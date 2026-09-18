from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def loginrequired(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        # Check if user is authenticated (regular user)
        if request.user and request.user.is_authenticated:
            return view_func(request, *args, **kwargs)

        return Response(
            {'success': False, 'message': 'Authentication required. Please login.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    return _wrapped_view
