#!/bin/bash
# Script to update existing doctor profiles with location data

cd /home/prantic/SHS/backend
source venv/bin/activate

echo "Updating existing doctor profiles with location data..."

python manage.py shell << EOF
from apps.users.models import DoctorInformation

# Update doctor profiles that don't have location data
updates = [
    {"id": 1, "city": "Mumbai", "state": "Maharashtra"},
    {"id": 2, "city": "Delhi", "state": "Delhi"},
    {"id": 3, "city": "Bangalore", "state": "Karnataka"},
    {"id": 14, "city": "Kolkata", "state": "West Bengal"},
]

for update in updates:
    try:
        doc = DoctorInformation.objects.get(id=update["id"])
        doc.city = update["city"]
        doc.state = update["state"]
        doc.save()
        print(f"✅ Updated Doctor ID {update['id']}: {update['city']}, {update['state']}")
    except DoctorInformation.DoesNotExist:
        print(f"❌ Doctor ID {update['id']} not found")
    except Exception as e:
        print(f"❌ Error updating Doctor ID {update['id']}: {e}")

print("\n✅ All doctor profiles updated successfully!")
EOF

echo "Done!"
