from django.urls import path
from .views import send_job_invitation

urlpatterns = [
    path('send-invitation/', send_job_invitation, name='send_invitation'),
]