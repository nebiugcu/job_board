from django.shortcuts import render
from django.http import HttpResponse
from django.utils import timezone
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .models import Job
from .forms import JobRecommendationForm


def job_recommendation_view(request):
    if request.method == 'POST':
        form = JobRecommendationForm(request.POST)
        if form.is_valid():
            desired_titles = form.cleaned_data['desired_titles'].split(',')
            preferred_location = form.cleaned_data['preferred_location']
            expected_salary = form.cleaned_data['expected_salary']
            skills = form.cleaned_data['skills'].split(',')

            # Candidate profile
            candidate_profile = {
                'desired_titles': desired_titles,
                'preferred_location': preferred_location,
                'expected_salary': expected_salary,
                'skills': skills
            }

            # Fetch jobs where the application deadline hasn't passed
            jobs = Job.objects.filter(application_deadline__gte=timezone.now())

            # Calculate job match scores
            recommended_jobs = []
            for job in jobs:
                # Ensure that `job.required_skills` exists in your Job model
                job_skills = job.required_skills  # Assign the actual job skills here

                vectorizer = TfidfVectorizer()
                skills_vecs = vectorizer.fit_transform([', '.join(skills), job_skills])
                cosine_sim = cosine_similarity(skills_vecs[0], skills_vecs[1]).flatten()[0]

                match_score = cosine_sim * 100
                recommended_jobs.append({'job': job, 'score': match_score})

            # Sort jobs by match score in descending order and get the top 5
            recommended_jobs = sorted(recommended_jobs, key=lambda x: x['score'], reverse=True)[:5]

            return render(request, 'jobs/recommendations.html', {'recommended_jobs': recommended_jobs})
        else:
            return render(request, 'jobs/job_recommendation_form.html', {'form': form})
    else:
        form = JobRecommendationForm()
        return render(request, 'jobs/job_recommendation_form.html', {'form': form})

    return HttpResponse(status=405)
