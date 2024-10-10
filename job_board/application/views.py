from rest_framework import generics, permissions
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Application, Hire
from jobs.models import Job
from authentication.models import JobSeeker
from .serializers import ApplicationSerializer, HireSerializer
from jobs.models import Job
from django.http import JsonResponse
from authentication.models import JobSeeker
from authentication.models import User, JobSeeker, Employer
from .forms import CandidateMatchForm
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import spacy
import PyPDF2
import docx



class EmployerApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure the user is an authenticated employer
        if not hasattr(self.request.user, 'employer'):
            raise permissions.PermissionDenied("You must be an employer to access this resource.")

        # Get the job ID from the request parameters
        job_id = self.kwargs.get('job_id')

        try:
            # Get the job instance to verify it belongs to the authenticated employer
            job = Job.objects.get(id=job_id, employer=self.request.user.employer)
        except Job.DoesNotExist:
            raise permissions.PermissionDenied("Job not found or you do not have permission to access it.")

        # Filter applications for the specified job
        return Application.objects.filter(job=job)

class ApplicationView(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically associate the application with the authenticated job seeker
        job_id = self.request.data.get('job')
        
        # Find the job object using the provided job_id
        job = Job.objects.get(id=job_id)

        try:
            job_seeker = JobSeeker.objects.get(user=self.request.user)
        except JobSeeker.DoesNotExist:
            raise PermissionDenied("You must be a job seeker to create an application.")

        # Automatically associate the application with the authenticated job seeker and the selected job
        serializer.save(job_seeker=job_seeker, job=job)

    def get_queryset(self):
        # Filter applications by the job seeker who is authenticated
        return Application.objects.filter(job_seeker=self.request.user)

class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure that only applications submitted by the authenticated job seeker can be accessed
        job_seeker_profile = self.request.user.job_seeker_profile  # Access the related JobSeeker instance
        return Application.objects.filter(job_seeker=job_seeker_profile)

class JobSeekerApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter applications by the authenticated job seeker
        job_seeker = self.request.user.job_seeker_profile
        # Filter applications by the authenticated job seeker
        return Application.objects.filter(job_seeker=job_seeker)

class RejectApplicationView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]  # Ensure user is authenticated
    queryset = Application.objects.all()

    def update(self, request, *args, **kwargs):
        # Fetch the application using the ID passed in the URL
        application = get_object_or_404(Application, id=kwargs['pk'])

        # Check if the authenticated user is the employer who posted the job
        if application.job.employer != request.user.employer:
            return Response({'error': 'Unauthorized to reject this application.'}, status=status.HTTP_403_FORBIDDEN)

        # Update the status to 'rejected'
        application.status = 'rejected'
        application.save()

        return Response({'message': 'Application has been rejected successfully.'}, status=status.HTTP_200_OK)

class HireView(generics.ListCreateAPIView):
    queryset = Hire.objects.all()
    serializer_class = HireSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Get the application from the validated data
        application = serializer.validated_data.get('application')

        # Check if the authenticated user is the employer who posted the job
        if application.job.employer != self.request.user.employer:
            raise serializers.ValidationError("Unauthorized to hire for this application.")

        # Update the application's status to 'accepted'
        application.status = 'accepted'
        application.save()

        # Automatically associate the hire with the authenticated employer and the job seeker from the application
        serializer.save(
            employer=self.request.user.employer,  # Set employer to the authenticated user
            job_seeker=application.job_seeker     # Set job_seeker from the application
        )

    def get_queryset(self):
        # Ensure that only hires related to the authenticated employer are shown
        return Hire.objects.filter(employer=self.request.user.employer)

class HireDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hire.objects.all()
    serializer_class = HireSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure that only hires related to the authenticated employer can be modified
        return Hire.objects.filter(employer=self.request.user)

# Check if a jobseeker applied for a job
@api_view(['GET'])
def has_applied(request, job_id):
    # Check if the user is authenticated
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication credentials were not provided."}, status=401)
    
    # Get the job object
    job = get_object_or_404(Job, id=job_id)
    
    # Check if the authenticated user is a JobSeeker
    try:
        job_seeker = JobSeeker.objects.get(user=request.user)
    except JobSeeker.DoesNotExist:
        return Response({"detail": "User is not a job seeker."}, status=403)

    # Check if the job seeker has applied for the job
    application_exists = Application.objects.filter(job=job, job_seeker=job_seeker).exists()
    
    if application_exists:
        return Response({"has_applied": True}, status=200)
    else:
        return Response({"has_applied": False}, status=200)


# candidate match

nlp = spacy.load('en_core_web_sm')



def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()
    return text

def extract_text_from_docx(docx_path):
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text_from_resume(file_path):
    file_ext = os.path.splitext(file_path)[1].lower()
    if file_ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif file_ext == ".docx":
        return extract_text_from_docx(file_path)
    else:
        return None  # Unsupported file format

# Function to extract skills from resume text using spaCy
def extract_skills_with_spacy(text):
    doc = nlp(text)
    skills = []

    # Assuming that skills are mostly nouns or proper nouns, we filter based on POS tagging
    for token in doc:
        if token.pos_ in ['NOUN', 'PROPN']:  # Adjust POS types based on your needs
            skills.append(token.text.lower())
    
    return skills

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

                resume_path = application.resume.path if application.resume else job_seeker.resume.path if job_seeker.resume else None
                if resume_path:
                    resume_text = extract_text_from_resume(resume_path)
                    if resume_text:
                        # Basic cleaning and skill extraction (you can further improve this by using NLP)
                        candidate_skills = [skill.strip() for skill in resume_text.lower().split() if skill.isalpha()]
                    else:
                        candidate_skills = []
                elif job_seeker.skills:
                    candidate_skills = job_seeker.skills.split(',')
                else:
                    candidate_skills = []

                # Calculate skills match using TF-IDF and cosine similarity
                if candidate_skills:
                    vectorizer = TfidfVectorizer()
                    skills_vecs = vectorizer.fit_transform([', '.join(required_skills), ', '.join(candidate_skills)])
                    cosine_sim = cosine_similarity(skills_vecs[0], skills_vecs[1]).flatten()[0]
                    match_score = cosine_sim * 100

                    matched_candidates.append({
                        'first_name': job_seeker.user.first_name,
                        'last_name': job_seeker.user.last_name,
                        'profession': job_seeker.profession,
                        'score': match_score,
                        'matched_skills': list(set(required_skills).intersection(candidate_skills)),
                    })

                # if job_seeker.skills:  # Ensure job seeker has listed skills
                #     candidate_skills = job_seeker.skills.split(',')

                #     # Calculate skills match using TF-IDF and cosine similarity
                #     vectorizer = TfidfVectorizer()
                #     skills_vecs = vectorizer.fit_transform([', '.join(required_skills), ', '.join(candidate_skills)])
                #     cosine_sim = cosine_similarity(skills_vecs[0], skills_vecs[1]).flatten()[0]

                #     match_score = cosine_sim * 100

                #     # Add job seeker details with match score
                #     matched_candidates.append({
                #         'first_name': job_seeker.user.first_name,
                #         'last_name': job_seeker.user.last_name,
                #         'profession': job_seeker.profession,
                #         'score': match_score
                #     })

            # Sort candidates by match score in descending order and limit to top 5
            matched_candidates = sorted(matched_candidates, key=lambda x: x['score'], reverse=True)[:5]

            return render(request, 'employers/matched_candidates.html', {'matched_candidates': matched_candidates})
    else:
        form = CandidateMatchForm()

    return render(request, 'employers/candidate_match_form.html', {'form': form})
