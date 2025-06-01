import { Component } from '@angular/core';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';
import { OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-modificarpaginas',
  imports: [MenuadminComponent, CommonModule,
    HttpClientModule, FormsModule],
  templateUrl: './modificarpaginas.component.html',
  styleUrl: './modificarpaginas.component.scss'
})
export class ModificarpaginasComponent {

  paginaSeleccionada: string = '';
  modificarSobrenosotros: boolean = false;
  cerrandoModalSobreNosotros: boolean = false;

  sobreNosotros: any = {
    id: '',
    texto: 0
  };
  cargandoAccion: boolean = false;

  private urlSobreNosotros='https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/SobreNosotros';

  constructor(private http: HttpClient) { }

  obtenerSobreNosotros() {
  this.http.get<any>(this.urlSobreNosotros)
    .subscribe({
      next: (data) => {
        this.sobreNosotros.id = data.id;
        this.sobreNosotros.texto = data.texto;
      },
      error: (err) => {
        console.error('Error al obtener la información de Sobre Nosotros', err);
      }
    });
}

  abrirModal() {
  if (this.paginaSeleccionada === 'sobre-nosotros') {
    this.obtenerSobreNosotros();
    this.modificarSobrenosotros=true;
  } else {
    console.log('Página no implementada aún');
  }
}

onAnimationEnd(tipo: 'modalSobreNosotros' | 'Notificacion' | 'Confirmacion') {
  if (tipo === 'modalSobreNosotros' && this.cerrandoModalSobreNosotros) {
    this.cerrandoModalSobreNosotros = false;
    this.modificarSobrenosotros = false;
  }
}

cerrarModal() {
  this.cerrandoModalSobreNosotros = true;
}


}
