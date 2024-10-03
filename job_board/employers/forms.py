# forms.py
from django import forms


class CandidateMatchForm(forms.Form):
    job_title = forms.CharField(label='Job Title', max_length=255)
    location = forms.CharField(label='Location', max_length=255)
    skills = forms.CharField(widget=forms.Textarea, label='Skills', help_text='Enter skills separated by commas')
    experience_level = forms.CharField(label='Experience Level', max_length=50, help_text='Enter experience level (e.g., Junior, Senior)')
