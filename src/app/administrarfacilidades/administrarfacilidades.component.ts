import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administrarfacilidades',
  imports: [CommonModule, HttpClientModule, MenuadminComponent, FormsModule],
  templateUrl: './administrarfacilidades.component.html',
  styleUrls: ['./administrarfacilidades.component.scss']
})
export class AdministrarfacilidadesComponent implements OnInit {
  facilidades: any[] = [];

  facilidad = {
    id: 0,
    nombre: '',
    descripcion: '',
    imagen: '',
    visible: true
  };

  facilidadSeleccionada: any = null;
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
  private apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Facilidades';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarFacilidades();
  }

  cargarFacilidades() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => {
        this.facilidades = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.abrirModalNotificacion('Error al cargar facilidades', 'Ocurrió un error al cargar las facilidades.');
        this.cargando = false;
      }
    });
  }


  abrirFormularioNuevaFacilidad() {
    this.mensajeErrorModal='';
    this.modoEdicion = false;
    this.facilidad = { id: 0, nombre: '', descripcion: '', imagen: '', visible: true };
    this.mostrarModal = true;
  }

  editarFacilidad(f: any) {
    this.mensajeErrorModal='';
    this.modoEdicion = true;
    this.facilidad = { id: f.id, nombre: f.nombre, descripcion: f.descripcion, imagen: f.imagen, visible: f.visible };
    this.mostrarModal = true;
  }
  
  registrarFacilidad() {
    const errores: string[] = [];
    this.mensajeErrorModal = '';

    const regexSinCaracteresEspeciales = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,:;()\-_\s/]+$/;

    if (!this.facilidad.nombre?.trim()) {
      errores.push('El campo "Nombre" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.facilidad.nombre)) {
      errores.push('El campo "Nombre" tiene caracteres no permitidos.');
    }

    if (!this.facilidad.descripcion?.trim()) {
      errores.push('El campo "Descripción" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.facilidad.descripcion)) {
      errores.push('El campo "Descripción" tiene caracteres no permitidos.');
    }

    if (!this.imagenParaSubir) {
      errores.push('Debe seleccionar una imagen.');
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
          nombre: this.facilidad.nombre,
          descripcion: this.facilidad.descripcion,
          imagen: urlImagenSubida,
          estado: true
        };

        this.http.post(this.apiUrl, datos).subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarFacilidades();
            this.cargandoAccion = false;
            this.abrirModalNotificacion('Facilidad registrada', 'La facilidad fue registrada con éxito.');
          },
          error: err => {
            console.error('Error al registrar facilidad:', err.error);
            this.mensajeErrorModal = 'Error al registrar la facilidad.';
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


  actualizarFacilidad() {
    const errores: string[] = [];
    this.mensajeErrorModal = '';

    const regexSinCaracteresEspeciales = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,:;()\-_\s/]+$/;

    if (!this.facilidad.nombre?.trim()) {
      errores.push('El campo "Nombre" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.facilidad.nombre)) {
      errores.push('El campo "Nombre" tiene caracteres no permitidos.');
    }

    if (!this.facilidad.descripcion?.trim()) {
      errores.push('El campo "Descripción" no puede estar vacío.');
    } else if (!regexSinCaracteresEspeciales.test(this.facilidad.descripcion)) {
      errores.push('El campo "Descripción" tiene caracteres no permitidos.');
    }

    if (errores.length > 0) {
      this.mensajeErrorModal = errores.join('\n');
      return;
    }

    this.cargandoAccion = true;


    const procesar = (imagenUrl: string) => {
      const url = `${this.apiUrl}/Actualizar?idFacilidad=${this.facilidad.id}&nombre=${this.facilidad.nombre}&imagen=${imagenUrl}&descripcion=${this.facilidad.descripcion}`;
      this.http.put(url, {}, { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }).subscribe({
        next: () => {
          this.abrirModalNotificacion('Facilidad actualizada', 'Los datos de la facilidad fueron actualizados con éxito.');
          this.cerrarModal();
          this.cargandoAccion = false;
          this.cargarFacilidades();
        },
        error: (error) => {
          console.error(error);
          this.mensajeErrorModal = 'No se pudo actualizar la facilidad.';
          this.cargandoAccion = false;
        }
      });
    };
    if (this.imagenParaSubir) {
      this.subirImagen().subscribe({
        next: (res: any) => procesar(res.data.url),
        error: () => {
          this.mensajeErrorModal = 'Error al subir imagen';
          this.cargandoAccion = false;
        }
      });
    } else {
      procesar(this.facilidad.imagen);
    }
  }

  habilitarFacilidad(id: number) {
    this.http.put(`${this.apiUrl}/Habilitar?idFacilidad=${id}`, {}).subscribe({
      next: () => {
        this.abrirModalNotificacion('Facilidad habilitada', 'La facilidad se ha habilitado correctamente.');
        this.cargarFacilidades(); // ¡IMPORTANTE! refrescar los datos
      },
      error: (error) => {
        console.error(error);
        this.abrirModalNotificacion('Error', 'No se pudo habilitar la facilidad.');
      }
    });
  }

  deshabilitarFacilidad(id: number) {
    this.http.put(`${this.apiUrl}/Deshabilitar?idFacilidad=${id}`, {}).subscribe({
      next: () => {
        this.abrirModalNotificacion('Facilidad deshabilitada', 'La facilidad fue deshabilitada correctamente.');
        this.cargarFacilidades(); // Refresca la lista
      },
      error: (error) => {
        console.error(error);
        this.abrirModalNotificacion('Error', 'No se pudo deshabilitar la facilidad.');
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
  }

  abrirModalNotificacion(titulo: string, mensaje: string) {
    this.tituloNotificacion = titulo;
    this.mensajeNotificacion = mensaje;
    this.mostrarNotificacion = true;
  }

  onAnimationEnd(tipo: 'modal' | 'Notificacion' | 'Confirmacion') {
    if (tipo === 'modal') {
      this.mostrarModal = false;
      this.cerrandoModal = false;
    } else if (tipo === 'Notificacion') {
      this.mostrarNotificacion = false;
      this.cerrandoNotificacion = false;
    } else {
      this.mostrarConfirmacion = false;
      this.cerrandoConfirmacion = false;
    }
  }

  validarTexto(event: KeyboardEvent) {
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]$/;
    const inputChar = String.fromCharCode(event.keyCode);
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }
  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenParaSubir = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.facilidad.imagen = reader.result as string;
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