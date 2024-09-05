from django.contrib import admin
from .models import JobSeeker, Employer, User

# Register your models here.
admin.site.register(JobSeeker)
admin.site.register(Employer)
admin.site.register(User)

