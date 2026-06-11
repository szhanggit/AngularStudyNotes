import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupSkuViewComponent } from './merchant-group-sku-view.component';

describe('MerchantGroupSkuViewComponent', () => {
  let component: MerchantGroupSkuViewComponent;
  let fixture: ComponentFixture<MerchantGroupSkuViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupSkuViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupSkuViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
