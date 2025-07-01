import { Injectable } from '@angular/core';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private incidents: Incident[] = [
    {
      id: 1,
      title: "No se carga el sistema de gestión",
      description: "El sistema se queda en la pantalla de carga y no avanza.",
      category: "Software",
      priority: "Alta",
      createdAt: new Date("2025-05-08T08:30:05"),
      openingTime: new Date("2025-05-08T09:15:00"),
      closingTime: new Date("2025-05-09T15:30:00"),
      assignedTo: "Eduardo Rojas",
      status: "Cerrado",
      resolution: "Se reinició el servicio en el servidor y se verificó que el sistema cargara correctamente."
    },
    {
      id: 2,
      title: "Impresora no responde a los comandos de impresión",
      description: "El equipo detecta la impresora pero no imprime nada.",
      category: "Hardware",
      priority: "Media",
      createdAt: new Date("2025-06-01T11:00:00"),
      openingTime: new Date("2025-06-02T11:30:00"),
      closingTime: null,
      assignedTo: "Camila Campos",
      status: "En progreso",
      resolution: null,
    },
    {
      id: 3,
      title: "Wi-Fi intermitente en sala de reuniones",
      description: "La señal de Wi-Fi se desconecta de forma ocasional, pero se reconecta sola al cabo de unos segundos.",
      category: "Red",
      priority: "Baja",
      createdAt: new Date("2025-06-03T11:00:00"),
      openingTime: null,
      closingTime: null,
      assignedTo: null,
      status: "En progreso",
      resolution: null,
    },
    {
      id: 4,
      title: "No tengo acceso al correo institucional",
      description: "Intento ingresar al correo pero me dice 'usuario inválido'.",
      category: "Otros",
      priority: "Alta",
      createdAt: new Date("2025-06-06T09:45:00"),
      openingTime: null,
      closingTime: null,
      assignedTo: null,
      status: "Abierto",
      resolution: null
    },
    {
      id: 5,
      title: "Error al abrir planillas en Excel",
      description: "Al intentar abrir ciertos archivos .xlsx, Excel muestra un mensaje de error indicando que el archivo está dañado.",
      category: "Software",
      priority: "Media",
      createdAt: new Date("2025-05-03T09:10:00"),
      openingTime: new Date("2025-05-03T09:30:00"),
      closingTime: new Date("2025-05-03T10:20:00"),
      assignedTo: "Carlos Sánchez",
      status: "Cerrado",
      resolution: "Se usó la herramienta de recuperación de archivos integrada en Excel. Además, se desactivó el modo de vista protegida que causaba el bloqueo de archivos legítimos."
    }
  ]

  constructor() {}

  // Obtener todos los incidentes
  getIncidents(): Incident[] {
    return [...this.incidents];
  }

  // Obtener un incidente por ID
  getIncidentById(id: number): Incident | undefined {
    return this.incidents.find(incident => incident.id === id);
  }

  // Agregar un nuevo incidente
  addIncident(incident: Incident): void {
    // Generar ID automáticamente
    const maxId = this.incidents.length > 0 ? Math.max(...this.incidents.map(i => i.id)) : 0;
    incident.id = maxId + 1;
    this.incidents.push(incident);
  }

  // Actualizar un incidente existente
  updateIncident(updatedIncident: Incident): boolean {
    const index = this.incidents.findIndex(incident => incident.id === updatedIncident.id);
    if (index !== -1) {
      // Mantener las fechas de creación y apertura si ya existen
      const originalIncident = this.incidents[index];
      updatedIncident.createdAt = originalIncident.createdAt;
      
      // Si el estado cambia a "En progreso" y no tiene openingTime, establecerlo
      if (updatedIncident.status === "En progreso" && !originalIncident.openingTime) {
        updatedIncident.openingTime = new Date();
      }
      
      // Si el estado cambia a "Cerrado" y no tiene closingTime, establecerlo
      if (updatedIncident.status === "Cerrado" && !originalIncident.closingTime) {
        updatedIncident.closingTime = new Date();
      }
      
      this.incidents[index] = updatedIncident;
      return true;
    }
    return false;
  }

  // Eliminar un incidente
  deleteIncident(id: number): boolean {
    const index = this.incidents.findIndex(incident => incident.id === id);
    if (index !== -1) {
      this.incidents.splice(index, 1);
      return true;
    }
    return false;
  }

  // Filtrar incidentes por estado
  getIncidentsByStatus(status: string): Incident[] {
    return this.incidents.filter(incident => incident.status === status);
  }

  // Filtrar incidentes por prioridad
  getIncidentsByPriority(priority: string): Incident[] {
    return this.incidents.filter(incident => incident.priority === priority);
  }

  // Obtener estadísticas de incidentes
  getIncidentStats(): any {
    const total = this.incidents.length;
    const abiertos = this.incidents.filter(i => i.status === "Abierto").length;
    const enProgreso = this.incidents.filter(i => i.status === "En progreso").length;
    const cerrados = this.incidents.filter(i => i.status === "Cerrado").length;
    
    return {
      total,
      abiertos,
      enProgreso,
      cerrados
    };
  }
}