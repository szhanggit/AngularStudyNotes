import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCreationComponent } from './super-admin-creation.component';

describe('SuperAdminCreationComponent', () => {
  let component: SuperAdminCreationComponent;
  let fixture: ComponentFixture<SuperAdminCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperAdminCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
