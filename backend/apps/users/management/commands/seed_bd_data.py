"""
Seed Bangladeshi Doctor and Patient Data
Creates realistic test data with BD names and locations
All users will have password: zxcvbnm123
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.users.models import DoctorInformation
from apps.doctors.models import Rating

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with Bangladeshi doctors and patients'
    
    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Clearing existing data...'))
        
        # Clear existing data
        Rating.objects.all().delete()
        DoctorInformation.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        
        self.stdout.write(self.style.SUCCESS('✓ Existing data cleared'))
        self.stdout.write(self.style.WARNING('\nCreating doctors...'))
        
        # Bangladeshi Doctors Data
        doctors_data = [
            {
                'name': 'Dr. Abdur Rahman Khan',
                'email': 'abdur.rahman@shs.com',
                'phone': '01711234567',
                'location': 'Dhanmondi, Dhaka',
                'blood_group': 'A+',
                'gender': 'Male',
                'age': 45,
                'license_number': 'BMDC-12345',
                'qualification': 'MBBS, MD (Cardiology)',
                'education': 'Dhaka Medical College, Bangabandhu Sheikh Mujib Medical University',
                'specialization': 'Cardiology',
                'practice_location': 'Square Hospital, Dhaka',
                'experience_years': 18,
                'bio': 'Experienced cardiologist specializing in interventional cardiology and heart disease management.',
                'consultation_fee': 1500.00,
                'clinic_address': 'Square Hospital, 18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205',
                'city': 'Dhaka',
                'languages': 'Bangla, English',
                'availability_status': 'available',
                'is_verified': True,
                'status': 'APPROVED'
            },
            {
                'name': 'Dr. Fatima Begum',
                'email': 'fatima.begum@shs.com',
                'phone': '01811234568',
                'location': 'Agrabad, Chattogram',
                'blood_group': 'B+',
                'gender': 'Female',
                'age': 38,
                'license_number': 'BMDC-12346',
                'qualification': 'MBBS, FCPS (Pediatrics)',
                'education': 'Chittagong Medical College, Institute of Child Health',
                'specialization': 'Pediatrics',
                'practice_location': 'Chattogram Medical College Hospital',
                'experience_years': 12,
                'bio': 'Dedicated pediatrician with expertise in child health and development.',
                'consultation_fee': 1200.00,
                'clinic_address': 'Chattogram Medical College Hospital, K.B. Fazlul Kader Road, Chattogram',
                'city': 'Chattogram',
                'languages': 'Bangla, English',
                'availability_status': 'available',
                'is_verified': True,
                'status': 'APPROVED'
            },
            {
                'name': 'Dr. Mohammad Karim',
                'email': 'mohammad.karim@shs.com',
                'phone': '01911234569',
                'location': 'Zindabazar, Sylhet',
                'blood_group': 'O+',
                'gender': 'Male',
                'age': 42,
                'license_number': 'BMDC-12347',
                'qualification': 'MBBS, MS (Orthopedics)',
                'education': 'Sylhet MAG Osmani Medical College, BSMMU',
                'specialization': 'Orthopedics',
                'practice_location': 'Sylhet Osmani Medical College Hospital',
                'experience_years': 15,
                'bio': 'Orthopedic surgeon specializing in joint replacement and sports injuries.',
                'consultation_fee': 1300.00,
                'clinic_address': 'Sylhet MAG Osmani Medical College Hospital, Sylhet',
                'city': 'Sylhet',
                'languages': 'Bangla, English, Hindi',
                'availability_status': 'available',
                'is_verified': True,
                'status': 'APPROVED'
            },
            {
                'name': 'Dr. Nasrin Akter',
                'email': 'nasrin.akter@shs.com',
                'phone': '01511234570',
                'location': 'Newmarket, Dhaka',
                'blood_group': 'AB+',
                'gender': 'Female',
                'age': 35,
                'license_number': 'BMDC-12348',
                'qualification': 'MBBS, FCPS (Dermatology)',
                'education': 'Sir Salimullah Medical College, BSMMU',
                'specialization': 'Dermatology',
                'practice_location': 'LabAid Specialized Hospital',
                'experience_years': 10,
                'bio': 'Dermatologist specializing in skin conditions, cosmetic dermatology and hair treatment.',
                'consultation_fee': 1000.00,
                'clinic_address': 'LabAid Specialized Hospital, House-1, Road-4, Dhanmondi, Dhaka',
                'city': 'Dhaka',
                'languages': 'Bangla, English',
                'availability_status': 'available',
                'is_verified': True,
                'status': 'APPROVED'
            },
            {
                'name': 'Dr. Rafiqul Islam',
                'email': 'rafiqul.islam@shs.com',
                'phone': '01611234571',
                'location': 'Kazir Dewri, Chattogram',
                'blood_group': 'A-',
                'gender': 'Male',
                'age': 50,
                'license_number': 'BMDC-12349',
                'qualification': 'MBBS, FCPS (General Surgery)',
                'education': 'Dhaka Medical College, Royal College of Surgeons',
                'specialization': 'General Surgery',
                'practice_location': 'Chevron Clinical Laboratory',
                'experience_years': 22,
                'bio': 'Experienced general surgeon with expertise in laparoscopic and minimally invasive surgery.',
                'consultation_fee': 1400.00,
                'clinic_address': 'Chevron Clinical Laboratory, Mehedibagh, Chattogram',
                'city': 'Chattogram',
                'languages': 'Bangla, English',
                'availability_status': 'busy',
                'is_verified': True,
                'status': 'APPROVED'
            },
            {
                'name': 'Dr. Sultana Ahmed',
                'email': 'sultana.ahmed@shs.com',
                'phone': '01711234572',
                'location': 'Motijheel, Dhaka',
                'blood_group': 'B-',
                'gender': 'Female',
                'age': 40,
                'license_number': 'BMDC-12350',
                'qualification': 'MBBS, FCPS (Gynecology)',
                'education': 'Dhaka Medical College, BSMMU',
                'specialization': 'Gynecology',
                'practice_location': 'United Hospital Limited',
                'experience_years': 14,
                'bio': 'Gynecologist and obstetrician specializing in high-risk pregnancies and women\'s health.',
                'consultation_fee': 1500.00,
                'clinic_address': 'United Hospital Limited, Plot 15, Road 71, Gulshan, Dhaka',
                'city': 'Dhaka',
                'languages': 'Bangla, English',
                'availability_status': 'available',
                'is_verified': True,
                'status': 'APPROVED'
            },
            {
                'name': 'Dr. Habibur Rahman',
                'email': 'habibur.rahman@shs.com',
                'phone': '01811234573',
                'location': 'Court Road, Rajshahi',
                'blood_group': 'O-',
                'gender': 'Male',
                'age': 48,
                'license_number': 'BMDC-12351',
                'qualification': 'MBBS, MD (Neurology)',
                'education': 'Rajshahi Medical College, National Institute of Neurosciences',
                'specialization': 'Neurology',
                'practice_location': 'Rajshahi Medical College Hospital',
                'experience_years': 20,
                'bio': 'Neurologist with expertise in stroke management and neurological disorders.',
                'consultation_fee': 1600.00,
                'clinic_address': 'Rajshahi Medical College Hospital, Laxmipur, Rajshahi',
                'city': 'Rajshahi',
                'languages': 'Bangla, English',
                'availability_status': 'available',
                'is_verified': True,
                'status': 'APPROVED'
            },
            {
                'name': 'Dr. Shahnaz Parvin',
                'email': 'shahnaz.parvin@shs.com',
                'phone': '01911234574',
                'location': 'Badda, Dhaka',
                'blood_group': 'AB-',
                'gender': 'Female',
                'age': 37,
                'license_number': 'BMDC-12352',
                'qualification': 'MBBS, MD (Psychiatry)',
                'education': 'Dhaka Medical College, National Institute of Mental Health',
                'specialization': 'Psychiatry',
                'practice_location': 'National Institute of Mental Health',
                'experience_years': 11,
                'bio': 'Psychiatrist specializing in anxiety, depression, and mental health counseling.',
                'consultation_fee': 1100.00,
                'clinic_address': 'National Institute of Mental Health, Sher-e-Bangla Nagar, Dhaka',
                'city': 'Dhaka',
                'languages': 'Bangla, English',
                'availability_status': 'available',
                'is_verified': True,
                'status': 'APPROVED'
            },
            {
                'name': 'Dr. Mizanur Rahman',
                'email': 'mizanur.rahman@shs.com',
                'phone': '01511234575',
                'location': 'Kaptai Road, Chattogram',
                'blood_group': 'A+',
                'gender': 'Male',
                'age': 44,
                'license_number': 'BMDC-12353',
                'qualification': 'MBBS, FCPS (Medicine)',
                'education': 'Chattogram Medical College, BIRDEM',
                'specialization': 'Internal Medicine',
                'practice_location': 'Imperial Hospital Limited',
                'experience_years': 17,
                'bio': 'Specialist in internal medicine, diabetes management, and general health.',
                'consultation_fee': 1200.00,
                'clinic_address': 'Imperial Hospital Limited, Nasirabad, Chattogram',
                'city': 'Chattogram',
                'languages': 'Bangla, English',
                'availability_status': 'available',
                'is_verified': True,
                'status': 'APPROVED'
            },
            {
                'name': 'Dr. Taslima Khatun',
                'email': 'taslima.khatun@shs.com',
                'phone': '01611234576',
                'location': 'Khulna Sadar, Khulna',
                'blood_group': 'B+',
                'gender': 'Female',
                'age': 41,
                'license_number': 'BMDC-12354',
                'qualification': 'MBBS, FCPS (Ophthalmology)',
                'education': 'Khulna Medical College, BSMMU',
                'specialization': 'Ophthalmology',
                'practice_location': 'Khulna Medical College Hospital',
                'experience_years': 13,
                'bio': 'Eye specialist with expertise in cataract surgery and vision correction.',
                'consultation_fee': 1000.00,
                'clinic_address': 'Khulna Medical College Hospital, Khulna',
                'city': 'Khulna',
                'languages': 'Bangla, English',
                'availability_status': 'available',
                'is_verified': True,
                'status': 'APPROVED'
            },
        ]
        
        # Create doctors
        doctors = []
        for data in doctors_data:
            # Extract doctor-specific fields
            doctor_fields = {
                'license_number': data.pop('license_number'),
                'qualification': data.pop('qualification'),
                'education': data.pop('education'),
                'specialization': data.pop('specialization'),
                'practice_location': data.pop('practice_location'),
                'experience_years': data.pop('experience_years'),
                'bio': data.pop('bio'),
                'consultation_fee': data.pop('consultation_fee'),
                'clinic_address': data.pop('clinic_address'),
                'city': data.pop('city'),
                'languages': data.pop('languages'),
                'availability_status': data.pop('availability_status'),
                'is_verified': data.pop('is_verified'),
                'status': data.pop('status'),
            }
            
            # Create user
            user = User.objects.create_user(
                password='zxcvbnm123',
                role='DOCTOR',
                **data
            )
            
            # Create doctor profile
            doctor_profile = DoctorInformation.objects.create(
                user=user,
                phone=user.phone,
                email=user.email,
                **doctor_fields
            )
            
            doctors.append(doctor_profile)
            self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {user.name}'))
        
        self.stdout.write(self.style.SUCCESS(f'\n✓ Created {len(doctors)} doctors'))
        self.stdout.write(self.style.WARNING('\nCreating patients...'))
        
        # Bangladeshi Patients Data
        patients_data = [
            {
                'name': 'Kamal Hossain',
                'email': 'kamal.hossain@gmail.com',
                'phone': '01712345678',
                'location': 'Mirpur, Dhaka',
                'blood_group': 'A+',
                'gender': 'Male',
                'age': 32
            },
            {
                'name': 'Nusrat Jahan',
                'email': 'nusrat.jahan@gmail.com',
                'phone': '01812345679',
                'location': 'Uttara, Dhaka',
                'blood_group': 'B+',
                'gender': 'Female',
                'age': 28
            },
            {
                'name': 'Rahim Uddin',
                'email': 'rahim.uddin@gmail.com',
                'phone': '01912345680',
                'location': 'Panchlaish, Chattogram',
                'blood_group': 'O+',
                'gender': 'Male',
                'age': 45
            },
            {
                'name': 'Ayesha Siddika',
                'email': 'ayesha.siddika@gmail.com',
                'phone': '01512345681',
                'location': 'Banani, Dhaka',
                'blood_group': 'AB+',
                'gender': 'Female',
                'age': 35
            },
            {
                'name': 'Jamal Ahmed',
                'email': 'jamal.ahmed@gmail.com',
                'phone': '01612345682',
                'location': 'Khilgaon, Dhaka',
                'blood_group': 'A-',
                'gender': 'Male',
                'age': 50
            },
            {
                'name': 'Salma Begum',
                'email': 'salma.begum@gmail.com',
                'phone': '01712345683',
                'location': 'Mohammadpur, Dhaka',
                'blood_group': 'B-',
                'gender': 'Female',
                'age': 42
            },
            {
                'name': 'Farhan Khan',
                'email': 'farhan.khan@gmail.com',
                'phone': '01812345684',
                'location': 'Khulshi, Chattogram',
                'blood_group': 'O-',
                'gender': 'Male',
                'age': 29
            },
            {
                'name': 'Ruksana Akter',
                'email': 'ruksana.akter@gmail.com',
                'phone': '01912345685',
                'location': 'Dhanmondi, Dhaka',
                'blood_group': 'AB-',
                'gender': 'Female',
                'age': 38
            },
            {
                'name': 'Shakib Hasan',
                'email': 'shakib.hasan@gmail.com',
                'phone': '01512345686',
                'location': 'Jatrabari, Dhaka',
                'blood_group': 'A+',
                'gender': 'Male',
                'age': 26
            },
            {
                'name': 'Fahima Rahman',
                'email': 'fahima.rahman@gmail.com',
                'phone': '01612345687',
                'location': 'Agrabad, Chattogram',
                'blood_group': 'B+',
                'gender': 'Female',
                'age': 31
            },
            {
                'name': 'Tanvir Islam',
                'email': 'tanvir.islam@gmail.com',
                'phone': '01712345688',
                'location': 'Gulshan, Dhaka',
                'blood_group': 'O+',
                'gender': 'Male',
                'age': 40
            },
            {
                'name': 'Sabina Yasmin',
                'email': 'sabina.yasmin@gmail.com',
                'phone': '01812345689',
                'location': 'Badda, Dhaka',
                'blood_group': 'AB+',
                'gender': 'Female',
                'age': 33
            },
            {
                'name': 'Mehedi Hasan',
                'email': 'mehedi.hasan@gmail.com',
                'phone': '01912345690',
                'location': 'Cantonment, Dhaka',
                'blood_group': 'A-',
                'gender': 'Male',
                'age': 27
            },
            {
                'name': 'Farzana Ahmed',
                'email': 'farzana.ahmed@gmail.com',
                'phone': '01512345691',
                'location': 'Lalmatia, Dhaka',
                'blood_group': 'B-',
                'gender': 'Female',
                'age': 36
            },
            {
                'name': 'Imran Hossain',
                'email': 'imran.hossain@gmail.com',
                'phone': '01612345692',
                'location': 'Maghbazar, Dhaka',
                'blood_group': 'O-',
                'gender': 'Male',
                'age': 44
            },
            {
                'name': 'Sharmin Akter',
                'email': 'sharmin.akter@gmail.com',
                'phone': '01712345693',
                'location': 'Tejgaon, Dhaka',
                'blood_group': 'AB-',
                'gender': 'Female',
                'age': 30
            },
            {
                'name': 'Rafiq Ullah',
                'email': 'rafiq.ullah@gmail.com',
                'phone': '01812345694',
                'location': 'Shyamoli, Dhaka',
                'blood_group': 'A+',
                'gender': 'Male',
                'age': 48
            },
            {
                'name': 'Nasima Begum',
                'email': 'nasima.begum@gmail.com',
                'phone': '01912345695',
                'location': 'Motijheel, Dhaka',
                'blood_group': 'B+',
                'gender': 'Female',
                'age': 39
            },
            {
                'name': 'Sohel Rana',
                'email': 'sohel.rana@gmail.com',
                'phone': '01512345696',
                'location': 'Narayanganj, Dhaka',
                'blood_group': 'O+',
                'gender': 'Male',
                'age': 34
            },
            {
                'name': 'Shirin Sultana',
                'email': 'shirin.sultana@gmail.com',
                'phone': '01612345697',
                'location': 'Gazipur, Dhaka',
                'blood_group': 'AB+',
                'gender': 'Female',
                'age': 37
            },
        ]
        
        # Create patients
        patients = []
        for data in patients_data:
            user = User.objects.create_user(
                password='zxcvbnm123',
                role='PATIENT',
                **data
            )
            patients.append(user)
            self.stdout.write(self.style.SUCCESS(f'  ✓ Created: {user.name}'))
        
        self.stdout.write(self.style.SUCCESS(f'\n✓ Created {len(patients)} patients'))
        self.stdout.write(self.style.WARNING('\nCreating ratings...'))
        
        # Create ratings (3-5 ratings per doctor)
        ratings_data = [
            # For Dr. Abdur Rahman Khan
            {'doctor': doctors[0], 'patient': patients[0], 'rating': 5, 'review': 'অসাধারণ চিকিৎসক। খুবই যত্নশীল এবং অভিজ্ঞ। হৃদরোগ নিয়ে তার পরামর্শ অত্যন্ত কার্যকর।'},
            {'doctor': doctors[0], 'patient': patients[1], 'rating': 5, 'review': 'Excellent doctor! Very professional and caring. Highly recommended for heart problems.'},
            {'doctor': doctors[0], 'patient': patients[2], 'rating': 4, 'review': 'ভালো অভিজ্ঞতা। ডাক্তার সাহেব রোগী দেখতে সময় নেন কিন্তু চিকিৎসা চমৎকার।'},
            {'doctor': doctors[0], 'patient': patients[3], 'rating': 5, 'review': 'Best cardiologist in Dhaka. Saved my father\'s life.'},
            
            # For Dr. Fatima Begum
            {'doctor': doctors[1], 'patient': patients[4], 'rating': 5, 'review': 'শিশুদের জন্য সেরা চিকিৎসক। আমার বাচ্চার চিকিৎসায় অনেক সাহায্য করেছেন।'},
            {'doctor': doctors[1], 'patient': patients[5], 'rating': 4, 'review': 'Good pediatrician. Very patient with children.'},
            {'doctor': doctors[1], 'patient': patients[6], 'rating': 5, 'review': 'Highly skilled and compassionate. Great experience.'},
            
            # For Dr. Mohammad Karim
            {'doctor': doctors[2], 'patient': patients[7], 'rating': 5, 'review': 'হাড়ের সমস্যার জন্য সিলেটের সেরা চিকিৎসক। অপারেশন খুব সফল হয়েছে।'},
            {'doctor': doctors[2], 'patient': patients[8], 'rating': 4, 'review': 'Experienced orthopedic surgeon. Good results.'},
            {'doctor': doctors[2], 'patient': patients[9], 'rating': 5, 'review': 'আমার হাঁটু ব্যথার জন্য চমৎকার চিকিৎসা দিয়েছেন।'},
            {'doctor': doctors[2], 'patient': patients[10], 'rating': 4, 'review': 'Professional service and good treatment.'},
            
            # For Dr. Nasrin Akter
            {'doctor': doctors[3], 'patient': patients[11], 'rating': 5, 'review': 'ত্বকের সমস্যার জন্য খুব ভালো চিকিৎসক। চিকিৎসা কার্যকর এবং দ্রুত ফলাফল পেয়েছি।'},
            {'doctor': doctors[3], 'patient': patients[12], 'rating': 5, 'review': 'Excellent dermatologist! My skin problem is completely cured.'},
            {'doctor': doctors[3], 'patient': patients[13], 'rating': 4, 'review': 'Good experience. Effective treatment for acne.'},
            
            # For Dr. Rafiqul Islam
            {'doctor': doctors[4], 'patient': patients[14], 'rating': 5, 'review': 'অত্যন্ত দক্ষ সার্জন। আমার অপারেশন খুব সফল হয়েছে।'},
            {'doctor': doctors[4], 'patient': patients[15], 'rating': 4, 'review': 'Good surgeon but appointment takes time.'},
            {'doctor': doctors[4], 'patient': patients[16], 'rating': 5, 'review': 'Highly experienced. Great surgical skills.'},
            
            # For Dr. Sultana Ahmed
            {'doctor': doctors[5], 'patient': patients[1], 'rating': 5, 'review': 'নারীদের স্বাস্থ্যসেবার জন্য সেরা চিকিৎসক। খুবই যত্নশীল এবং অভিজ্ঞ।'},
            {'doctor': doctors[5], 'patient': patients[11], 'rating': 5, 'review': 'Excellent gynecologist. Very caring and professional.'},
            {'doctor': doctors[5], 'patient': patients[13], 'rating': 4, 'review': 'Good doctor. Helpful during pregnancy.'},
            
            # For Dr. Habibur Rahman
            {'doctor': doctors[6], 'patient': patients[17], 'rating': 5, 'review': 'স্নায়ুরোগের জন্য রাজশাহীর সেরা চিকিৎসক। চমৎকার চিকিৎসা পেয়েছি।'},
            {'doctor': doctors[6], 'patient': patients[18], 'rating': 4, 'review': 'Experienced neurologist. Good treatment for my migraine.'},
            {'doctor': doctors[6], 'patient': patients[19], 'rating': 5, 'review': 'Highly knowledgeable and caring doctor.'},
            
            # For Dr. Shahnaz Parvin
            {'doctor': doctors[7], 'patient': patients[0], 'rating': 5, 'review': 'মানসিক স্বাস্থ্যের জন্য চমৎকার চিকিৎসক। আমার বিষণ্নতার চিকিৎসায় অনেক সাহায্য করেছেন।'},
            {'doctor': doctors[7], 'patient': patients[8], 'rating': 5, 'review': 'Great psychiatrist. Very understanding and helpful.'},
            {'doctor': doctors[7], 'patient': patients[12], 'rating': 4, 'review': 'Good experience with counseling sessions.'},
            
            # For Dr. Mizanur Rahman
            {'doctor': doctors[8], 'patient': patients[2], 'rating': 5, 'review': 'ডায়াবেটিসের জন্য অসাধারণ চিকিৎসক। তার পরামর্শে আমার সুগার নিয়ন্ত্রণে এসেছে।'},
            {'doctor': doctors[8], 'patient': patients[10], 'rating': 4, 'review': 'Good internal medicine specialist. Effective treatment.'},
            {'doctor': doctors[8], 'patient': patients[14], 'rating': 5, 'review': 'Excellent doctor for diabetes management.'},
            
            # For Dr. Taslima Khatun
            {'doctor': doctors[9], 'patient': patients[5], 'rating': 5, 'review': 'চোখের সমস্যার জন্য খুলনার সেরা চিকিৎসক। আমার ছানি অপারেশন সফল হয়েছে।'},
            {'doctor': doctors[9], 'patient': patients[15], 'rating': 4, 'review': 'Good eye specialist. Professional service.'},
            {'doctor': doctors[9], 'patient': patients[19], 'rating': 5, 'review': 'Excellent ophthalmologist. My vision is much better now.'},
        ]
        
        # Create ratings and update doctor stats
        for rating_data in ratings_data:
            doctor = rating_data['doctor']
            patient = rating_data['patient']
            
            rating = Rating.objects.create(
                doctor=doctor,
                user=patient,
                rating=rating_data['rating'],
                review_text=rating_data['review']
            )
            
            # Update doctor rating stats
            doctor.rating_count += 1
            total_rating = (doctor.rating_avg * (doctor.rating_count - 1)) + rating_data['rating']
            doctor.rating_avg = total_rating / doctor.rating_count
            doctor.save()
        
        self.stdout.write(self.style.SUCCESS(f'✓ Created {len(ratings_data)} ratings'))
        
        # Summary
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        self.stdout.write(self.style.SUCCESS('DATABASE SEEDING COMPLETE!'))
        self.stdout.write(self.style.SUCCESS('='*60))
        self.stdout.write(self.style.SUCCESS(f'\n✓ Doctors created: {len(doctors)}'))
        self.stdout.write(self.style.SUCCESS(f'✓ Patients created: {len(patients)}'))
        self.stdout.write(self.style.SUCCESS(f'✓ Ratings created: {len(ratings_data)}'))
        self.stdout.write(self.style.SUCCESS(f'\n✓ All users password: zxcvbnm123'))
        self.stdout.write(self.style.SUCCESS('\n' + '='*60))
        
        # Show some sample users
        self.stdout.write(self.style.WARNING('\nSample Doctor Login:'))
        self.stdout.write(self.style.SUCCESS(f'  Email: {doctors[0].user.email}'))
        self.stdout.write(self.style.SUCCESS(f'  Password: zxcvbnm123'))
        
        self.stdout.write(self.style.WARNING('\nSample Patient Login:'))
        self.stdout.write(self.style.SUCCESS(f'  Email: {patients[0].email}'))
        self.stdout.write(self.style.SUCCESS(f'  Password: zxcvbnm123'))
        self.stdout.write(self.style.SUCCESS('\n' + '='*60 + '\n'))
