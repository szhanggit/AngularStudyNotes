import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchErrorComponent } from './batch-error.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AttachmentService, ConfirmationModalComponent } from '@txc-angular/component-library';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UploadBatchComponent } from './upload-batch/upload-batch.component';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';
import { BatchListStateService } from '../../services/state/batch-list-state.service';

describe('BatchErrorComponent', () => {
  let component: BatchErrorComponent;
  let fixture: ComponentFixture<BatchErrorComponent>;
  let activatedRouteStub: any;
  let routerMock: any;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;
  let attachmentServiceSpy: jasmine.SpyObj<AttachmentService>;

  const mockSelectedItem = {
    batchNumber: 1,
    fileName: 'BP000202311091234560010.XLS',
    status: 'Failed',
    errorReason: {
      summary: ['Invalid Data'],
      details: [
        {
          errorMessage: 'Invalid voucher number',
          rowNumber: [1, 2, 100, 23, 42],
        },
        {
          errorMessage: 'Duplicate Transaction Id',
          rowNumber: [1, 2, 100, 23, 42],
        },
      ],
    },
    isLink: true,
    createdOn: '2023/05/11 2:46:12 AM',
    startTime: '2023-06-02T18:23:07Z',
    endTime: '2023-01-24T10:41:39Z',
    failNumber: 404,
    successNumber: 2780,
    totalNumber: 3184,
    source: 'Automatic',
    operator: 'Phip',
    action: 'Cancel',
    errorSummary: 'Invalid Data',
    tooltipLabel: 'Start: 2023/06/03 2:23:07 AM End: 2023/01/24 6:41:39 PM',
  };
  const batchListStateServiceMock = {
    selectedItem$: of(mockSelectedItem),
  };

  beforeEach(async () => {
    routerMock = { url: '', navigateByUrl: jasmine.createSpy('navigateByUrl') };
    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    attachmentServiceSpy = jasmine.createSpyObj('AttachmentService', ['downloadSample']);
    

    await TestBed.configureTestingModule({
      declarations: [ BatchErrorComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerMock },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: AttachmentService, useValue: attachmentServiceSpy },
        { provide: BatchListStateService, useValue: batchListStateServiceMock },
        HttpClient, HttpHandler, DatePipe
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter and update action buttons when status is Failed', () => {
    component.status = 'Failed';
    component.ngOnInit();

    expect(component.actionButtons.length).toBe(1);
    expect(component.actionButtons[0].buttonText.trim()).toBe('Download');
    expect(component.actionButtons[0].buttonClass).toBe('btn-primary');
  });

  it('should return the correct redirection URL', () => {
    routerMock.url = '/path/to?resource=batchNumber';
    expect(component.getRedirectionUrl()).toBe('/path/to');

    routerMock.url = '/path/to/resource';
    expect(component.getRedirectionUrl()).toBe('/path/to/resource');

    routerMock.url = '/';
    expect(component.getRedirectionUrl()).toBe('/');
  });

  it('should open modal window on cancel', async () => {
    const mockModalRef: Partial<NgbModalRef> = {
      result: Promise.resolve('confirm'),
      componentInstance: {}
    };
  
    modalServiceSpy.open.and.returnValue(mockModalRef as NgbModalRef);
    component.onCancel();
    expect(modalServiceSpy.open).toHaveBeenCalledWith(
      ConfirmationModalComponent,
      {
        size: 'md',
        backdrop: 'static',
        centered: true,
      }
    );
  });

  it('onDownload should call downloadSample with correct arguments', () => {
    const mockEvent = new MouseEvent('click');
    const expectedHref = environment.local
      ? '/assets/templates/import-voucher-template.xlsx'
      : '/move/assets/templates/import-voucher-template.xlsx';

    component.onDownload(mockEvent);

    expect(attachmentServiceSpy.downloadSample).toHaveBeenCalledWith(
        mockEvent, expectedHref
      );
  });

  describe('onReupload', () => {
    it('should navigate to correct URL on modal confirm', async () => {
      const mockModalRef: Partial<NgbModalRef> = {
        result: Promise.resolve('confirm'),
        componentInstance: { title: '', }
      };
      modalServiceSpy.open.and.returnValue(mockModalRef as NgbModalRef);
  
      spyOn(component, 'getRedirectionUrl').and.returnValue('/redirect-url');
      await component.onReupload();
      expect(modalServiceSpy.open).toHaveBeenCalledWith(UploadBatchComponent, {
        size: 'md',
        backdrop: 'static',
        centered: true,
      });
  
      await mockModalRef.result;
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/redirect-url');
    });
  
    it('should handle modal rejection/error', async () => {
      const mockModalRef: Partial<NgbModalRef> = {
        result: Promise.reject(new Error('Modal dismissed')),
        componentInstance: { title: '', }
      };
      modalServiceSpy.open.and.returnValue(mockModalRef as NgbModalRef);
      await component.onReupload();
    });
  });
});