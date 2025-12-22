"""
Django Admin Configuration for users app
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.users.models import User, DoctorInformation


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model"""
    
    list_display = [
        'user_id', 'email', 'name', 'phone', 'role',
        'is_active', 'is_staff', 'created_at'
    ]
    list_filter = ['role', 'is_active', 'is_staff', 'gender', 'blood_group']
    search_fields = ['user_id', 'email', 'name', 'phone']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Account Info', {
            'fields': ('user_id', 'email', 'password')
        }),
        ('Personal Info', {
            'fields': ('name', 'phone', 'location', 'blood_group', 'gender', 'age')
        }),
        ('Permissions', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important Dates', {
            'fields': ('last_login', 'created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ['user_id', 'created_at', 'updated_at', 'last_login']
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'phone', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(DoctorInformation)
class DoctorInformationAdmin(admin.ModelAdmin):
    """Admin configuration for Doctor Information model"""
    
    list_display = [
        'user', 'specialization', 'license_number',
        'status', 'is_verified', 'rating_avg', 'created_at'
    ]
    list_filter = ['status', 'is_verified', 'specialization']
    search_fields = ['user__name', 'user__email', 'license_number', 'specialization']
    ordering = ['-created_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Professional Information', {
            'fields': (
                'license_number', 'qualification', 'education',
                'specialization', 'practice_location', 'experience_years', 'bio'
            )
        }),
        ('Verification', {
            'fields': ('status',)
        }),
        ('Status Info (Read Only)', {
            'fields': ('is_verified', 'rating_avg', 'created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'rating_avg', 'is_verified']
    
    actions = ['approve_doctors', 'reject_doctors']
    
    def save_model(self, request, obj, form, change):
        """Override save to handle status changes"""
        if change:  # Only for existing objects
            old_obj = DoctorInformation.objects.get(pk=obj.pk)
            # If status changed to APPROVED, call approve method
            if old_obj.status != 'APPROVED' and obj.status == 'APPROVED':
                obj.approve()
                self.message_user(request, f'Doctor {obj.user.name} approved successfully. User role updated to DOCTOR.', level='SUCCESS')
                return
            # If status changed to REJECTED, call reject method
            elif old_obj.status != 'REJECTED' and obj.status == 'REJECTED':
                obj.reject()
                self.message_user(request, f'Doctor {obj.user.name} application rejected.', level='WARNING')
                return
        super().save_model(request, obj, form, change)
    
    def approve_doctors(self, request, queryset):
        """Bulk approve doctor applications"""
        count = 0
        for doctor in queryset:
            if doctor.status != 'APPROVED':
                doctor.approve()
                count += 1
        self.message_user(request, f'{count} doctor(s) approved successfully. User roles updated.')
    approve_doctors.short_description = "Approve selected doctor applications"
    
    def reject_doctors(self, request, queryset):
        """Bulk reject doctor applications"""
        count = 0
        for doctor in queryset:
            if doctor.status != 'REJECTED':
                doctor.reject()
                count += 1
        self.message_user(request, f'{count} doctor(s) rejected')
    reject_doctors.short_description = "Reject selected doctor applications"
