import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupSkuDetailsComponent } from './merchant-group-sku-details.component';

describe('GroupSkuDetailComponent', () => {
  let component: MerchantGroupSkuDetailsComponent;
  let fixture: ComponentFixture<MerchantGroupSkuDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupSkuDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupSkuDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
