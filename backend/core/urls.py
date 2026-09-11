from django.urls import path
from . import views
from . import views_police

urlpatterns = [
    path("test/", views.test_api, name="test_api"),
    
    # Police Authentication & Session Management
    path("police/login/", views_police.police_login_view, name="police_login"),
    path("police/logout/", views_police.police_logout_view, name="police_logout"),
    path("police/me/", views_police.police_me_view, name="police_me"),
    
    # Task 2: Police Dashboard & Operations
    path("police/dashboard/", views_police.police_dashboard_stats_view, name="police_dashboard_stats"),
    path("police/station/", views_police.police_station_profile_view, name="police_station_profile"),
    
    # Reported Crimes Management
    path("police/crimes/", views_police.police_crimes_list_view, name="police_crimes_list"),
    path("police/crimes/<str:pk>/", views_police.police_crime_detail_view, name="police_crime_detail"),
    path("police/crimes/<str:pk>/status/", views_police.police_crime_status_update_view, name="police_crime_status_update"),
    
    # Complaints Management
    path("police/complaints/", views_police.police_complaints_list_view, name="police_complaints_list"),
    path("police/complaints/<str:pk>/", views_police.police_complaint_detail_view, name="police_complaint_detail"),
    path("police/complaints/<str:pk>/status/", views_police.police_complaint_status_update_view, name="police_complaint_status_update"),
    
    # Public Police Station Directory (from database)
    path("police/stations/", views_police.police_station_list_view, name="police_stations"),
]