import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBatchOperationsModalComponent } from './upload-batch-operations-modal.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AttachmentService } from '@txc-angular/component-library';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';
import { BatchListService } from 'src/app/batch-processor/services/data/batch-list.service';
import { of } from 'rxjs';

describe('UploadBatchOperationsModalComponent', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'delete']);
  let component: UploadBatchOperationsModalComponent;
  let fixture: ComponentFixture<UploadBatchOperationsModalComponent>;
  let attachmentServiceSpy: jasmine.SpyObj<AttachmentService>;
  const eventStateServiceSpy = jasmine.createSpyObj('EventStateService', [''], {
    isUploadSuccess$: of({ isSuccess: true }),
  });
  const batchListServiceSpy = jasmine.createSpyObj('BatchListService', [
    'mockUpload',
  ]);

  beforeEach(async () => {
    attachmentServiceSpy = jasmine.createSpyObj('AttachmentService', [
      'downloadSample',
    ]);

    await TestBed.configureTestingModule({
      declarations: [UploadBatchOperationsModalComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: AttachmentService, useValue: attachmentServiceSpy },
        { provide: BatchListService, useValue: batchListServiceSpy },
        EventStateService,
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBatchOperationsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDownload', () => {
    it('should call downloadSample with correct arguments', () => {
      const mockEvent = new MouseEvent('click');
      const expectedHref = environment.local
        ? '/assets/templates/import-voucher-template.xlsx'
        : '/move/assets/templates/import-voucher-template.xlsx';

      component.onDownload(mockEvent);

      expect(attachmentServiceSpy.downloadSample).toHaveBeenCalledWith(
        mockEvent,
        expectedHref
      );
    });
  });

  it('should set eventStateService.isUploadSuccess to true when onUploadClicked is called and upload is success', () => {
    component.attachments?.setValue({ name: 'test.xlsx' });
    batchListServiceSpy.mockUpload.and.returnValue(of({ message: 'Success' }));
    const expected = { isSuccess: true };
    component.onUploadClicked();
    eventStateServiceSpy.isUploadSuccess$.subscribe((isUploadSuccess: any) => {
      expect(isUploadSuccess).toEqual(expected);
    });
  });

  xit('should set eventStateService.isUploadSuccess to false when onUploadClicked is called and upload failed', () => {
    component.attachments?.setValue({ name: 'MockError.xlsx' });
    batchListServiceSpy.mockUpload.and.returnValue(
      of({ message: 'Invalid file' })
    );
    const expected = { isSuccess: false, errorMessage: 'Invalid file' };
    component.onUploadClicked();

    eventStateServiceSpy.isUploadSuccess$.subscribe((isUploadSuccess: any) => {
      expect(isUploadSuccess).toEqual(expected);
    });
  });
});
