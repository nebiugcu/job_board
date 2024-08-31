from rest_framework import generics, permissions
from .models import Application, Hire
from .serializers import ApplicationSerializer, HireSerializer

class ApplicationView(generics.ListCreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically associate the application with the authenticated job seeker
        serializer.save(job_seeker=self.request.user)

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
