import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrartemporadasComponent } from './administrartemporadas.component';

describe('AdministrartemporadasComponent', () => {
  let component: AdministrartemporadasComponent;
  let fixture: ComponentFixture<AdministrartemporadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrartemporadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrartemporadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
