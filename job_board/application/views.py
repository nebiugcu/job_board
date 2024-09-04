from rest_framework import generics, permissions
from .models import Application, Hire
from jobs.models import Job
from authentication.models import JobSeeker
from .serializers import ApplicationSerializer, HireSerializer
from jobs.models import Job

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
        return Application.objects.filter(job_seeker=self.request.user)

class JobSeekerApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter applications by the authenticated job seeker
        job_seeker = self.request.user.job_seeker_profile
        # Filter applications by the authenticated job seeker
        return Application.objects.filter(job_seeker=job_seeker)

class HireView(generics.ListCreateAPIView):
    queryset = Hire.objects.all()
    serializer_class = HireSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically associate the hire with the authenticated employer and selected application
        application = serializer.validated_data['application']
        serializer.save(employer=self.request.user, job_seeker=application.job_seeker)

    def get_queryset(self):
        # Ensure that only hires related to the authenticated employer are shown
        return Hire.objects.filter(employer=self.request.user)

class HireDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hire.objects.all()
    serializer_class = HireSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure that only hires related to the authenticated employer can be modified
        return Hire.objects.filter(employer=self.request.user)
