from django.core.management.base import BaseCommand
from django.utils import timezone
from jobs.models import Job
from applications.models import Application
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import PyPDF2  # For PDF resume parsing
import docx  # For docx resume parsing
import os

class Command(BaseCommand):
    help = 'Match top candidates with job posts based on expiration, skills, and proximity'

    def extract_text_from_resume(self, resume_path):
        """Extract text from resume file (PDF or docx)."""
        file_extension = os.path.splitext(resume_path)[1]
        if file_extension == '.pdf':
            with open(resume_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                text = ''
                for page in range(len(reader.pages)):
                    text += reader.pages[page].extract_text()
            return text
        elif file_extension == '.docx':
            doc = docx.Document(resume_path)
            return ' '.join([para.text for para in doc.paragraphs])
        else:
            return ''  # Unsupported format

    def extract_skills_from_resume(self, resume_text):
        """Extracts job-related skills from the resume using keyword matching."""
        skills_list = ['Python', 'Django', 'Machine Learning', 'Data Analysis', 'JavaScript']
        extracted_skills = [skill for skill in skills_list if skill.lower() in resume_text.lower()]
        return extracted_skills

    def calculate_geographic_proximity(self, job_location, candidate_location):
        """Dummy function to calculate geographic proximity."""
        # Placeholder, use geolocation APIs to improve this logic
        return 1.0 if job_location.lower() == candidate_location.lower() else 0.5

    def calculate_job_match(self, job, candidate_profile, resume_skills):
        """Calculates job match score with custom weights for each criterion."""
        score = 0
        max_score = 100
        score_weights = {
            'title': 10,
            'location': 10,
            'salary': 30,
            'skills': 50,
        }

        # Title match
        if any(title.lower() in job.job_title.lower() for title in candidate_profile['desired_titles']):
            score += score_weights['title']

        # Location match
        location_proximity = self.calculate_geographic_proximity(job.location, candidate_profile['preferred_location'])
        score += score_weights['location'] * location_proximity

        # Skills match
        job_skills = job.required_skills
        vectorizer = TfidfVectorizer()
        skill_texts = [' '.join(candidate_profile['skills']), job_skills]
        skills_vecs = vectorizer.fit_transform(skill_texts)
        cosine_sim = cosine_similarity(skills_vecs[0], skills_vecs[1]).flatten()[0]
        score += score_weights['skills'] * cosine_sim

        return (score / max_score) * 100

    def handle(self, *args, **kwargs):
        # Fetch jobs where the expiration date hasn't passed
        jobs = Job.objects.filter(application_deadline__gte=timezone.now())
        candidate_profile = {
            'desired_titles': ['Software Engineer', 'Data Scientist'],
            'preferred_location': 'New York, NY',
            'expected_salary': 100000,
            'skills': ['Python', 'Django', 'Machine Learning']
        }

        # Example: Fetch candidate's resume text
        application = Application.objects.first()  # Replace with appropriate query
        resume_text = self.extract_text_from_resume(application.resume.path)
        resume_skills = self.extract_skills_from_resume(resume_text)

        # Calculate and display job match scores
        for job in jobs:
            match_score = self.calculate_job_match(job, candidate_profile, resume_skills)
            self.stdout.write(f'Job: {job.job_title}, Match Score: {match_score}')
