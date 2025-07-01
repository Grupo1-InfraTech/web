import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Incident } from '../../models/incident.model';
import { IncidentService } from '../../services/incident.service';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit {
  sortOrder: string = 'priority'; // Cambiar el valor por defecto

  // Array de técnicos disponibles para asignar a incidentes
  technicians = ['Eduardo Rojas', 'Camila Campos', 'Carlos Sánchez'];

  // Filter variables
  filterCategory: string = '';
  filterStatus: string = '';
  filterPriority: string = '';
  filterDate: string = '';

  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidents = this.incidentService.getIncidents();
    this.applyFilters();
  }

  sortIncidents() {
    if (this.sortOrder === 'priority') {
      // Ordenamiento prioritario: incidentes no resueltos +48h primero, luego por fecha
      this.filteredIncidents.sort((a, b) => {
        const aUnresolved48h = this.isUnresolvedFor48Hours(a);
        const bUnresolved48h = this.isUnresolvedFor48Hours(b);
        
        // Si uno tiene +48h sin resolver y el otro no, priorizar el de +48h
        if (aUnresolved48h && !bUnresolved48h) {
          return -1; // 'a' va primero
        }
        if (!aUnresolved48h && bUnresolved48h) {
          return 1;  // 'b' va primero
        }
        
        // Si ambos tienen la misma condición de 48h, ordenar por fecha de creación (más recientes primero)
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    } else if (this.sortOrder === 'newest') {
      this.filteredIncidents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (this.sortOrder === 'oldest') {
      this.filteredIncidents.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else if (this.sortOrder === 'id') {
      this.filteredIncidents.sort((a, b) => a.id - b.id);
    }
  }

  applyFilters() {
    this.filteredIncidents = this.incidents.filter(inc => {
      const matchCategory = this.filterCategory ? inc.category === this.filterCategory : true;
      const matchStatus = this.filterStatus ? inc.status === this.filterStatus : true;
      const matchPriority = this.filterPriority ? inc.priority === this.filterPriority : true;
      const matchDate = this.filterDate ? new Date(inc.createdAt) >= new Date(this.filterDate) : true;

      return matchCategory && matchStatus && matchPriority && matchDate;
    });
    this.sortIncidents();
  }

  refreshIncidents(): void {
    this.loadIncidents();
  }

  // Método para formatear fechas en español
  formatDateSpanish(date: Date | null): string {
    if (!date) return 'No especificado';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para verificar si un incidente lleva más de 48 horas sin resolver
  isUnresolvedFor48Hours(incident: Incident): boolean {
    if (incident.status === 'Cerrado') return false;
    
    const now = new Date();
    const createdAt = new Date(incident.createdAt);
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff > 48;
  }
}