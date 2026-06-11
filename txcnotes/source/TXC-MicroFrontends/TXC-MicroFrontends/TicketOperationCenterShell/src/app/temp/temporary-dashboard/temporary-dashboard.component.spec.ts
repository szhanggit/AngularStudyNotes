import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemporaryDashboardComponent } from './temporary-dashboard.component';

describe('TemporaryDashboardComponent', () => {
  let component: TemporaryDashboardComponent;
  let fixture: ComponentFixture<TemporaryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemporaryDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemporaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
