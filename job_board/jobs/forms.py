from django import forms

class CandidateProfileForm(forms.Form):
    desired_titles = forms.CharField(label='Desired Job Titles', max_length=200)
    preferred_location = forms.CharField(label='Preferred Location', max_length=100)
    expected_salary = forms.IntegerField(label='Expected Salary')
    experience_level = forms.CharField(label='Experience Level', max_length=50)
    skills = forms.CharField(label='Skills', widget=forms.Textarea)
