from django.urls import path
from .views import RegisterEmployerView, RegisterJobSeekerView
from . import views

urlpatterns = [
    path('api/register/employer/', RegisterEmployerView.as_view(), name='register_employer'),
    path('api/register/jobseeker/', RegisterJobSeekerView.as_view(), name='register_jobseeker'),
]
