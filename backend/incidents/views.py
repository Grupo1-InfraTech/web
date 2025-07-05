# incidentes/views.py
from rest_framework import viewsets, filters
from .models import Incidente
from .serializers import IncidenteSerializer

class IncidenteViewSet(viewsets.ModelViewSet):
    queryset = Incidente.objects.all().order_by('-createdAt')
    serializer_class = IncidenteSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['createdAt', 'priority', 'status']
    ordering = ['-createdAt']
