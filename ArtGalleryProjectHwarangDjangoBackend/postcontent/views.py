from rest_framework import generics, status
from rest_framework.response import Response
from .models import Postcontent, Blogcontent, Image2D, Object3D
from .serializers import PostcontentSerializer, BlogcontentSerializer, Image2DSerializer, Object3DSerializer

class PostContentView(generics.ListAPIView):
    serializer_class = PostcontentSerializer

    def get_queryset(self):
        postindex = self.kwargs['postindex']
        return Postcontent.objects.filter(postindex=postindex)

class SubmitPostContentView(generics.CreateAPIView):
    serializer_class = PostcontentSerializer

class DeletePostContentView(generics.DestroyAPIView):
    queryset = Postcontent.objects.all()
    lookup_field = 'postcontentindex'

class SubmitBlogcontentView(generics.CreateAPIView):
    serializer_class = BlogcontentSerializer

class SubmitImage2DView(generics.CreateAPIView):
    serializer_class = Image2DSerializer

class SubmitObject3DView(generics.CreateAPIView):
    serializer_class = Object3DSerializer