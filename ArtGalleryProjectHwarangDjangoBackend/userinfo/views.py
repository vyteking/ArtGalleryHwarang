from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import *
from .serializers import *
import utils
from django.contrib.auth.hashers import check_password

class SignupView(generics.CreateAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer

class LoginView(generics.GenericAPIView):
    serializer_class = UserInfoSerializer

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        password = request.data.get('user_password')
        try:
            user = UserInfo.objects.get(user_id=user_id)
            if check_password(password, user.user_password):
                serializer = UserInfoSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except UserInfo.DoesNotExist:
            pass
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class UserPageView(generics.RetrieveAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = PublicUserInfoSerializer
    lookup_field = 'user_index_1st'

class UserDetailView(generics.RetrieveAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = PublicUserInfoSerializer
    lookup_field = 'user_index_1st'

class UserUpdateView(generics.RetrieveAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = PublicUserInfoSerializer
    lookup_field = 'user_index_1st'

class UserDeletionView(generics.RetrieveAPIView):
    def delete(self, request, pk):
        user_index_1st = request.data.get('user_index_1st')
        try:
            user = UserInfo.objects.get(user_index_1st=user_index_1st)
            result = utils.get_collection("userinfo").delete_one("user_index_1st", user.user_index_1st)
            if result.deleted_count == 0:
                return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserInfo.DoesNotExist:
            pass
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
