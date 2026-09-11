import secrets
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from core.models import PoliceStation, PoliceStationToken, CrimeReport, Complaint, CaseStatusHistory

User = get_user_model()

class PoliceAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.station = PoliceStation.objects.create(
            station_name="Test Cyber Cell",
            station_code="KL-TST-CYBER",
            police_district="TestDistrict",
            revenue_district="TestDistrict",
            station_type="Cyber",
            username="test_cyber_ps",
            identification_key="PSK-TEST-ABCD1234",
            is_active=True
        )
        self.citizen_user = User.objects.create_user(
            username="citizen_user",
            email="citizen@example.com",
            password="testpassword123",
            phone_number="9876543210"
        )

    def test_login_invalid_credentials(self):
        url = reverse('police_login')
        # Case 1: Wrong key
        response = self.client.post(url, {
            'username': self.station.username,
            'identification_key': 'WRONG_KEY'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['message'], 'Invalid police station credentials.')

        # Case 2: Wrong username
        response = self.client.post(url, {
            'username': 'non_existent_ps',
            'identification_key': self.station.identification_key
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['message'], 'Invalid police station credentials.')

    def test_login_successful_and_token_issued(self):
        url = reverse('police_login')
        response = self.client.post(url, {
            'username': self.station.username,
            'identification_key': self.station.identification_key
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('token', response.data)
        # Ensure identification_key is NOT exposed
        self.assertNotIn('identification_key', response.data['station'])
        self.assertEqual(response.data['station']['station_code'], self.station.station_code)

    def test_police_api_rejects_unauthenticated(self):
        url = reverse('police_me')
        response = self.client.get(url)
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_police_api_rejects_normal_public_users(self):
        # Force authenticate as citizen user
        self.client.force_authenticate(user=self.citizen_user)
        url = reverse('police_me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_police_api_allows_authenticated_police_station(self):
        token, _ = PoliceStationToken.objects.get_or_create(station=self.station)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token.key}')
        url = reverse('police_me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['station']['station_name'], self.station.station_name)

    def test_police_logout_revokes_access(self):
        token, _ = PoliceStationToken.objects.get_or_create(station=self.station)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token.key}')
        
        # Logout
        logout_url = reverse('police_logout')
        logout_res = self.client.post(logout_url)
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # Access after logout must be rejected
        me_url = reverse('police_me')
        me_res = self.client.get(me_url)
        self.assertIn(me_res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])


class PoliceDashboardAndCaseManagementTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.station_a = PoliceStation.objects.create(
            station_name="Station Alpha",
            station_code="KL-STA-001",
            police_district="District Alpha",
            revenue_district="District Alpha",
            username="station_alpha",
            identification_key="KEY_ALPHA_123"
        )
        self.station_b = PoliceStation.objects.create(
            station_name="Station Beta",
            station_code="KL-STB-002",
            police_district="District Beta",
            revenue_district="District Beta",
            username="station_beta",
            identification_key="KEY_BETA_456"
        )

        self.token_a = PoliceStationToken.objects.create(station=self.station_a)
        self.token_b = PoliceStationToken.objects.create(station=self.station_b)

        # Create Crime for Station A
        self.crime_a = CrimeReport.objects.create(
            crime_id="CR-STA-101",
            police_station=self.station_a,
            crime_type="Cyber Fraud",
            title="Alpha Bank Phishing",
            description="Phishing portal targeted banking customers",
            location="Alpha Road",
            priority="High",
            status="Submitted"
        )

        # Create Crime for Station B
        self.crime_b = CrimeReport.objects.create(
            crime_id="CR-STB-202",
            police_station=self.station_b,
            crime_type="Ransomware",
            title="Beta Server Breach",
            description="Beta office server encrypted",
            location="Beta Street",
            priority="Critical",
            status="Under Investigation"
        )

        # Create Complaint for Station A
        self.complaint_a = Complaint.objects.create(
            complaint_id="CMP-STA-501",
            police_station=self.station_a,
            complaint_type="Harassment",
            title="Fake Social Media Profile",
            description="Defamatory posts on social media",
            location="Alpha Zone",
            priority="Medium",
            status="Submitted"
        )

    def test_dashboard_stats_scoped_to_authenticated_station(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_a.key}')
        url = reverse('police_dashboard_stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Station A has 1 crime and 1 complaint = 2 total reports
        self.assertEqual(response.data['statistics']['total_reports'], 2)
        self.assertEqual(response.data['statistics']['total_crimes'], 1)
        self.assertEqual(response.data['statistics']['total_complaints'], 1)

    def test_crime_list_strict_scoping(self):
        # Station A should only see Crime A, never Crime B
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_a.key}')
        url = reverse('police_crimes_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['crimes'][0]['crime_id'], self.crime_a.crime_id)

    def test_crime_detail_rejects_cross_station_access(self):
        # Station A attempting to view Station B's crime
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_a.key}')
        url = reverse('police_crime_detail', kwargs={'pk': self.crime_b.crime_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_controlled_status_update_and_history(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token_a.key}')
        url = reverse('police_crime_status_update', kwargs={'pk': self.crime_a.crime_id})
        
        # 1. Update with valid controlled status
        response = self.client.post(url, {
            'status': 'Under Investigation',
            'remarks': 'Evidence analysis initiated by forensics team.',
            'assigned_officer': 'Inspector Test'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['crime']['status'], 'Under Investigation')

        # Verify audit history entry was created
        self.crime_a.refresh_from_db()
        self.assertEqual(self.crime_a.status, 'Under Investigation')
        self.assertTrue(self.crime_a.history.filter(new_status='Under Investigation').exists())

        # 2. Update with invalid arbitrary status
        bad_response = self.client.post(url, {'status': 'InvalidFakeStatus'})
        self.assertEqual(bad_response.status_code, status.HTTP_400_BAD_REQUEST)
