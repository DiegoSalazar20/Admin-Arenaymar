import { Component } from '@angular/core';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';
import { OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-listadoreservas',
  imports: [MenuadminComponent, CommonModule,
    HttpClientModule, FormsModule],
  templateUrl: './listadoreservas.component.html',
  styleUrl: './listadoreservas.component.scss'
})
export class ListadoreservasComponent implements OnInit {

  reservas: any[] = [];
  cargando = true;
  error = '';

  paginaSeleccionada: string = '';
  mostrarModal: boolean = false;
  cerrandoModal: boolean = false;

  reservaSeleccionada: any = {};
  cargandoAccion: boolean = false;

  mostrarConfirmacion = false;
  cerrandoConfirmacion = false;
  tituloConfirmacion = '';
  mensajeConfirmacion = '';

  mostrarNotificacion = false;
  cerrandoNotificacion = false;
  tituloNotificacion = '';
  mensajeNotificacion = '';

  private apiUrlReservas = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Reserva';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.cargarReservas();
  }

  cargarReservas() {
    this.reservas = [];
    this.http.get<any[]>(this.apiUrlReservas).subscribe({
      next: data => {
        this.reservas = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.error = 'No se pudieron cargar las reservas.';
        this.cargando = false;
      }
    });
  }

  abrirModalConfirmacion(titulo: string, mensaje: string) {
    this.tituloConfirmacion = titulo;
    this.mensajeConfirmacion = mensaje;
    this.mostrarConfirmacion = true;
  }

  eliminarReserva(reserva: any) {
    this.reservaSeleccionada = reserva;
    this.abrirModalConfirmacion(
      '¿Estás seguro?',
      `¿Desea eliminar la oferta "${reserva.IdReserva}"?`
    );
  }

  verReserva(oferta: any) {

  }

  abrirModal(reserva: any) {
    this.reservaSeleccionada = reserva;
    this.mostrarModal = true;
  }

  cerrarModalConfirmacion() {
    if (!this.cerrandoConfirmacion) {
      this.cerrandoConfirmacion = true;

      setTimeout(() => {
        if (this.cerrandoConfirmacion) {
          this.cerrandoConfirmacion = false;
          this.mostrarConfirmacion = false;
        }
      }, 300);
    }
  }

  abrirModalNotificacion(titulo: string, mensaje: string) {
    this.tituloNotificacion = titulo;
    this.mensajeNotificacion = mensaje;
    this.mostrarNotificacion = true;
  }

  confirmarEliminarOferta() {
    const url = `${this.apiUrlReservas}/${this.reservaSeleccionada.IdReserva}`;
    this.http.delete(url).subscribe({
      next: () => {
        this.cerrarModalConfirmacion();
        this.cargarReservas();
        this.abrirModalNotificacion('Reserva eliminada', 'La reserva fue eliminada con éxito.');
      },
      error: err => {
        console.error(err);
        this.cerrarModalConfirmacion();
        this.abrirModalNotificacion('Error', 'No se pudo eliminar la reserva.');
      }
    });
  }

  cerrarModalNotificacion() {
    this.cerrandoNotificacion = true;
  }

  onAnimationEnd(tipo: 'modal' | 'Notificacion' | 'Confirmacion') {
    if (tipo === 'modal') {
      if (this.cerrandoModal) {
        this.cerrandoModal = false;
        this.mostrarModal = false;
      }
    }

    if (tipo === 'Confirmacion') {
      if (this.cerrandoConfirmacion) {
        this.cerrandoConfirmacion = false;
        this.mostrarConfirmacion = false;
      }
    }

    if (tipo === 'Notificacion') {
      if (this.cerrandoNotificacion) {
        this.cerrandoNotificacion = false;
        this.mostrarNotificacion = false;
      }
    }
  }

  cerrarModal() {
    this.cerrandoModal = true;
  }

  imprimirReserva() {
  const contenido = document.querySelector('.editor-contenido.datos-reserva');
  if (!contenido) return;

  const logoUrl = 'https://i.ibb.co/fYYxbjmG/logo-1.png';

  const ventana = window.open('', '_blank', 'width=800,height=600');

  if (ventana) {
    ventana.document.write(`
      <html>
        <head>
          <title>Reserva</title>
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

            section {
              font-size: 14px;
              line-height: 1.5;
            }

            p {
              margin: 8px 0;
            }

            strong {
              color: #000;
            }
          </style>
        </head>
        <body>
          <header>
            <img src="${logoUrl}" alt="Logo del Hotel" />
            <h2>Detalles de la Reserva</h2>
          </header>

          <section>
            ${contenido.innerHTML}
          </section>
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
