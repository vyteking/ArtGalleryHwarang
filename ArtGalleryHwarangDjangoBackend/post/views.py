from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import Post
from .serializers import PostSerializer, PostGallerySerializer, GALLERY_CONTENT_TYPES


class IsPostOwner(permissions.BasePermission):
    """Allow write access only to the post's author."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.postauthor == request.user


class PostListView(generics.ListAPIView):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer


class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'postindex'


class PostByUserView(generics.ListAPIView):
    serializer_class = PostGallerySerializer

    def get_queryset(self):
        postauthor = self.kwargs['postauthor']
        queryset = Post.objects.filter(postauthor=postauthor)
        # Private posts are only listed for their author.
        if str(self.request.user.pk) != str(postauthor):
            queryset = queryset.filter(isInPublic=True)
        # Optional submission type filter for the gallery tabs, e.g. ?type=image2d
        content_type = self.request.query_params.get('type')
        if content_type in GALLERY_CONTENT_TYPES:
            queryset = queryset.filter(**{f'postcontent__{content_type}__isnull': False}).distinct()
        prefetches = [f'postcontent_set__{content_type}' for content_type in GALLERY_CONTENT_TYPES]
        return queryset.prefetch_related(*prefetches).order_by('-created_at')


class SubmitPostView(generics.CreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(postauthor=self.request.user)


class UpdatePostView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated, IsPostOwner]
    lookup_field = 'postindex'


class DeletePostView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsPostOwner]
    lookup_field = 'postindex'