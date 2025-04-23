import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarhabitacionesComponent } from './administrarhabitaciones.component';

describe('AdministrarhabitacionesComponent', () => {
  let component: AdministrarhabitacionesComponent;
  let fixture: ComponentFixture<AdministrarhabitacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarhabitacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarhabitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
