import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from core.models import AdminProfile

User = get_user_model()

def create_admin():
    email = input('Admin Email: ')
    password = input('Admin Password: ')
    
    if User.objects.filter(email=email).exists():
        print('User with this email already exists.')
        return
        
    user = User.objects.create_user(
        username=email.split('@')[0] + '_admin',
        email=email,
        password=password,
        first_name='System Admin'
    )
    AdminProfile.objects.create(user=user, role='Super Admin')
    print('System Admin created successfully.')

if __name__ == '__main__':
    create_admin()
