import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule], 
  templateUrl: './iniciosesionempleado.component.html',
  styleUrls: ['./iniciosesionempleado.component.scss']
})
export class IniciosesionempleadoComponent {
  nombreUsuario: string = '';
  contrasena: string = '';
  mensajeError: string | null = null;
  
  apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Administrador/login';

  constructor(private router: Router, private http: HttpClient) {}

  async iniciarSesion(): Promise<void> {
    this.mensajeError = null;
 
    const datosLogin = {
      nombreUsuario: this.nombreUsuario,
      contrasena: this.contrasena
    };

    this.http.post<any>(this.apiUrl, datosLogin).subscribe({
      next: res => {
        if (res && res.token && res.estado !== undefined) {
          if (res.estado) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('Nombre', res.nombre);
            this.router.navigate(['/homeadmin']);
          } else {
            this.mensajeError = 'Usuario deshabilitado';
          }
        } else {
          this.mensajeError = 'Usuario y contraseña no coinciden';
        }
      },
      error: err => {
        console.error(err);
        this.mensajeError = 'Usuario y contraseña no coinciden';
      }
    });

  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
