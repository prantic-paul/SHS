"""
Blog Serializers
"""
from rest_framework import serializers
from .models import BlogPost, Comment


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for comments"""
    
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_role = serializers.CharField(source='author.role', read_only=True)
    
    class Meta:
        model = Comment
        fields = [
            'id', 'blog_post', 'author', 'author_name', 'author_role',
            'content', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for blog posts with comments"""
    
    author_name = serializers.CharField(source='author.name', read_only=True)
    author_specialization = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'content', 'author', 'author_name',
            'author_specialization', 'image', 'slug', 'views_count',
            'is_published', 'comments', 'comments_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'views_count', 'created_at', 'updated_at']
    
    def get_author_specialization(self, obj):
        """Get doctor specialization if author is a doctor"""
        if obj.author.role == 'DOCTOR' and hasattr(obj.author, 'doctor_profile'):
            return obj.author.doctor_profile.specialization
        return None
    
    def get_comments_count(self, obj):
        """Get total comments count"""
        return obj.comments.count()


class BlogPostCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating blog posts"""
    
    class Meta:
        model = BlogPost
        fields = [
            'title', 'content', 'image', 'is_published'
        ]
    
    def validate(self, data):
        """Validate blog post data"""
        if not data.get('title'):
            raise serializers.ValidationError("Title is required")
        if not data.get('content'):
            raise serializers.ValidationError("Content is required")
        if len(data.get('title', '')) < 10:
            raise serializers.ValidationError("Title must be at least 10 characters")
        if len(data.get('content', '')) < 50:
            raise serializers.ValidationError("Content must be at least 50 characters")
        return data


class CommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating comments"""
    
    class Meta:
        model = Comment
        fields = ['blog_post', 'content']
    
    def validate(self, data):
        """Validate comment data"""
        if not data.get('content'):
            raise serializers.ValidationError("Comment content is required")
        if len(data.get('content', '')) < 2:
            raise serializers.ValidationError("Comment must be at least 2 characters")
        return data
