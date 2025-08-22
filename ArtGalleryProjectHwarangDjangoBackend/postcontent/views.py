from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from utils import get_collection
from django.shortcuts import render
from .models import *
from .serializers import *

# Create your views here.
class PostContentsView(APIView):
    def get(self, request):
        post_collection = get_collection('postcontent')