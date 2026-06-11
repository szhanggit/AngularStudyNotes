import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportVoucherNoComponent } from './import-voucher-no.component';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('ImportVoucherNoComponent', () => {
  let component: ImportVoucherNoComponent;
  let fixture: ComponentFixture<ImportVoucherNoComponent>;
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ImportVoucherNoComponent,
      ],
      imports: [
        NgbModule,
      ],
      providers: [
        NgbActiveModal,
        NgbModal,
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
      ]
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
  it('should call modal when openDownloadVoucherImportTemplateModel() has been called', () => {
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve(),
      componentInstance: { selectedQuotation: {} },
    });
    component.openDownloadVoucherImportTemplateModel();
    expect(modalSvcSpy.open).toHaveBeenCalled();
  });

  it('should call modal when openUploadVoucherImportFileModel() has been called', () => {
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve(),
      componentInstance: { selectedQuotation: {} },
    });
    component.openUploadVoucherImportFileModel();
    expect(modalSvcSpy.open).toHaveBeenCalled();
  });

});
