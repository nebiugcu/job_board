from django.db import models
from authentication.models import Employer
from authentication.models import User
from authentication.models import User

class Job(models.Model):
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=255)
    job_type = models.CharField(max_length=50, choices=[('full time', 'Full Time'), ('part time', 'Part Time'), ('freelance', 'Freelance')])
    applicants_needed = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')]) # make it accept both
    job_description = models.TextField()
    job_category = models.CharField(max_length=100)
    job_site = models.CharField(max_length=255)
    application_deadline = models.DateField()
    experience_level = models.CharField(max_length=50, choices=[('expert', 'Expert'), ('senior', 'Senior'), ('intermediate', 'Intermediate'), ('junior', 'Junior'), ('entry', 'Entry')])
    created_at = models.DateTimeField(auto_now_add=True)
    salary = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.job_title


