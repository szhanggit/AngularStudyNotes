import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCtrlComponent } from './date-ctrl.component';

describe('DateCtrlComponent', () => {
  let component: DateCtrlComponent;
  let fixture: ComponentFixture<DateCtrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateCtrlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateCtrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
