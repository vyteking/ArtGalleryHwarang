from rest_framework import generics, permissions
from .models import Postcontent, Blogcontent, Image2D, Object3D
from .serializers import PostcontentSerializer, BlogcontentSerializer, Image2DSerializer, Object3DSerializer


class IsPostContentOwner(permissions.BasePermission):
    """Allow write access only to the author of the parent post."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.postindex.postauthor == request.user


class PostContentView(generics.ListAPIView):
    serializer_class = PostcontentSerializer

    def get_queryset(self):
        postcontentindex = self.kwargs['postcontentindex']
        return Postcontent.objects.filter(postcontentindex=postcontentindex)


class SubmitPostContentView(generics.CreateAPIView):
    serializer_class = PostcontentSerializer
    permission_classes = [permissions.IsAuthenticated]


class DeletePostContentView(generics.DestroyAPIView):
    queryset = Postcontent.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsPostContentOwner]
    lookup_field = 'postcontentindex'


class SubmitBlogcontentView(generics.CreateAPIView):
    serializer_class = BlogcontentSerializer
    permission_classes = [permissions.IsAuthenticated]


class SubmitImage2DView(generics.CreateAPIView):
    serializer_class = Image2DSerializer
    permission_classes = [permissions.IsAuthenticated]


class SubmitObject3DView(generics.CreateAPIView):
    serializer_class = Object3DSerializer
    permission_classes = [permissions.IsAuthenticated]