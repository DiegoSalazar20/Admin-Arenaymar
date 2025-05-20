import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administrartemporadas',
  imports: [
    CommonModule,
    HttpClientModule,
    MenuadminComponent,
    FormsModule
  ],
  templateUrl: './administrartemporadas.component.html',
  styleUrl: './administrartemporadas.component.scss'
})
export class AdministrartemporadasComponent {
  temporadas: any[] = [];
  cargando = true;
  cargandoAccion=false;
  error = '';

  mostrarModal = false;
  cerrandoModal = false;
  modoEdicion = false;

  mostrarNotificacion = false;
  cerrandoNotificacion = false;

  tituloNotificacion = '';
  mensajeNotificacion = '';

  mostrarConfirmacion = false;
  cerrandoConfirmacion = false;

  tituloConfirmacion = '';
  mensajeConfirmacion = '';
  temporadaSeleccionada: any = null;

  temporada = {
    idTemporada: null,
    nombre_temporada: '',
    fecha_inicio: '',
    fecha_final: '',
    descuento: 0
  };

  mensajeErrorModal = '';

  private apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Temporada';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.cargarTemporadas();
  }

  abrirFormularioNuevaTemporada() {
    this.modoEdicion = false;
    this.temporada = {
      idTemporada: null,
      nombre_temporada: '',
      fecha_inicio: '',
      fecha_final: '',
      descuento: 0
    };
    this.mostrarModal = true;
  }

  editarTemporada(t: any) {
    this.modoEdicion = true;

    this.temporada = {
      idTemporada: t.idTemporada,
      nombre_temporada: t.nombre_temporada,
      fecha_inicio: this.formatearFecha(t.fecha_inicio),
      fecha_final: this.formatearFecha(t.fecha_final),
      descuento: t.descuento
    };

    this.mostrarModal = true;
  }

  cerrarModal() {
    this.cerrandoModal = true;
  }

  onAnimationEnd(tipo: 'modal' | 'Notificacion' | 'Confirmacion') {
    if (tipo === 'modal' && this.cerrandoModal) {
      this.mostrarModal = false;
      this.cerrandoModal = false;
    }

    if (tipo === 'Notificacion' && this.cerrandoNotificacion) {
      this.mostrarNotificacion = false;
      this.cerrandoNotificacion = false;
    }

    if (tipo === 'Confirmacion' && this.cerrandoConfirmacion) {
      this.mostrarConfirmacion = false;
      this.cerrandoConfirmacion = false;
    }
  }

  actualizarTemporada() {
    this.cargandoAccion=true;
    const datos = {
      idTemporada: this.temporada.idTemporada,
      nombre_temporada: this.temporada.nombre_temporada,
      fecha_inicio: this.temporada.fecha_inicio,
      fecha_final: this.temporada.fecha_final,
      descuento: this.temporada.descuento
    };

    this.http.put(this.apiUrl, datos).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargandoAccion=false;
        this.abrirModalNotificacion('Temporada actualizada', 'Los datos de la temporada fueron actualizados con éxito.');
        this.cargarTemporadas();
      },
      error: (error) => {
        console.error(error);
        this.cargandoAccion=false;
        this.abrirModalNotificacion('Erro al actualizar la temporada', 'Ocurrió un error al actualizar los datos de la temporada.');
        this.mensajeErrorModal = 'Error al actualizar la temporada.';
      }
    });
  }

  registrarTemporada() {
    this.cargandoAccion=true;
    if (!this.temporada.nombre_temporada || !this.temporada.fecha_inicio || !this.temporada.fecha_final) {
      this.mensajeErrorModal = 'Todos los campos son obligatorios.';
      this.cargandoAccion=false;
      return;
    }

    const datos = {
      idTemporada: 0,
      nombre_temporada: this.temporada.nombre_temporada,
      fecha_inicio: this.temporada.fecha_inicio,
      fecha_final: this.temporada.fecha_final,
      descuento: this.temporada.descuento
    };

    this.http.post(this.apiUrl, datos).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargandoAccion=false;
        this.abrirModalNotificacion('Temporada registrada', 'La nueva temporada fue actualizada con éxito.');
        this.cargarTemporadas();
      },
      error: (error) => {
        console.error(error);
        this.cargandoAccion=false;
        this.abrirModalNotificacion('Error al registrar la temporada', 'Ocurrió un error al registrar la temporada.');
        this.mensajeErrorModal = 'Error al registrar la temporada.';
      }
    });
  }

  confirmarEliminarTemporada() {
  const url = `${this.apiUrl}/${this.temporadaSeleccionada.idTemporada}`;

  this.http.delete(url).subscribe({
    next: () => {
      this.cerrarModalConfirmacion();
      this.abrirModalNotificacion('Temporada eliminada', 'La temporada fue eliminada con éxito.');
      this.cargarTemporadas();
    },
    error: (error) => {
      console.error(error);
      this.cerrarModalConfirmacion();
      this.abrirModalNotificacion('Error al eliminar la temporada', 'Ocurrió un error al intentar eliminar la temporada.');
    }
  });
}


  eliminarTemporada(temporada: any) {
    this.abrirModalConfirmacion(
      '¿Está seguro?',
      `¿Desea eliminar la temporada "${temporada.nombre_temporada}"?`,
      temporada
    );
  }

  cargarTemporadas() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => {
        this.temporadas = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.abrirModalNotificacion('Error al cargar las temporadas', 'Ocurrió un error al cargar todas las temporadas.');
        this.cargando = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    return fecha.split('T')[0];
  }

  cerrarModalNotificacion() {
    this.cerrandoNotificacion = true;
  }

  abrirModalNotificacion(titulo: string, mensaje: string) {
    this.tituloNotificacion = titulo;
    this.mensajeNotificacion = mensaje;
    this.mostrarNotificacion = true;
  }

  abrirModalConfirmacion(titulo: string, mensaje: string, temporada: any) {
    this.tituloConfirmacion = titulo;
    this.mensajeConfirmacion = mensaje;
    this.temporadaSeleccionada = temporada;
    this.mostrarConfirmacion = true;
  }

  cerrarModalConfirmacion() {
    this.cerrandoConfirmacion=true;
    this.temporadaSeleccionada = null;
  }


}
