from rest_framework import generics, permissions
from .models import Job
from .serializers import JobSerializer
from authentication.models import Employer

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