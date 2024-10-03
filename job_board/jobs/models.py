from django.db import models
from authentication.models import Employer, User  # Correct 'user' to 'User'
from django.contrib.auth import get_user_model





class Job(models.Model):
    employer = models.ForeignKey(Employer, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=255)
    job_type = models.CharField(max_length=50, choices=[('full time', 'Full Time'), ('part time', 'Part Time'), ('freelance', 'Freelance')])
    applicants_needed = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('both', 'Both')]) # make it accept both
    job_description = models.TextField()
    job_category = models.CharField(max_length=100)
    job_site = models.CharField(max_length=255)
    application_deadline = models.DateField()
    experience_level = models.CharField(max_length=50, choices=[('expert', 'Expert'), ('senior', 'Senior'), ('intermediate', 'Intermediate'), ('junior', 'Junior'), ('entry', 'Entry')])
    created_at = models.DateTimeField(auto_now_add=True)
    salary = models.CharField(max_length=255, null=True, blank=True)
    location = models.CharField(max_length=255, null=True, blank=True)
    required_skills = models.CharField(max_length=255, null=True, blank=True)


    def __str__(self):
        return self.job_title

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

            # Fetch jobs where expiration date hasn't passed
            jobs = Job.objects.filter(application_deadline__gte=timezone.now())

            # Calculate job match scores
            recommended_jobs = []
            for job in jobs:
                job_skills = job.required_skills  # Make sure this field exists in your Job model

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



