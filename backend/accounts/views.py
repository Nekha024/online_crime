from django.contrib.auth import login, logout
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from .models import OTP
import random
import uuid

User = get_user_model()

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def register_view(request):
    full_name = request.data.get('full_name')
    phone_number = request.data.get('phone_number')
    email = request.data.get('email')
    password = request.data.get('password')
    confirm_password = request.data.get('confirm_password')

    if not all([full_name, phone_number, email, password, confirm_password]):
        return Response({'success': False, 'message': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({'success': False, 'message': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(phone_number=phone_number).exists():
        return Response({'success': False, 'message': 'Phone number already registered.'}, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(email=email).exists():
        return Response({'success': False, 'message': 'Email already registered.'}, status=status.HTTP_400_BAD_REQUEST)

    # Auto-generate a unique username
    base_username = full_name.lower().replace(' ', '')
    username = f"{base_username}_{uuid.uuid4().hex[:6]}"
    
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=full_name,
        phone_number=phone_number
    )
    
    # We do NOT login here as per requirements; user should login via OTP flow next.
    return Response({
        'success': True, 
        'message': 'Account created successfully. Please login with your phone number.'
    }, status=status.HTTP_201_CREATED)


@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def send_otp_view(request):
    phone_number = request.data.get('phone_number')
    
    if not phone_number:
        return Response({'success': False, 'message': 'Phone number is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(phone_number=phone_number)
    except User.DoesNotExist:
        return Response({
            'success': False, 
            'not_registered': True,
            'message': 'Phone number is not registered. Please create an account.'
        }, status=status.HTTP_404_NOT_FOUND)

    # Generate a 6-digit numeric OTP
    otp_code = str(random.randint(100000, 999999))
    
    # Invalidate any existing OTPs for this user
    OTP.objects.filter(user=user, is_verified=False).delete()

    # Create new OTP with 5 mins expiry
    expires_at = timezone.now() + timedelta(minutes=5)
    OTP.objects.create(user=user, otp=otp_code, expires_at=expires_at)

    # Print to backend terminal as requested (forced flush to ensure it prints immediately)
    print(f"OTP generated for {phone_number}: {otp_code}", flush=True)

    return Response({'success': True, 'message': 'OTP sent successfully.'}, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    # Check if this is an email/password login
    email = request.data.get('email')
    password = request.data.get('password')
    
    if email and password:
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                return Response({
                    'success': True, 
                    'message': 'Logged in successfully.', 
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'name': user.first_name,
                        'phone_number': user.phone_number
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'message': 'Invalid email or password.'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'Invalid email or password.'}, status=status.HTTP_400_BAD_REQUEST)

    # Otherwise, process as verify-otp
    phone_number = request.data.get('phone_number')
    otp_code = request.data.get('otp')
    
    if not all([phone_number, otp_code]):
        return Response({'success': False, 'message': 'Phone number and OTP (or Email and Password) are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(phone_number=phone_number)
    except User.DoesNotExist:
        return Response({'success': False, 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    try:
        otp_record = OTP.objects.get(user=user, otp=otp_code, is_verified=False)
    except OTP.DoesNotExist:
        return Response({'success': False, 'message': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

    if timezone.now() > otp_record.expires_at:
        return Response({'success': False, 'message': 'Expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)

    # OTP is valid
    otp_record.is_verified = True
    otp_record.save()
    
    # Authenticate and login without password
    login(request, user, backend='django.contrib.auth.backends.ModelBackend')

    return Response({
        'success': True, 
        'message': 'Logged in successfully.', 
        'user': {
            'username': user.username,
            'email': user.email,
            'name': user.first_name,
            'phone_number': user.phone_number
        }
    }, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
def logout_view(request):
    logout(request)
    return Response({'success': True, 'message': 'Logged out.'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    return Response({
        'success': True,
        'user': {
            'username': user.username,
            'email': user.email,
            'name': user.first_name,
            'phone_number': user.phone_number
        }
    })
