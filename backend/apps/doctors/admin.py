from django.contrib import admin
from .models import Rating, DoctorSchedule


@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    """
    Admin interface for Rating model
    """
    list_display = ['id', 'doctor', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['doctor__user__name', 'user__username', 'review_text']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Rating Information', {
            'fields': ('doctor', 'user', 'rating', 'review_text')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(DoctorSchedule)
class DoctorScheduleAdmin(admin.ModelAdmin):
    """
    Admin interface for DoctorSchedule model
    """
    list_display = ['id', 'doctor', 'day_of_week_display', 'start_time', 'end_time', 'is_active', 'created_at']
    list_filter = ['day_of_week', 'is_active', 'created_at']
    search_fields = ['doctor__user__name', 'doctor__user__email']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['doctor', 'day_of_week', 'start_time']
    
    def day_of_week_display(self, obj):
        return obj.get_day_of_week_display()
    day_of_week_display.short_description = 'Day of Week'
    
    fieldsets = (
        ('Schedule Information', {
            'fields': ('doctor', 'day_of_week', 'start_time', 'end_time', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
