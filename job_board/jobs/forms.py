# jobs/forms.py
# forms.py

from django import forms

class JobRecommendationForm(forms.Form):
    desired_titles = forms.CharField(label='Desired Job Titles', max_length=255, help_text='Enter job titles separated by commas')
    preferred_location = forms.CharField(label='Preferred Location', max_length=255, help_text='Enter your preferred location')
    expected_salary = forms.IntegerField(label='Expected Salary')
    skills = forms.CharField(widget=forms.Textarea, label='Skills', help_text='Enter skills separated by commas')
