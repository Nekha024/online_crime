from rest_framework import serializers
from .models import PoliceStation, CrimeReport, Complaint, CaseStatusHistory, STATUS_CHOICES

class PoliceStationSerializer(serializers.ModelSerializer):
    """
    Serializer for PoliceStation public & dashboard data.
    identification_key is STRICTLY EXCLUDED to prevent exposing credentials.
    """
    class Meta:
        model = PoliceStation
        fields = [
            'id',
            'station_name',
            'location_name',
            'station_code',
            'police_district',
            'revenue_district',
            'station_type',
            'state',
            'country',
            'address',
            'phone',
            'email',
            'latitude',
            'longitude',
            'username',
            'is_active',
        ]
        read_only_fields = fields


class PoliceLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, trim_whitespace=True)
    identification_key = serializers.CharField(required=True, trim_whitespace=True)


class CaseStatusHistorySerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = CaseStatusHistory
        fields = ['id', 'old_status', 'new_status', 'remarks', 'updated_by', 'timestamp', 'formatted_date']

    def get_formatted_date(self, obj):
        return obj.timestamp.strftime("%b %d, %Y - %I:%M %p")


class CrimeReportListSerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source='police_station.station_name', read_only=True)
    station_code = serializers.CharField(source='police_station.station_code', read_only=True)
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = CrimeReport
        fields = [
            'id',
            'crime_id',
            'title',
            'crime_type',
            'location',
            'priority',
            'status',
            'report_date',
            'formatted_date',
            'assigned_officer',
            'station_name',
            'station_code'
        ]

    def get_formatted_date(self, obj):
        return obj.report_date.strftime("%b %d, %Y")


class CrimeReportDetailSerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source='police_station.station_name', read_only=True)
    station_code = serializers.CharField(source='police_station.station_code', read_only=True)
    police_district = serializers.CharField(source='police_station.police_district', read_only=True)
    history = CaseStatusHistorySerializer(many=True, read_only=True)
    formatted_report_date = serializers.SerializerMethodField()
    formatted_incident_date = serializers.SerializerMethodField()

    class Meta:
        model = CrimeReport
        fields = [
            'id',
            'crime_id',
            'title',
            'crime_type',
            'description',
            'incident_date',
            'report_date',
            'formatted_report_date',
            'formatted_incident_date',
            'location',
            'priority',
            'status',
            'evidence_info',
            'investigation_notes',
            'assigned_officer',
            'complainant_name',
            'complainant_contact',
            'station_name',
            'station_code',
            'police_district',
            'history',
            'created_at',
            'updated_at'
        ]

    def get_formatted_report_date(self, obj):
        return obj.report_date.strftime("%b %d, %Y %I:%M %p")

    def get_formatted_incident_date(self, obj):
        return obj.incident_date.strftime("%b %d, %Y %I:%M %p")


class ComplaintListSerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source='police_station.station_name', read_only=True)
    station_code = serializers.CharField(source='police_station.station_code', read_only=True)
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = [
            'id',
            'complaint_id',
            'title',
            'complaint_type',
            'location',
            'priority',
            'status',
            'date',
            'formatted_date',
            'description',
            'assigned_officer',
            'station_name',
            'station_code'
        ]

    def get_formatted_date(self, obj):
        return obj.date.strftime("%b %d, %Y")


class ComplaintDetailSerializer(serializers.ModelSerializer):
    station_name = serializers.CharField(source='police_station.station_name', read_only=True)
    station_code = serializers.CharField(source='police_station.station_code', read_only=True)
    police_district = serializers.CharField(source='police_station.police_district', read_only=True)
    history = CaseStatusHistorySerializer(many=True, read_only=True)
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = [
            'id',
            'complaint_id',
            'title',
            'complaint_type',
            'description',
            'date',
            'formatted_date',
            'location',
            'priority',
            'status',
            'evidence_info',
            'investigation_notes',
            'assigned_officer',
            'complainant_name',
            'complainant_contact',
            'station_name',
            'station_code',
            'police_district',
            'history',
            'created_at',
            'updated_at'
        ]

    def get_formatted_date(self, obj):
        return obj.date.strftime("%b %d, %Y %I:%M %p")


class StatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[c[0] for c in STATUS_CHOICES])
    remarks = serializers.CharField(required=False, allow_blank=True, default='')
    assigned_officer = serializers.CharField(required=False, allow_blank=True)
    investigation_notes = serializers.CharField(required=False, allow_blank=True)
