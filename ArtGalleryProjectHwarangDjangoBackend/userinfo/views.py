from django.shortcuts import render
from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from .serializers import LoginSerializer

# Create your views here.

#Login Serializer
class beginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(false_exception=True)
        return Response({"message": "Login succesful"}, status=status.HTTP_200_OK)
    
    