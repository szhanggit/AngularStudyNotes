import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadVoucherImportFileComponent } from './upload-voucher-import-file.component';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDropzoneModule } from 'ngx-dropzone';

describe('UploadVoucherImportFileComponent', () => {
  let component: UploadVoucherImportFileComponent;
  let fixture: ComponentFixture<UploadVoucherImportFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadVoucherImportFileComponent ],
      imports: [
        NgbModule,
        NgxDropzoneModule,
      ],
      providers: [
        NgbActiveModal,
        NgbModal,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadVoucherImportFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should push event.addedFiles to file', () => {
    const dummyEvent = {
      addedFiles:'dummy file'
    }
    component.onSelect(dummyEvent);
    expect(component.files.length > 0).toBeTruthy();
  });

  it('should create', () => {

    const dummyEvent = {
      addedFiles:'dummy file'
    }
    component.onSelect(dummyEvent);
    fixture
    component.onRemove(dummyEvent);
    expect(component.files.length > 0).toBeTruthy();
  });

});
