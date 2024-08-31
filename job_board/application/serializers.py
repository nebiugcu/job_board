from rest_framework import serializers
from .models import Application, Hire

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'

class HireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hire
        fields = "__all__"