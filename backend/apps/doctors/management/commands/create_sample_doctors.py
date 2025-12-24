"""
Management command to create sample doctor data for Sprint 2 testing
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import DoctorInformation
from decimal import Decimal
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Create sample doctors for Sprint 2 testing'
    
    SPECIALIZATIONS = [
        'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics',
        'Neurology', 'Psychiatry', 'Gastroenterology', 'Ophthalmology',
        'ENT', 'General Medicine'
    ]
    
    CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad']
    STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Telangana', 'Maharashtra', 'Gujarat']
    
    QUALIFICATIONS = [
        'MBBS, MD (General Medicine)',
        'MBBS, MS (Surgery)',
        'MBBS, MD (Pediatrics)',
        'MBBS, DNB (Cardiology)',
        'MBBS, MD (Dermatology)',
    ]
    
    def handle(self, *args, **options):
        self.stdout.write('Creating sample doctors...')
        
        doctors_data = [
            {
                'name': 'Dr. Rajesh Kumar',
                'specialization': 'Cardiology',
                'experience_years': 15,
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'consultation_fee': Decimal('1500.00'),
                'bio': 'Experienced cardiologist with expertise in interventional cardiology.',
            },
            {
                'name': 'Dr. Priya Sharma',
                'specialization': 'Dermatology',
                'experience_years': 10,
                'city': 'Delhi',
                'state': 'Delhi',
                'consultation_fee': Decimal('1200.00'),
                'bio': 'Specialist in cosmetic and clinical dermatology.',
            },
            {
                'name': 'Dr. Amit Patel',
                'specialization': 'Pediatrics',
                'experience_years': 12,
                'city': 'Bangalore',
                'state': 'Karnataka',
                'consultation_fee': Decimal('800.00'),
                'bio': 'Child specialist with focus on preventive care.',
            },
            {
                'name': 'Dr. Sneha Reddy',
                'specialization': 'Orthopedics',
                'experience_years': 8,
                'city': 'Hyderabad',
                'state': 'Telangana',
                'consultation_fee': Decimal('1000.00'),
                'bio': 'Expert in joint replacement and sports injuries.',
            },
            {
                'name': 'Dr. Vikram Singh',
                'specialization': 'Neurology',
                'experience_years': 20,
                'city': 'Chennai',
                'state': 'Tamil Nadu',
                'consultation_fee': Decimal('2000.00'),
                'bio': 'Senior neurologist specializing in stroke management.',
            },
            {
                'name': 'Dr. Anita Verma',
                'specialization': 'Psychiatry',
                'experience_years': 7,
                'city': 'Pune',
                'state': 'Maharashtra',
                'consultation_fee': Decimal('1500.00'),
                'bio': 'Mental health specialist with holistic approach.',
            },
            {
                'name': 'Dr. Ramesh Nair',
                'specialization': 'Gastroenterology',
                'experience_years': 14,
                'city': 'Kolkata',
                'state': 'West Bengal',
                'consultation_fee': Decimal('1300.00'),
                'bio': 'Digestive system expert with advanced endoscopy training.',
            },
            {
                'name': 'Dr. Kavita Desai',
                'specialization': 'Ophthalmology',
                'experience_years': 11,
                'city': 'Ahmedabad',
                'state': 'Gujarat',
                'consultation_fee': Decimal('900.00'),
                'bio': 'Eye specialist with laser surgery expertise.',
            },
            {
                'name': 'Dr. Suresh Gupta',
                'specialization': 'ENT',
                'experience_years': 9,
                'city': 'Mumbai',
                'state': 'Maharashtra',
                'consultation_fee': Decimal('1100.00'),
                'bio': 'ENT surgeon with focus on minimally invasive procedures.',
            },
            {
                'name': 'Dr. Meera Iyer',
                'specialization': 'General Medicine',
                'experience_years': 13,
                'city': 'Bangalore',
                'state': 'Karnataka',
                'consultation_fee': Decimal('700.00'),
                'bio': 'General physician for all age groups and common ailments.',
            },
        ]
        
        created_count = 0
        for doc_data in doctors_data:
            # Create or get user
            email = doc_data['name'].lower().replace('dr. ', '').replace(' ', '_') + '@hospital.com'
            phone = f'+91{random.randint(7000000000, 9999999999)}'
            
            user, user_created = User.objects.get_or_create(
                email=email,
                defaults={
                    'name': doc_data['name'],
                    'phone': phone,
                    'role': 'DOCTOR',
                    'location': f'{doc_data["city"]}, {doc_data["state"]}',
                }
            )
            
            if user_created:
                user.set_password('doctor123')  # Set a default password
                user.save()
            
            # Create or update doctor profile
            doctor, created = DoctorInformation.objects.update_or_create(
                user=user,
                defaults={
                    'license_number': f'MED{random.randint(10000, 99999)}',
                    'qualification': random.choice(self.QUALIFICATIONS),
                    'education': 'Medical College, University Hospital',
                    'specialization': doc_data['specialization'],
                    'practice_location': f'{doc_data["city"]} Medical Center',
                    'experience_years': doc_data['experience_years'],
                    'bio': doc_data['bio'],
                    'status': 'APPROVED',
                    'is_verified': True,
                    'rating_avg': Decimal('0.00'),
                    'rating_count': 0,
                    'availability_status': 'unavailable',  # All unavailable initially
                    'phone': f'+91 {random.randint(7000000000, 9999999999)}',
                    'email': email,
                    'consultation_fee': doc_data['consultation_fee'],
                    'clinic_address': f'{random.randint(1, 99)} Main Street, {doc_data["city"]}',
                    'city': doc_data['city'],
                    'state': doc_data['state'],
                    'pincode': str(random.randint(100000, 999999)),
                    'languages': 'English, Hindi',
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'Created: {doc_data["name"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'Updated: {doc_data["name"]}'))
        
        self.stdout.write(self.style.SUCCESS(f'\nSuccessfully created {created_count} new doctors!'))
        self.stdout.write(f'Total doctors in database: {DoctorInformation.objects.count()}')
        self.stdout.write('\nAll doctors are set to "unavailable" status as per Sprint 2 requirements.')
        self.stdout.write('Default password for all doctor accounts: doctor123')
