from django.urls import path, include
from .views import JobPostView, JobDetailView, JobListView, EmployerJobListView


urlpatterns = [
    path('api/jobs/', JobPostView.as_view(), name='job-list-create'),
    path('api/jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('jobs/', JobListView.as_view(), name='job-list'),  # Public view to list all jobs
    path('employer/jobs/', EmployerJobListView.as_view(), name='employer-job-list'),  # Private view for authenticated employers
]
