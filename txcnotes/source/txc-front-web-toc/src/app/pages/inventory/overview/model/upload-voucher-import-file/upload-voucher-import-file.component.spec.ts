import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVoucherImportFileComponent } from './upload-voucher-import-file.component';

describe('UploadVoucherImportFileComponent', () => {
  let component: UploadVoucherImportFileComponent;
  let fixture: ComponentFixture<UploadVoucherImportFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadVoucherImportFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadVoucherImportFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
