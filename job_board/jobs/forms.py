# jobs/forms.py

from django import forms
from .models import Job
from authentication.models import JobSeeker

class JobRecommendationForm(forms.Form):
    desired_titles = forms.CharField(label='Desired Job Titles', max_length=255, help_text='Enter job titles separated by commas')
    preferred_location = forms.CharField(label='Preferred Location', max_length=255, help_text='Enter your preferred location')
    expected_salary = forms.IntegerField(label='Expected Salary')
    skills = forms.CharField(widget=forms.Textarea, label='Skills', help_text='Enter skills separated by commas')
    
class CandidateProfileForm(forms.Form):
    desired_titles = forms.CharField(label='Desired Job Titles', max_length=200, help_text="Comma-separated job titles you're looking for")
    preferred_location = forms.CharField(label='Preferred Location', max_length=100, help_text="Your preferred job location")
    expected_salary = forms.IntegerField(label='Expected Salary', help_text="Your expected salary")
    experience_level = forms.CharField(label='Experience Level', max_length=100, help_text="Your experience level (e.g., Junior, Senior, etc.)")
    skills = forms.CharField(label='Skills', widget=forms.Textarea, help_text="Comma-separated list of skills")

class JobSelectionForm(forms.Form):
    job = forms.ModelChoiceField(queryset=Job.objects.all(), label="Select Job")

class CandidateSelectionForm(forms.Form):
    job_category = forms.CharField(max_length=100, widget=forms.HiddenInput())  # This will be populated dynamically.