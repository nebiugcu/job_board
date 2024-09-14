from django.urls import path
from .views import  ApplicationView, ApplicationDetailView, HireView, HireDetailView, JobSeekerApplicationListView, EmployerApplicationListView, RejectApplicationView

urlpatterns = [
    path('api/applications/', ApplicationView.as_view(), name='application-list-create'),
    path('applications/reject/<int:pk>/', RejectApplicationView.as_view(), name='reject-application'),
    path('api/applications/<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('applications/', JobSeekerApplicationListView.as_view(), name='jobseeker-applications'),
    path('employer/applications/<int:job_id>/', EmployerApplicationListView.as_view(), name='employer-applications'),
    path('api/hires/', HireView.as_view(), name='hire_list'),
    path('api/hires/<int:pk>/', HireDetailView.as_view(), name='hire_detail'),
]