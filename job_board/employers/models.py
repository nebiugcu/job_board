# employers/models.py

from django.db import models
from authentication.models import User
from django.contrib.auth import get_user_model


class Employer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='emp_employer')
    company_name = models.CharField(max_length=255)
    company_location = models.CharField(max_length=255)
    website = models.URLField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.company_name
# employers/models.py



