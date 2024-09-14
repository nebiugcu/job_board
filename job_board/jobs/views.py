import os
from rest_framework import generics, permissions
from django.shortcuts import render
from .models import Job
from .serializers import JobSerializer
from authentication.models import Employer
import pandas as pd
from .management.commands.job_recommendation import Command as JobRecommendationCommand
from .forms import CandidateProfileForm

class JobPostView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically associate the job with the authenticated employer
         try:
            employer = Employer.objects.get(user=self.request.user)
         except Employer.DoesNotExist:
            raise PermissionDenied("You must be an employer to create a job.")
        
         # Save the job with the associated employer
         serializer.save(employer=employer)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure that only jobs created by the authenticated employer can be modified
        try:
            employer_profile = self.request.user.employer  # Access the related Employer instance
        except Employer.DoesNotExist:
            return Job.objects.none()  # If the user is not an Employer, return an empty queryset

        # Filter jobs based on the Employer instance
        return Job.objects.filter(employer=employer_profile)

class JobListView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

class EmployerJobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure that only jobs created by the authenticated employer are listed
        return Job.objects.filter(employer__user=self.request.user)

# Recommendation views

# Candidate profile for job match calculation
candidate_profile = {
    'desired_titles': ['Software Engineer', 'Data Scientist'],
    'preferred_location': 'New York, NY',
    'expected_salary': 100000,
    'experience_level': 'Mid-level',
    'skills': ['Python', 'Django', 'Machine Learning']
}

def calculate_job_match(row, candidate_profile):
    """Calculates job match score with custom weights for each criterion."""
    score = 0
    max_score = 100  # Total possible score for normalization
    score_weights = {
        'title': 25,  # 25% weight
        'location': 15,  # 15% weight
        'salary': 20,  # 20% weight
        'skills': 40,  # 40% weight
    }

    # Title Match
    title_str = str(row.get('title', ''))
    if any(title.lower() in title_str.lower() for title in candidate_profile['desired_titles']):
        score += score_weights['title']

    # Location Match
    if candidate_profile['preferred_location'].lower() in str(row.get('location', '')).lower():
        score += score_weights['location']

    # Salary Match
    if pd.notna(row['min_salary']) and pd.notna(row['max_salary']):
        salary_range = row['max_salary'] - row['min_salary']
        if salary_range > 0:
            salary_proximity = 1 - (abs(candidate_profile['expected_salary'] - row['min_salary']) / salary_range)
            score += score_weights['salary'] * max(0, salary_proximity)

    # Skills Match
    candidate_skills = candidate_profile['skills']
    job_skills = str(row['skills_desc'])
    if candidate_skills and job_skills:
        # Simple string matching for skills
        matched_skills = [skill for skill in candidate_skills if skill.lower() in job_skills.lower()]
        skill_match_ratio = len(matched_skills) / len(candidate_skills) if candidate_skills else 0
        score += score_weights['skills'] * skill_match_ratio

    return (score / max_score) * 100

def recommend_jobs_view(request):
    # Load the CSV file (or query the database if jobs are stored there)
    csv_path = os.path.join(os.path.dirname(__file__), 'data', 'job_postings.csv')
    df = pd.read_csv(csv_path)

    # Apply the job match score calculation to each job
    df['job_match_score'] = df.apply(lambda row: calculate_job_match(row, candidate_profile), axis=1)

    # Sort jobs by match score and get the top 5
    recommended_jobs = df.sort_values(by='job_match_score', ascending=False).head(5)

    # Prepare the data for the template
    context = {
        'recommended_jobs': recommended_jobs[['title', 'location', 'job_match_score']]
    }

    # Render the template with the recommendations
    return render(request, 'recommended_jobs.html', context)

def job_recommendations_view(request):
    if request.method == 'POST':
        form = CandidateProfileForm(request.POST)
        if form.is_valid():
            candidate_profile = {
                'desired_titles': form.cleaned_data['desired_titles'].split(','),
                'preferred_location': form.cleaned_data['preferred_location'],
                'expected_salary': form.cleaned_data['expected_salary'],
                'experience_level': form.cleaned_data['experience_level'],
                'skills': form.cleaned_data['skills'].split(',')
            }

            # Create an instance of the job recommendation command
            job_recommender = JobRecommendationCommand()

            # Load and preprocess data
            csv_path = r'E:\job_board\job_board\jobs\data\job_postings.csv'
            df = job_recommender.load_and_preprocess_data(csv_path)

            # Get top 5 recommended jobs
            recommended_jobs = job_recommender.recommend_top_jobs(df, top_n=5)

            context = {'recommended_jobs': recommended_jobs.to_dict('records')}
            return render(request, 'jobs/recommendations.html', context)

    else:
        form = CandidateProfileForm()

    return render(request, 'jobs/recommendation_form.html', {'form': form})