import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciosesionempleadoComponent } from './iniciosesionempleado.component';

describe('IniciosesionempleadoComponent', () => {
  let component: IniciosesionempleadoComponent;
  let fixture: ComponentFixture<IniciosesionempleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IniciosesionempleadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IniciosesionempleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
