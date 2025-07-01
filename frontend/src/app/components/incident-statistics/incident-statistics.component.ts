import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { IncidentService } from '../../services/incident.service';
import { Incident } from '../../models/incident.model';

@Component({
  selector: 'app-incident-statistics',
  templateUrl: './incident-statistics.component.html',
  styleUrls: ['./incident-statistics.component.css']
})
export class IncidentStatisticsComponent implements OnInit {
  
  // Propiedades para el dashboard en el orden correcto
  totalIncidents: number = 0;
  resolvedIncidents: number = 0;
  openIncidents: number = 0;
  inProgressIncidents: number = 0;

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.calculateDashboardStats();
    
    // Esperar a que el DOM esté completamente renderizado
    setTimeout(() => {
      this.renderCategoryChart();
      this.renderMonthlyChart();
      this.renderResolutionStatusChart();
    }, 100);
  }

  calculateDashboardStats() {
    const incidents = this.incidentService.getIncidents();
    
    // Total de incidentes
    this.totalIncidents = incidents.length;
    
    // Incidentes resueltos (estado "Cerrado")
    this.resolvedIncidents = incidents.filter(incident => 
      incident.status === 'Cerrado'
    ).length;
    
    // Incidentes abiertos (estado "Abierto")
    this.openIncidents = incidents.filter(incident => 
      incident.status === 'Abierto'
    ).length;
    
    // Incidentes en progreso (estado "En progreso")
    this.inProgressIncidents = incidents.filter(incident => 
      incident.status === 'En progreso'
    ).length;
  }

  renderCategoryChart() {
    const categoryCanvas = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!categoryCanvas) {
      console.error('Canvas categoryChart no encontrado');
      return;
    }

    const incidents = this.incidentService.getIncidents();
    const categoryStats = this.getCategoryStatistics(incidents);
    
    new Chart(categoryCanvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryStats),
        datasets: [
          {
            data: Object.values(categoryStats),
            backgroundColor: [
              '#FF6384', // Hardware - Rosa
              '#36A2EB', // Software - Azul
              '#FFCE56', // Red - Amarillo
              '#4BC0C0', // Otros - Verde agua
              '#FF9F40'  // Adicional - Naranja
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Distribución por Categoría',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  renderMonthlyChart() {
    const monthlyCanvas = document.getElementById('monthlyChart') as HTMLCanvasElement;
    if (!monthlyCanvas) {
      console.error('Canvas monthlyChart no encontrado');
      return;
    }

    const incidents = this.incidentService.getIncidents();
    const monthlyStats = this.getMonthlyStatistics(incidents);
    
    new Chart(monthlyCanvas, {
      type: 'bar',
      data: {
        labels: Object.keys(monthlyStats),
        datasets: [
          {
            label: 'Cantidad de Incidentes',
            data: Object.values(monthlyStats),
            backgroundColor: '#36A2EB',
            borderColor: '#2E8BC0',
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Incidentes por Mes',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: '#e9ecef'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  renderResolutionStatusChart() {
    const statusCanvas = document.getElementById('resolutionChart') as HTMLCanvasElement;
    if (!statusCanvas) {
      console.error('Canvas resolutionChart no encontrado');
      return;
    }

    const incidents = this.incidentService.getIncidents();
    const resolutionStats = this.getResolutionStatistics(incidents);
    
    new Chart(statusCanvas, {
      type: 'bar',
      data: {
        labels: ['Resueltos', 'No Resueltos'],
        datasets: [
          {
            label: 'Número de Incidentes',
            data: [resolutionStats.resolved, resolutionStats.unresolved],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: ['#1e7e34', '#bd2130'],
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Estado de Resolución',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            },
            grid: {
              color: '#e9ecef'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  private getCategoryStatistics(incidents: Incident[]): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    
    incidents.forEach(incident => {
      const category = incident.category;
      stats[category] = (stats[category] || 0) + 1;
    });
    
    return stats;
  }

  private getMonthlyStatistics(incidents: Incident[]): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    incidents.forEach(incident => {
      const month = monthNames[incident.createdAt.getMonth()];
      stats[month] = (stats[month] || 0) + 1;
    });
    
    return stats;
  }

  private getResolutionStatistics(incidents: Incident[]): { resolved: number, unresolved: number } {
    let resolved = 0;
    let unresolved = 0;
    
    incidents.forEach(incident => {
      if (incident.status === 'Cerrado') {
        resolved++;
      } else {
        // "Abierto" y "En progreso" se consideran como no resueltos
        unresolved++;
      }
    });
    
    return { resolved, unresolved };
  }
}