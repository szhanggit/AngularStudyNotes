import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWalletComponent } from './e-wallet.component';

describe('EWalletComponent', () => {
  let component: EWalletComponent;
  let fixture: ComponentFixture<EWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
