from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes, authentication_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Complaint, PoliceStation
from .serializers import ComplaintDetailSerializer
import uuid

@api_view(["GET"])
def test_api(request):
    return Response({
        "message": "React successfully connected to Django"
    })

import math
import threading
from .decorators import loginrequired
from .ai_utils import analyze_text_with_groq
from .authentication import CsrfExemptSessionAuthentication

def run_ai_analysis(complaint):
    text_to_analyze = f"Title: {complaint.title}\nType: {complaint.complaint_type}\nDescription: {complaint.description}\nLocation: {complaint.location}"
    result = analyze_text_with_groq(text_to_analyze)
    
    complaint.ai_severity = result.get('severity', 'Medium')
    complaint.ai_summary = result.get('summary', '')
    complaint.ai_analysis = result.get('analysis', '')
    
    severity = complaint.ai_severity.lower()
    if 'critical' in severity:
        complaint.priority = 'Critical'
    elif 'high' in severity:
        complaint.priority = 'High'
    elif 'medium' in severity:
        complaint.priority = 'Medium'
    elif 'low' in severity:
        complaint.priority = 'Low'
        
    complaint.save()

import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0 # Earth radius in km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = math.sin(dLat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dLon/2)**2
    return R * (2 * math.atan2(math.sqrt(a), math.sqrt(1-a)))

@api_view(["POST"])
@authentication_classes([CsrfExemptSessionAuthentication])
@parser_classes([MultiPartParser, FormParser])
@loginrequired
def create_complaint(request):
    data = request.data.copy()
    
    station_id = data.get('station_id')
    station = None
    
    if station_id and station_id != 'auto':
        try:
            station = PoliceStation.objects.get(id=station_id)
        except PoliceStation.DoesNotExist:
            pass
            
    # Auto route based on closest location if no specific station or station not found
    if not station:
        lat = data.get('latitude')
        lon = data.get('longitude')
        
        if lat and lon:
            try:
                lat = float(lat)
                lon = float(lon)
                closest_station = None
                min_distance = float('inf')
                
                for s in PoliceStation.objects.filter(is_active=True).exclude(latitude__isnull=True).exclude(longitude__isnull=True):
                    dist = haversine(lat, lon, float(s.latitude), float(s.longitude))
                    if dist < min_distance:
                        min_distance = dist
                        closest_station = s
                
                station = closest_station
            except (ValueError, TypeError):
                pass
                
    # Fallback if no location or no stations have coords
    if not station:
        station = PoliceStation.objects.first()
        
    if not station:
        return Response({"error": "No police station available in system."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    complaint_id = f"CMP-{uuid.uuid4().hex[:8].upper()}"

    # Round lat/lon to 6 decimal places to fit DecimalField(max_digits=9, decimal_places=6)
    clean_lat = None
    clean_lon = None
    try:
        if data.get('latitude'):
            clean_lat = round(float(data['latitude']), 6)
        if data.get('longitude'):
            clean_lon = round(float(data['longitude']), 6)
    except (ValueError, TypeError):
        pass

    serializer = ComplaintDetailSerializer(data=data)
    if serializer.is_valid():
        complaint = serializer.save(
            complaint_id=complaint_id,
            police_station=station,
            status='Submitted',
            latitude=clean_lat,
            longitude=clean_lon,
        )
        
        # Trigger background AI analysis
        thread = threading.Thread(target=run_ai_analysis, args=(complaint,))
        thread.start()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@loginrequired
def get_my_complaints(request):
    # Fetch complaints by phone number (if logged in) or allow frontend to pass a list of IDs
    phone = request.user.phone_number if hasattr(request.user, 'phone_number') and request.user.is_authenticated else None
    
    queryset = Complaint.objects.all()
    
    # Filter by user's phone if authenticated
    if phone:
        queryset = queryset.filter(complainant_contact=phone)
    else:
        # Fallback for guests: frontend passes ?ids=CMP-123,CMP-456
        ids_param = request.query_params.get('ids', '')
        if ids_param:
            ids_list = [i.strip() for i in ids_param.split(',') if i.strip()]
            queryset = queryset.filter(complaint_id__in=ids_list)
        else:
            return Response({"success": True, "complaints": []}, status=status.HTTP_200_OK)
            
    serializer = ComplaintDetailSerializer(queryset, many=True)
    return Response({"success": True, "complaints": serializer.data}, status=status.HTTP_200_OK)


@api_view(["GET"])
def public_map_data(request):
    """
    Returns public, anonymized data for the crime map.
    Only includes cases with valid coordinates.
    """
    from .models import CrimeReport, Complaint
    nodes = []
    
    # Add Complaints
    complaints = Complaint.objects.filter(latitude__isnull=False, longitude__isnull=False)
    for c in complaints:
        nodes.append({
            "id": c.complaint_id,
            "type": "complaint",
            "lat": float(c.latitude),
            "lng": float(c.longitude),
            "title": c.title,
            "category": c.complaint_type,
            "date": c.date.strftime("%b %d, %Y"),
            "status": c.status,
            "priority": c.priority,
            "station": c.police_station.station_name if c.police_station else "Unknown"
        })
        
    # Add Crime Reports
    crimes = CrimeReport.objects.filter(location__isnull=False) # Wait, CrimeReport doesn't have lat/lon yet! 
    # Just return Complaints for now since that's what citizens are creating with the map.
    
    return Response({"success": True, "nodes": nodes}, status=status.HTTP_200_OK)