from django.urls import path, include
from .views import JobPostView, JobDetailView, JobListView, EmployerJobListView, api_predict_job_match, predict_job_match


urlpatterns = [
    path('api/jobs/', JobPostView.as_view(), name='job-list-create'),
    path('api/jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('jobs/', JobListView.as_view(), name='job-list'),  # Public view to list all jobs
    path('employer/jobs/', EmployerJobListView.as_view(), name='employer-job-list'),  # Private view for authenticated employers
    path('predict/', predict_job_match, name='predict_job_match'),
    path('api/predict/', api_predict_job_match, name='api_predict_job_match'),
]
