import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMDashboardComponent } from './dashboard.component';

describe('CRMDashboardComponent', () => {
  let component: CRMDashboardComponent;
  let fixture: ComponentFixture<CRMDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CRMDashboardComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRMDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
