import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type Prioridad = 'Alta' | 'Media' | 'Baja' | '';

interface Incident {
  createdAt: string;
  category: string;
  prioridad: Prioridad;
  title: string;
  descripcion: string;
}

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.css']
})
export class IncidentFormComponent {
  incident: Incident = {
    createdAt: '',
    category: '',
    prioridad: '', 
    title: '',
    descripcion: '',
  };

  fechaOpcion: string = '';
  fechaManual: string = '';
  fechaActual: string = '';

  onFechaOpcionChange() {
    if (this.fechaOpcion === 'automatica') {
      this.fechaActual = new Date().toLocaleString('es-ES');
    }
  }

  onSubmit() {
    // Establecer la fecha según la opción seleccionada
    if (this.fechaOpcion === 'automatica') {
      this.incident.createdAt = new Date().toISOString();
    } else if (this.fechaOpcion === 'manual' && this.fechaManual) {
      this.incident.createdAt = new Date(this.fechaManual).toISOString();
    }
    
    console.log('Incidente enviado:', this.incident);
    
    const fechaEnvio = new Date().toLocaleString('es-ES');
    if (this.fechaOpcion === 'automatica') {
      alert(`Incidente enviado automáticamente el ${fechaEnvio}`);
    } else {
      alert(`Incidente enviado el ${fechaEnvio} con fecha de incidente: ${new Date(this.fechaManual).toLocaleDateString('es-ES')}`);
    }

    // Restablecer el formulario
    this.incident = {
      createdAt: '',
      category: '',
      prioridad: '',
      title: '',
      descripcion: '',
    };
    this.fechaOpcion = '';
    this.fechaManual = '';
    this.fechaActual = '';
  }
}