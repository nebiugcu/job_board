from rest_framework import serializers
from .models import Application, Hire

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.ReadOnlyField(source='job.job_title')
    employer_name = serializers.ReadOnlyField(source='job.employer.user.username')
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    profession = serializers.SerializerMethodField()
    job_seeker_username = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    

    class Meta:
        model = Application
        exclude = ['job_seeker']
        read_only_fields = ['job_title', 'employer_name', 'first_name', 'last_name', 'bio', 'profession', 'job_seeker_username', 'email']

    def get_first_name(self, obj):
        return obj.job_seeker.user.first_name if obj.job_seeker and obj.job_seeker.user else None

    def get_last_name(self, obj):
        return obj.job_seeker.user.last_name if obj.job_seeker and obj.job_seeker.user else None

    def get_bio(self, obj):
        return obj.job_seeker.bio if obj.job_seeker and obj.job_seeker.user else None

    def get_profession(self, obj):
        return obj.job_seeker.profession if obj.job_seeker and obj.job_seeker.user else None

    def get_job_seeker_username(self, obj):
        return obj.job_seeker.user.username if obj.job_seeker and obj.job_seeker.user else None

    def get_profile_picture(self, obj):
        return obj.job_seeker.profile_picture.url if obj.job_seeker and obj.job_seeker.user else None
    
    def get_email(self, obj):
        return obj.job_seeker.user.email if obj.job_seeker and obj.job_seeker.user else None

class HireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hire
        fields = ['id', 'application', 'hire_date', 'completed_date', 'rating', 'is_completed']