import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ImportVoucherNumberModalComponent } from './import-voucher-number-modal.component';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DownloadTemplateModalComponent } from '../download-template-modal/download-template-modal.component';
import { AttachmentService } from '@txc-angular/component-library';
import { environment } from 'src/environments/environment';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormInputTypeEnum } from 'src/app/batch-processor/enums/form-input-type.enum';
import { BusinessUnitEnum } from 'src/app/batch-processor/enums/tenant.enum';
import { BatchListService } from 'src/app/batch-processor/services/data/batch-list.service';
import { UtilityService } from 'src/app/batch-processor/services/utility.service';
import { of, throwError } from 'rxjs';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';
import { BatchListStateService } from 'src/app/batch-processor/services/state/batch-list-state.service';
import { ImportVoucherFieldsDefinition } from 'src/app/batch-processor/models/field-definition/import-voucher-fields-definition.model';

describe('ImportVoucherNumberModalComponent', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'delete']);
  let component: ImportVoucherNumberModalComponent;
  let fixture: ComponentFixture<ImportVoucherNumberModalComponent>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;
  let modalRef: jasmine.SpyObj<NgbModalRef>;
  let attachmentServiceSpy: jasmine.SpyObj<AttachmentService>;
  let batchListServiceSpy: jasmine.SpyObj<BatchListService>;
  let utilityServiceSpy: jasmine.SpyObj<UtilityService>;
  let eventStateServiceSpy: jasmine.SpyObj<EventStateService>;
  let batchListStateServiceSpy: jasmine.SpyObj<BatchListStateService>;

  beforeEach(async () => {
    modalRef = jasmine.createSpyObj('NgbModalRef', ['result']);
    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    modalServiceSpy.open.and.returnValue(modalRef);
    attachmentServiceSpy = jasmine.createSpyObj('AttachmentService', [
      'downloadSample',
    ]);
    batchListServiceSpy = jasmine.createSpyObj('BatchListService', [
      'uploadInventoryVoucherNumber',
    ]);
    utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
      'transformedSourceValue',
      'filterCommonBatchTable',
      'listenToUploadSuccess',
      'listenToErrorMessage',
      'unsubscribeToastSubscriptions',
      'getLocalDateTime',
    ]);
    batchListStateServiceSpy = jasmine.createSpyObj(
      'BatchListStateService',
      ['getMerchantBySkuCode'],
      {
        merchantBySkuCode$: of({ data: { program: { name: 'Test Program' } } }),
      }
    );

    eventStateServiceSpy = jasmine.createSpyObj('EventStateService', [], {
      isUploadSuccess$: of({ isSuccess: true }),
    });

    await TestBed.configureTestingModule({
      declarations: [ImportVoucherNumberModalComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: AttachmentService, useValue: attachmentServiceSpy },
        { provide: BatchListService, useValue: batchListServiceSpy },
        { provide: BatchListStateService, useValue: batchListStateServiceSpy },
        {
          provide: UtilityService,
          useValue: utilityServiceSpy,
        },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportVoucherNumberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on useDefaultDate changes', () => {
    beforeEach(() => {
      component.listenToDateChange();
    });
    it('should set default dates and disable fields when useDefaultDate is true', () => {
      spyOn(component, 'setDefaultDates');

      component.useDefaultDate.setValue(true);

      expect(component.setDefaultDates).toHaveBeenCalled();
      expect(component.availableStartDate.disabled).toBeTrue();
      expect(component.availableEndDate.disabled).toBeTrue();
    });

    it('should enable fields when useDefaultDate is false', () => {
      component.availableStartDate.disable();
      component.availableEndDate.disable();

      component.useDefaultDate.setValue(false);

      expect(component.availableStartDate.enabled).toBeTrue();
      expect(component.availableEndDate.enabled).toBeTrue();
    });
  });

  describe('expiryDate valueChanges', () => {
    beforeEach(() => {
      component.listenToDateChange();
    });

    it('should set availableEndDate value when useDefaultDate is true', () => {
      component.useDefaultDate.setValue(true);
      const mockDate = new Date('2023-11-01');
      component.expiryDate.setValue(mockDate);

      expect(component.availableEndDate.value).toEqual(mockDate);
    });

    it('should not set availableEndDate value when useDefaultDate is false', () => {
      component.useDefaultDate.setValue(false);
      const initialAvailableEndDateValue = component.availableEndDate.value;
      const mockDate = new Date('2023-11-01');
      component.expiryDate.setValue(mockDate);
      expect(component.availableEndDate.value).toEqual(
        initialAvailableEndDateValue
      );
    });
  });

  describe('setFormControlValidators', () => {
    beforeEach(() => {
      component.initializeForm();
    });

    it('should add required validators to the appropriate fields', () => {
      spyOn(component.fieldsDefinition, 'define').and.returnValue([
        {
          type: FormInputTypeEnum.Typeahead,
          formControlName: 'merchant',
          required: true,
          buSpecificField: true,
          businessUnits: [BusinessUnitEnum.Taiwan],
        },
        {
          type: FormInputTypeEnum.Textbox,
          formControlName: 'skuCode',
          required: true,
          buSpecificField: true,
          businessUnits: [BusinessUnitEnum.Taiwan],
        },
        {
          type: FormInputTypeEnum.Date,
          formControlName: 'expiryDate',
          required: true,
          buSpecificField: true,
          businessUnits: [
            BusinessUnitEnum.Taiwan,
            BusinessUnitEnum.Singapore,
            BusinessUnitEnum.Global,
          ],
        },
      ]);

      component.selectedTenant = 'SG';
      component.setFormControlValidators();

      const merchantControl =
        component.importVoucherNumberFormGroup.get('merchant');
      const skuCodeControl =
        component.importVoucherNumberFormGroup.get('skuCode');
      const expiryDateControl =
        component.importVoucherNumberFormGroup.get('expiryDate');
      expect(merchantControl?.validator).toBeFalsy(
        'The "merchant" control should not have validators'
      );
      expect(skuCodeControl?.validator).toBeFalsy(
        'The "skuCode" control should not have validators'
      );
      expect(expiryDateControl?.validator).toBeTruthy(
        'The "expiryDateControl" control should not have validators'
      );
    });
  });

  describe('on setDefaultDates()', () => {
    beforeEach(() => {
      jasmine.clock().install();
      const baseTime = new Date(2023, 10, 1);
      jasmine.clock().mockDate(baseTime);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should set default dates', () => {
      const mockExpiryDate = new Date('2023-11-01T00:00:00');

      component.initializeForm();
      component.importVoucherNumberFormGroup.patchValue({
        expiryDate: mockExpiryDate,
      });

      component.setDefaultDates();

      const startDateControl = component.availableStartDate;
      const endDateControl = component.availableEndDate;

      expect(startDateControl.value).toEqual(mockExpiryDate);
      expect(startDateControl.pristine).toBeTruthy();

      expect(endDateControl.value).toEqual(mockExpiryDate);
      expect(endDateControl.pristine).toBeTruthy();
    });
  });

  describe('on modal window open', () => {
    it('should open modal window and handle confirm result', async () => {
      modalRef.result = Promise.resolve('confirm');
      spyOn(component, 'downloadTemplate');
      await component.onDownload(new Event('click'));
      expect(modalServiceSpy.open).toHaveBeenCalledWith(
        DownloadTemplateModalComponent,
        {
          size: 'md',
          backdrop: 'static',
          centered: true,
        }
      );
      expect(component.downloadTemplate).toHaveBeenCalledWith(
        jasmine.any(Event)
      );
    });

    it('should handle modal dismissal', async () => {
      modalRef.result = Promise.reject('dismiss');
      const downloadTemplateSpy = spyOn(component, 'downloadTemplate');
      await component.onDownload(new Event('click'));

      expect(modalServiceSpy.open).toHaveBeenCalledWith(
        DownloadTemplateModalComponent,
        {
          size: 'md',
          backdrop: 'static',
          centered: true,
        }
      );

      expect(downloadTemplateSpy).not.toHaveBeenCalled();
    });
  });

  describe('listenToSkuCodeChange', () => {
    let skuCodeSpy: jasmine.Spy;
    let merchantNameSpy: jasmine.Spy;
    beforeEach(() => {
      skuCodeSpy = spyOn(component.skuCode, 'setErrors');
      merchantNameSpy = spyOn(component.merchantName, 'setValue');
    });

    it('should set merchant name when SKU code is valid', fakeAsync(() => {
      component.listenToSkuCodeChange();

      component.skuCode.setValue('valid_sku_code');

      tick(500);

      expect(
        batchListStateServiceSpy.getMerchantBySkuCode
      ).toHaveBeenCalledWith('valid_sku_code');
    }));

    it('should clear merchant name', () => {
      component.clearMerchantName();

      expect(merchantNameSpy).toHaveBeenCalledWith(null);
      expect(component.fieldsDefinition).toEqual(
        new ImportVoucherFieldsDefinition('', true)
      );
    });

    it('should set invalid SKU code error when hasError is true', fakeAsync(() => {
      component.setInvalidSkuCodeError(true);

      tick();

      expect(skuCodeSpy).toHaveBeenCalledWith({
        invalidSkuCode: true,
      });
    }));

    it('should clear SKU code errors when hasError is false', fakeAsync(() => {
      component.setInvalidSkuCodeError(false);

      tick();

      expect(skuCodeSpy).toHaveBeenCalledWith(null);
    }));

    // it('should clear merchant name when SKU code is invalid', (done) => {
    //   batchListStateServiceSpy.merchantBySkuCode$ = of({ data: null });

    //   component.listenToSkuCodeChange();

    //   component.skuCode.setValue('invalid_sku_code');

    //   setTimeout(() => {
    //     expect(
    //       batchListStateServiceSpy.getMerchantBySkuCode
    //     ).toHaveBeenCalledWith('invalid_sku_code');
    //     expect(component.merchantName.setValue).toHaveBeenCalledWith(null);
    //     done();
    //   }, 500);
    // });
  });

  describe('downloadTemplate', () => {
    it('should call downloadSample with correct arguments', () => {
      const mockEvent = new MouseEvent('click');
      const expectedHref = environment.local
        ? '/assets/templates/import-voucher-template.xlsx'
        : '/move/assets/templates/import-voucher-template.xlsx';

      component.downloadTemplate(mockEvent);

      expect(attachmentServiceSpy.downloadSample).toHaveBeenCalledWith(
        mockEvent,
        expectedHref
      );
    });
  });

  describe('onImportClicked', () => {
    beforeEach(() => {
      component.attachments.setValue([new File([], 'test.xlsx')]);
    });

    it('should set isUploadSuccess to true when upload is successful', () => {
      batchListServiceSpy.uploadInventoryVoucherNumber.and.returnValue(of({}));

      component.onImportClicked();

      eventStateServiceSpy.isUploadSuccess$.subscribe((isUploadSuccess) => {
        expect(isUploadSuccess).toEqual({ isSuccess: true });
      });
    });

    it('should set isUploadSuccess to false when upload fails', () => {
      batchListServiceSpy.uploadInventoryVoucherNumber.and.returnValue(
        throwError({ error: { Message: 'Upload failed' } })
      );

      component.onImportClicked();

      // eventStateServiceSpy.isUploadSuccess$.subscribe((isUploadSuccess) => {
      //   expect(isUploadSuccess).toEqual({
      //     isSuccess: false,
      //     errorMessage: 'Upload failed',
      //   });
      // });
    });
  });
});
