from django.urls import path
from . import admin_views

urlpatterns = [
    path('dashboard-stats/', admin_views.admin_dashboard_stats, name='admin-dashboard-stats'),
    path('login/', admin_views.admin_login, name='admin-login'),
    path('logout/', admin_views.admin_logout, name='admin-logout'),
    path('stations/', admin_views.manage_stations, name='admin-stations'),
    path('stations/<int:pk>/', admin_views.delete_station, name='admin-delete-station'),
    path('stations/stats/', admin_views.station_stats, name='admin-station-stats'),
    path('broadcast/', admin_views.broadcast_alert, name='admin-broadcast'),
    path('queries/', admin_views.admin_queries, name='admin-queries'),
]
