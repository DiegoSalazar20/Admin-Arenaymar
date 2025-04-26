import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MenuadminComponent } from '../menuadmin/menuadmin.component';

@Component({
  standalone: true,
  selector: 'app-verhotelhoy',
  imports: [
    CommonModule,
    HttpClientModule,    
    MenuadminComponent
  ],
  templateUrl: './verhotelhoy.component.html',
  styleUrls: ['./verhotelhoy.component.scss']
})
export class VerhotelhoyComponent implements OnInit {
  habitaciones: any[] = [];
  cargando = true;
  error = '';
  fechaHoy: string = '';

  private apiUrl = 'https://arenaymar-frdyg5caarhsd2g5.eastus-01.azurewebsites.net/api/Habitacion/VerEstadoHabitacionesHoy';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const hoy = new Date();
    this.fechaHoy = hoy.toLocaleDateString('es-CR', { day: 'numeric', month: 'numeric', year: 'numeric'});

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

  imprimir(): void {
    window.print();
  }
}
