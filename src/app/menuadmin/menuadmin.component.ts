import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-menuadmin',
  imports: [CommonModule, HttpClientModule],

  templateUrl: './menuadmin.component.html',
  styleUrl: './menuadmin.component.scss'
})

export class MenuadminComponent implements OnInit {
  public menuOpen: boolean = false;
  public rutaActual: string = '';
  public nombreAdmin: string | null = null;

  constructor(private router: Router, private http: HttpClient, @Inject(PLATFORM_ID) private platformId:Object) { }

  ngOnInit(): void {
    this.rutaActual = this.router.url;
    this.router.events.subscribe(() => {
      this.rutaActual = this.router.url;
    });
    if (isPlatformBrowser(this.platformId)) {
      this.nombreAdmin=localStorage.getItem('Nombre');;
    }
    
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }

  cerrarSesion(){
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('Nombre');
    }
    
    this.router.navigate(['']);

  }
}
