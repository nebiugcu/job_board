from rest_framework import serializers
from .models import Application, Hire

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.ReadOnlyField(source='job.job_title')
    employer_name = serializers.ReadOnlyField(source='job.employer.user.username')
    first_name = serializers.ReadOnlyField(source='job.job_seeker.user.first_name')
    last_name = serializers.ReadOnlyField(source='job.job_seeker.user.last_name')
    profession = serializers.ReadOnlyField(source='job.job_seeker.profession')
    email = profession = serializers.ReadOnlyField(source='job.job_seeker.user.email')
    job_seeker_username = employer_name = serializers.ReadOnlyField(source='job.job_seeker.user.username')
    bio = serializers.ReadOnlyField(source='job.job_seeker.bio')
    profile_picture = serializers.ReadOnlyField(source='job.job_seeker.profile_picture')



    class Meta:
        model = Application
        exclude = ['job_seeker']
        read_only_fields = ['job_seeker', 'job_title', 'employer_name', 'first_name', 'last_name', 'profession', 'email', 'job_seeker_username', 'bio', 'profile_picture']

class HireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hire
        fields = "__all__"