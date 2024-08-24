from rest_framework import viewsets
from .models import Job
from .serializers import JobSerializer

class JobViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing job instances.
    """
    serializer_class = JobSerializer
    queryset = Job.objects.all()
