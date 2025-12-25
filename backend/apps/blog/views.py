"""
Blog Views
API views for blog posts and comments
"""
from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from .models import BlogPost, Comment
from .serializers import (
    BlogPostSerializer, BlogPostCreateSerializer,
    CommentSerializer, CommentCreateSerializer
)


class BlogPostViewSet(viewsets.ModelViewSet):
    """ViewSet for blog post CRUD operations"""
    
    queryset = BlogPost.objects.filter(is_published=True)
    parser_classes = [MultiPartParser, FormParser]
    
    def get_permissions(self):
        """
        Allow anyone to view blog posts
        Only doctors can create/update/delete
        """
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        """Return appropriate serializer"""
        if self.action in ['create', 'update', 'partial_update']:
            return BlogPostCreateSerializer
        return BlogPostSerializer
    
    def get_queryset(self):
        """Get queryset based on user role"""
        if self.action in ['update', 'partial_update', 'destroy']:
            # For edit/delete, only show user's own posts
            if self.request.user.is_authenticated and self.request.user.role == 'DOCTOR':
                return BlogPost.objects.filter(author=self.request.user)
            return BlogPost.objects.none()
        
        # For listing, show all published posts
        return BlogPost.objects.filter(is_published=True).prefetch_related('comments')
    
    def perform_create(self, serializer):
        """Create blog post with author"""
        user = self.request.user
        
        # Ensure user is a doctor
        if user.role != 'DOCTOR':
            raise ValueError("Only doctors can create blog posts")
        
        serializer.save(author=user)
    
    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Increment views count for a blog post"""
        blog_post = self.get_object()
        blog_post.views_count += 1
        blog_post.save()
        return Response({'views_count': blog_post.views_count})
    
    @action(detail=False, methods=['get'])
    def my_posts(self, request):
        """Get current doctor's blog posts"""
        if request.user.role != 'DOCTOR':
            return Response(
                {"error": "Only doctors can access this endpoint"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        posts = BlogPost.objects.filter(author=request.user)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for comment CRUD operations"""
    
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """Return appropriate serializer"""
        if self.action in ['create', 'update', 'partial_update']:
            return CommentCreateSerializer
        return CommentSerializer
    
    def get_queryset(self):
        """Get comments based on action"""
        if self.action in ['update', 'partial_update', 'destroy']:
            # For edit/delete, only show user's own comments
            return Comment.objects.filter(author=self.request.user)
        
        # For listing, filter by blog_post if provided
        blog_post_id = self.request.query_params.get('blog_post')
        if blog_post_id:
            return Comment.objects.filter(blog_post_id=blog_post_id)
        
        return Comment.objects.all()
    
    def create(self, request, *args, **kwargs):
        """Create or update comment - only one comment per user per post"""
        blog_post_id = request.data.get('blog_post')
        
        if not blog_post_id:
            return Response(
                {"error": "blog_post is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already has a comment on this post
        existing_comment = Comment.objects.filter(
            author=request.user,
            blog_post_id=blog_post_id
        ).first()
        
        if existing_comment:
            # Update existing comment
            serializer = CommentCreateSerializer(existing_comment, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            # Return full comment data
            return Response(
                CommentSerializer(existing_comment).data,
                status=status.HTTP_200_OK
            )
        
        # Create new comment
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        """Create comment with author"""
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_comments(self, request):
        """Get current user's comments"""
        comments = Comment.objects.filter(author=request.user)
        serializer = self.get_serializer(comments, many=True)
        return Response(serializer.data)
