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


}
