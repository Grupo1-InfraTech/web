import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: ''
  };
  confirmPassword = '';

  onSubmit() {
    if (this.user.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    console.log('Usuario registrado:', this.user);
    // Implementar lógica de registro
    alert('Cuenta registrada');
    
    // Resetear el formulario después del registro exitoso
    this.user = {
      name: '',
      email: '',
      password: ''
    };
    this.confirmPassword = '';
  }
}