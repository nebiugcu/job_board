import os
import pandas as pd
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions
from django.core.exceptions import PermissionDenied
from .models import Job , Applicant
from .serializers import JobSerializer
from authentication.models import Employer
from .forms import CandidateProfileForm
from .forms import JobSelectionForm, CandidateSelectionForm





# Candidate profile for job match calculation
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
        matched_skills = [skill for skill in candidate_skills if skill.lower() in job_skills.lower()]
        skill_match_ratio = len(matched_skills) / len(candidate_skills) if candidate_skills else 0
        score += score_weights['skills'] * skill_match_ratio

    return (score / max_score) * 100

# Recommendation view for candidates
def job_recommendations_view(request):
    if request.method == 'POST':
        form = CandidateProfileForm(request.POST)
        if form.is_valid():
            # Create the candidate profile based on the submitted form
            candidate_profile = {
                'desired_titles': form.cleaned_data['desired_titles'].split(','),
                'preferred_location': form.cleaned_data['preferred_location'],
                'expected_salary': form.cleaned_data['expected_salary'],
                'experience_level': form.cleaned_data['experience_level'],
                'skills': form.cleaned_data['skills'].split(',')
            }

            # Load and preprocess data (adjust the path as needed)
            csv_path = os.path.join(os.path.dirname(__file__), 'data', 'job_postings.csv')
            df = pd.read_csv(csv_path)

            # Ensure company_name column exists, and replace missing/empty values with 'Not mentioned'
            if 'company_name' in df.columns:
                df['company_name'].fillna('Not mentioned', inplace=True)  # Replace NaN values
                df['company_name'].replace('', 'Not mentioned', inplace=True)  # Replace empty strings
            else:
                df['company_name'] = 'Not mentioned'  # Set default if column is missing

            # Apply the job match score calculation based on user input
            df['job_match_score'] = df.apply(lambda row: calculate_job_match(row, candidate_profile), axis=1)

            # Sort jobs by match score and get the top 5
            recommended_jobs = df.sort_values(by='job_match_score', ascending=False).head(5)

            # Prepare context for the template
            context = {'recommended_jobs': recommended_jobs[['title', 'location', 'company_name', 'min_salary', 'max_salary', 'job_match_score']].to_dict('records')}
            return render(request, 'jobs/recommendations.html', context)
    else:
        form = CandidateProfileForm()

    return render(request, 'jobs/recommendation_form.html', {'form': form})

# Job posting views
class JobPostView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            employer = Employer.objects.get(user=self.request.user)
        except Employer.DoesNotExist:
            raise PermissionDenied("You must be an employer to create a job.")
        serializer.save(employer=employer)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            employer_profile = self.request.user.employer
        except Employer.DoesNotExist:
            return Job.objects.none()
        return Job.objects.filter(employer=employer_profile)

class JobListView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.AllowAny]

class EmployerJobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(employer__user=self.request.user)

# Recommendation form view
def recommendation_form_view(request):
    if request.method == 'POST':
        form = CandidateProfileForm(request.POST)
        if form.is_valid():
            # Process the form data here (e.g., save to database, perform recommendations)
            pass
    else:
        form = CandidateProfileForm()

    return render(request, 'jobs/recommendation_form.html', {'form': form})

# comment for new files
def calculate_candidate_match(applicant, employer_criteria):
    """Calculates match score for an applicant based on skills and experience level."""
    score = 0
    max_score = 100
    weights = {'skills': 60, 'experience_level': 40}

    # Skills matching
    applicant_skills = applicant.skills.split(',')
    employer_skills = employer_criteria['skills'].split(',')
    matching_skills = [skill for skill in employer_skills if skill.lower() in [s.lower() for s in applicant_skills]]
    skills_ratio = len(matching_skills) / len(employer_skills) if employer_skills else 0
    score += weights['skills'] * skills_ratio

    # Experience level match
    if applicant.experience_level.lower() == employer_criteria['experience_level'].lower():
        score += weights['experience_level']

    return (score / max_score) * 100

def select_top_candidates_view(request):
    if request.method == 'POST':
        # Instantiate forms with POST data
        job_form = JobSelectionForm(request.POST)
        candidate_form = CandidateSelectionForm(request.POST)

        if job_form.is_valid() and candidate_form.is_valid():
            # Get the selected job
            selected_job = job_form.cleaned_data['job']

            # Fetch the top 5 candidates based on some criteria (e.g., match score)
            top_candidates = Candidate.objects.filter(job=selected_job).order_by('-match_score')[:5]

            # Prepare the context with top candidates and forms
            context = {
                'job_form': job_form,
                'candidate_form': candidate_form,
                'top_candidates': top_candidates
            }

            return render(request, 'jobs/select_top_candidates.html', context)
        else:
            # If the form is invalid, re-render the page with the form
            context = {
                'job_form': job_form,
                'candidate_form': candidate_form,
            }
            return render(request, 'jobs/select_top_candidates.html', context)
    else:
        # Initialize empty forms when the request method is GET
        job_form = JobSelectionForm()
        candidate_form = CandidateSelectionForm()

        # Render the template with empty forms
        context = {
            'job_form': job_form,
            'candidate_form': candidate_form,
        }
        return render(request, 'jobs/select_top_candidates.html', context)