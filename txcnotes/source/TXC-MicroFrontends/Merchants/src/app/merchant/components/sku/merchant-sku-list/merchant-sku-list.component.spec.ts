import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantSkuListComponent } from './merchant-sku-list.component';

describe('MerchantSkuListComponent', () => {
  let component: MerchantSkuListComponent;
  let fixture: ComponentFixture<MerchantSkuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantSkuListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantSkuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
