from django.contrib import admin
from .models import PoliceStation, PoliceStationToken, CrimeReport, Complaint, CaseStatusHistory

@admin.register(PoliceStation)
class PoliceStationAdmin(admin.ModelAdmin):
    list_display = ('station_name', 'station_code', 'police_district', 'station_type', 'username', 'is_active')
    list_filter = ('police_district', 'station_type', 'is_active', 'state')
    search_fields = ('station_name', 'station_code', 'username', 'police_district', 'location_name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(PoliceStationToken)
class PoliceStationTokenAdmin(admin.ModelAdmin):
    list_display = ('station', 'key', 'created_at')
    search_fields = ('station__station_name', 'station__station_code', 'key')
    readonly_fields = ('created_at',)

@admin.register(CrimeReport)
class CrimeReportAdmin(admin.ModelAdmin):
    list_display = ('crime_id', 'title', 'crime_type', 'police_station', 'priority', 'status', 'report_date')
    list_filter = ('status', 'priority', 'crime_type', 'police_station__police_district')
    search_fields = ('crime_id', 'title', 'description', 'location', 'police_station__station_name')
    readonly_fields = ('created_at', 'updated_at', 'report_date')

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('complaint_id', 'title', 'complaint_type', 'police_station', 'priority', 'status', 'date')
    list_filter = ('status', 'priority', 'complaint_type', 'police_station__police_district')
    search_fields = ('complaint_id', 'title', 'description', 'location', 'police_station__station_name')
    readonly_fields = ('created_at', 'updated_at', 'date')

@admin.register(CaseStatusHistory)
class CaseStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('get_case_id', 'old_status', 'new_status', 'updated_by', 'timestamp')
    list_filter = ('new_status', 'old_status')
    search_fields = ('crime_report__crime_id', 'complaint__complaint_id', 'remarks', 'updated_by')
    readonly_fields = ('timestamp',)

    def get_case_id(self, obj):
        return obj.crime_report.crime_id if obj.crime_report else (obj.complaint.complaint_id if obj.complaint else "-")
    get_case_id.short_description = 'Case ID'
