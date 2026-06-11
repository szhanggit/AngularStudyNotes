import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadVoucherImportTemplateComponent } from './download-voucher-import-template.component';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('DownloadVoucherImportTemplateComponent', () => {
  let component: DownloadVoucherImportTemplateComponent;
  let fixture: ComponentFixture<DownloadVoucherImportTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadVoucherImportTemplateComponent ],
      imports: [
        NgbModule,
      ],
      providers: [
        NgbActiveModal,
        NgbModal
      ]
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
