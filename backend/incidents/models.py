# incidentes/models.py
from django.db import models
from django.utils import timezone

class Incidente(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    category = models.CharField(max_length=50)
    priority = models.CharField(max_length=20)
    createdAt = models.DateTimeField(default=timezone.now)
    openingTime = models.DateTimeField(null=True, blank=True)
    closingTime = models.DateTimeField(null=True, blank=True)
    assignedTo = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=20)
    resolution = models.TextField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Si es un nuevo incidente y no tiene openingTime, establecerlo igual a createdAt
        if not self.pk and not self.openingTime:
            self.openingTime = self.createdAt
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
