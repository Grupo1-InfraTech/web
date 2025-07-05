# incidentes/views.py
from rest_framework import viewsets
from .models import Incidente
from .serializers import IncidenteSerializer

class IncidenteViewSet(viewsets.ModelViewSet):
    queryset = Incidente.objects.all().order_by('-createdAt')  # Puedes cambiar el orden aquí
    serializer_class = IncidenteSerializer
