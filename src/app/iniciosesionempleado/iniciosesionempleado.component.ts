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
  
  apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Administrador';

  constructor(private router: Router, private http: HttpClient) {}

  async iniciarSesion(): Promise<void> {
    this.mensajeError = null;
    const cifrada = await this.hashContrasena(this.contrasena);
    const url = `${this.apiUrl}?nombreUsuario=${this.nombreUsuario}&contrasena=${this.contrasena}`;

    this.http.get<any>(url).subscribe({
      next: data => {
        if (data[0] && data[0].idAdministrador) {
          if (data[0].estado) {
            localStorage.setItem('Nombre', data[0].nombre.toString());
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
        
       
      }
    });

  }


  async hashContrasena(contrasena: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(contrasena);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return this.bufferToHex(hashBuffer);
  }

  // Conversión de ArrayBuffer a cadena hexadecimal
  bufferToHex(buffer: ArrayBuffer): string {
    return [...new Uint8Array(buffer)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
