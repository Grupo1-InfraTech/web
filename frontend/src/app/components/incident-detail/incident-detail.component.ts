import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentService } from '../../services/incident.service';
import { Incident } from '../../models/incident.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incident-detail.component.html',
  styleUrls: ['./incident-detail.component.css']
})
export class IncidentDetailComponent implements OnInit {
  technicians: string[] = ['Carlos Sánchez', 'Eduardo Rojas', 'Camila Campos'];
  incident: Incident | null = null;
  incidents: Incident[] = [];
  isLoading = false;
  isSaving = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.loadAllIncidents();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.loadIncident(id);
    } else {
      alert('ID de incidente no válido');
    }
  }

  loadAllIncidents(): void {
    this.isLoading = true;
    this.incidentService.getIncidents().subscribe({
      next: (incidents) => {
        this.incidents = incidents;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar incidentes:', error);
        this.incidents = [];
        this.isLoading = false;
        alert('Error al cargar la lista de incidentes');
      }
    });
  }

  loadIncident(id: number): void {
    this.isLoading = true;
    this.incidentService.getIncidents().subscribe({
      next: (incidents) => {
        const found = incidents.find((i: Incident) => i.id === id);
        if (found) {
          this.incident = found;
        } else {
          alert(`Incidente con ID ${id} no encontrado`);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar incidente:', error);
        alert('Error al cargar el incidente');
        this.isLoading = false;
      }
    });
  }

  // Método para cambiar el incidente seleccionado desde el dropdown
  onIncidentChange(): void {
    // Este método se ejecuta automáticamente cuando cambia el ngModel
    // No necesita lógica adicional ya que el binding se encarga de actualizar la variable
  }

  saveChanges(): void {
    if (!this.incident || this.isSaving) return;

    this.isSaving = true;
    this.incidentService.updateIncident(this.incident).subscribe({
      next: (updatedIncident) => {
        this.incident = updatedIncident;
        alert('Cambios guardados exitosamente');
        // Actualizar la lista de incidentes
        this.loadAllIncidents();
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error al guardar:', error);
        alert('Error al guardar los cambios');
        this.isSaving = false;
      }
    });
  }

  generateReport(): void {
    if (!this.incident) return;

    try {
      const doc = new jsPDF();
      const primaryColor: [number, number, number] = [26, 115, 232];
      const textColor: [number, number, number] = [51, 51, 51];

      // Header
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18).setFont('helvetica', 'bold');
      doc.text('INFORME DE INCIDENTE', 105, 12, { align: 'center' });
      doc.setFontSize(10).setFont('helvetica', 'normal');
      doc.text('InfraTech S.A', 105, 20, { align: 'center' });

      // Info columns
      let y = 35;
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(12).setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN DEL INCIDENTE', 20, y);
      y += 8;

      doc.setFontSize(9).setFont('helvetica', 'normal');

      const leftData = [
        { label: 'ID:', value: `#${this.incident.id}` },
        { label: 'Estado:', value: this.incident.status ?? 'N/A' },
        { label: 'Prioridad:', value: this.incident.priority ?? 'N/A' },
        { label: 'Responsable:', value: this.incident.assignedTo ?? 'Sin asignar' },
        { label: 'Fecha Creación:', value: this.formatDate(this.incident.createdAt) }
      ];

      const rightData = [
        { label: 'Categoría:', value: this.incident.category ?? 'N/A' },
        { label: 'Fecha Apertura:', value: this.formatDate(this.incident.openingTime) },
        { label: 'Fecha Cierre:', value: this.formatDate(this.incident.closingTime) },
        { label: 'Fecha Informe:', value: this.formatDate(new Date()) },
        { label: '', value: '' }
      ];

      // Columnas
      leftData.forEach((item, i) => {
        doc.setFont('helvetica', 'bold').text(item.label, 20, 43 + i * 8);
        doc.setFont('helvetica', 'normal').text(item.value, 55, 43 + i * 8);
      });

      rightData.forEach((item, i) => {
        if (item.label) {
          doc.setFont('helvetica', 'bold').text(item.label, 110, 43 + i * 8);
          doc.setFont('helvetica', 'normal').text(item.value, 145, 43 + i * 8);
        }
      });

      // Título y descripción
      y = 85;
      doc.setFontSize(10).setFont('helvetica', 'bold').text('TÍTULO:', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal').setFontSize(9);
      const titleLines = doc.splitTextToSize(this.incident.title ?? 'Sin título', 170);
      doc.text(titleLines, 20, y);
      y += titleLines.length * 5 + 8;

      doc.setFont('helvetica', 'bold').text('DESCRIPCIÓN:', 20, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(this.incident.description ?? 'Sin descripción', 170);
      doc.text(descLines.slice(0, 6), 20, y);
      y += Math.min(6, descLines.length) * 5 + 8;

      if (this.incident.resolution) {
        doc.setFont('helvetica', 'bold').text('RESOLUCIÓN/COMENTARIOS:', 20, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        const resLines = doc.splitTextToSize(this.incident.resolution, 170);
        doc.text(resLines.slice(0, 8), 20, y);
      }

      doc.setFontSize(8).setTextColor(100);
      doc.text(`Generado el ${this.formatDateTime(new Date())}`, 105, 280, { align: 'center' });

      const fileName = `Informe_Incidente_${this.incident.id}_${this.formatDateForFile(new Date())}.pdf`;
      doc.save(fileName);

      alert('Informe PDF generado');
    } catch (error) {
      console.error('Error al generar el informe:', error);
      alert('Error al generar el informe PDF');
    }
  }

  private formatDate(date: Date | string | null): string {
    if (!date) return 'No especificado';
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  }

  private formatDateTime(date: Date): string {
    return this.formatDate(date);
  }

  private formatDateForFile(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '');
  }

  goBack(): void {
    this.router.navigate(['/Lista-Incidente']);
  }
}
