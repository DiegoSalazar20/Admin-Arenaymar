import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoreservasComponent } from './listadoreservas.component';

describe('ListadoreservasComponent', () => {
  let component: ListadoreservasComponent;
  let fixture: ComponentFixture<ListadoreservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoreservasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoreservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
