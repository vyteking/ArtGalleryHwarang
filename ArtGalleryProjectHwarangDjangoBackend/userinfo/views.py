from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import *
from .serializers import *
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
                # Note: Token-based authentication with custom user models requires
                # a bit more setup. For now, we'll return a success message.
                # In a real application, you would generate and return a JWT or similar token.
                return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        except UserInfo.DoesNotExist:
            pass
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)