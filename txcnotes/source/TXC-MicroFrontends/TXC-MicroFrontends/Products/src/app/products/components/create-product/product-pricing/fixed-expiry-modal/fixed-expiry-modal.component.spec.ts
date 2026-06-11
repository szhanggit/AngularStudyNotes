import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedExpiryModalComponent } from './fixed-expiry-modal.component';

describe('FixedExpiryModalComponent', () => {
  let component: FixedExpiryModalComponent;
  let fixture: ComponentFixture<FixedExpiryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedExpiryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedExpiryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
