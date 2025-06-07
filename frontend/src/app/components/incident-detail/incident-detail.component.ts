import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
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
  technicians: string[] = [
    'Carlos Sánchez',
    'Eduardo Rojas',
    'Camila Campos'
  ];

  incidents: Incident[] = [];
  incident: Incident | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    try {
      this.incidents = this.incidentService.getIncidents();
      console.log('Incidentes cargados:', this.incidents);
      
      if (this.incidents.length > 0) {
        this.incident = this.incidents[0];
      }
    } catch (error) {
      console.error('Error al cargar incidentes:', error);
      alert('Error al cargar los incidentes');
    }
  }

  saveChanges(): void {
    if (!this.incident) {
      alert('No hay incidente seleccionado');
      return;
    }

    try {
      const success = this.incidentService.updateIncident(this.incident);
      if (success) {
        alert('Se guardaron los cambios exitosamente');
        this.loadIncidents(); // Recargar para ver cambios
      } else {
        alert('Error al guardar los cambios');
      }
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Error al guardar los cambios');
    }
  }

  generateReport(): void {
    if (!this.incident) {
      alert('No hay incidente seleccionado para generar el informe');
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Configuración de colores
      const primaryColor = [26, 115, 232];
      const textColor = [51, 51, 51];

      // Encabezado más compacto
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 25, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORME DE INCIDENTE', 105, 12, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('InfraTech S.A', 105, 20, { align: 'center' });

      // Información del incidente en formato compacto
      let yPosition = 35;
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN DEL INCIDENTE', 20, yPosition);

      yPosition += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      // Datos del incidente en dos columnas
      const leftColumnData = [
        { label: 'ID:', value: `#${this.incident.id}` },
        { label: 'Estado:', value: this.incident.status || 'N/A' },
        { label: 'Prioridad:', value: this.incident.priority || 'N/A' },
        { label: 'Responsable:', value: this.incident.assignedTo || 'Sin asignar' },
        { label: 'Fecha Creación:', value: this.formatDateCompact(this.incident.createdAt) }
      ];

      const rightColumnData = [
        { label: 'Categoría:', value: this.incident.category || 'N/A' },
        { label: 'Fecha Apertura:', value: this.incident.openingTime ? this.formatDateCompact(this.incident.openingTime) : 'No especificado' },
        { label: 'Fecha Cierre:', value: this.incident.closingTime ? this.formatDateCompact(this.incident.closingTime) : 'No cerrado' },
        { label: 'Fecha Informe:', value: this.formatDateCompact(new Date()) },
        { label: '', value: '' } // Espacio vacío
      ];

      // Columna izquierda
      leftColumnData.forEach((item, index) => {
        doc.setFont('helvetica', 'bold');
        doc.text(item.label, 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(item.value, 55, yPosition);
        yPosition += 8;
      });

      // Columna derecha
      yPosition = 43; // Reset para columna derecha
      rightColumnData.forEach((item, index) => {
        if (item.label) {
          doc.setFont('helvetica', 'bold');
          doc.text(item.label, 110, yPosition);
          doc.setFont('helvetica', 'normal');
          doc.text(item.value, 145, yPosition);
        }
        yPosition += 8;
      });

      // Título del incidente
      yPosition = 85;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('TÍTULO:', 20, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const titleLines = doc.splitTextToSize(this.incident.title || 'Sin título', 170);
      doc.text(titleLines, 20, yPosition);
      yPosition += titleLines.length * 5 + 8;

      // Descripción compacta
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('DESCRIPCIÓN:', 20, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      const description = this.incident.description || 'Sin descripción';
      const descriptionLines = doc.splitTextToSize(description, 170);
      // Limitar descripción a máximo 6 líneas
      const limitedDescriptionLines = descriptionLines.slice(0, 6);
      doc.text(limitedDescriptionLines, 20, yPosition);
      yPosition += limitedDescriptionLines.length * 5 + 8;

      // Resolución/Comentarios compacta
      if (this.incident.resolution && this.incident.resolution.trim()) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('RESOLUCIÓN/COMENTARIOS:', 20, yPosition);
        yPosition += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const resolutionLines = doc.splitTextToSize(this.incident.resolution, 170);
        // Limitar resolución a máximo 8 líneas
        const limitedResolutionLines = resolutionLines.slice(0, 8);
        doc.text(limitedResolutionLines, 20, yPosition);
        yPosition += limitedResolutionLines.length * 5;
      }

      // Pie de página compacto
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generado el ${this.formatDateTime(new Date())}`,
        105,
        280,
        { align: 'center' }
      );

      // Guardar el PDF
      const fileName = `Informe_Incidente_${this.incident.id}_${this.formatDateForFile(new Date())}.pdf`;
      doc.save(fileName);

      alert('Informe PDF generado exitosamente');

    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Error al generar el informe PDF. Revisa la consola para más detalles.');
    }
  }

  // Agregar este método para formato de fecha más compacto
  private formatDateCompact(date: Date | null): string {
    if (!date) return 'No especificado';
    try {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  private formatDate(date: Date | null): string {
    if (!date) return 'No especificado';
    try {
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  private formatDateTime(date: Date): string {
    if (!date) return 'Fecha no disponible';
    try {
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  }

  private formatDateForFile(date: Date): string {
    if (!date) return 'fecha_invalida';
    try {
      return date.toISOString().split('T')[0].replace(/-/g, '');
    } catch (error) {
      return 'fecha_invalida';
    }
  }

  goBack(): void {
    this.router.navigate(['/Lista-Incidente']);
  }
}