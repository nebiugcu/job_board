from rest_framework import generics, permissions
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
