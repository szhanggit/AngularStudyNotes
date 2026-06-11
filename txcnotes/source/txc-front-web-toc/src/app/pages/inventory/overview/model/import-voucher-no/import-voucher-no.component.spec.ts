import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportVoucherNoComponent } from './import-voucher-no.component';

describe('ImportVoucherNoComponent', () => {
  let component: ImportVoucherNoComponent;
  let fixture: ComponentFixture<ImportVoucherNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportVoucherNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportVoucherNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
