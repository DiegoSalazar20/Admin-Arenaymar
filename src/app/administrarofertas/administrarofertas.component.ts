import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administrarofertas',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MenuadminComponent,
    FormsModule
  ],
  templateUrl: './administrarofertas.component.html',
  styleUrl: './administrarofertas.component.scss'
})
export class AdministrarofertasComponent implements OnInit {
  ofertas: any[] = [];
  tiposHabitacion: any[] = [];

  oferta = {
    idOferta: null,
    nombre_Oferta: '',
    fecha_inicio: '',
    fecha_final: '',
    descuento: 0,
    idTipoHabitacion: ''
  };

  ofertaSeleccionada: any = null;
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

  cargando = true;
  cargandoAccion = false;
  mensajeErrorModal = '';

  private apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Ofertas';
  private tipoHabUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/TipoHabitacion/ObtenerOfertas';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarOfertas();
    this.cargarTiposHabitacion();
  }
  validarTexto(event: KeyboardEvent) {
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]$/;
    const inputChar = String.fromCharCode(event.keyCode);
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }

  validarNumeros(event: KeyboardEvent) {
    const regex = /^[0-9-]$/;
    const inputChar = String.fromCharCode(event.keyCode);
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }


  cargarOfertas() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => {
        this.ofertas = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.abrirModalNotificacion('Error al cargar ofertas', 'Ocurrió un error al cargar las ofertas.');
        this.cargando = false;
      }
    });
  }

  cargarTiposHabitacion() {
    this.http.get<any[]>(this.tipoHabUrl).subscribe({
      next: data => this.tiposHabitacion = data,
      error: err => console.error('Error al cargar tipos de habitación:', err)
    });
  }

  abrirFormularioNuevaOferta() {
    this.modoEdicion = false;
    this.oferta = {
      idOferta: null,
      nombre_Oferta: '',
      fecha_inicio: '',
      fecha_final: '',
      descuento: 0,
      idTipoHabitacion: ''
    };
    this.mostrarModal = true;
  }

  editarOferta(o: any) {
    this.modoEdicion = true;
    this.oferta = {
      idOferta: o.idOferta,
      nombre_Oferta: o.nombre_Oferta,
      fecha_inicio: this.formatearFecha(o.fecha_inicio),
      fecha_final: this.formatearFecha(o.fecha_final),
      descuento: o.descuento,
      idTipoHabitacion: o.idTipoHabitacion
    };
    this.mostrarModal = true;
  }

  registrarOferta() {
    const errores: string[] = [];
    this.mensajeErrorModal = '';

    const regexSinCaracteresEspeciales = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,:;()\-_%\s/]+$/;
    const desc = Number(this.oferta.descuento);

    if (!this.oferta.nombre_Oferta?.trim()) {
      errores.push('El campo "Nombre" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.oferta.nombre_Oferta)) {
      errores.push('El campo "Nombre" tiene caracteres no permitidos.');
    }

    if (!this.oferta.fecha_inicio?.trim()) {
      errores.push('Debe seleccionar una fecha de inicio.');
    }

    if (!this.oferta.fecha_final?.trim()) {
      errores.push('Debe seleccionar una fecha final.');
    }

    if (this.oferta.fecha_inicio && this.oferta.fecha_final) {
      const fechaInicio = new Date(this.oferta.fecha_inicio);
      const fechaFinal = new Date(this.oferta.fecha_final);
      if (fechaInicio > fechaFinal) {
        errores.push('La fecha de inicio no puede ser posterior a la fecha final.');
      }
    }

    if (!this.oferta.idTipoHabitacion?.toString().trim()) {
      errores.push('Debe seleccionar un tipo de habitación.');
    }

    if ( desc < 0 || desc > 100) {
      errores.push('El descuento debe estar entre -100 y 100.');
    }

    if(desc==0){
      errores.push('El descuento no puede ser 0 ni estar vacío.');
    }

    if (errores.length > 0) {
      this.mensajeErrorModal = errores.join('\n');
      return;
    }

    this.cargandoAccion = true;

    this.cargandoAccion = true;

    if (isNaN(desc) || desc < -100 || desc > 100) {
      this.mensajeErrorModal = 'El descuento debe estar entre -100 y 100.';
      this.cargandoAccion = false;
      return;
    }

    const datos = {
      ...this.oferta,
      fecha_inicio: new Date(this.oferta.fecha_inicio + 'T00:00:00').toISOString(),
      fecha_final: new Date(this.oferta.fecha_final + 'T00:00:00').toISOString(),
      idTipoHabitacion: Number(this.oferta.idTipoHabitacion),
      descuento: desc,
      idOferta: 0
    };

    this.http.post(this.apiUrl, datos).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarOfertas();
        this.cargandoAccion = false;
        this.abrirModalNotificacion('Oferta registrada', 'La oferta fue creada con éxito.');
      },
      error: err => {
        console.error('Error al registrar:', err.error);
        this.mensajeErrorModal = 'Error al registrar la oferta.';
        this.cargandoAccion = false;
      }
    });
  }


  actualizarOferta() {
    const errores: string[] = [];
    this.mensajeErrorModal = '';

    const regexSinCaracteresEspeciales = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,:;()\-_\s/]+$/;
    const desc = Number(this.oferta.descuento);

    if (!this.oferta.nombre_Oferta?.trim()) {
      errores.push('El campo "Nombre" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.oferta.nombre_Oferta)) {
      errores.push('El campo "Nombre" tiene caracteres no permitidos.');
    }

    if (!this.oferta.fecha_inicio?.trim()) {
      errores.push('Debe seleccionar una fecha de inicio.');
    }

    if (!this.oferta.fecha_final?.trim()) {
      errores.push('Debe seleccionar una fecha final.');
    }

    if (this.oferta.fecha_inicio && this.oferta.fecha_final) {
      const fechaInicio = new Date(this.oferta.fecha_inicio);
      const fechaFinal = new Date(this.oferta.fecha_final);
      if (fechaInicio > fechaFinal) {
        errores.push('La fecha de inicio no puede ser posterior a la fecha final.');
      }
    }

    if (!this.oferta.idTipoHabitacion?.toString().trim()) {
      errores.push('Debe seleccionar un tipo de habitación.');
    }

    if ( desc < 0 || desc > 100) {
      errores.push('El descuento debe estar entre -100 y 100.');
    }

    if(this.oferta.descuento==0){
      errores.push('El descuento no puede ser 0 ni estar vacío.');
    }

    if (errores.length > 0) {
      this.mensajeErrorModal = errores.join('\n');
      return;
    }

    this.cargandoAccion = true;

    const datos = {
      ...this.oferta,
      fecha_inicio: new Date(this.oferta.fecha_inicio + 'T00:00:00').toISOString(),
      fecha_final: new Date(this.oferta.fecha_final + 'T00:00:00').toISOString(),
      idTipoHabitacion: Number(this.oferta.idTipoHabitacion),
      descuento: desc
    };

    this.http.put(this.apiUrl, datos).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarOfertas();
        this.cargandoAccion = false;
        this.abrirModalNotificacion('Oferta actualizada', 'La oferta fue actualizada con éxito.');
      },
      error: err => {
        console.error(err);
        this.mensajeErrorModal = 'Error al actualizar la oferta.';
        this.cargandoAccion = false;
      }
    });
  }


  eliminarOferta(oferta: any) {
    this.ofertaSeleccionada = oferta;
    this.abrirModalConfirmacion(
      '¿Estás seguro?',
      `¿Desea eliminar la oferta "${oferta.nombre_Oferta}"?`
    );
  }

  confirmarEliminarOferta() {
    const url = `${this.apiUrl}/${this.ofertaSeleccionada.idOferta}`;
    this.http.delete(url).subscribe({
      next: () => {
        this.cerrarModalConfirmacion();
        this.cargarOfertas();
        this.abrirModalNotificacion('Oferta eliminada', 'La oferta fue eliminada con éxito.');
      },
      error: err => {
        console.error(err);
        this.cerrarModalConfirmacion();
        this.abrirModalNotificacion('Error', 'No se pudo eliminar la oferta.');
      }
    });
  }

  cerrarModal() {
    this.cerrandoModal = true;
  }

  cerrarModalNotificacion() {
    this.cerrandoNotificacion = true;
  }

  cerrarModalConfirmacion() {
    this.cerrandoConfirmacion = true;
    this.ofertaSeleccionada = null;
  }

  abrirModalNotificacion(titulo: string, mensaje: string) {
    this.tituloNotificacion = titulo;
    this.mensajeNotificacion = mensaje;
    this.mostrarNotificacion = true;
  }

  abrirModalConfirmacion(titulo: string, mensaje: string) {
    this.tituloConfirmacion = titulo;
    this.mensajeConfirmacion = mensaje;
    this.mostrarConfirmacion = true;
  }

  onAnimationEnd(tipo: 'modal' | 'Notificacion' | 'Confirmacion') {
    if (tipo === 'modal') {
      this.mostrarModal = false;
      this.cerrandoModal = false;
    } else if (tipo === 'Notificacion') {
      this.mostrarNotificacion = false;
      this.cerrandoNotificacion = false;
    } else if (tipo === 'Confirmacion') {
      this.mostrarConfirmacion = false;
      this.cerrandoConfirmacion = false;
    }
  }

  formatearFecha(fecha: string): string {
    return fecha.split('T')[0];
  }
}
