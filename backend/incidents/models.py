# incidentes/models.py
from django.db import models

class Incidente(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)
    priority = models.CharField(max_length=20)
    createdAt = models.DateTimeField(auto_now_add=True)
    openingTime = models.DateTimeField(null=True, blank=True)
    closingTime = models.DateTimeField(null=True, blank=True)
    assignedTo = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=20)
    resolution = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.title
