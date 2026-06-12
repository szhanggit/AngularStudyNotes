import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSuperAdminComponent } from './add-new-super-admin.component';

describe('AddNewSuperAdminComponent', () => {
  let component: AddNewSuperAdminComponent;
  let fixture: ComponentFixture<AddNewSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewSuperAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
