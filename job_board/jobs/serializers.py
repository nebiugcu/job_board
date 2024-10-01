from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    employer_firstname = serializers.CharField(source='employer.user.first_name', read_only=True)  # or 'first_name'/'last_name'
    employer_lastname = serializers.CharField(source='employer.user.last_name', read_only=True)  # or 'first_name'/'last_name'
    class Meta:
        model = Job
        exclude = ['employer']
        read_only_fields = ['employer']