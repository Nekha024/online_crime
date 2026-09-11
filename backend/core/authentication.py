from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed
from .models import PoliceStation, PoliceStationToken

class PoliceAuthentication(BaseAuthentication):
    """
    Dedicated authentication backend for Police Stations.
    Supports Authorization Bearer tokens, X-Police-Token header, and police sessions.
    Completely isolated from regular citizen User authentication.
    """
    def authenticate(self, request):
        token_key = None
        auth_header = request.headers.get('Authorization', '')
        
        if auth_header.startswith('Bearer ') or auth_header.startswith('Token '):
            token_key = auth_header.split(' ', 1)[1].strip()
        elif 'X-Police-Token' in request.headers:
            token_key = request.headers.get('X-Police-Token', '').strip()

        if token_key:
            try:
                token = PoliceStationToken.objects.select_related('station').get(key=token_key)
                if not token.station.is_active:
                    raise AuthenticationFailed("Police station account is inactive.")
                request.police_station = token.station
                return (None, token)
            except PoliceStationToken.DoesNotExist:
                raise AuthenticationFailed("Invalid police station token.")

        # Check Django session for police session flag
        session_station_id = request.session.get('police_station_id')
        is_police = request.session.get('is_police')
        if session_station_id and is_police:
            try:
                station = PoliceStation.objects.get(id=session_station_id, is_active=True)
                request.police_station = station
                return (None, None)
            except PoliceStation.DoesNotExist:
                pass

        return None


class IsPoliceStationAuthenticated(BasePermission):
    """
    Permission class that strictly requires a verified PoliceStation.
    Rejects:
    - Unauthenticated requests
    - Normal citizen/public users (request.user without a verified police_station)
    - Unauthorized requests
    """
    message = "Access restricted to authorized police station personnel only."

    def has_permission(self, request, view):
        police_station = getattr(request, 'police_station', None)
        if not police_station or not police_station.is_active:
            return False
        return True
