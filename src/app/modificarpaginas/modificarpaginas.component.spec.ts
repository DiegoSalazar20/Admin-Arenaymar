import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarpaginasComponent } from './modificarpaginas.component';

describe('ModificarpaginasComponent', () => {
  let component: ModificarpaginasComponent;
  let fixture: ComponentFixture<ModificarpaginasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificarpaginasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificarpaginasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
