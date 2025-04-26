import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-menuadmin',
  imports: [CommonModule, HttpClientModule],

  templateUrl: './menuadmin.component.html',
  styleUrl: './menuadmin.component.scss'
})

export class MenuadminComponent implements OnInit {
  public menuOpen: boolean = false;
  public rutaActual: string = '';

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.rutaActual = this.router.url;
    this.router.events.subscribe(() => {
      this.rutaActual = this.router.url;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
