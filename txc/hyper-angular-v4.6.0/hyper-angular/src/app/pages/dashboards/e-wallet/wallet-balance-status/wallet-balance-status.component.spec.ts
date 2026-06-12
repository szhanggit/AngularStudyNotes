import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletBalanceStatusComponent } from './wallet-balance-status.component';

describe('WalletBalanceStatusComponent', () => {
  let component: WalletBalanceStatusComponent;
  let fixture: ComponentFixture<WalletBalanceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletBalanceStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletBalanceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
