from django.core.management.base import BaseCommand
from incidents.models import Incidente


class Command(BaseCommand):
    help = 'Fix openingTime for existing incidents where it is null'

    def handle(self, *args, **options):
        # Buscar todos los incidentes que tienen openingTime como null
        incidents_to_fix = Incidente.objects.filter(openingTime__isnull=True)
        
        count = 0
        for incident in incidents_to_fix:
            # Establecer openingTime igual a createdAt
            incident.openingTime = incident.createdAt
            incident.save()
            count += 1
            self.stdout.write(
                self.style.SUCCESS(f'Fixed incident #{incident.id}: {incident.title}')
            )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully fixed {count} incidents')
        )
