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

  sobreNosotros: any = {
    id: '',
    texto: ''
  };

  cargandoAccion: boolean = false;
  mensajeError: string = '';
  mensajeInfo: string = '';

  mostrarNotificacion = false;
  cerrandoNotificacion = false;
  tituloNotificacion = '';
  mensajeNotificacion = '';

  private urlSobreNosotros = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/SobreNosotros';

  constructor(private http: HttpClient) { }

  abrirModal() {
    if (this.paginaSeleccionada === 'sobre-nosotros') {
      this.obtenerSobreNosotros();
      this.modificarSobrenosotros = true;
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

  cerrarModal() {
    this.cerrandoModalSobreNosotros = true;
  }

  cerrarModalNotificacion() {
    this.cerrandoNotificacion = true;
  }

  abrirModalNotificacion(titulo: string, mensaje: string) {
    this.tituloNotificacion = titulo;
    this.mensajeNotificacion = mensaje;
    this.mostrarNotificacion = true;
  }

 onAnimationEnd(tipo: 'modalSobreNosotros' | 'Notificacion' | 'Confirmacion') {
  if (tipo === 'modalSobreNosotros' && this.cerrandoModalSobreNosotros) {
    this.cerrandoModalSobreNosotros = false;
    this.modificarSobrenosotros = false;
  }

  if (tipo === 'Notificacion' && this.cerrandoNotificacion) {
    this.cerrandoNotificacion = false;
    this.mostrarNotificacion = false;
  }
  if (tipo === 'Confirmacion') {
  
  }
}

}
