import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupManagementComponent } from './merchant-group-management.component';

describe('CreateMerchantGroupComponent', () => {
  let component: MerchantGroupManagementComponent;
  let fixture: ComponentFixture<MerchantGroupManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
