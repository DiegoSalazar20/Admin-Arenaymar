import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarfacilidadesComponent } from './administrarfacilidades.component';

describe('AdministrarfacilidadesComponent', () => {
  let component: AdministrarfacilidadesComponent;
  let fixture: ComponentFixture<AdministrarfacilidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarfacilidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarfacilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
