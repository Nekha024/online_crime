import re

f_path = 'd:/Developments/FreeLance/AICrimeReporting/backend/core/serializers.py'
with open(f_path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    "formatted_date = serializers.SerializerMethodField()", 
    "formatted_date = serializers.SerializerMethodField()\n    registered_user_details = serializers.SerializerMethodField()"
)

c = c.replace(
    "'complainant_contact',", 
    "'complainant_contact',\n            'registered_user_details',"
)

c = c.replace(
    "def get_formatted_date(self, obj):\n        return obj.date.strftime(\"%b %d, %Y\")", 
    "def get_formatted_date(self, obj):\n        return obj.date.strftime(\"%b %d, %Y\")\n\n    def get_registered_user_details(self, obj):\n        if obj.user:\n            return {'username': obj.user.username, 'email': obj.user.email, 'name': getattr(obj.user, 'first_name', obj.user.username), 'phone': getattr(obj.user, 'phone_number', '')}\n        return None"
)

with open(f_path, 'w', encoding='utf-8') as f:
    f.write(c)
print("done")
