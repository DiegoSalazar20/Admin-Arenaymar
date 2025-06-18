import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-actualizarpublicidad',
  imports: [CommonModule,
    HttpClientModule,
    MenuadminComponent,
    FormsModule],
  templateUrl: './actualizarpublicidad.component.html',
  styleUrl: './actualizarpublicidad.component.scss'
})
export class ActualizarpublicidadComponent {
  publicidades: any[] = [];
  tiposHabitacion: any[] = [];

  publicidad = {
    id: 0,
    nombre: '',
    descripcion: '',
    urlImagen: '',
    urlDestino: '',
    visible: true
  };

  publicidadSeleccionada: any = null;
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

  apiUrlImgBB = 'https://api.imgbb.com/1/upload';
  apiKeyImgBB = '3c639960d9b0b9276d0d0cc19b1e2319';

  imagenParaSubir: Blob | null = null;

  private apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Publicidad';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarPublicidades();
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


  cargarPublicidades() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => {
        this.publicidades = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.abrirModalNotificacion('Error al cargar publicidades', 'Ocurrió un error al cargar las publicidades.');
        this.cargando = false;
      }
    });
  }

  abrirFormularioNuevaOferta() {
    this.mensajeErrorModal='';
    this.modoEdicion = false;
    this.publicidad = {
      id: 0,
      nombre: '',
      descripcion: '',
      urlImagen: '',
      urlDestino: '',
      visible: true
    };
    this.mostrarModal = true;
  }

  editarOferta(o: any) {
    this.mensajeErrorModal='';
    this.modoEdicion = true;
    this.publicidad = {
      id: o.id,
      nombre: o.nombre,
      descripcion: o.descripcion,
      urlImagen: o.urlImagen,
      urlDestino: o.urlDestino,
      visible: o.visible
    };
    this.mostrarModal = true;
  }

  registrarPublicidad() {

    const errores: string[] = [];
    this.mensajeErrorModal = '';
    const regexSinCaracteresEspeciales = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,:;()\-_\s/]+$/;
    const regexURL = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;

    if (!this.publicidad.nombre?.trim()) {
      errores.push('El campo "Nombre" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.publicidad.nombre)) {
      errores.push('El campo "Nombre" tiene caracteres no permitidos.');
    }

    if (!this.publicidad.descripcion?.trim()) {
      errores.push('El campo "Descripción" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.publicidad.descripcion)) {
      errores.push('El campo "Descripción" tiene caracteres no permitidos.');
    }

    if (!this.publicidad.urlDestino?.trim()) {
      errores.push('El campo "URL destino" no puede estar vacío.');
    } else if (!regexURL.test(this.publicidad.urlDestino)) {
      errores.push('El campo "URL destino" no tiene un formato válido.');
    }

    if (!this.imagenParaSubir) {
      errores.push('Debe seleccionar una imagen para la publicidad.');
    }

    if (errores.length > 0) {
      this.mensajeErrorModal = errores.join('\n');
      return;
    }

    this.cargandoAccion = true;

    const formData = new FormData();
    formData.append('image', this.imagenParaSubir!);

    this.http.post<any>(`${this.apiUrlImgBB}?key=${this.apiKeyImgBB}`, formData).subscribe({
      next: (response) => {
        const urlImagenSubida = response.data.url;

        const datos = {
          ...this.publicidad,
          urlImagen: urlImagenSubida
        };

        this.http.post(this.apiUrl, datos).subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarPublicidades();
            this.cargandoAccion = false;
            this.abrirModalNotificacion('Publicidad registrada', 'La publicidad fue registrada con éxito.');
          },
          error: err => {
            console.error('Error al registrar:', err.error);
            this.mensajeErrorModal = 'Error al registrar la publicidad.';
            this.cargandoAccion = false;
          }
        });
      },
      error: err => {
        console.error('Error al subir imagen:', err.error);
        this.mensajeErrorModal = 'No se pudo subir la imagen. Intente de nuevo.';
        this.cargandoAccion = false;
      }
    });
  }


  actualizarOferta() {

    const errores: string[] = [];
    this.mensajeErrorModal = '';
    const regexSinCaracteresEspeciales = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,:;()\-_\s/]+$/;
    const regexURL = /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;

    if (!this.publicidad.nombre?.trim()) {
      errores.push('El campo "Nombre" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.publicidad.nombre)) {
      errores.push('El campo "Nombre" tiene caracteres no permitidos.');
    }

    if (!this.publicidad.descripcion?.trim()) {
      errores.push('El campo "Descripción" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.publicidad.descripcion)) {
      errores.push('El campo "Descripción" tiene caracteres no permitidos.');
    }

    if (!this.publicidad.urlDestino?.trim()) {
      errores.push('El campo "URL destino" no puede estar vacío.');
    } else if (!regexURL.test(this.publicidad.urlDestino)) {
      errores.push('El campo "URL destino" no tiene un formato válido.');
    }

    if (errores.length > 0) {
      this.mensajeErrorModal = errores.join('\n');
      return;
    }

    this.cargandoAccion = true;

    const datos = {
      ...this.publicidad,
    };

    const procesarActualizacion = (imagenUrl: string) => {

      this.http.put(`${this.apiUrl}/Actualizar?idpublicidad=${this.publicidad.id}&nombre=${this.publicidad.nombre}&descripcion=${this.publicidad.descripcion}&urlDestino=${this.publicidad.urlDestino}&urlImagen=${imagenUrl}&visible=${this.publicidad.visible}`, {}, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text'
      }).subscribe({
        next: () => {
          this.abrirModalNotificacion('Datos actualizados', 'Los datos de la publicidad fueron actualizados con éxito.');
          this.cerrarModal();
          this.cargandoAccion = false;
          this.mostrarNotificacion = true;
          this.cargarPublicidades();
        },
        error: (error) => {
          console.error(error);
          this.mensajeErrorModal = 'No se pudo actualizar la publicidad.';
          this.abrirModalNotificacion('Error al actualizar los datos', 'Ocurrió un error al actualizar los datos de la publicidad.');
          this.cargandoAccion = false;
        }
      });
    };

    if (this.imagenParaSubir) {
      this.subirImagen().subscribe({
        next: (imageResponse: any) => {
          const urlImagenSubida = imageResponse.data.url;
          procesarActualizacion(urlImagenSubida);
        },
        error: (error) => {
          this.abrirModalNotificacion('Error al actualizar los datos', 'Ocurrió un error al subir la imagen, inténtelo de nuevo más tarde.');
          this.cargandoAccion = false;
        }
      });
    } else {
      procesarActualizacion(this.publicidad.urlImagen);
    }
  }


  eliminarOferta(publicidad: any) {
    this.publicidadSeleccionada = publicidad;
    this.abrirModalConfirmacion(
      '¿Estás seguro?',
      `¿Desea deshabilitar la publicidad "${publicidad.nombre}"?`
    );
  }

  habilitarPublicidad(id: number) {
    this.http.put(`${this.apiUrl}/Habilitar?idpublicidad=${id}`, {}, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.abrirModalNotificacion('Datos actualizados', 'La publicidad se ha habilitado con éxito.');
        this.cerrarModal();
        this.cargandoAccion = false;
        this.mostrarNotificacion = true;
        this.cargarPublicidades();
      },
      error: (error) => {
        console.error(error);
        this.mensajeErrorModal = 'No se pudo habilitar la publicidad.';
        this.abrirModalNotificacion('Error al habilitar', 'Ocurrió un error al habilitar la publicidad.');
        this.cargandoAccion = false;
      }
    });
  }

  deshabilitarPublicidad(id: number) {
    this.http.put(`${this.apiUrl}/Deshabilitar?idpublicidad=${id}`, {}, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.abrirModalNotificacion('Datos actualizados', 'La publicidad se ha deshabilitado con éxito.');
        this.cerrarModal();
        this.cargandoAccion = false;
        this.mostrarNotificacion = true;
        this.cargarPublicidades();
      },
      error: (error) => {
        console.error(error);
        this.mensajeErrorModal = 'No se pudo deshabilitar la publicidad.';
        this.abrirModalNotificacion('Error al deshabilitar', 'Ocurrió un error al deshabilitar la publicidad.');
        this.cargandoAccion = false;
      }
    });
  }

  confirmarEliminarOferta() {
    const url = `${this.apiUrl}/${this.publicidadSeleccionada.idOferta}`;
    this.http.delete(url).subscribe({
      next: () => {
        this.cerrarModalConfirmacion();
        this.cargarPublicidades();
        this.abrirModalNotificacion('Oferta eliminada', 'La oferta fue eliminada con éxito.');
      },
      error: err => {
        console.error(err);
        this.cerrarModalConfirmacion();
        this.abrirModalNotificacion('Error', 'No se pudo eliminar la publicidad.');
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
    this.publicidadSeleccionada = null;
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

  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenParaSubir = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.publicidad.urlImagen = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  subirImagen() {
    const formData = new FormData();
    if (this.imagenParaSubir) {
      formData.append('image', this.imagenParaSubir);
    }
    return this.http.post<any>(`${this.apiUrlImgBB}?key=${this.apiKeyImgBB}`, formData);
  }
}
