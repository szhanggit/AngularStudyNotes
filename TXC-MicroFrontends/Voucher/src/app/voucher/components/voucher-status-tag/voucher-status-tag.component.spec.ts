import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherStatusTagComponent } from './voucher-status-tag.component';

describe('VoucherStatusTagComponent', () => {
  let component: VoucherStatusTagComponent;
  let fixture: ComponentFixture<VoucherStatusTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherStatusTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherStatusTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
