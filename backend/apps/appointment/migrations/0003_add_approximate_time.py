from django.db import migrations, models
import django.db.models.deletion


def generate_approximate_time(apps, schema_editor):
    Appointment = apps.get_model('appointment', 'Appointment')
    DoctorSchedule = apps.get_model('doctors', 'DoctorSchedule')
    from datetime import datetime, timedelta

    for apt in Appointment.objects.all():
        try:
            day_of_week = (apt.appointment_date.weekday() + 1) % 7
            schedule = DoctorSchedule.objects.filter(
                doctor=apt.doctor,
                day_of_week=day_of_week,
                is_active=True
            ).first()
            if schedule:
                base_datetime = datetime.combine(apt.appointment_date, schedule.start_time)
                approximate_datetime = base_datetime + timedelta(minutes=(apt.serial_number - 1) * 10)
                apt.approximate_time = approximate_datetime.time()
                apt.save()
        except Exception:
            continue

class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0002_alter_appointment_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='approximate_time',
            field=models.TimeField(null=True, blank=True, help_text='Approximate appointment time calculated from serial number'),
        ),
        migrations.RunPython(generate_approximate_time, reverse_code=migrations.RunPython.noop),
    ]
