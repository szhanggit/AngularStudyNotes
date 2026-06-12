import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMManagementComponent } from './management.component';

describe('CRMManagementComponent', () => {
  let component: CRMManagementComponent;
  let fixture: ComponentFixture<CRMManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CRMManagementComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CRMManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
