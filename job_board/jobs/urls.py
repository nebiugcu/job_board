from django.urls import path

from .views import (
    job_recommendation_view

)

urlpatterns = [
     # path('api/jobs/', JobPostView.as_view(), name='job-list-create'),  # API for job creation
     # path('api/jobs/<int:pk>/', JobDetailView.as_view(), name='job-detail'),  # Job details
    # path('jobs/', JobListView.as_view(), name='job-list'),  # Public view to list all jobs
    # path('employer/jobs/', EmployerJobListView.as_view(), name='employer-job-list'),  # Private view for authenticated employers
    # path('recommendation-form/', recommendation_form_view, name='recommendation_form'),  # Form page
    # path('recommendations/', job_recommendations_view, name='job_recommendations'),  # Results page
    # path('select-top-candidates/', select_top_candidates_view, name='select_top_candidates'),
    # path('recommendations/<int:job_seeker_id>/', JobRecommendationView.as_view(), name='job-recommendations'),
    #path('recommend-applicants/<int:job_id>/', recommend_applicants, name='recommend-applicants'),
    path('job-recommendations/', job_recommendation_view, name='job_recommendations'),
]

def candidate_match_view(request):
    # Your logic to display the list or form
    return render(request, 'employers/candidate_match_form.html')  # Ensure this template exists