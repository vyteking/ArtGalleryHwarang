from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from utils import get_collection
from django.shortcuts import get_object_or_404
from .models import Post
from .serializers import PostSerializer

class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostByUserView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        postauthor = self.kwargs['postauthor']
        return Post.objects.filter(postauthor=postauthor)

class SubmitPostView(generics.GenericAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        posttitle = request.data.get("posttitle")
        postdescription = request.data.get("postdescription")
        posttag = request.data.get("posttag")
        postauthor = request.user
        try:
            postsubmission = Post.objects.create(
                posttitle=posttitle,
                postauthor=postauthor,
                postdescription=postdescription,
                posttag=posttag
            )
            return Response({"message": "Post submitted successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UpdatePostView(generics.GenericAPIView):
    serializer_class = PostSerializer

    def put(self, request, postindex, *args, **kwargs):
        post_to_update = get_object_or_404(Post, pk=postindex)
        serializer = self.get_serializer(post_to_update, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeletePostView(generics.GenericAPIView):
    def delete(self, request, postindex, *args, **kwargs):
        post_to_delete = get_object_or_404(Post, pk=postindex)
        post_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)