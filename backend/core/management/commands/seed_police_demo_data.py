from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import PoliceStation, CrimeReport, Complaint, CaseStatusHistory

class Command(BaseCommand):
    help = 'Seeds realistic sample crimes, complaints, and status timelines for test police stations.'

    def handle(self, *args, **options):
        # Target test stations
        station_cyber = PoliceStation.objects.filter(username='alappuzha_cyber').first()
        station_north = PoliceStation.objects.filter(username='alappuzha_north').first()
        station_kannur = PoliceStation.objects.filter(username__icontains='kannur_city_cyber').first()

        if not station_cyber:
            self.stdout.write(self.style.ERROR("Station alappuzha_cyber not found. Run import_police_stations first."))
            return

        now = timezone.now()

        # Seed Crimes for Alappuzha Cyber
        crimes_data = [
            {
                "crime_id": "CR-ALP-2026-001",
                "police_station": station_cyber,
                "crime_type": "Financial Scam / Banking Fraud",
                "title": "Unauthorized UPI Transfer & SIM Swap Scam",
                "description": "Victim reported fraudulent withdrawal of INR 2,45,000 via unauthorized UPI debit requests following an unsolicited SIM upgrade SMS. Fraudulent transfers routed to multiple accounts in quick succession.",
                "incident_date": now - timedelta(days=2),
                "location": "Mullakkal, Alappuzha Town",
                "priority": "Critical",
                "status": "Under Investigation",
                "evidence_info": "Victim bank statements, fraudulent UPI handles (fraudtx@ybl), IP logs of mobile banking session, SIM reactivation SMS headers.",
                "investigation_notes": "Freezing requests sent to beneficiary bank nodals. Cyber cell tracing originating device IMEI and cell tower triangulation.",
                "assigned_officer": "Sub-Inspector Rajesh V.",
                "complainant_name": "Suresh Kumar",
                "complainant_contact": "+91 94471 23456"
            },
            {
                "crime_id": "CR-ALP-2026-002",
                "police_station": station_cyber,
                "crime_type": "Ransomware / Extortion",
                "title": "Hospital Management Server Encrypted by LockBit Variant",
                "description": "Private diagnostic clinic reported their patient records server and billing system encrypted with .locked extension. Ransom note demands 0.8 BTC.",
                "incident_date": now - timedelta(days=5),
                "location": "Boat Jetty Road, Alappuzha",
                "priority": "High",
                "status": "Action Taken",
                "evidence_info": "Memory dump from server, ransomware note 'RESTORE_FILES.txt', RDP brute-force event logs from IP 185.220.101.4.",
                "investigation_notes": "Decryption key matching conducted via NoMoreRansom database. Offsite backups located and restored in secure DMZ.",
                "assigned_officer": "Inspector Manoj Nair",
                "complainant_name": "Dr. K. George",
                "complainant_contact": "+91 98470 98765"
            },
            {
                "crime_id": "CR-ALP-2026-003",
                "police_station": station_cyber,
                "crime_type": "Identity Theft / Impersonation",
                "title": "Deepfake Video Impersonation & Extortion",
                "description": "Complainant blackmailed using AI-generated deepfake video call recordings over WhatsApp demanding immediate crypto transfer under threat of public release.",
                "incident_date": now - timedelta(hours=14),
                "location": "Ambalapuzha North, Alappuzha",
                "priority": "High",
                "status": "Submitted",
                "evidence_info": "Screen recordings of extortion chats, WhatsApp call logs, VoIP international virtual numbers used (+1-815-xxx-xxxx).",
                "investigation_notes": "Case received from Citizen Portal. Awaiting primary triage officer assignment.",
                "assigned_officer": "Pending Assignment",
                "complainant_name": "Ananya Pillai",
                "complainant_contact": "+91 94950 11223"
            },
            {
                "crime_id": "CR-ALP-2026-004",
                "police_station": station_cyber,
                "crime_type": "Social Media Harassment",
                "title": "Coordinated Fake Profiles & Defamation",
                "description": "Multiple fake Instagram and Facebook profiles created using victim's photographs accompanied by derogatory captions targeting college student.",
                "incident_date": now - timedelta(days=12),
                "location": "Near SD College, Alappuzha",
                "priority": "Medium",
                "status": "Resolved",
                "evidence_info": "URLs of 4 flagged accounts, screenshots of defamatory stories, Meta Legal compliance ticket #883920.",
                "investigation_notes": "Meta response received. Offending profiles taken down. Accused minor identified, called in with guardians, given strict counseling and written bond.",
                "assigned_officer": "Sub-Inspector Deepa M.",
                "complainant_name": "Meera Santhosh",
                "complainant_contact": "+91 97455 33445"
            }
        ]

        # Seed Complaints for Alappuzha Cyber
        complaints_data = [
            {
                "complaint_id": "CMP-ALP-2026-010",
                "police_station": station_cyber,
                "complaint_type": "E-Commerce Fraud",
                "title": "Fake Online Electronics Store Scam",
                "description": "Ordered an iPhone from an advertised Instagram page 'KeralaDealsHub'. Paid INR 42,000 via Google Pay; page deleted afterwards.",
                "location": "Kalarcode, Alappuzha",
                "priority": "Medium",
                "status": "Under Review",
                "evidence_info": "Google Pay transaction UTR 402918239120, screenshots of Instagram advertisements and chat history.",
                "investigation_notes": "Beneficiary account linked to Federal Bank branch in Kozhikode. Notice issued to bank.",
                "assigned_officer": "Sub-Inspector Rajesh V.",
                "complainant_name": "Rahul Raman",
                "complainant_contact": "+91 94460 77889"
            },
            {
                "complaint_id": "CMP-ALP-2026-011",
                "police_station": station_cyber,
                "complaint_type": "Phishing & Credential Harvesting",
                "title": "Electricity Bill Disconnection Phishing SMS",
                "description": "Received SMS claiming KSEB power will be disconnected at 9:30 PM. Clicked link and entered credit card details on fake portal.",
                "location": "Thathampally, Alappuzha",
                "priority": "High",
                "status": "Assigned",
                "evidence_info": "Phishing domain 'kseb-bill-pay-update.online', SMS sender ID 'VK-KSEBPY', card debit alert of INR 18,500.",
                "investigation_notes": "Domain registrar contacted for immediate suspension. Chargeback initiated with card network.",
                "assigned_officer": "Inspector Manoj Nair",
                "complainant_name": "Mathew Jacob",
                "complainant_contact": "+91 98462 55667"
            },
            {
                "complaint_id": "CMP-ALP-2026-012",
                "police_station": station_cyber,
                "complaint_type": "Job Scam",
                "title": "Telegram Work-From-Home YouTube Like Scam",
                "description": "Complainant induced to invest INR 1,15,000 in prepaid crypto task platform promising 30% daily returns.",
                "location": "Punnapra, Alappuzha",
                "priority": "High",
                "status": "Under Investigation",
                "evidence_info": "Telegram channel chat exports, USDT TRC20 wallet addresses, transfer receipts.",
                "investigation_notes": "Wallet addresses tracked through blockchain analytics. Linked to international syndicated cyber racket.",
                "assigned_officer": "Sub-Inspector Rajesh V.",
                "complainant_name": "Pooja Varma",
                "complainant_contact": "+91 90480 33221"
            }
        ]

        # Seed 1 separate crime for Alappuzha North (to demonstrate strict station data isolation!)
        if station_north:
            CrimeReport.objects.update_or_create(
                crime_id="CR-ALPN-2026-088",
                defaults={
                    "police_station": station_north,
                    "crime_type": "Burglary & Electronic Theft",
                    "title": "Office Laptops Stolen from IT Firm",
                    "description": "Night-time break-in at commercial building, 4 Dell Latitude laptops stolen with proprietary code repositories.",
                    "incident_date": now - timedelta(days=1),
                    "location": "North Police Station Road, Alappuzha",
                    "priority": "High",
                    "status": "Under Investigation",
                    "evidence_info": "CCTV footage of suspects in dark clothing, MAC addresses of stolen network cards.",
                    "investigation_notes": "Fingerprint experts collected latent prints from window latch. Patrolling alerted.",
                    "assigned_officer": "SI Harikrishnan",
                    "complainant_name": "Arun Prasad",
                    "complainant_contact": "+91 94470 12399"
                }
            )

        # Insert Crimes
        for c in crimes_data:
            crime, created = CrimeReport.objects.update_or_create(
                crime_id=c['crime_id'],
                defaults=c
            )
            # Add initial history
            if created or not crime.history.exists():
                CaseStatusHistory.objects.create(
                    crime_report=crime,
                    old_status="N/A",
                    new_status=crime.status,
                    remarks="Initial case registration and classification in Police Station Portal.",
                    updated_by="System / " + station_cyber.username,
                    timestamp=crime.report_date
                )

        # Insert Complaints
        for cmp_item in complaints_data:
            complaint, created = Complaint.objects.update_or_create(
                complaint_id=cmp_item['complaint_id'],
                defaults=cmp_item
            )
            if created or not complaint.history.exists():
                CaseStatusHistory.objects.create(
                    complaint=complaint,
                    old_status="N/A",
                    new_status=complaint.status,
                    remarks="Complaint logged and dispatched to station investigation desk.",
                    updated_by="System / " + station_cyber.username,
                    timestamp=complaint.date
                )

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded operational data for {station_cyber.station_name} and {station_north.station_name if station_north else 'other stations'}."))
