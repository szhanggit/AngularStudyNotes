import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadRemainingVoucherDetailsComponent } from './download-remaining-voucher-details.component';

describe('DownloadRemainingVoucherDetailsComponent', () => {
  let component: DownloadRemainingVoucherDetailsComponent;
  let fixture: ComponentFixture<DownloadRemainingVoucherDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadRemainingVoucherDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadRemainingVoucherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
