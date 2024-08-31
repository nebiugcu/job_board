from rest_framework import generics, permissions
from .models import Job
from .serializers import JobSerializer

class JobPostView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically associate the job with the authenticated employer
        serializer.save(employer=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Ensure that only jobs created by the authenticated employer can be modified
        return Job.objects.filter(employer=self.request.user)