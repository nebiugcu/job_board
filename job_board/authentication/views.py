from .models import User, Employer, JobSeeker
from .serializers import EmployerSerializer, JobSeekerSerializer
from rest_framework import generics, permissions

# Create your views here.
class RegisterEmployerView(generics.CreateAPIView):
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer
    permission_classes = [permissions.AllowAny]

class RegisterJobSeekerView(generics.CreateAPIView):
    queryset = JobSeeker.objects.all()
    serializer_class = JobSeekerSerializer
    permission_classes = [permissions.AllowAny]
