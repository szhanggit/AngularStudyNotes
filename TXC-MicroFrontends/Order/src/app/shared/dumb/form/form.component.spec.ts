import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FormEmitterService } from './form-emitter.service';
import { AttachmentService } from 'src/app/order/services/attachment.service';
import { CustomFile, FileEvent } from '../../models/custom-file.model';
import { FileEventTypeEnum } from '../../enums/file-event-type.enum';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let attachmentService: jasmine.SpyObj<AttachmentService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      providers: [
        FormBuilder,
        FormEmitterService,
        {
          provide: AttachmentService,
          useValue: jasmine.createSpyObj('AttachmentService', [
            'downloadRecentlyUploadedAttachment',
          ]),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    const fb = TestBed.inject(FormBuilder);
    component.formModel = {
      formGroup: fb.group({
        field: '',
        field2: 'test',
      }),
      fieldsDefinition: [
        {
          formControlName: 'field',
          type: FormInputTypeEnum.Textbox,
          required: true,
        },
        {
          formControlName: 'field2',
          type: FormInputTypeEnum.Textbox,
          required: false,
          watchForValueChanges: true,
          hideActionButton: true,
        },
      ],
    };
    attachmentService = TestBed.inject(
      AttachmentService
    ) as jasmine.SpyObj<AttachmentService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('disableAllInput()', () => {
    it('should be defined', () => {
      // assert
      expect(component.disableAllInput).toBeDefined();
    });

    it('should disable all controls', () => {
      // act
      component.disableAllInput = true;

      // assert
      component.formModel.fieldsDefinition.forEach((field) => {
        expect(
          component.formModel.formGroup.get(field.formControlName)?.disabled
        ).toBeTrue();
      });
    });

    it('should enable all controls', () => {
      // act
      component.disableAllInput = false;

      // assert
      component.formModel.fieldsDefinition.forEach((field) => {
        expect(
          component.formModel.formGroup.get(field.formControlName)?.enabled
        ).toBeTrue();
      });
    });
  });

  describe('getFieldColumnClass()', () => {
    it('should return col-12 as default', () => {
      // assert
      expect(component.getFieldColumnClass({} as any)).toBe('col-12');
    });

    it('should return defined', () => {
      // assert
      expect(component.getFieldColumnClass({ columns: 6 } as any)).toBe(
        'col-6'
      );
    });
  });

  describe('watchForValueChanges()', () => {
    it('should set the action buttons to false', () => {
      // act
      component.formModel.formGroup.patchValue({ field2: '' });

      // assert
      expect(component.showActionButtons).toBeFalse();
    });
  });

  describe('getMappedValue()', () => {
    it('should return -- as default', () => {
      // act
      const actualMappedValue = component.getMappedValue([], 1);

      // assert
      expect(actualMappedValue).toBe('--');
    });

    it('should return correct value', () => {
      // act
      const actualMappedValue = component.getMappedValue(
        [{ value: 1, label: 'myLabel' }],
        1
      );

      // assert
      expect(actualMappedValue).toBe('myLabel');
    });
  });

  describe('emitEvent()', () => {
    it('should emit form control name', () => {
      // arrange
      const emitEventSpy = spyOn(
        (component as any).formEmitterService.emitEvent,
        'next'
      );

      // act
      component.emitEvent('field');

      // assert
      expect(emitEventSpy).toHaveBeenCalledWith('field');
    });
  });

  describe('onAttachmentDownload()', () => {
    it('should call downloadRecentlyUploadedAttachment from attachmentServiice', () => {
      // arrange
      const file: CustomFile = new File([], 'test.xls');

      // act
      component.onAttachmentDownload(file);

      // assert
      expect(
        attachmentService.downloadRecentlyUploadedAttachment
      ).toHaveBeenCalledWith(file);
    });
  });

  describe('emit file event', () => {
    it('should emit on emitfileEventWithApi()', () => {
      // arrange
      const fileEvent: FileEvent = {
        customFiles: [new File([], 'test.xls')],
        eventType: FileEventTypeEnum.UPLOAD,
      };
      const fileEventWithApiEmitSpy = spyOn(component.fileEventWithApi, 'emit');

      // act
      component.emitfileEventWithApi(fileEvent);

      // assert
      expect(fileEventWithApiEmitSpy).toHaveBeenCalledWith(fileEvent);
    });

    it('should emit on emitFileEvent()', () => {
      // arrange
      const fileEvent: FileEvent = {
        customFiles: [new File([], 'test.xls')],
        eventType: FileEventTypeEnum.UPLOAD,
      };
      const fileEventSpy = spyOn(component.fileEvent, 'emit');

      // act
      component.emitFileEvent(fileEvent);

      // assert
      expect(fileEventSpy).toHaveBeenCalledWith(fileEvent);
    });
  });
});
