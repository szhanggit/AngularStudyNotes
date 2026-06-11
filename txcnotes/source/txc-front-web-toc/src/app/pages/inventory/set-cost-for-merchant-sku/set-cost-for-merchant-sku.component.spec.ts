import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetCostForMerchantSkuComponent } from './set-cost-for-merchant-sku.component';

describe('SetCostForMerchantSkuComponent', () => {
  let component: SetCostForMerchantSkuComponent;
  let fixture: ComponentFixture<SetCostForMerchantSkuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetCostForMerchantSkuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetCostForMerchantSkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
