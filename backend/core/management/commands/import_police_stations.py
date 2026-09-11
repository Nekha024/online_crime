import json
import os
import re
import secrets
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.conf import settings
from core.models import PoliceStation

class Command(BaseCommand):
    help = 'Imports police stations from a JSON file into the database.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            '-f',
            type=str,
            default=None,
            help='Path to the police stations JSON file. Defaults to backend/data/police_stations.json'
        )

    def generate_unique_station_code(self, district, name):
        dist_clean = re.sub(r'[^A-Za-z0-9]', '', district).upper()[:6]
        name_clean = re.sub(r'[^A-Za-z0-9]', '', name).upper()[:12]
        base_code = f"KL-{dist_clean}-{name_clean}"
        code = base_code
        counter = 1
        while PoliceStation.objects.filter(station_code=code).exists():
            code = f"{base_code}-{counter}"
            counter += 1
        return code

    def generate_unique_username(self, district, name):
        name_slug = slugify(name).replace('-', '_')
        dist_slug = slugify(district).replace('-', '_')
        base_username = name_slug
        
        # If too short or already taken
        if len(base_username) < 3 or PoliceStation.objects.filter(username=base_username).exists():
            base_username = f"{name_slug}_{dist_slug}"
        
        username = base_username
        counter = 1
        while PoliceStation.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1
        return username

    def generate_unique_key(self, district, name):
        dist_part = slugify(district)[:4].upper().replace('-', '')
        while True:
            rand_part = secrets.token_hex(4).upper()
            key = f"PSK-{dist_part}-{rand_part}"
            if not PoliceStation.objects.filter(identification_key=key).exists():
                return key

    def handle(self, *args, **options):
        file_path = options.get('file')
        if not file_path:
            file_path = os.path.join(settings.BASE_DIR, 'data', 'police_stations.json')

        if not os.path.isabs(file_path):
            file_path = os.path.abspath(file_path)

        if not os.path.exists(file_path):
            self.stderr.write(self.style.ERROR(f"JSON file not found at: {file_path}"))
            return

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error reading JSON file: {e}"))
            return

        if not isinstance(data, list):
            self.stderr.write(self.style.ERROR("Invalid JSON format: Expected a list of police station objects."))
            return

        processed = 0
        created_count = 0
        updated_count = 0
        invalid_count = 0
        sample_credentials = []

        for item in data:
            processed += 1
            
            # Validation
            if not isinstance(item, dict):
                invalid_count += 1
                self.stderr.write(self.style.WARNING(f"Record #{processed}: Invalid data format (not an object)."))
                continue

            station_name = item.get('station_name', '').strip()
            police_district = item.get('police_district', '').strip()
            revenue_district = item.get('revenue_district', '').strip() or police_district

            if not station_name or not police_district:
                invalid_count += 1
                self.stderr.write(self.style.WARNING(f"Record #{processed}: Missing station_name or police_district."))
                continue

            location_name = item.get('location_name', '').strip() or station_name
            station_type = item.get('station_type', 'General').strip()
            state = item.get('state', 'Kerala').strip()
            country = item.get('country', 'India').strip()
            address = item.get('address', '').strip()
            phone = item.get('phone', '').strip()
            email = item.get('email', '').strip()
            latitude = item.get('latitude')
            longitude = item.get('longitude')

            # Look for existing record by station_name and police_district
            existing = PoliceStation.objects.filter(
                station_name__iexact=station_name,
                police_district__iexact=police_district
            ).first()

            if existing:
                # Update existing record without changing existing credentials
                existing.location_name = location_name
                existing.revenue_district = revenue_district
                existing.station_type = station_type
                existing.state = state
                existing.country = country
                if address:
                    existing.address = address
                if phone:
                    existing.phone = phone
                if email:
                    existing.email = email
                if latitude is not None:
                    existing.latitude = latitude
                if longitude is not None:
                    existing.longitude = longitude
                existing.save()
                updated_count += 1
                if len(sample_credentials) < 2:
                    sample_credentials.append((existing.station_name, existing.username, existing.identification_key))
            else:
                # Create new record with unique station_code, username, and identification_key
                station_code = self.generate_unique_station_code(police_district, station_name)
                username = self.generate_unique_username(police_district, station_name)
                identification_key = self.generate_unique_key(police_district, station_name)

                new_station = PoliceStation.objects.create(
                    station_name=station_name,
                    location_name=location_name,
                    station_code=station_code,
                    police_district=police_district,
                    revenue_district=revenue_district,
                    station_type=station_type,
                    state=state,
                    country=country,
                    address=address,
                    phone=phone,
                    email=email,
                    latitude=latitude,
                    longitude=longitude,
                    username=username,
                    identification_key=identification_key,
                    is_active=True
                )
                created_count += 1
                if len(sample_credentials) < 2:
                    sample_credentials.append((new_station.station_name, new_station.username, new_station.identification_key))

        # Output Summary
        self.stdout.write(self.style.SUCCESS("\n--- Import Summary ---"))
        self.stdout.write(f"Processed: {processed}")
        self.stdout.write(f"Created: {created_count}")
        self.stdout.write(f"Updated: {updated_count}")
        self.stdout.write(f"Invalid: {invalid_count}")

        if sample_credentials:
            self.stdout.write(self.style.SUCCESS("\n--- Sample Police Credentials for Testing ---"))
            for name, uname, key in sample_credentials:
                self.stdout.write(f"Station: {name}")
                self.stdout.write(f"  Username: {uname}")
                self.stdout.write(f"  Identification Key: {key}\n")
