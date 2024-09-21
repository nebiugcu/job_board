# jobs/forms.py

from django import forms
from .models import Job
class CandidateProfileForm(forms.Form):
    desired_titles = forms.CharField(label='Desired Job Titles', max_length=200, help_text="Comma-separated job titles you're looking for")
    preferred_location = forms.CharField(label='Preferred Location', max_length=100, help_text="Your preferred job location")
    expected_salary = forms.IntegerField(label='Expected Salary', help_text="Your expected salary")
    experience_level = forms.CharField(label='Experience Level', max_length=100, help_text="Your experience level (e.g., Junior, Senior, etc.)")
    skills = forms.CharField(label='Skills', widget=forms.Textarea, help_text="Comma-separated list of skills")

class CandidateSelectionForm(forms.Form):
    experience_level = forms.CharField(label='Experience Level', max_length=100, required=False)
    skills = forms.CharField(label='Skills', widget=forms.Textarea, required=False, help_text="Comma-separated list of skills")
    job_id = forms.IntegerField(widget=forms.HiddenInput())  # Hidden field to reference the job

class JobSelectionForm(forms.Form):
    job = forms.ModelChoiceField(queryset=Job.objects.all(), label="Select Job")