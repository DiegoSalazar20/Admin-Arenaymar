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

  private urlSobreNosotros = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/SobreNosotros';
  private urlHome = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Home';

  constructor(private http: HttpClient) { }

  abrirModal() {
    if (this.paginaSeleccionada === 'sobre-nosotros') {
      this.obtenerSobreNosotros();
      this.modificarSobrenosotros = true;
    } else if (this.paginaSeleccionada === 'home') {
      this.obtenerHome();
      this.modificarHome = true;
      this.homeDescripcionTocado = false;
    } else {
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

  actualizarHome() {
    this.mensajeError = '';

    if (!this.home.contenido || !this.home.contenido.trim()) {
      this.mensajeError = 'La descripción no puede estar vacía.';
      return;
    }

    this.cargandoAccion = true;

    let imagenEnviar = this.home.imagen;
    if (this.imagenHomePreview) {
      imagenEnviar = this.imagenHomePreview as string;
    }

    const cuerpo = {
      id: this.home.idHome,
      imagen: imagenEnviar,
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
  this.cerrandoModalSobreNosotros = true;
  this.cerrandoModalHome = true;
  this.homeDescripcionTocado = false;
}

  cerrarModalNotificacion() {
    this.cerrandoNotificacion = true;
  }

  abrirModalNotificacion(titulo: string, mensaje: string) {
    this.tituloNotificacion = titulo;
    this.mensajeNotificacion = mensaje;
    this.mostrarNotificacion = true;
  }

  onAnimationEnd(tipo: 'modalSobreNosotros' | 'Notificacion' | 'Confirmacion' | 'modalHome') {
    if (tipo === 'modalSobreNosotros' && this.cerrandoModalSobreNosotros) {
      this.cerrandoModalSobreNosotros = false;
      this.modificarSobrenosotros = false;
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
