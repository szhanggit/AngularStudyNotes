import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantSkuComponent } from './merchant-sku.component';

describe('MerchantSkuComponent', () => {
  let component: MerchantSkuComponent;
  let fixture: ComponentFixture<MerchantSkuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantSkuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantSkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
