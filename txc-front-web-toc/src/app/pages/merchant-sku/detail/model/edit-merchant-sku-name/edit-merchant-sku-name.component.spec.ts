import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMerchantSkuNameComponent } from './edit-merchant-sku-name.component';

describe('EditMerchantSkuNameComponent', () => {
  let component: EditMerchantSkuNameComponent;
  let fixture: ComponentFixture<EditMerchantSkuNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMerchantSkuNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMerchantSkuNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
