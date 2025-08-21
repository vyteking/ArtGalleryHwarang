from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from utils import get_collection
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *

class PostListView(APIView):
    def get(self, request):
        post_collection = get_collection('post_post')
        posts = []
        for post in post_collection.find():
            posts.append({
                'postindex': str(post.get('postindex')),
                'posttitle': post.get('posttitle'),
                'postauthor': str(post.get('postauthor_id')), # Assuming you store author's id
                'postdescription': post.get('postdescription'),
                'posttag': post.get('posttag'),
            })
        return Response(posts)

class SubmitPostView(generics.GenericAPIView):
    serializer_class = PostSerializer

    def post(self, request, *args1, **args2):
        posttitle = request.data.get("posttitle")
        postauthor = request.data.get("postauthor")
        postdescription = request.data.get("postdescription")
        postdescription = request.data.get("posttags")
        try:
            postsubmission = Post.objects.get()
        except Post.DoesNotExist:
            pass
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
class UpdatePostView(generics.GenericAPIView, id):
    post_to_update = get_object_or_404(Post, id=id)
    
class DeletePostView(generics.GenericAPIView, id):
    post_to_delete = get_object_or_404(Post, id=id)