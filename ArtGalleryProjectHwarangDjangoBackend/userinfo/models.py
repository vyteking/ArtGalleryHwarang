from django.db import models
import uuid
# import mongoengine

# Create your models here.
# mongoengine.connect('hwarangtestserver')

# Basic user info such as user index, ID, password, etc.
class UserInfo(models.Model):
    class UserStatus(models.IntegerChoices):
        SUSPENDED_USER = -1
        NORMAL_USER = 1
        ADMIN = 7
        DEVELOPER = 8
        PROJECT_MANAGER = 9
        FOUNDER = 10

    class UserLevel(models.IntegerChoices):
        UNRANKED_USER = 1
        BRONZE_USER = 2
        SILVER_USER = 3
        GOLD_USER = 4
        PLATINUM_USER = 5

    user_index_1st = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    user_id = models.CharField(max_length=127, unique=True)
    user_password = models.CharField(max_length=255)
    user_password_2nd = models.CharField(max_length=255, null=True)
    user_index_2nd = models.UUIDField(default=uuid.uuid4, editable=True)
    user_index_3rd = models.UUIDField(default=uuid.uuid4, editable=True)
    user_status = models.SmallIntegerField(choices=UserStatus.choices, default=UserStatus.NORMAL_USER)
    user_level = models.SmallIntegerField(choices=UserLevel.choices, default=UserLevel.UNRANKED_USER)
    user_join_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user_id

# Additional user info such as E-Mail, phone number, personal name, description, and so on
class UserAdditionalInfo(models.Model):
    user_info_index_1st = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    user_email = models.EmailField(null=True)
    user_phone_number = models.CharField(max_length=15, null=True)  # Use CharField for phone numbers
    username = models.CharField(max_length=255, null=True)
    user_alt_name = models.CharField(max_length=255, null=True)
    user_description = models.TextField()

    def __str__(self):
        return self.username or "No Name"

# Media submission of the user such as profile pic, header, etc.
class UserMediaSubmission(models.Model):
    user_info_index_1st = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    user_profile_pic = models.ImageField(upload_to='profile_pics/')
    user_header_image = models.ImageField(upload_to='header_images/')

    def __str__(self):
        return f"{self.user_info_index_1st}"

# User setup for the UI settings such as locale, theme, etc.
class UserUISetup(models.Model):
    user_info_index_1st = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    setup_locale = models.CharField(max_length=16, default='en-GB')
    enable_vertical_mode = models.BooleanField(default=False) #Vertical writing mode for vertical-writing-supporting languages like Chinese, Korean, Japanese, Mongolian, etc.
    setup_theme = models.CharField(max_length=255, null=True)

    def __str__(self):
        return f"{self.user_info_index_1st}"