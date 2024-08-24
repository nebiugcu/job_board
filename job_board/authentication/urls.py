from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('job_seeker_dashboard/', views.job_seeker_dashboard, name='job_seeker_dashboard'),
    path('employer_dashboard/', views.employer_dashboard, name='employer_dashboard'),
    path('admin_dashboard/', views.admin_dashboard, name='admin_dashboard'),
]
