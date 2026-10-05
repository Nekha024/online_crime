from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from .authentication import CsrfExemptSessionAuthentication
from .models import AdminProfile, PoliceStation, StationQuery, Notification, CrimeReport, Complaint

User = get_user_model()

def is_admin(user):
    return hasattr(user, 'admin_profile')

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def admin_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if email and password:
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                if not hasattr(user, 'admin_profile'):
                    return Response({'success': False, 'message': 'Unauthorized. Not an admin.'}, status=status.HTTP_403_FORBIDDEN)
                
                login(request, user, backend='django.contrib.auth.backends.ModelBackend')
                return Response({
                    'success': True,
                    'message': 'Admin logged in successfully.',
                    'admin': {
                        'email': user.email,
                        'name': user.first_name,
                        'role': user.admin_profile.role
                    }
                })
        except User.DoesNotExist:
            pass
    return Response({'success': False, 'message': 'Invalid credentials.'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    if not is_admin(request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)
    logout(request)
    return Response({'success': True, 'message': 'Admin logged out.'})

@api_view(['GET', 'POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def manage_stations(request):
    if not is_admin(request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)
        
    if request.method == 'GET':
        stations = PoliceStation.objects.all()
        data = []
        for s in stations:
            data.append({
                'id': s.id,
                'station_name': s.station_name,
                'location_name': s.location_name,
                'station_code': s.station_code,
                'police_district': s.police_district,
                'revenue_district': s.revenue_district,
                'station_type': s.station_type,
                'state': s.state,
                'country': s.country,
                'address': s.address,
                'phone': s.phone,
                'email': s.email,
                'latitude': str(s.latitude) if s.latitude else None,
                'longitude': str(s.longitude) if s.longitude else None,
                'username': s.username,
                'identification_key': s.identification_key,
                'is_active': s.is_active
            })
        return Response({'success': True, 'stations': data})
        
    if request.method == 'POST':
        # Add a new police station
        data = request.data
        try:
            station = PoliceStation.objects.create(
                station_name=data.get('station_name'),
                station_code=data.get('station_code'),
                police_district=data.get('police_district', 'Central'),
                revenue_district=data.get('revenue_district', 'Central'),
                username=data.get('username'),
                identification_key=data.get('identification_key', 'DEFAULT_KEY')
            )
            return Response({'success': True, 'message': 'Station added.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def delete_station(request, pk):
    if not is_admin(request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)
    try:
        station = PoliceStation.objects.get(id=pk)
        station.delete()
        return Response({'success': True, 'message': 'Station deleted.'})
    except PoliceStation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def station_stats(request):
    if not is_admin(request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)
        
    stations = PoliceStation.objects.all()
    stats = []
    for s in stations:
        total = s.crimes.count() + s.complaints.count()
        solved = s.crimes.filter(status='Resolved').count() + s.crimes.filter(status='Closed').count() + s.complaints.filter(status='Resolved').count() + s.complaints.filter(status='Closed').count()
        unsolved = total - solved
        stats.append({
            'station_id': s.id,
            'station_name': s.station_name,
            'total_cases': total,
            'solved': solved,
            'unsolved': unsolved
        })
    return Response({'success': True, 'stats': stats})

@api_view(['POST'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def broadcast_alert(request):
    if not is_admin(request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)
        
    title = request.data.get('title')
    message = request.data.get('message')
    stations = PoliceStation.objects.filter(is_active=True)
    
    for station in stations:
        Notification.objects.create(
            police_station=station,
            title=f"BROADCAST: {title}",
            message=message
        )
    return Response({'success': True, 'message': f'Alert broadcasted to {stations.count()} stations.'})

@api_view(['GET', 'PUT'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_queries(request):
    if not is_admin(request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)
        
    if request.method == 'GET':
        queries = StationQuery.objects.all()
        data = [{
            'id': q.id,
            'station': q.station.station_name,
            'subject': q.subject,
            'message': q.message,
            'status': q.status,
            'admin_reply': q.admin_reply,
            'created_at': q.created_at
        } for q in queries]
        return Response({'success': True, 'queries': data})
        
    if request.method == 'PUT':
        query_id = request.data.get('query_id')
        reply = request.data.get('reply')
        try:
            query = StationQuery.objects.get(id=query_id)
            query.admin_reply = reply
            query.status = 'Responded'
            query.save()
            return Response({'success': True, 'message': 'Reply sent.'})
        except StationQuery.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@authentication_classes([CsrfExemptSessionAuthentication])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    if not is_admin(request.user):
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    total_crimes = CrimeReport.objects.count()
    total_complaints = Complaint.objects.count()
    total_cases = total_crimes + total_complaints
    
    solved_crimes = CrimeReport.objects.filter(status__in=['Resolved', 'Closed']).count()
    solved_complaints = Complaint.objects.filter(status__in=['Resolved', 'Closed']).count()
    total_solved = solved_crimes + solved_complaints
    
    pending_crimes = CrimeReport.objects.exclude(status__in=['Resolved', 'Closed']).count()
    pending_complaints = Complaint.objects.exclude(status__in=['Resolved', 'Closed']).count()
    total_pending = pending_crimes + pending_complaints
    
    # Priority breakdown
    high_priority = CrimeReport.objects.filter(priority='High').count() + Complaint.objects.filter(priority='High').count()
    critical_priority = CrimeReport.objects.filter(priority='Critical').count() + Complaint.objects.filter(priority='Critical').count()
    
    # Recent 5 cases
    recent_crimes = CrimeReport.objects.order_by('-created_at')[:5]
    recent_cases_list = [{
        'id': c.crime_id,
        'title': c.title,
        'status': c.status,
        'date': c.created_at.strftime('%Y-%m-%d')
    } for c in recent_crimes]

    return Response({
        'success': True,
        'stats': {
            'total_cases': total_cases,
            'total_solved': total_solved,
            'total_pending': total_pending,
            'high_critical_cases': high_priority + critical_priority,
            'recent_cases': recent_cases_list
        }
    })
