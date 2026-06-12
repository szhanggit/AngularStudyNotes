import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyProgressComponent } from './monthly-progress.component';

describe('MonthlyProgressComponent', () => {
  let component: MonthlyProgressComponent;
  let fixture: ComponentFixture<MonthlyProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
