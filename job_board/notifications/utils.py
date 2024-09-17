# notifications/utils.py
from django.core.mail import send_mail
from django.conf import settings

def send_invitation_email(email, job_title, employer_name):
    subject = f"Job Invitation for {job_title}"
    message = f"Hello, You have been invited by {employer_name} to check out a job opportunity for {job_title}. Visit the platform to know more."
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]

    send_mail(subject, message, from_email, recipient_list)
