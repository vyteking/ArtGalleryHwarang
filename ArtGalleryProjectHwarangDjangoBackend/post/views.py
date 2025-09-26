from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from utils import get_collection
from django.shortcuts import get_object_or_404
from .models import Post
from .serializers import PostSerializer

class PostListView(APIView):
    def get(self, request):
        post_collection = get_collection('post')
        posts = []
        for post in post_collection.find():
            posts.append({
                'postindex': str(post.get('postindex')),
                'posttitle': post.get('posttitle'),
                'postauthor': str(post.get('postauthor_id')),  # Assuming you store author's id
                'postdescription': post.get('postdescription'),
                'posttag': post.get('posttag'),
            })
        return Response(posts)

class PostByUserView(generics.GenericAPIView):
    def get(self, request, postauthor):
        post_collection = get_collection('post')
        posts = []
        for post in post_collection.find({'postauthor':postauthor}):
            posts.append({
                'postindex': str(post.get('postindex')),
                'posttitle': post.get('posttitle'),
                'postauthor': str(post.get('postauthor_id')),  # Assuming you store author's id
                'postdescription': post.get('postdescription'),
                'posttag': post.get('posttag'),
            })
        return Response(posts)

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

    def put(self, request, id, *args, **kwargs):
        post_to_update = get_object_or_404(Post, id=id)
        serializer = self.get_serializer(post_to_update, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeletePostView(generics.GenericAPIView):
    def delete(self, request, id, *args, **kwargs):
        post_to_delete = get_object_or_404(Post, id=id)
        post_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)