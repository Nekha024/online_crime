import re

f_path = 'd:/Developments/FreeLance/AICrimeReporting/backend/core/serializers.py'
with open(f_path, 'r', encoding='utf-8') as f:
    c = f.read()

# The classes are:
# 1. CrimeReportListSerializer
# 2. CrimeReportDetailSerializer (has formatted_report_date and formatted_incident_date, no formatted_date)
# 3. ComplaintListSerializer
# 4. ComplaintDetailSerializer

# So CrimeReportListSerializer and ComplaintListSerializer got the field by accident.

# Remove from CrimeReportListSerializer
c = re.sub(r'(class CrimeReportListSerializer.*?formatted_date = serializers\.SerializerMethodField\(\))\n    registered_user_details = serializers\.SerializerMethodField\(\)', r'\1', c, flags=re.DOTALL)

# Remove from ComplaintListSerializer
c = re.sub(r'(class ComplaintListSerializer.*?formatted_date = serializers\.SerializerMethodField\(\))\n    registered_user_details = serializers\.SerializerMethodField\(\)', r'\1', c, flags=re.DOTALL)

with open(f_path, 'w', encoding='utf-8') as f:
    f.write(c)

print("Cleaned up extra registered_user_details fields")
