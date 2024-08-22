from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    USER_TYPE_CHOICES = (
        (1, 'Job Seeker'),
        (2, 'Employer'),
        (3, 'Admin'),
    )
    user_type = models.PositiveSmallIntegerField(choices=USER_TYPE_CHOICES)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)