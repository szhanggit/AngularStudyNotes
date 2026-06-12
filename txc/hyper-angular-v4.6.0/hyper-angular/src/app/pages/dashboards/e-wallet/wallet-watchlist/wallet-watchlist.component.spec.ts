import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletWatchlistComponent } from './wallet-watchlist.component';

describe('WalletWatchlistComponent', () => {
  let component: WalletWatchlistComponent;
  let fixture: ComponentFixture<WalletWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletWatchlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
