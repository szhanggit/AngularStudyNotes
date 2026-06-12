import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadVoucherImportTemplateComponent } from './download-voucher-import-template.component';

describe('DownloadVoucherImportTemplateComponent', () => {
  let component: DownloadVoucherImportTemplateComponent;
  let fixture: ComponentFixture<DownloadVoucherImportTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadVoucherImportTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadVoucherImportTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
