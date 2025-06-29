import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modificarpaginas',
  standalone: true,
  imports: [MenuadminComponent, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './modificarpaginas.component.html',
  styleUrl: './modificarpaginas.component.scss'
})
export class ModificarpaginasComponent {
  paginaSeleccionada: string = '';
  modificarSobrenosotros: boolean = false;
  cerrandoModalSobreNosotros: boolean = false;
  modificarComoLlegar: boolean = false;
  cerrandoModalComoLlegar: boolean = false;

  modificarHome: boolean = false;
  cerrandoModalHome: boolean = false;
  imagenHomePreview: string | ArrayBuffer | null = null;
  imagenHomeFile: File | null = null;
  imagenHomeError: string | null = null;
  homeDescripcionTocado: boolean = false;

  sobreNosotros: any = {
    id: '',
    texto: ''
  };

  comoLlegar: any = {
    idUbicacion: '',
    descripcion: '',
    latidud: 0,
    longitud: 0
  };

  home: any = {
    idHome: '',
    imagen: '',
    contenido: ''
  }

  cargandoAccion: boolean = false;
  mensajeError: string = '';
  mensajeInfo: string = '';

  mostrarNotificacion = false;
  cerrandoNotificacion = false;
  tituloNotificacion = '';
  mensajeNotificacion = '';

  apiUrlImgBB = 'https://api.imgbb.com/1/upload';
  apiKeyImgBB = '3c639960d9b0b9276d0d0cc19b1e2319';

  private urlSobreNosotros = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/SobreNosotros';
  private urlHome = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Home';
  private urlComoLlegar = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/ComoLlegar';

  constructor(private http: HttpClient) { }

  abrirModal() {
    this.mensajeError=''
    if (this.paginaSeleccionada === 'sobre-nosotros') {
      this.obtenerSobreNosotros();
      this.modificarSobrenosotros = true;
    } else if (this.paginaSeleccionada === 'home') {
      this.obtenerHome();
      this.modificarHome = true;
      this.homeDescripcionTocado = false;
    }else if(this.paginaSeleccionada == 'como-llegar'){
      this.obtenerComoLlegar();
      this.modificarComoLlegar = true;
    }
     else {
      console.log('Página no implementada aún');
    }
  }

  obtenerSobreNosotros() {
    this.http.get<any>(this.urlSobreNosotros).subscribe({
      next: (data) => {
        this.sobreNosotros.id = data.id;
        this.sobreNosotros.texto = data.texto;
      },
      error: (err) => {
        console.error('Error al obtener la información de Sobre Nosotros', err);
      }
    });
  }

  obtenerComoLlegar() {
    this.http.get<any>(this.urlComoLlegar).subscribe({
      next: (data) => {
        this.comoLlegar.idUbicacion = data.idUbicacion;
        this.comoLlegar.descripcion = data.descripcion;
        this.comoLlegar.latitud = data.latitud;
        this.comoLlegar.longitud = data.longitud;
      },
      error: (err) => {
        console.error('Error al obtener la información de Como Llegar', err);
      }
    });
  }

  obtenerHome() {
    this.http.get<any>(this.urlHome).subscribe({
      next: (data) => {
        this.home.idHome = data.idHome;
        this.home.imagen = data.imagen;
        this.home.contenido = data.contenido;
      },
      error: (err) => {
        console.error('Error al obtener la información de Home', err);
      }
    });
  }

