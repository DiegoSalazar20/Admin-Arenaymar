import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';

@Component({
  standalone: true,
  selector: 'app-verhotelhoy',
  imports: [
    CommonModule,
    HttpClientModule,    
    MenuadminComponent
  ],
  templateUrl: './verhotelhoy.component.html',
  styleUrls: ['./verhotelhoy.component.scss']
})
export class VerhotelhoyComponent implements OnInit {
  habitaciones: any[] = [];
  cargando = true;
  error = '';
  fechaHoy: string = '';

  private apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Habitacion/VerEstadoHabitacionesHoy';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-CR', { day: 'numeric', month: 'numeric', year: 'numeric'});

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => {
        this.habitaciones = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.error = 'No se pudo cargar el estado de las habitaciones.';
        this.cargando = false;
      }
    });
  }

  imprimir(): void {
    const tabla = document.getElementById('tabla-habitaciones-hoy');
  if (!tabla) return;

  const logoUrl = 'https://i.ibb.co/fYYxbjmG/logo-1.png'; // Cambia por tu logo si deseas
  const fecha = new Date().toLocaleDateString('es-CR');

  const ventana = window.open('', '_blank', 'width=800,height=600');

  if (ventana) {
    ventana.document.write(`
      <html>
        <head>
          <title>Estado de Habitaciones</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #FFFFFF;
              color: #333;
              padding: 40px 30px;
            }

            header {
              display: flex;
              align-items: center;
              gap: 20px;
              border-bottom: 2px solid #ccc;
              margin-bottom: 20px;
              padding-bottom: 10px;
            }

            header img {
              width: 80px;
              height: auto;
            }

            header h2 {
              margin: 0;
              font-size: 22px;
              color: #2c3e50;
            }

            .fecha {
              text-align: right;
              font-size: 14px;
              margin-bottom: 10px;
              color: #555;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            th, td {
              border: 1px solid #ccc;
              padding: 10px;
              text-align: left;
              font-size: 14px;
            }

            th {
              background-color: #3F5B62;
              color: #FFFFFF;
            }

            tr:nth-child(even) td {
              background-color: #f5f5f5;
            }

            tr:hover td {
              background-color: #e0e0e0;
            }
          </style>
        </head>
        <body>
          <header>
            <img src="${logoUrl}" alt="Logo del Hotel" />
            <h2>Estado de habitaciones hoy</h2>
          </header>

          <div class="fecha">Fecha: ${fecha}</div>

          ${tabla.outerHTML}
        </body>
      </html>
    `);

    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();
  }
  }
}
