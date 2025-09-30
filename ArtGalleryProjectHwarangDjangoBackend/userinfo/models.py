from django.db import models
import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserInfoManager(BaseUserManager):
    def create_user(self, user_id, password=None, **extra_fields):
        if not user_id:
            raise ValueError('The User ID must be set')
        user = self.model(user_id=user_id, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, user_id, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('user_status', 64) # Founder

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(user_id, password, **extra_fields)

# Basic user info such as user index, ID, password, etc.
class UserInfo(AbstractBaseUser, PermissionsMixin):
    class UserStatus(models.IntegerChoices):
        SUSPENDED_USER = -1
        NORMAL_USER = 1
        ADMIN = 8
        DEVELOPER = 16
        PROJECT_MANAGER = 32
        FOUNDER = 64

    class UserLevel(models.IntegerChoices):
        UNRANKED_USER = 1
        BRONZE_USER = 2
        SILVER_USER = 3
        GOLD_USER = 4
        PLATINUM_USER = 5

    user_index_1st = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user_id = models.CharField(max_length=127, unique=True)
    user_password = models.CharField(max_length=255, editable=True)
    user_password_2nd = models.CharField(max_length=255, null=True)
    user_index_2nd = models.UUIDField(default=uuid.uuid4, editable=True)
    user_index_3rd = models.UUIDField(default=uuid.uuid4, editable=True)
    user_status = models.SmallIntegerField(choices=UserStatus.choices, default=UserStatus.NORMAL_USER)
    user_level = models.SmallIntegerField(choices=UserLevel.choices, default=UserLevel.UNRANKED_USER)
    user_join_date = models.DateTimeField(auto_now_add=True)

    objects = UserInfoManager()

    USERNAME_FIELD = 'user_id'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.user_id

# Additional user info such as E-Mail, phone number, personal name, description, and so on
class UserAdditionalInfo(models.Model):
    user_info_index_1st = models.ForeignKey(UserInfo, on_delete=models.CASCADE, primary_key=True)
    user_email = models.EmailField(null=True)
    user_phone_number = models.CharField(max_length=15, null=True)  # Use CharField for phone numbers
    username = models.CharField(max_length=255, null=True)
    user_alt_name = models.CharField(max_length=255, null=True)
    user_description = models.TextField()

    def __str__(self):
        return self.username or "No Name"

# Media submission of the user such as profile pic, header, etc.
class UserMediaSubmission(models.Model):
    user_info_index_1st = models.ForeignKey(UserInfo, on_delete=models.CASCADE, primary_key=True)
    user_profile_pic = models.ImageField(upload_to='profile_pics/')
    user_header_image = models.ImageField(upload_to='header_images/')

    def __str__(self):
        return f"{self.user_info_index_1st}"

# User setup for the UI settings such as locale, theme, etc.
class UserUISetup(models.Model):
    user_info_index_1st = models.ForeignKey(UserInfo, on_delete=models.CASCADE, primary_key=True)
    setup_locale = models.CharField(max_length=16, default='en-GB')
    enable_vertical_mode = models.BooleanField(default=False) #Vertical writing mode for vertical-writing-supporting languages like Chinese, Korean, Japanese, Mongolian, etc.
    setup_theme = models.CharField(max_length=255, null=True)

    def __str__(self):
        return f"{self.user_info_index_1st}"
    
# User Following Statistics and Info
class UserFollowing(models.Model):
    following = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name='followers')
    followed_by = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name='following')
    follow_date_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('following', 'followed_by'),)

class UserCloseFriend(models.Model):
    friend = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name='followers')
    friend_request_by = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name='following')
    befriend_date_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (('friend', 'friend_request_by'),)