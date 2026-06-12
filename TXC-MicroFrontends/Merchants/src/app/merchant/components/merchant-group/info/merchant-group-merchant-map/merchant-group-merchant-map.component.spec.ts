import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantGroupMerchantMapComponent } from './merchant-group-merchant-map.component';

describe('MerchantGroupMerchantMapComponent', () => {
  let component: MerchantGroupMerchantMapComponent;
  let fixture: ComponentFixture<MerchantGroupMerchantMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantGroupMerchantMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantGroupMerchantMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
