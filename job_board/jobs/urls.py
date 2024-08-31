from django.urls import path, include
from .views import JobPostView, JobDetailView


urlpatterns = [
    path('api/jobs/', JobPostView.as_view(), name='job-list-create'),
    path('api/jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),
]
