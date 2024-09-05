from rest_framework import serializers
from .models import User, Employer, JobSeeker
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class EmployerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Employer
        fields = '__all__'
    def create(self, validated_data):
        user_data = validated_data.pop('user')  # Extract User data
        user = User.objects.create_user(**user_data)  # Create the User instance
        employeer = Employer.objects.create(user=user, **validated_data)  # Create JobSeeker
        return employeer

class JobSeekerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = JobSeeker
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('user')  # Extract User data
        user = User.objects.create_user(**user_data)  # Create the User instance
        job_seeker = JobSeeker.objects.create(user=user, **validated_data)  # Create JobSeeker
        return job_seeker

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        is_employer = Employer.objects.filter(user=user).exists()
        is_job_seeker = JobSeeker.objects.filter(user=user).exists()
        token['email'] = user.email  # Adding the user's email

        # Fetch the name and profile picture based on the user's role
        if is_employer:
            employer = Employer.objects.get(user=user)
            token['name'] = user.username if hasattr(user, 'username') else None  # Assuming user has a name field
            token['profile_picture'] = employer.profile_picture.url if employer.profile_picture else None

        elif is_job_seeker:
            job_seeker = JobSeeker.objects.get(user=user)
            token['name'] = user.username if hasattr(user, 'username') else None  # Assuming user has a name field
            token['profile_picture'] = job_seeker.profile_picture.url if job_seeker.profile_picture else None
       
        
        token['is_employer'] = is_employer
        token['is_job_seeker'] = is_job_seeker

        return token