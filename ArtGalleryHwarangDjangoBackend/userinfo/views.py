from .models import UserInfo, UserFollowing, UserCloseFriend, UserAdditionalInfo
from .serializers import (
    UserInfoSerializer, PublicUserInfoSerializer, UserProfileSerializer, UserSummarySerializer,
    UserAdditionalInfoSerializer,
)
from .authentication import auth_cookie_name, parse_account_header
from django.conf import settings
from django.db import IntegrityError
from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class IsUserSelf(permissions.BasePermission):
    """Allow access only to the user themselves."""
    def has_object_permission(self, request, view, obj):
        return obj == request.user

class SignupView(generics.CreateAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer
    permission_classes = [permissions.AllowAny]

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(generics.GenericAPIView):
    serializer_class = UserInfoSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        user_password = request.data.get('user_password')
        try:
            user = UserInfo.objects.get(user_id=user_id)
            if check_password(user_password, user.user_password):
                token, created = Token.objects.get_or_create(user=user)
                serializer = UserInfoSerializer(user)
                response = Response(serializer.data, status=status.HTTP_200_OK)
                # The token never reaches JavaScript, so a script injected into the page cannot steal it.
                response.set_cookie(
                    auth_cookie_name(user.pk),
                    token.key,
                    max_age=settings.AUTH_COOKIE_AGE,
                    httponly=True,
                    secure=settings.AUTH_COOKIE_SECURE,
                    samesite=settings.AUTH_COOKIE_SAMESITE,
                )
                return response
        except UserInfo.DoesNotExist:
            pass
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    # Runs without authentication so that a stale cookie can still be cleared.
    # Only the holder of the account's cookie can revoke its token.
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        account = parse_account_header(request)
        if account is None:
            return Response({"error": "Invalid account"}, status=status.HTTP_400_BAD_REQUEST)

        cookie_name = auth_cookie_name(account)
        key = request.COOKIES.get(cookie_name)
        if key:
            Token.objects.filter(key=key, user_id=account).delete()

        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(cookie_name, samesite=settings.AUTH_COOKIE_SAMESITE)
        return response

class UserPageView(generics.RetrieveAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = PublicUserInfoSerializer
    lookup_field = 'user_index_1st'

# Full public profile for the user info page (additional info, media, follow counts).
class UserDetailView(generics.RetrieveAPIView):
    queryset = UserInfo.objects.select_related('useradditionalinfo', 'usermediasubmission')
    serializer_class = UserProfileSerializer
    lookup_field = 'user_index_1st'

class UserUpdateView(generics.UpdateAPIView):
    queryset = UserInfo.objects.all()
    serializer_class = UserInfoSerializer
    permission_classes = [IsAuthenticated, IsUserSelf]
    lookup_field = 'user_index_1st'

class UserDeletionView(generics.DestroyAPIView):
    queryset = UserInfo.objects.all()
    permission_classes = [IsAuthenticated, IsUserSelf]
    lookup_field = 'user_index_1st'

# Lets a user edit their own display name, alternate name, and description.
class UserAdditionalInfoUpdateView(generics.UpdateAPIView):
    serializer_class = UserAdditionalInfoSerializer
    permission_classes = [IsAuthenticated, IsUserSelf]

    def get_object(self):
        user = get_object_or_404(UserInfo, pk=self.kwargs['user_index_1st'])
        self.check_object_permissions(self.request, user)
        obj, _ = UserAdditionalInfo.objects.get_or_create(user_info_index_1st=user)
        return obj

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

        # Users this user follows: relations where this user is the follower (followed_by).
        following_relations = UserFollowing.objects.filter(followed_by=user).select_related(
            'following__useradditionalinfo', 'following__usermediasubmission')
        following_users = [relation.following for relation in following_relations]
        serializer = UserSummarySerializer(following_users, many=True, context={'request': request})
        return Response(serializer.data)

class FollowersListView(APIView):
    def get(self, request, *args, **kwargs):
        user_pk = kwargs.get('user_index_1st')
        try:
            user = UserInfo.objects.get(pk=user_pk)
        except UserInfo.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Users following this user: relations where this user is the followed one (following).
        follower_relations = UserFollowing.objects.filter(following=user).select_related(
            'followed_by__useradditionalinfo', 'followed_by__usermediasubmission')
        follower_users = [relation.followed_by for relation in follower_relations]
        serializer = UserSummarySerializer(follower_users, many=True, context={'request': request})
        return Response(serializer.data)