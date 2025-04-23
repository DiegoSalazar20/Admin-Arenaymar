import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultardisponibilidadComponent } from './consultardisponibilidad.component';

describe('ConsultardisponibilidadComponent', () => {
  let component: ConsultardisponibilidadComponent;
  let fixture: ComponentFixture<ConsultardisponibilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultardisponibilidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultardisponibilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
