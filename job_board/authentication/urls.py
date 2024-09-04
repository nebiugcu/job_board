from django.urls import path
from .views import RegisterEmployerView, RegisterJobSeekerView, EmployerDetailView, JobSeekerDetailView, CustomTokenObtainPairView

urlpatterns = [
    path('api/register/employer/', RegisterEmployerView.as_view(), name='register_employer'),
    path('api/register/employer/<int:pk>/', EmployerDetailView.as_view(), name='employer-detail'),
    path('api/register/jobseeker/', RegisterJobSeekerView.as_view(), name='register_jobseeker'),
    path('api/register/jobseeker/<int:pk>/', JobSeekerDetailView.as_view(), name='jobseeker-detail'),
    path("api/token", CustomTokenObtainPairView.as_view(), name="get_token"),
]
