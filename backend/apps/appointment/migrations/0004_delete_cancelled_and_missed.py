from django.db import migrations
from django.utils import timezone
from datetime import datetime


def delete_cancelled_and_missed_appointments(apps, schema_editor):
    """Delete all cancelled appointments and appointments with passed time"""
    Appointment = apps.get_model('appointment', 'Appointment')
    
    # Delete all cancelled and no-show appointments
    deleted_count = Appointment.objects.filter(
        status__in=['CANCELLED', 'NO_SHOW']
    ).delete()[0]
    
    print(f"Deleted {deleted_count} cancelled/no-show appointments")
    
    # Delete missed appointments (today's appointments with passed approximate_time)
    from datetime import date, time as dt_time
    today = date.today()
    current_time = timezone.now().time()
    
    missed_count = 0
    for apt in Appointment.objects.filter(appointment_date=today):
        if apt.approximate_time and apt.approximate_time < current_time:
            apt.delete()
            missed_count += 1
    
    print(f"Deleted {missed_count} missed appointments")


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0003_add_approximate_time'),
    ]

    operations = [
        migrations.RunPython(
            delete_cancelled_and_missed_appointments, 
            reverse_code=migrations.RunPython.noop
        ),
    ]
