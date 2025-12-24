from django.contrib import admin
from .models import Rating


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
