import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarpublicidadComponent } from './actualizarpublicidad.component';

describe('ActualizarpublicidadComponent', () => {
  let component: ActualizarpublicidadComponent;
  let fixture: ComponentFixture<ActualizarpublicidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarpublicidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarpublicidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
