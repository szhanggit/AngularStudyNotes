import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopAddressSpanComponent } from './shop-address-span.component';

describe('ShopAddressSpanComponent', () => {
  let component: ShopAddressSpanComponent;
  let fixture: ComponentFixture<ShopAddressSpanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopAddressSpanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopAddressSpanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
