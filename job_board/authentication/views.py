from .models import User, Employer, JobSeeker
from .serializers import EmployerSerializer, JobSeekerSerializer, CustomTokenObtainPairSerializer
from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

# Create your views here.
class RegisterEmployerView(generics.ListCreateAPIView):
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer
    permission_classes = [permissions.AllowAny]

class EmployerDetailView(generics.RetrieveAPIView):
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer
    permission_classes = [permissions.AllowAny]

class RegisterJobSeekerView(generics.ListCreateAPIView):
    queryset = JobSeeker.objects.all()
    serializer_class = JobSeekerSerializer
    permission_classes = [permissions.AllowAny]

class JobSeekerDetailView(generics.RetrieveAPIView):
    queryset = JobSeeker.objects.all()
    serializer_class = JobSeekerSerializer
    permission_classes = [permissions.AllowAny]



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer