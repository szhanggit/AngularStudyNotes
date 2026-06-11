import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { DownloadExcelFileComponent } from './download-excel-file.component';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DownloadAndSendService } from 'src/app/order/services/download-and-send.service';
import { of, throwError } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';

describe('DownloadExcelFileComponent', () => {
  const activeModalSvcSpy = jasmine.createSpyObj('NgbActiveModal', ['dismiss']);
  const downloadFileSvcSpy = jasmine.createSpyObj('DownloadAndSendService', [
    'DownloadOrderVoucherExcel',
  ]);
  const toastSpy = jasmine.createSpyObj('NgbdToastGlobal', [
    'showSuccess',
    'showDanger',
  ]);
  let component: DownloadExcelFileComponent;
  let fixture: ComponentFixture<DownloadExcelFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadExcelFileComponent, NgbdToastGlobal],
      imports: [HttpClientTestingModule],
      providers: [
        FormBuilder,
        {
          provide: NgbActiveModal,
          useValue: activeModalSvcSpy,
        },
        {
          provide: DownloadAndSendService,
          useValue: downloadFileSvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    downloadFileSvcSpy.DownloadOrderVoucherExcel.and.returnValue(
      of({ success: true, message: '', data: {} })
    );
    fixture = TestBed.createComponent(DownloadExcelFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.downloadExcelFileFormGroup).toBeDefined();
  });

  describe('onButtonClicked', () => {
    it('should dismiss active modal when param is false', () => {
      // act
      component.onButtonClicked();

      // assert
      expect(activeModalSvcSpy.dismiss).toHaveBeenCalled();
    });

    it('should download file and dismiss active modal when param is true', () => {
      // arrange
      environment.local = true;
      component.fileObject = {
        file: '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',
        fileName: 'sample.zip',
        password: 'H7W116II',
        contentType: 'application/octet-stream',
      };

      // act
      component.onButtonClicked(true);

      // assert
      expect(activeModalSvcSpy.dismiss).toHaveBeenCalled();
    });
  });

  describe('fetchFileWithPassword()', () => {
    beforeEach(() => {
      // arrange
      component.orderId = 1;
      component.orderMode = 1;
    });
    it('should call getClientContact and return success', fakeAsync(() => {
      // arrange
      const assignFileValues = spyOn(component, 'assignFileValues');

      // act
      component.ngOnInit();
      component.fetchFileWithPassword();
      tick();

      // assert
      expect(downloadFileSvcSpy.DownloadOrderVoucherExcel).toHaveBeenCalled();
      expect(assignFileValues).toHaveBeenCalled();
    }));

    it('should call getClientContact and return error', fakeAsync(() => {
      // arrange
      downloadFileSvcSpy.DownloadOrderVoucherExcel.and.returnValue(
        of(throwError('error'))
      );
      // act
      component.fetchFileWithPassword();
      tick();
      // assert
      expect(toastSpy.showDanger).toBeDefined();
    }));
  });
});
