from django.urls import path, include
from .views import JobListCreateAPIView, JobDetailAPIView


urlpatterns = [
path('api/jobs/', JobListCreateAPIView.as_view(), name='job-list-create'),
    path('api/jobs/<int:pk>/', JobDetailAPIView.as_view(), name='job-detail'),
]
