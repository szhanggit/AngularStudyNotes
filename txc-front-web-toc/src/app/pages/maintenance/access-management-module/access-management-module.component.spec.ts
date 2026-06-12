import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessManagementModuleComponent } from './access-management-module.component';

describe('AccessManagementModuleComponent', () => {
  let component: AccessManagementModuleComponent;
  let fixture: ComponentFixture<AccessManagementModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessManagementModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessManagementModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
