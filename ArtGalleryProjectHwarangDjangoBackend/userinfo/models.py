from django.db import models
import uuid

# Create your models here.
class Userinfo(models.Model):
    class Userstatus(models.IntegerChoices):
        SuspendedUser = -1
        NormalUser = 1
        Admin = 7
        Developer = 8
        ProjectManager = 9
        Founder = 10
    class Userlevel(models.IntegerChoices):
        UnrankedUser = 1
        BronzeUser = 2
        SilverUser = 3
        GoldUser = 4
        PlatinumUser = 5
    userindex1st = models.UUIDField(primary_key=True, null=False, auto_created=True, unique=True, default=uuid.uuid4)
    userID = models.CharField(null=False, unique=True, max_length=127)
    userpassword = models.CharField(null=False, max_length=255)
    userpassword2nd = models.CharField(null=True, max_length=255)
    userindex2nd = models.UUIDField(null=False, auto_created=True, unique=True, default=uuid.uuid4)
    userindex3rd = models.UUIDField(null=False, auto_created=True, unique=True, default=uuid.uuid4)
    userstatus = models.SmallIntegerField(mull = False, default=Userstatus.NormalUser)
    userlevel = models.SmallIntegerField(mull = False, default=Userlevel.UnrankedUser)
    userjoindate = models.DateTimeField(null = False, default=models.DateTimeField.auto_now)


class UserAdditionalInfo(models.Model):
    userinfoindex1st = models.ForeignKey(Userinfo.userinfoindex1st, on_delete=models.CASCADE)
    useremail = models.EmailField(null=True)
    userphonenumber = models.IntegerField(null=True)
    username = models.CharField(null = True, max_length=255)
    userdescription = models.TextField()

class UserAdditionalInfoWithMedia(models.Model):
    userinfoindex1st = models.ForeignKey(Userinfo.userinfoindex1st, on_delete=models.CASCADE)
    userprofilepic = models.FileField()
    userheaderimage = models.FileField()
