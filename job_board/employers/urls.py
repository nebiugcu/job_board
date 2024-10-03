# urls.py

from django.urls import path
from .views import candidate_match_view

urlpatterns = [
    path('candidate-match/', candidate_match_view, name='candidate_match'),
]

