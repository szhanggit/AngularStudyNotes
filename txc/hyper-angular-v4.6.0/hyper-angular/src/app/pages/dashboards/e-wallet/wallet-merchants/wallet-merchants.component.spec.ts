import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletMerchantsComponent } from './wallet-merchants.component';

describe('WalletMerchantsComponent', () => {
  let component: WalletMerchantsComponent;
  let fixture: ComponentFixture<WalletMerchantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletMerchantsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletMerchantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
