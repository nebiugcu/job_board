from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .utils import send_invitation_email

@api_view(['POST'])
@permission_classes([AllowAny])
def send_job_invitation(request):
    email = request.data.get('email')
    job_title = request.data.get('jobTitle')
    employer_name = request.data.get('employerName')

    if email and job_title and employer_name:
        send_invitation_email(email, job_title, employer_name)
        return Response({'message': 'Invitation email sent successfully'}, status=200)
    
    return Response({'error': 'Invalid data'}, status=400)


