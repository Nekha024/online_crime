from django.db import models
from django.utils import timezone
import secrets

STATUS_CHOICES = [
    ('Submitted', 'Submitted'),
    ('Under Review', 'Under Review'),
    ('Assigned', 'Assigned'),
    ('Under Investigation', 'Under Investigation'),
    ('Action Taken', 'Action Taken'),
    ('Resolved', 'Resolved'),
    ('Closed', 'Closed'),
]

PRIORITY_CHOICES = [
    ('Low', 'Low'),
    ('Medium', 'Medium'),
    ('High', 'High'),
    ('Critical', 'Critical'),
]


class PoliceStation(models.Model):
    station_name = models.CharField(max_length=255)
    location_name = models.CharField(max_length=255, blank=True, default='')
    station_code = models.CharField(max_length=100, unique=True, db_index=True)
    police_district = models.CharField(max_length=100, db_index=True)
    revenue_district = models.CharField(max_length=100, db_index=True)
    station_type = models.CharField(max_length=100, default='General')
    state = models.CharField(max_length=100, default='Kerala')
    country = models.CharField(max_length=100, default='India')
    address = models.TextField(blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True, db_index=True)
    identification_key = models.CharField(max_length=255, unique=True, db_index=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['police_district', 'station_name']
        verbose_name = 'Police Station'
        verbose_name_plural = 'Police Stations'

    def __str__(self):
        return f"{self.station_name} ({self.police_district}) - {self.station_code}"


class PoliceStationToken(models.Model):
    station = models.OneToOneField(PoliceStation, on_delete=models.CASCADE, related_name='auth_token')
    key = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = secrets.token_hex(32)
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Token for {self.station.station_code}"


class CrimeReport(models.Model):
    crime_id = models.CharField(max_length=50, unique=True, db_index=True)
    police_station = models.ForeignKey(PoliceStation, on_delete=models.CASCADE, related_name='crimes')
    crime_type = models.CharField(max_length=100, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    incident_date = models.DateTimeField(default=timezone.now)
    report_date = models.DateTimeField(auto_now_add=True, db_index=True)
    location = models.CharField(max_length=255)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Submitted', db_index=True)
    evidence_info = models.TextField(blank=True, default='')
    investigation_notes = models.TextField(blank=True, default='')
    assigned_officer = models.CharField(max_length=150, blank=True, default='Pending Assignment')
    complainant_name = models.CharField(max_length=150, blank=True, default='Anonymous')
    complainant_contact = models.CharField(max_length=50, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-report_date']
        verbose_name = 'Crime Report'
        verbose_name_plural = 'Crime Reports'

    def __str__(self):
        return f"{self.crime_id} - {self.title} ({self.status})"


class Complaint(models.Model):
    complaint_id = models.CharField(max_length=50, unique=True, db_index=True)
    police_station = models.ForeignKey(PoliceStation, on_delete=models.CASCADE, related_name='complaints')
    complaint_type = models.CharField(max_length=100, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True, db_index=True)
    location = models.CharField(max_length=255)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Submitted', db_index=True)
    evidence_info = models.TextField(blank=True, default='')
    investigation_notes = models.TextField(blank=True, default='')
    assigned_officer = models.CharField(max_length=150, blank=True, default='Pending Assignment')
    complainant_name = models.CharField(max_length=150, blank=True, default='Citizen')
    complainant_contact = models.CharField(max_length=50, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Citizen Complaint'
        verbose_name_plural = 'Citizen Complaints'

    def __str__(self):
        return f"{self.complaint_id} - {self.title} ({self.status})"


class CaseStatusHistory(models.Model):
    crime_report = models.ForeignKey(CrimeReport, on_delete=models.CASCADE, related_name='history', null=True, blank=True)
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='history', null=True, blank=True)
    old_status = models.CharField(max_length=50)
    new_status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    remarks = models.TextField(blank=True, default='')
    updated_by = models.CharField(max_length=150)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Case Status History'
        verbose_name_plural = 'Case Status Histories'

    def __str__(self):
        target = self.crime_report.crime_id if self.crime_report else (self.complaint.complaint_id if self.complaint else "Case")
        return f"{target}: {self.old_status} -> {self.new_status} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