  actualizarSobreNosotros() {
    this.mensajeError = '';

    const errores: string[] = [];

    const regexTextoValido = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,:;()\-_%¡!¿?"'\s]+$/;

    if (!this.sobreNosotros.texto?.trim()) {
      errores.push('El campo de texto no puede estar vacío.');
    } else if (!regexTextoValido.test(this.sobreNosotros.texto)) {
      errores.push('El texto contiene caracteres no permitidos.');
    }

    if (errores.length > 0) {
      this.mensajeError = errores.join('\n');
      this.cargandoAccion = false;
      return;
    }

    this.cargandoAccion = true;

    const cuerpo = {
      id: this.sobreNosotros.id,
      texto: this.sobreNosotros.texto
    };

    this.http.put('https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/SobreNosotros', cuerpo).subscribe({
      next: () => {
        this.cargandoAccion = false;
       this.cerrarModal();
        this.abrirModalNotificacion('Actualizado', 'Texto actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.abrirModalNotificacion('Error', 'Ocurrió un error al actualizar el texto.');
        this.cargandoAccion = false;
      }
    });
  }

  actualizarComoLlegar() {
    this.mensajeError = '';

    const errores: string[] = [];

    const regexTextoValido = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,:;()\-_%¡!¿?"'\s]+$/;

    if (!this.comoLlegar.descripcion?.trim()) {
      errores.push('El campo de texto no puede estar vacío.');
    } else if (!regexTextoValido.test(this.comoLlegar.descripcion)) {
      errores.push('El texto contiene caracteres no permitidos.');
    }

    if (errores.length > 0) {
      this.mensajeError = errores.join('\n');
      this.cargandoAccion = false;
      return;
    }

    this.cargandoAccion = true;

    const cuerpo = {
      idUbicacion: this.comoLlegar.idUbicacion,
      descripcion: this.comoLlegar.descripcion,
      latitud: this.comoLlegar.latidud,
      longitud: this.comoLlegar.longitud
    };

    this.http.put('https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/ComoLlegar', cuerpo).subscribe({
      next: () => {
        this.cargandoAccion = false;
        this.cerrarModal();
        this.abrirModalNotificacion('Actualizado', 'Texto actualizado correctamente.');
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.abrirModalNotificacion('Error', 'Ocurrió un error al actualizar el texto.');
        this.cargandoAccion = false;
      }
    });
  }

  actualizarHome() {
  this.mensajeError = '';
  const errores: string[] = [];
  const regexTextoValido = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:_"'¿?¡!%\- \n]+$/;

  if (!this.home.contenido?.trim()) {
    errores.push('El campo de texto no puede estar vacío.');
  } else if (!regexTextoValido.test(this.home.contenido)) {
    errores.push('El texto contiene caracteres no permitidos.');
  }

  if (errores.length > 0) {
    this.mensajeError = errores.join('\n');
    this.cargandoAccion = false;
    return;
  }

  this.cargandoAccion = true;

  const procesarActualizacion = (urlImagen: string) => {
    const cuerpo = {
      id: this.home.idHome,
      imagen: urlImagen,
      contenido: this.home.contenido
    };

    this.http.put('https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Home', cuerpo).subscribe({
      next: () => {
        this.cargandoAccion = false;
        this.cerrarModal();
        this.abrirModalNotificacion('Actualizado', 'Información actualizada correctamente.');
        this.imagenHomePreview = null;
        this.imagenHomeFile = null;
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        this.abrirModalNotificacion('Error', 'Ocurrió un error al actualizar la información.');
        this.cargandoAccion = false;
      }
    });
  };

  if (!this.imagenHomeFile) {
    procesarActualizacion(this.home.imagen);
    return;
  }

  const formData = new FormData();
  formData.append('image', this.imagenHomeFile);

  this.http.post(`${this.apiUrlImgBB}?key=${this.apiKeyImgBB}`, formData).subscribe({
    next: (response: any) => {
      const urlImagenSubida = response?.data?.url;
      if (urlImagenSubida) {
        procesarActualizacion(urlImagenSubida);
      } else {
        this.abrirModalNotificacion('Error', 'La imagen no pudo ser subida correctamente.');
        this.cargandoAccion = false;
      }
    },
    error: (err) => {
      console.error('Error al subir imagen:', err);
      this.abrirModalNotificacion('Error', 'Ocurrió un error al subir la imagen. Intente nuevamente.');
      this.cargandoAccion = false;
    }
  });
}



  onImagenHomeSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.imagenHomeError = 'El archivo seleccionado no es una imagen válida.';
        return;
      }
      this.imagenHomeError = null;
      this.imagenHomeFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenHomePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarImagenHome(): void {
    this.imagenHomePreview = null;
    this.imagenHomeFile = null;
  }

  cerrarModal() {
    if(this.paginaSeleccionada==='home'){
      this.cerrandoModalHome=true;
      this.homeDescripcionTocado = false;
      return;
    }

    if(this.paginaSeleccionada==='sobre-nosotros'){
      this.cerrandoModalSobreNosotros = true;
      return;
    }

    if(this.paginaSeleccionada==='como-llegar'){
      this.cerrandoModalComoLlegar = true;
      return;
    }
  }

  cerrarModalNotificacion() {
    this.cerrandoNotificacion = true;
  }

  abrirModalNotificacion(titulo: string, mensaje: string) {
    this.tituloNotificacion = titulo;
    this.mensajeNotificacion = mensaje;
    this.mostrarNotificacion = true;
  }

  onAnimationEnd(tipo: 'modalSobreNosotros' | 'Notificacion' | 'Confirmacion' | 'modalHome' | 'modalComoLlegar') {
    if (tipo === 'modalSobreNosotros' && this.cerrandoModalSobreNosotros) {
      this.cerrandoModalSobreNosotros = false;
      this.modificarSobrenosotros = false;
    }

    if (tipo === 'modalComoLlegar' && this.cerrandoModalComoLlegar) {
      this.cerrandoModalComoLlegar = false;
      this.modificarComoLlegar = false;
    }

    if (tipo === 'modalHome' && this.cerrandoModalHome) {
      this.cerrandoModalHome = false;
      this.modificarHome = false;
    }

    if (tipo === 'Notificacion' && this.cerrandoNotificacion) {
      this.cerrandoNotificacion = false;
      this.mostrarNotificacion = false;
    }
    if (tipo === 'Confirmacion') {

    }
  }

}
