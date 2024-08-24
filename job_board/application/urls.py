from django.urls import path
from .views import  ApplicationListCreateAPIView, ApplicationDetailAPIView

urlpatterns = [
    path('api/applications/', ApplicationListCreateAPIView.as_view(), name='application-list-create'),
    path('api/applications/<int:pk>/', ApplicationDetailAPIView.as_view(), name='application-detail'),

]