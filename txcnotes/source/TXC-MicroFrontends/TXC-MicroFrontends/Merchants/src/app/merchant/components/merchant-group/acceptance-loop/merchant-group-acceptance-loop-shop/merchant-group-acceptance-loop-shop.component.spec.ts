import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupAcceptanceLoopShopComponent } from './merchant-group-acceptance-loop-shop.component';

describe('MerchantGroupAcceptanceLoopShopComponent', () => {
  let component: MerchantGroupAcceptanceLoopShopComponent;
  let fixture: ComponentFixture<MerchantGroupAcceptanceLoopShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupAcceptanceLoopShopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupAcceptanceLoopShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
