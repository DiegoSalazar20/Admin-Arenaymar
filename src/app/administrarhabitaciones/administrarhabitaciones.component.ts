import { Component } from '@angular/core';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';
import { OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-administrarhabitaciones',
  imports: [MenuadminComponent, CommonModule,
    HttpClientModule, FormsModule
  ],
  templateUrl: './administrarhabitaciones.component.html',
  styleUrl: './administrarhabitaciones.component.scss'
})
export class AdministrarhabitacionesComponent {
  habitacionesEstandar: any[] = [];
  habitacionesJunior: any[] = [];
  habitaciones: any[] = [];
  tiposDeHabitaciones: any[] = [];
  cargando = true;
  error = '';

  tipoSeleccionado: any = null;
  mostrarModal = false;
  cargandoAccion = false;
  cerrandoModal = false;

  mensajeErrorModal = '';

  mostrarNotificacion = false;
  cerrandoNotificacion = false;

  tituloNotificacion = '';
  mensajeNotificacion = '';

  apiUrlImgBB = 'https://api.imgbb.com/1/upload';
  apiKeyImgBB = '3c639960d9b0b9276d0d0cc19b1e2319';

  imagenParaSubir: Blob | null = null;
  urlParaActualizar = '';

  tipoHabitacion: {
    idTipoHabitacion: number | null,
    nombre: string,
    descripcion: string,
    precio: number,
    imagen: string
  } = {
      idTipoHabitacion: null,
      nombre: '',
      descripcion: '',
      precio: 0,
      imagen: ''
    };

  private apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Habitacion/VerEstadoHabitacionesHoy';
  private urlCargarTipoHabitaciones = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/TipoHabitacion/ObtenerOfertas';
  private urlActualizarTipoHabitaciones = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/TipoHabitacion/ActualizarDatosHabitacion';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.cargarTiposDeHabitaciones();
    this.cargarHabitaciones()
  }

  imprimir(): void {
    window.print();
  }

  cargarTiposDeHabitaciones(): void {
    this.http.get<any>(this.urlCargarTipoHabitaciones).subscribe({
      next: data2 => {
        this.tiposDeHabitaciones = data2;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.error = 'No se pudo cargar los tipos de habitaciones.';
        this.cargando = false;
      }
    });
  }

  editarTipoHabitacion(id: number) {

    const habitacion = this.tiposDeHabitaciones.find(h => h.idTipoHabitacion === id);
    if (habitacion) {
      this.tipoHabitacion = {
        idTipoHabitacion: habitacion.idTipoHabitacion,
        nombre: habitacion.nombre,
        precio: habitacion.precio,
        descripcion: habitacion.descripcion,
        imagen: habitacion.imagen
      };

      this.mostrarModal = true;
    }
  }

  cerrarModal() {
    this.cerrandoModal = true;
  }

  actualizarTipoHabitacion() {
    this.cargandoAccion = true;
    this.mensajeErrorModal = '';

    if (!this.tipoHabitacion.nombre || !this.tipoHabitacion.descripcion || this.tipoHabitacion.precio <= 0) {
      this.mensajeErrorModal = 'Por favor, complete todos los campos correctamente.';
      this.cargandoAccion = false;
      return;
    }

    const procesarActualizacion = (imagenUrl: string) => {
      const datos = {
        idTipoHabitacion: this.tipoHabitacion.idTipoHabitacion,
        nombre: this.tipoHabitacion.nombre,
        descripcion: this.tipoHabitacion.descripcion,
        precio: this.tipoHabitacion.precio,
        imagen: imagenUrl
      };

      this.http.put(this.urlActualizarTipoHabitaciones, datos, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text'
      }).subscribe({
        next: () => {
          this.abrirModalNotificacion('Datos actualizados', 'Los datos de la habitación fueron actualizados con éxito.');
          this.cerrarModal();
          this.cargandoAccion = false;
          this.mostrarNotificacion = true;
          this.cargarHabitaciones();
          this.cargarTiposDeHabitaciones();
        },
        error: (error) => {
          console.error(error);
          this.mensajeErrorModal = 'No se pudo actualizar el tipo de habitación.';
          this.abrirModalNotificacion('Error al actualizar los datos', 'Ocurrió un error al actualizar los datos de la habitación.');
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
      procesarActualizacion(this.tipoHabitacion.imagen);
    }
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
  }

  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenParaSubir = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.tipoHabitacion.imagen = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  habitacionesPorTipo(tipo: number): any[] {
    return this.habitaciones.filter(h => h.IdTipoHabitacion === tipo);
  }

  cargarHabitaciones() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: data => {
        this.habitaciones = data;
        this.cargando = false;
      },
      error: err => {
        console.error(err);
        this.error = 'No se pudo cargar el estado de las habitaciones.';
        this.cargando = false;
      }
    });
  }

  subirImagen() {
    const formData = new FormData();
    if (this.imagenParaSubir) {
      formData.append('image', this.imagenParaSubir);
    }
    return this.http.post<any>(`${this.apiUrlImgBB}?key=${this.apiKeyImgBB}`, formData);
  }

  cerrarModalNotificacion() {
    this.cerrandoNotificacion = true;
  }

  abrirModalNotificacion(titulo: string, mensaje: string) {
    this.tituloNotificacion = titulo;
    this.mensajeNotificacion = mensaje;
    this.mostrarNotificacion = true;
  }

}