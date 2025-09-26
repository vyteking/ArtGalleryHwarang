from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import *
from .serializers import *
import utils
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

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
                token, created = Token.objects.get_or_create(user=user)
                serializer = UserInfoSerializer(user)
                response_data = serializer.data
                response_data['token'] = token.key
                return Response(response_data, status=status.HTTP_200_OK)
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

class UserUpdateView(generics.UpdateAPIView):
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

class FollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_to_follow_pk = kwargs.get('user_index_1st')
        try:
            user_to_follow = UserInfo.objects.get(pk=user_to_follow_pk)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        followed_by_user = request.user

        UserFollowing.objects.create(following=user_to_follow, followed_by=followed_by_user)

        return Response({"message": "Successfully followed user."}, status=status.HTTP_200_OK)

class UnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_to_unfollow_pk = kwargs.get('user_index_1st')
        try:
            user_to_unfollow = UserInfo.objects.get(pk=user_to_unfollow_pk)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        followed_by_user = request.user

        UserFollowing.objects.filter(following=user_to_unfollow, followed_by=followed_by_user).delete()

        return Response({"message": "Successfully unfollowed user."}, status=status.HTTP_200_OK)

class FollowingListView(APIView):
    def get(self, request, *args, **kwargs):
        user_pk = kwargs.get('user_index_1st')
        try:
            user = UserInfo.objects.get(pk=user_pk)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        following_relations = user.following.all()
        following_users = [relation.following for relation in following_relations]
        serializer = PublicUserInfoSerializer(following_users, many=True)
        return Response(serializer.data)

class FollowersListView(APIView):
    def get(self, request, *args, **kwargs):
        user_pk = kwargs.get('user_index_1st')
        try:
            user = UserInfo.objects.get(pk=user_pk)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        follower_relations = user.followers.all()
        follower_users = [relation.followed_by for relation in follower_relations]
        serializer = PublicUserInfoSerializer(follower_users, many=True)
        return Response(serializer.data)