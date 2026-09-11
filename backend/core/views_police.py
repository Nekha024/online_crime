import secrets
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, Count

from .models import PoliceStation, PoliceStationToken, CrimeReport, Complaint, CaseStatusHistory
from .serializers import (
    PoliceStationSerializer,
    PoliceLoginSerializer,
    CrimeReportListSerializer,
    CrimeReportDetailSerializer,
    ComplaintListSerializer,
    ComplaintDetailSerializer,
    StatusUpdateSerializer
)
from .authentication import PoliceAuthentication, IsPoliceStationAuthenticated

@csrf_exempt
@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def police_login_view(request):
    """
    Dedicated Police Station Login Endpoint.
    Accepts: username, identification_key.
    Returns 401 with generic error on any failure to prevent enumeration.
    """
    serializer = PoliceLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(
            {'success': False, 'message': 'Invalid police station credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    username = serializer.validated_data['username']
    identification_key = serializer.validated_data['identification_key']

    # Station can log in using either station username or station code
    station = PoliceStation.objects.filter(
        Q(username__iexact=username) | Q(station_code__iexact=username),
        is_active=True
    ).first()

    if not station:
        return Response(
            {'success': False, 'message': 'Invalid police station credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Constant-time comparison to prevent timing attacks
    if not secrets.compare_digest(station.identification_key, identification_key):
        return Response(
            {'success': False, 'message': 'Invalid police station credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Issue or rotate auth token
    token, _ = PoliceStationToken.objects.get_or_create(station=station)

    # Set isolated session flags
    request.session['police_station_id'] = station.id
    request.session['is_police'] = True
    request.session.modified = True

    return Response({
        'success': True,
        'message': 'Police station authenticated successfully.',
        'token': token.key,
        'station': PoliceStationSerializer(station).data
    }, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_logout_view(request):
    """
    Police Station Logout Endpoint.
    Revokes the active police auth token and purges the police session.
    """
    police_station = getattr(request, 'police_station', None)
    if police_station:
        PoliceStationToken.objects.filter(station=police_station).delete()

    request.session.pop('police_station_id', None)
    request.session.pop('is_police', None)
    request.session.modified = True

    return Response({
        'success': True,
        'message': 'Police station logged out successfully.'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_me_view(request):
    """
    Returns current authenticated police station profile.
    Strictly restricted to authorized police station personnel.
    """
    return Response({
        'success': True,
        'station': PoliceStationSerializer(request.police_station).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def police_station_list_view(request):
    """
    Returns public database records for police stations.
    Supports ?district=, ?type=, ?search=.
    Never includes identification keys.
    """
    queryset = PoliceStation.objects.filter(is_active=True)

    district = request.query_params.get('district')
    if district and district != 'All':
        queryset = queryset.filter(
            Q(police_district__iexact=district) | Q(revenue_district__iexact=district)
        )

    station_type = request.query_params.get('type')
    if station_type and station_type != 'All':
        queryset = queryset.filter(station_type__icontains=station_type)

    search = request.query_params.get('search')
    if search:
        queryset = queryset.filter(
            Q(station_name__icontains=search) |
            Q(location_name__icontains=search) |
            Q(police_district__icontains=search) |
            Q(station_code__icontains=search)
        )

    serializer = PoliceStationSerializer(queryset, many=True)
    return Response({
        'success': True,
        'count': queryset.count(),
        'stations': serializer.data
    }, status=status.HTTP_200_OK)


# =========================================================================
# TASK 2: POLICE DASHBOARD & CASE MANAGEMENT VIEWS (STATION-SCOPED)
# =========================================================================

@api_view(['GET'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_dashboard_stats_view(request):
    """
    Computes real database statistics strictly scoped to the authenticated police station.
    """
    station = request.police_station

    crimes_qs = CrimeReport.objects.filter(police_station=station)
    complaints_qs = Complaint.objects.filter(police_station=station)

    total_crimes = crimes_qs.count()
    total_complaints = complaints_qs.count()
    total_reports = total_crimes + total_complaints

    # Status breakdowns
    new_reports = (
        crimes_qs.filter(status__in=['Submitted', 'Under Review']).count() +
        complaints_qs.filter(status__in=['Submitted', 'Under Review']).count()
    )

    under_investigation = (
        crimes_qs.filter(status__in=['Assigned', 'Under Investigation', 'Action Taken']).count() +
        complaints_qs.filter(status__in=['Assigned', 'Under Investigation', 'Action Taken']).count()
    )

    resolved_cases = (
        crimes_qs.filter(status__in=['Resolved', 'Closed']).count() +
        complaints_qs.filter(status__in=['Resolved', 'Closed']).count()
    )

    pending_complaints = complaints_qs.exclude(status__in=['Resolved', 'Closed']).count()

    # Recent activity - up to 6 latest reports
    recent_crimes = list(crimes_qs.order_by('-report_date')[:5])
    recent_complaints = list(complaints_qs.order_by('-date')[:5])

    combined_recent = []
    for c in recent_crimes:
        combined_recent.append({
            'id': c.id,
            'case_id': c.crime_id,
            'title': c.title,
            'type': c.crime_type,
            'kind': 'Crime',
            'priority': c.priority,
            'status': c.status,
            'date': c.report_date.strftime("%b %d, %Y"),
            'assigned_officer': c.assigned_officer
        })
    for cmp in recent_complaints:
        combined_recent.append({
            'id': cmp.id,
            'case_id': cmp.complaint_id,
            'title': cmp.title,
            'type': cmp.complaint_type,
            'kind': 'Complaint',
            'priority': cmp.priority,
            'status': cmp.status,
            'date': cmp.date.strftime("%b %d, %Y"),
            'assigned_officer': cmp.assigned_officer
        })

    # Sort combined by date descending
    combined_recent.sort(key=lambda x: x['date'], reverse=True)
    recent_reports = combined_recent[:6]

    # Crime types distribution
    crime_types = list(
        crimes_qs.values('crime_type')
        .annotate(count=Count('id'))
        .order_by('-count')[:5]
    )

    return Response({
        'success': True,
        'station': {
            'id': station.id,
            'name': station.station_name,
            'code': station.station_code,
            'district': station.police_district,
            'type': station.station_type,
        },
        'statistics': {
            'total_reports': total_reports,
            'new_reports': new_reports,
            'under_investigation': under_investigation,
            'resolved_cases': resolved_cases,
            'pending_complaints': pending_complaints,
            'total_crimes': total_crimes,
            'total_complaints': total_complaints,
        },
        'recent_reports': recent_reports,
        'crime_types': crime_types
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_crimes_list_view(request):
    """
    Returns real crime reports relevant to the authenticated police station.
    Supports search, status, crime_type, and priority filters.
    """
    station = request.police_station
    queryset = CrimeReport.objects.filter(police_station=station)

    # Search filter
    search = request.query_params.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(crime_id__icontains=search) |
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(location__icontains=search) |
            Q(assigned_officer__icontains=search) |
            Q(crime_type__icontains=search)
        )

    # Status filter
    status_param = request.query_params.get('status', '').strip()
    if status_param and status_param != 'All':
        queryset = queryset.filter(status__iexact=status_param)

    # Crime type filter
    type_param = request.query_params.get('type', '').strip()
    if type_param and type_param != 'All':
        queryset = queryset.filter(crime_type__icontains=type_param)

    # Priority filter
    priority_param = request.query_params.get('priority', '').strip()
    if priority_param and priority_param != 'All':
        queryset = queryset.filter(priority__iexact=priority_param)

    serializer = CrimeReportListSerializer(queryset, many=True)
    return Response({
        'success': True,
        'count': queryset.count(),
        'crimes': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_crime_detail_view(request, pk):
    """
    Returns detailed crime report information strictly if it belongs to the authenticated station.
    """
    station = request.police_station
    
    crime = CrimeReport.objects.filter(
        Q(id=pk) if str(pk).isdigit() else Q(crime_id=pk),
        police_station=station
    ).first()

    if not crime:
        return Response({
            'success': False,
            'message': 'Crime report not found or access denied for this station.'
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = CrimeReportDetailSerializer(crime)
    return Response({
        'success': True,
        'crime': serializer.data
    }, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST', 'PATCH'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_crime_status_update_view(request, pk):
    """
    Updates the status of a crime report and records an immutable history trail.
    Strictly verifies ownership by the authenticated police station.
    """
    station = request.police_station
    crime = CrimeReport.objects.filter(
        Q(id=pk) if str(pk).isdigit() else Q(crime_id=pk),
        police_station=station
    ).first()

    if not crime:
        return Response({
            'success': False,
            'message': 'Crime report not found or access denied for this station.'
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = StatusUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid status update parameters.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    new_status = serializer.validated_data['status']
    remarks = serializer.validated_data.get('remarks', '').strip()
    assigned_officer = serializer.validated_data.get('assigned_officer', '').strip()
    investigation_notes = serializer.validated_data.get('investigation_notes', '').strip()

    old_status = crime.status

    # Record history
    CaseStatusHistory.objects.create(
        crime_report=crime,
        old_status=old_status,
        new_status=new_status,
        remarks=remarks or f"Status transitioned from {old_status} to {new_status}.",
        updated_by=f"Officer ({station.station_code})"
    )

    # Apply updates
    crime.status = new_status
    if assigned_officer:
        crime.assigned_officer = assigned_officer
    if investigation_notes:
        if crime.investigation_notes:
            crime.investigation_notes += f"\n\n[{new_status}]: {investigation_notes}"
        else:
            crime.investigation_notes = investigation_notes

    crime.save()

    return Response({
        'success': True,
        'message': f"Case {crime.crime_id} status updated to {new_status}.",
        'crime': CrimeReportDetailSerializer(crime).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_complaints_list_view(request):
    """
    Returns complaints scoped to the authenticated police station.
    """
    station = request.police_station
    queryset = Complaint.objects.filter(police_station=station)

    search = request.query_params.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(complaint_id__icontains=search) |
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(location__icontains=search) |
            Q(assigned_officer__icontains=search)
        )

    status_param = request.query_params.get('status', '').strip()
    if status_param and status_param != 'All':
        queryset = queryset.filter(status__iexact=status_param)

    serializer = ComplaintListSerializer(queryset, many=True)
    return Response({
        'success': True,
        'count': queryset.count(),
        'complaints': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_complaint_detail_view(request, pk):
    """
    Returns detailed complaint information scoped to the station.
    """
    station = request.police_station
    complaint = Complaint.objects.filter(
        Q(id=pk) if str(pk).isdigit() else Q(complaint_id=pk),
        police_station=station
    ).first()

    if not complaint:
        return Response({
            'success': False,
            'message': 'Complaint not found or access denied for this station.'
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = ComplaintDetailSerializer(complaint)
    return Response({
        'success': True,
        'complaint': serializer.data
    }, status=status.HTTP_200_OK)


@csrf_exempt
@api_view(['POST', 'PATCH'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_complaint_status_update_view(request, pk):
    """
    Updates the status of a complaint and records an audit history entry.
    """
    station = request.police_station
    complaint = Complaint.objects.filter(
        Q(id=pk) if str(pk).isdigit() else Q(complaint_id=pk),
        police_station=station
    ).first()

    if not complaint:
        return Response({
            'success': False,
            'message': 'Complaint not found or access denied for this station.'
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = StatusUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid status update parameters.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    new_status = serializer.validated_data['status']
    remarks = serializer.validated_data.get('remarks', '').strip()
    assigned_officer = serializer.validated_data.get('assigned_officer', '').strip()
    investigation_notes = serializer.validated_data.get('investigation_notes', '').strip()

    old_status = complaint.status

    CaseStatusHistory.objects.create(
        complaint=complaint,
        old_status=old_status,
        new_status=new_status,
        remarks=remarks or f"Complaint transitioned from {old_status} to {new_status}.",
        updated_by=f"Officer ({station.station_code})"
    )

    complaint.status = new_status
    if assigned_officer:
        complaint.assigned_officer = assigned_officer
    if investigation_notes:
        if complaint.investigation_notes:
            complaint.investigation_notes += f"\n\n[{new_status}]: {investigation_notes}"
        else:
            complaint.investigation_notes = investigation_notes

    complaint.save()

    return Response({
        'success': True,
        'message': f"Complaint {complaint.complaint_id} status updated to {new_status}.",
        'complaint': ComplaintDetailSerializer(complaint).data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([PoliceAuthentication])
@permission_classes([IsPoliceStationAuthenticated])
def police_station_profile_view(request):
    """
    Station information page endpoint.
    Displays: station name, code, district, address, phone, email, location.
    Strictly excludes secret identification key.
    """
    station = request.police_station
    crimes_count = CrimeReport.objects.filter(police_station=station).count()
    complaints_count = Complaint.objects.filter(police_station=station).count()
    active_cases = (
        CrimeReport.objects.filter(police_station=station).exclude(status__in=['Resolved', 'Closed']).count() +
        Complaint.objects.filter(police_station=station).exclude(status__in=['Resolved', 'Closed']).count()
    )

    data = PoliceStationSerializer(station).data
    data['summary_stats'] = {
        'total_crimes': crimes_count,
        'total_complaints': complaints_count,
        'active_cases': active_cases
    }

    return Response({
        'success': True,
        'station': data
    }, status=status.HTTP_200_OK)
