import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerhotelhoyComponent } from './verhotelhoy.component';

describe('VerhotelhoyComponent', () => {
  let component: VerhotelhoyComponent;
  let fixture: ComponentFixture<VerhotelhoyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerhotelhoyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerhotelhoyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
