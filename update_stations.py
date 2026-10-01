import os

with open('backend/core/admin_views.py', 'r') as f:
    content = f.read()

old_get = '''
    if request.method == 'GET':
        stations = PoliceStation.objects.all()
        data = []
        for s in stations:
            data.append({
                'id': s.id,
                'station_name': s.station_name,
                'station_code': s.station_code,
                'police_district': s.police_district,
                'username': s.username,
                'is_active': s.is_active
            })
        return Response({'success': True, 'stations': data})'''

new_get = '''
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
        return Response({'success': True, 'stations': data})'''

content = content.replace(old_get, new_get)

with open('backend/core/admin_views.py', 'w') as f:
    f.write(content)

print('admin_views.py updated')
