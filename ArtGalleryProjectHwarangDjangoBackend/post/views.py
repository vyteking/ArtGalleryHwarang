from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .models import Post
from .serializers import PostSerializer


class IsPostOwner(permissions.BasePermission):
    """Allow write access only to the post's author."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.postauthor == request.user


class PostListView(generics.ListAPIView):
    queryset = Post.objects.order_by('-created_at')
    serializer_class = PostSerializer


class PostByUserView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        postauthor = self.kwargs['postauthor']
        return Post.objects.filter(postauthor=postauthor).order_by('-created_at')


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