import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBatchOrderModalComponent } from './create-batch-order-modal.component';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators } from '@angular/forms';
import { AttachmentService } from '@txc-angular/component-library';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';
import { BatchListService } from 'src/app/batch-processor/services/data/batch-list.service';
import { of } from 'rxjs';

describe('CreateBatchOrderModalComponent', () => {
  let component: CreateBatchOrderModalComponent;
  let fixture: ComponentFixture<CreateBatchOrderModalComponent>;
  const attachmentServiceSpy = jasmine.createSpyObj('AttachmentService', [
    'downloadSample',
  ]);
  const eventStateServiceSpy = jasmine.createSpyObj('EventStateService', [''], {
    isUploadSuccess$: false,
  });

  const batchListServiceSpy = jasmine.createSpyObj('BatchListService', [
    'mockUpload',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBatchOrderModalComponent],
      providers: [
        FormBuilder,
        { provide: AttachmentService, useValue: attachmentServiceSpy },
        { provide: EventStateService, useValue: eventStateServiceSpy },
        { provide: BatchListService, useValue: batchListServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBatchOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with attachments field', () => {
    component.initializeForm();
    expect(
      component.uploadBatchOrderFormGroup.get('attachments')
    ).toBeDefined();
    expect(
      component.uploadBatchOrderFormGroup.get('attachments')?.validator
    ).toBe(Validators.required);
  });

  it('should call attachmentService.downloadSample with correct parameters when onDownload is called', () => {
    const event = new Event('click');

    const href = environment.local
      ? '/assets/templates/import-voucher-template.xlsx'
      : '/move/assets/templates/import-voucher-template.xlsx';

    component.onDownload(event);
    expect(attachmentServiceSpy.downloadSample).toHaveBeenCalledWith(
      event,
      href
    );
  });

  it('should set eventStateService.isUploadSuccess to true when onUploadClicked is called and upload is success', () => {
    component.attachments?.setValue({ name: 'test.xlsx' });
    batchListServiceSpy.mockUpload.and.returnValue(of({ message: 'Success' }));
    const expected = { isSuccess: true };
    component.onUploadClicked();
    expect(eventStateServiceSpy.isUploadSuccess).toEqual(expected);
  });

  it('should set eventStateService.isUploadSuccess to false when onUploadClicked is called and upload failed', () => {
    component.attachments?.setValue({ name: 'MockError.xlsx' });
    batchListServiceSpy.mockUpload.and.returnValue(
      of({ message: 'Invalid file' })
    );
    const expected = { isSuccess: false, errorMessage: 'Invalid file' };
    component.onUploadClicked();
    expect(eventStateServiceSpy.isUploadSuccess).toEqual(expected);
  });
});
