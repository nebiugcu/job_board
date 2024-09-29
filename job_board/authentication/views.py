from rest_framework import status
from .models import User, Employer, JobSeeker
from .serializers import EmployerSerializer, JobSeekerSerializer, UserSerializer, CustomTokenObtainPairSerializer
from rest_framework import generics, permissions
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import JSONParser

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


class UpdateEmployerProfile(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        employer = get_object_or_404(Employer, user=user)

        # Parse user data
        user_data = request.data.get('user', {})
        employer_data = request.data.get('employer', {})

        user_serializer = UserSerializer(user, data=user_data, partial=True)
        employer_serializer = EmployerSerializer(employer, data=employer_data, partial=True)

        if user_serializer.is_valid() and employer_serializer.is_valid():
            user_serializer.save()
            employer_serializer.save()
            return Response({
                "user": user_serializer.data,
                "employer": employer_serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "user_errors": user_serializer.errors,
            "employer_errors": employer_serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class UpdateJobSeekerProfile(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        job_seeker = get_object_or_404(JobSeeker, user=user)

        # Parse user data
        user_data = request.data.get('user', {})
        job_seeker_data = request.data.get('job_seeker', {})

        user_serializer = UserSerializer(user, data=user_data, partial=True)
        job_seeker_serializer = JobSeekerSerializer(job_seeker, data=job_seeker_data, partial=True)

        if user_serializer.is_valid() and job_seeker_serializer.is_valid():
            user_serializer.save()
            job_seeker_serializer.save()
            return Response({
                "user": user_serializer.data,
                "job_seeker": job_seeker_serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "user_errors": user_serializer.errors,
            "job_seeker_errors": job_seeker_serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)



class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer