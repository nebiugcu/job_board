from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .models import User

# Create your views here.
def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.user_type == 1:
                return redirect('job_seeker_dashboard')
            elif user.user_type == 2:
                return redirect('employer_dashboard')
            elif user.user_type == 3:
                return redirect('admin_dashboard')
    return render(request, 'authentication/login.html')
