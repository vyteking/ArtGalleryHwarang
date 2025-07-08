from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, status, viewsets, permissions
from rest_framework.response import Response
from .models import *
from .serializers import *

# Create your views here.

# Basic User Info Viewset
class UserInfoViewset(viewsets.ModelViewSet):
    queryset = UserInfo.objects.all().order_by('-user_join_date')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None):
        userinfo_ = self.queryset.get(pk=pk)
        serializer = self.serializer_class(userinfo_)
        return Response(serializer.data)

    def update(self, request, pk=None):
        userinfo_ = self.queryset.get(pk=pk)
        serializer = self.serializer_class(userinfo_, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def delete(self, request, pk=None):
        userinfo_ = self.queryset.get(pk=pk)
        userinfo_.delete()
        return Response(status=204)