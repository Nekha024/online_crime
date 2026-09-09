from django.urls import path
from .views import register_view, login_view, send_otp_view, logout_view, me_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'), # Keep for backward compatibility or as alias
    path('send-otp/', send_otp_view, name='send_otp'),
    path('verify-otp/', login_view, name='verify_otp'),
    path('logout/', logout_view, name='logout'),
    path('me/', me_view, name='me'),
]
