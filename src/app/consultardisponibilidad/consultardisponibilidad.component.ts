import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';
@Component({
  selector: 'app-consultardisponibilidad',
  imports: [CommonModule, FormsModule, HttpClientModule, MenuadminComponent],
  templateUrl: './consultardisponibilidad.component.html',
  styleUrl: './consultardisponibilidad.component.scss'
})
export class ConsultardisponibilidadComponent {

  constructor(private http: HttpClient) { }

  mensajeError: string = '';
  mensajeInfo: string = '';
  fechaLlegada!: Date;
  fechaSalida!: Date;
  tipoHabitacion: string = '';
  habitacionesDisponibles: any[] = [];

  consultarDisponibilidad() {
    this.habitacionesDisponibles = [];
    this.mensajeError = '';
    this.mensajeInfo = '';


    if (!this.fechaLlegada || !this.fechaSalida) {
      this.mensajeError = 'Debe ingresar ambas fechas.';
      return;
    }

    const fechaLlegada = new Date(this.fechaLlegada);
    const fechaSalida = new Date(this.fechaSalida);

    if (fechaLlegada.getTime() === fechaSalida.getTime()) {
      this.mensajeError = 'La fecha de llegada y la de salida no pueden ser iguales.';
      return;
    }
    if (fechaLlegada > fechaSalida) {
      this.mensajeError = 'La fecha de llegada no puede ser posterior a la fecha de salida.';
      return;
    }
    let params = new HttpParams()
      .set('fechainicio', fechaLlegada.toISOString())
      .set('fechafin', fechaSalida.toISOString());

    if (this.tipoHabitacion) {
      if (this.tipoHabitacion !== "") {
        params = params.set('idTipoHabitacion', this.tipoHabitacion.toString());
      }
    }
    let apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Habitacion/HabitacionesDisponibles';
    this.http.get<any[]>(apiUrl, { params: params }).subscribe({
      next: (response) => {
        if (response.length === 0) {
          this.mensajeError = "No hay habitaciones disponibles.";
        } else {
          this.habitacionesDisponibles = response;
        }
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = 'Ocurrió un error al consultar la disponibilidad.';
      }
    });
  }
}
