"""
Django management command to cleanup missed appointments
This command should be run daily (e.g., via cron job at end of day)

Usage:
    python manage.py cleanup_missed_appointments

Cron job example (run at 11:59 PM daily):
    59 23 * * * cd /path/to/SHS/backend && /path/to/python manage.py cleanup_missed_appointments
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date
from apps.appointment.models import Appointment


class Command(BaseCommand):
    help = 'Delete appointments that have missed their time for today'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be deleted without actually deleting',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        today = date.today()
        current_time = timezone.now().time()
        
        self.stdout.write(self.style.WARNING(f'Running cleanup for {today}...'))
        
        # Find all appointments for today whose approximate time has passed
        # and are not completed
        missed_appointments = []
        appointments_to_check = Appointment.objects.filter(
            appointment_date=today
        ).exclude(status='COMPLETED')
        
        for apt in appointments_to_check:
            apt_time = getattr(apt, 'approximate_time', None) or apt.get_approximate_time()
            if apt_time and apt_time < current_time:
                missed_appointments.append({
                    'id': apt.id,
                    'appointment_number': apt.appointment_number,
                    'patient': apt.patient.name if apt.patient else 'Unknown',
                    'doctor': apt.doctor.user.name if apt.doctor else 'Unknown',
                    'time': str(apt_time),
                })
        
        count = len(missed_appointments)
        
        if count == 0:
            self.stdout.write(self.style.SUCCESS('No missed appointments to clean up.'))
            return
        
        self.stdout.write(self.style.WARNING(f'Found {count} missed appointment(s):'))
        for apt in missed_appointments:
            self.stdout.write(
                f"  - {apt['appointment_number']}: {apt['patient']} "
                f"with Dr. {apt['doctor']} at {apt['time']}"
            )
        
        if dry_run:
            self.stdout.write(self.style.NOTICE('\n[DRY RUN] No appointments were deleted.'))
        else:
            # Delete the missed appointments
            appointment_ids = [apt['id'] for apt in missed_appointments]
            Appointment.objects.filter(id__in=appointment_ids).delete()
            
            self.stdout.write(
                self.style.SUCCESS(f'\nSuccessfully deleted {count} missed appointment(s).')
            )
