from django.urls import path, include
from .views import JobListCreateAPIView, JobDetailAPIView


urlpatterns = [
    path('', JobListCreateAPIView.as_view(), name='job-list-create'),
    path('<int:pk>/', JobDetailAPIView.as_view(), name='job-detail'),
]
