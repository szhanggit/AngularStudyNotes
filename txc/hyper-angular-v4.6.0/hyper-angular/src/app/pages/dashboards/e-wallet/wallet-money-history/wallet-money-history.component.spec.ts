import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletMoneyHistoryComponent } from './wallet-money-history.component';

describe('WalletMoneyHistoryComponent', () => {
  let component: WalletMoneyHistoryComponent;
  let fixture: ComponentFixture<WalletMoneyHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletMoneyHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletMoneyHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
