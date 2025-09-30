from .models import *
from .serializers import *
import utils
from django.db import IntegrityError
from django.contrib.auth.hashers import check_password
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

class SignupView(generics.CreateAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(generics.GenericAPIView):
    serializer_class = UserInfoSerializer

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        user_password = request.data.get('user_password')
        try:
            user = UserInfo.objects.get(user_id=user_id)
            if check_password(user_password, user.user_password):
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
        followed_by_user = request.user
        
        if str(user_to_follow_pk) == str(followed_by_user.pk):
            return Response({"error": "Cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_follow = UserInfo.objects.get(pk=user_to_follow_pk)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # get_or_create를 사용하여 중복 팔로우 방지 및 로직 간소화
        try:
            relation, created = UserFollowing.objects.get_or_create(
                following=user_to_follow,
                followed_by=followed_by_user
            )
        except IntegrityError:
             return Response({"message": "Already following."}, status=status.HTTP_200_OK)


        if created:
            return Response({"message": "Successfully followed user."}, status=status.HTTP_201_CREATED) # 생성 시 201
        else:
            return Response({"message": "Already following."}, status=status.HTTP_200_OK) # 이미 존재 시 200

class UnfollowUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs): # POST 대신 DELETE 사용
        user_to_unfollow_pk = kwargs.get('user_index_1st')
        followed_by_user = request.user

        try:
            user_to_unfollow = UserInfo.objects.get(pk=user_to_unfollow_pk)
        except UserInfo.DoesNotExist:
            # 언팔로우 대상이 없어도 204를 반환하는 것이 idempotent하게 처리하는 데 유리
            return Response(status=status.HTTP_204_NO_CONTENT)

        # delete()는 삭제된 행의 개수를 반환합니다.
        deleted_count, _ = UserFollowing.objects.filter(
            following=user_to_unfollow,
            followed_by=followed_by_user
        ).delete()
        
        if deleted_count > 0:
             return Response({"message": "Successfully unfollowed user."}, status=status.HTTP_200_OK)
        else:
             # 언팔로우할 관계가 없었어도 성공으로 간주하는 것이 일반적
             return Response({"message": "Not currently following."}, status=status.HTTP_200_OK)

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