from django.db import models
from authentication.models import User


class Job(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    company_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    employment_type = models.CharField(
        max_length=50,
        choices=[
            ('FT', 'Full-Time'),
            ('PT', 'Part-Time'),
            ('CT', 'Contract'),
            ('IN', 'Internship'),
            ('TP', 'Temporary')
        ]
    )
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    date_posted = models.DateTimeField(auto_now_add=True)
    application_deadline = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs', default=3)

    def __str__(self):
        return self.title
