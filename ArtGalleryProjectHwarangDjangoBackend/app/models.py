from django.db import models

# Create your models here.
class Locale(models.Model):
    class Vieworientation(models.IntegerChoices):
        LR_TB = 1
        RL_TB = 2
        TB_RL_AND_LR_TB = 3
        TB_LR_AND_RL_TB = 4
        
    localeIdx = models.PositiveBigIntegerField(verbose_name="localeIdx", primary_key=True, unique=True)
    localecode = models.CharField(max_length=15)
    nativelangname = models.CharField(max_length=63)
    vieworientation = models.IntegerField(choices=Vieworientation.choices)