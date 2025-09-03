from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from utils import get_collection
from django.shortcuts import get_object_or_404
from .models import Postcontent
from .serializers import PostcontentSerializer

# Create your views here.
class PostContentView(APIView):
    def get(self, request):
        post_collection = get_collection('postcontent')

class SubmitPostContentView(generics.GenericAPIView):
    serializer_class = PostcontentSerializer

    def post(self, request, *args, **kwargs):
        try:
            postsubmission = Postcontent.objects.create(
                # postcontentindex=
            )
            return Response({"message": "Post content submitted successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class DeletePostView(generics.GenericAPIView):
    def delete(self, request, id, *args, **kwargs):
        post_to_delete = get_object_or_404(Postcontent, id=id)
        post_to_delete.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)