import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarofertasComponent } from './administrarofertas.component';

describe('AdministrarofertasComponent', () => {
  let component: AdministrarofertasComponent;
  let fixture: ComponentFixture<AdministrarofertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarofertasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarofertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
