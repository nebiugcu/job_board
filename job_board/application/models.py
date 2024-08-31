from django.db import models
from jobs.models import Job
from authentication.models import JobSeeker, Employer

# Create your models here.
class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    job_seeker = models.ForeignKey(JobSeeker, on_delete=models.CASCADE)
    cover_letter = models.TextField()
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=[('applied', 'Applied'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='applied')
    created_at = models.DateTimeField(auto_now_add=True)

class Hire(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE)
    job_seeker = models.ForeignKey(JobSeeker, on_delete=models.CASCADE)
    hire_date = models.DateTimeField(auto_now_add=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

