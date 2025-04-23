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
  constructor(private router: Router, private http: HttpClient) { }

  public menuOpen: boolean = false;

  ngOnInit(): void {
   
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  redirigir(ruta: string) {
    this.router.navigate([ruta]);
  }
}
