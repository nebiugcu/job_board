from rest_framework import generics, permissions
from .models import Job
from .serializers import JobSerializer
from authentication.models import Employer
from django.shortcuts import render
from django.http import JsonResponse
import os
import joblib
import pandas as pd
from .models import Job  # Assuming the Job model exists

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def predict_job_match(request):
    if request.method == 'POST':
        model_path = os.path.join(BASE_DIR, 'jobs', 'models', 'best_job_match_model.pkl')
        scaler_path = os.path.join(BASE_DIR, 'jobs', 'models', 'scaler.pkl')

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        user_input = {
            'feature_1': request.POST['feature_1'],
            'feature_2': request.POST['feature_2'],
            # Add more features as needed
        }

        input_df = pd.DataFrame([user_input])
        input_df = pd.get_dummies(input_df)
        input_scaled = scaler.transform(input_df)
        prediction = model.predict(input_scaled)
        recommended_jobs = Job.objects.filter(job_match_score__gte=prediction[0])
        return render(request, 'job_recommendation.html', {'jobs': recommended_jobs})
    return render(request, 'job_form.html')

def api_predict_job_match(request):
    if request.method == 'POST':
        model_path = os.path.join(BASE_DIR, 'jobs', 'models', 'best_job_match_model.pkl')
        scaler_path = os.path.join(BASE_DIR, 'jobs', 'models', 'scaler.pkl')

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        data = request.json()
        input_df = pd.DataFrame([data])
        input_scaled = scaler.transform(input_df)
        prediction = model.predict(input_scaled)
        return JsonResponse({'job_match_score': prediction[0]})
    return JsonResponse({'error': 'Invalid request method'}, status=400)


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
        return Job.objects.filter(employer=self.request.user)

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