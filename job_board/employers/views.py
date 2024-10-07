# views.py
import PyPDF2
# import docx
import os
from django.shortcuts import render
from django.utils import timezone
from application.models import Application
from authentication.models import User, JobSeeker, Employer
from .forms import CandidateMatchForm
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# def extract_text_from_resume(resume_path):
#     # Add logic to extract text from resume files (PDF, DOCX, etc.)
#     # This is a placeholder; you need to define this method
#     return "Extracted resume text"


# def extract_skills_from_resume(resume_text):
#     # Add logic to extract skills from the resume text
#     # This is a placeholder; you need to define this method
#     skills_list = ['Python', 'Django', 'Machine Learning', 'Data Analysis', 'JavaScript']
#     return [skill for skill in skills_list if skill.lower() in resume_text.lower()]


# def candidate_match_view(request):
#     if request.method == 'POST':
#         form = CandidateMatchForm(request.POST)
#         if form.is_valid():
#             job_title = form.cleaned_data['job_title']
#             location = form.cleaned_data['location']
#             skills = form.cleaned_data['skills'].split(',')
#             experience_level = form.cleaned_data['experience_level']

#             # Fetch applications for jobs that match the given job title, location, and experience level
#             applications = Application.objects.filter(
#                 job__job_title__icontains=job_title,
#                 job__location__icontains=location,
#                 job__experience_level__iexact=experience_level
#             )

#              # Fetch job seekers that match the criteria based on skills and experience
#             job_seekers = JobSeeker.objects.filter(
#                 profession__icontains=job_title,  # Matching profession with job title
#                 skills__icontains=','.join(skills)  # Checking if job seeker skills match
#             )

#             # Calculate match scores for candidates
#             matched_candidates = []
#             for application in applications:
#                 # Extract skills from the resume
#                 resume_text = extract_text_from_resume(application.resume.path)
#                 candidate_skills = extract_skills_from_resume(resume_text)

#                 # Calculate skills match using TF-IDF and cosine similarity
#                 vectorizer = TfidfVectorizer()
#                 skills_vecs = vectorizer.fit_transform([', '.join(skills), ', '.join(candidate_skills)])
#                 cosine_sim = cosine_similarity(skills_vecs[0], skills_vecs[1]).flatten()[0]

#                 match_score = cosine_sim * 100
#                 matched_candidates.append({'application': application, 'score': match_score})

#             # Sort candidates by match score in descending order and limit to top 5
#             matched_candidates = sorted(matched_candidates, key=lambda x: x['score'], reverse=True)[:5]

#             return render(request, 'employers/matched_candidates.html', {'matched_candidates': matched_candidates})
#     else:
#         form = CandidateMatchForm()

#     return render(request, 'employers/candidate_match_form.html', {'form': form})


def candidate_match_view(request):
    if request.method == 'POST':
        form = CandidateMatchForm(request.POST)
        if form.is_valid():
            job_title = form.cleaned_data['job_title']
            location = form.cleaned_data['location']
            required_skills = form.cleaned_data['skills'].split(',')
            experience_level = form.cleaned_data['experience_level']

            # Fetch applications for jobs that match the given job title and location
            applications = Application.objects.filter(
                job__job_title__icontains=job_title,
            )

            # Calculate match scores for candidates based on job_seeker skills
            matched_candidates = []
            for application in applications:
                job_seeker = application.job_seeker

                if job_seeker.skills:  # Ensure job seeker has listed skills
                    candidate_skills = job_seeker.skills.split(',')

                    # Calculate skills match using TF-IDF and cosine similarity
                    vectorizer = TfidfVectorizer()
                    skills_vecs = vectorizer.fit_transform([', '.join(required_skills), ', '.join(candidate_skills)])
                    cosine_sim = cosine_similarity(skills_vecs[0], skills_vecs[1]).flatten()[0]

                    match_score = cosine_sim * 100

                    # Add job seeker details with match score
                    matched_candidates.append({
                        'first_name': job_seeker.user.first_name,
                        'last_name': job_seeker.user.last_name,
                        'profession': job_seeker.profession,
                        'score': match_score
                    })

            # Sort candidates by match score in descending order and limit to top 5
            matched_candidates = sorted(matched_candidates, key=lambda x: x['score'], reverse=True)[:5]

            return render(request, 'employers/matched_candidates.html', {'matched_candidates': matched_candidates})
    else:
        form = CandidateMatchForm()

    return render(request, 'employers/candidate_match_form.html', {'form': form})
