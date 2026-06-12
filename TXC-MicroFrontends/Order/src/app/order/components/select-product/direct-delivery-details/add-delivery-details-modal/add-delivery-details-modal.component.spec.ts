import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliveryDetailsModalComponent } from './add-delivery-details-modal.component';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';

describe('AddDeliveryDetailsModalComponent', () => {
  const activeModalSpy = jasmine.createSpyObj('NgbActiveModal', ['dismiss']);
  let component: AddDeliveryDetailsModalComponent;
  let fixture: ComponentFixture<AddDeliveryDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDeliveryDetailsModalComponent],
      providers: [
        FormBuilder,
        { provide: NgbActiveModal, useValue: activeModalSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDeliveryDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.addDeliveryDetailsFormModel).toBeDefined();
  });

  describe('duplicateFieldsMessage', () => {
    it('should return correct message when DFV type', () => {
      // arrange
      component.productType = ProductTypeEnum.DynamicFaceValue;
      const expectMessage =
        'Contact info/voucher quantity/face value combination already exists.';

      // act
      const actualMessage = component.duplicateFieldsMessage;

      // assert
      expect(actualMessage).toBe(expectMessage);
    });

    it('should return correct message when general product', () => {
      // arrange
      component.productType = ProductTypeEnum.ProductBased;
      const expectMessage =
        'Contact info/voucher quantity combination already exists.';

      // act
      const actualMessage = component.duplicateFieldsMessage;

      // assert
      expect(actualMessage).toBe(expectMessage);
    });
  });

  it('deliveryDetailsFormGroup should define', () => {
    // act
    const actualFaceValue = component.faceValue;
    const actualContactInfoPhone = component.contactInfoPhoneNumber;
    const actualContactInfoEmail = component.contactInfoEmailAddress;
    const actualPostCode = component.postCode;
    const actualAddress = component.address;
    const actualVoucherQty = component.voucherQuantity;
    const actualPostCodeAddress = component.postCodeAddress;

    // assert
    expect(actualFaceValue).toBeDefined();
    expect(actualContactInfoPhone).toBeDefined();
    expect(actualContactInfoEmail).toBeDefined();
    expect(actualPostCode).toBeDefined();
    expect(actualAddress).toBeDefined();
    expect(actualVoucherQty).toBeDefined();
    expect(actualFaceValue).toBeDefined();
    expect(actualPostCodeAddress).toBeDefined();
  });

  describe('faceValueRangeValues ', () => {
    it('should return valid values', () => {
      // arrange
      component.faceValueRange = '1 to 10';

      // act
      const actualFaceValueRangeValues = component.faceValueRangeValues;

      // assert
      expect(actualFaceValueRangeValues).toEqual({ min: 1, max: 10 });
    });

    it('should return empty', () => {
      // arrange
      component.faceValueRange = '';

      // act
      const actualFaceValueRangeValues = component.faceValueRangeValues;

      // assert
      expect(actualFaceValueRangeValues).toEqual({
        min: undefined,
        max: undefined,
      } as any);
    });
  });

  describe('listenToCheckDuplicateFieldValues', () => {
    beforeEach(() => {
      // arrange
      component.editDeliveryDetails = {
        contactInfoPhoneNumber: 2,
        contactInfoEmailAddress: 'test@123',
        voucherQuantity: 10,
        faceValue: 10,
      };
    });

    it('should set has duplicate false when there is no duplicate for DFV', () => {
      // arrange
      component.productType = ProductTypeEnum.DynamicFaceValue;

      // act
      component.deliveryDetailsFormGroup.patchValue({
        contactInfoPhoneNumber: 2,
        contactInfoEmailAddress: 'test@123',
        voucherQuantity: 10,
        faceValue: 10,
      });

      // assert
      expect(component.hasDuplicate).toBeFalse();
    });

    it('should set has duplicate false when there is no duplicate for other product', () => {
      // arrange
      component.productType = ProductTypeEnum.ProductBased;

      // act
      component.deliveryDetailsFormGroup.patchValue({
        contactInfoPhoneNumber: 2,
        contactInfoEmailAddress: 'test@123',
        voucherQuantity: 10,
        faceValue: 10,
      });

      // assert
      expect(component.hasDuplicate).toBeFalse();
    });

    it('should emit duplicate true when there is duplicate for DFV', () => {
      // arrange
      component.existingTableRows = [
        {
          contactInfoPhoneNumber: 3,
          contactInfoEmailAddress: 'test@123',
          voucherQuantity: 10,
          faceValue: 10,
        },
      ];
      const setErrorSpy = spyOn(component, 'setErrors');
      component.productType = ProductTypeEnum.DynamicFaceValue;

      // act
      component.deliveryDetailsFormGroup.patchValue({
        contactInfoPhoneNumber: 3,
        contactInfoEmailAddress: 'test@123',
        voucherQuantity: 10,
        faceValue: 10,
      });

      // assert
      expect(setErrorSpy).toHaveBeenCalledWith(true);
      expect(component.hasDuplicate).toBeTrue();
    });

    it('should emit duplicate true when there is duplicate for other products', () => {
      // arrange
      component.existingTableRows = [
        {
          contactInfoPhoneNumber: 3,
          contactInfoEmailAddress: 'test@123',
          voucherQuantity: 10,
          faceValue: 10,
        },
      ];
      const setErrorSpy = spyOn(component, 'setErrors');
      component.productType = ProductTypeEnum.ProductBased;

      // act
      component.deliveryDetailsFormGroup.patchValue({
        contactInfoPhoneNumber: 3,
        contactInfoEmailAddress: 'test@123',
        voucherQuantity: 10,
        faceValue: 10,
      });

      // assert
      expect(setErrorSpy).toHaveBeenCalledWith(true);
      expect(component.hasDuplicate).toBeTrue();
    });
  });

  it('patchDeliveryDetailValuesOnEdit should patch form', () => {
    // arrange
    const patchSpy = spyOn(component.deliveryDetailsFormGroup, 'patchValue');
    const expectedDetails = {
      contactInfoPhoneNumber: 2,
      contactInfoEmailAddress: 'test@123',
      voucherQuantity: 10,
      faceValue: 10,
    };
    component.editDeliveryDetails = expectedDetails;

    // act
    component.patchDeliveryDetailValuesOnEdit();

    // assert
    expect(patchSpy).toHaveBeenCalledWith(expectedDetails);
  });

  const expectedDetails = {
    contactInfoPhoneNumber: 2,
    contactInfoEmailAddress: 'test@123',
    voucherQuantity: 10,
    faceValue: 10,
  };

  describe('setErrors', () => {
    beforeEach(() => {
      // arrange
      component.editDeliveryDetails = expectedDetails;
      component.patchDeliveryDetailValuesOnEdit();
    });

    it('should set error for voucher quantity and face value when param is true', () => {
      // act
      component.setErrors(true);

      // assert
      expect(component.voucherQuantity?.hasError('hasDuplicate')).toBeTrue();

      expect(component.faceValue?.hasError('hasDuplicate')).toBeTrue();
    });

    it('should not set error for voucher quantity when param is false', () => {
      // act
      component.setErrors(false);

      // assert
      expect(component.voucherQuantity?.hasError('hasDuplicate')).toBeFalse();
    });

    it('should not set error for voucher quantity and face value when param is true on DFV', () => {
      // arrange
      component.productType = ProductTypeEnum.DynamicFaceValue;

      // act
      component.setErrors(false);

      // assert
      expect(component.voucherQuantity?.hasError('hasDuplicate')).toBeFalse();
      expect(component.faceValue?.hasError('hasDuplicate')).toBeFalse();
    });
  });

  describe('setContactInfoErrors', () => {
    beforeEach(() => {
      // arrange
      component.editDeliveryDetails = expectedDetails;
      component.patchDeliveryDetailValuesOnEdit();
    });

    it('should set dupe error for phone number and email when param is true', () => {
      // act
      component.editDeliveryDetails = expectedDetails;
      component.patchDeliveryDetailValuesOnEdit();
      component.setContactInfoErrors(true);

      // assert
      expect(
        component.contactInfoPhoneNumber?.hasError('hasDuplicate')
      ).toBeTrue();

      expect(
        component.contactInfoEmailAddress?.hasError('hasDuplicate')
      ).toBeTrue();
    });

    it('should set required error for phone number and email if there is no value for both when param is true', () => {
      // arrange
      const requiredDetails = { ...expectedDetails };
      requiredDetails.contactInfoEmailAddress = null as any;
      requiredDetails.contactInfoPhoneNumber = null as any;
      component.editDeliveryDetails = requiredDetails;
      component.patchDeliveryDetailValuesOnEdit();

      // act
      component.setContactInfoErrors(false);

      // assert
      expect(component.contactInfoPhoneNumber?.hasError('required')).toBeTrue();

      expect(
        component.contactInfoEmailAddress?.hasError('required')
      ).toBeTrue();
    });

    it('should not set error for phone number and email when param is false', () => {
      // act
      component.setContactInfoErrors(false);

      // assert
      expect(
        component.contactInfoPhoneNumber?.hasError('hasDuplicate')
      ).toBeFalse();
      expect(
        component.contactInfoEmailAddress?.hasError('hasDuplicate')
      ).toBeFalse();
    });

    it('should mark dirty them both when param is false', () => {
      // arrange
      component.editDeliveryDetails = expectedDetails;
      component.patchDeliveryDetailValuesOnEdit();
      component.contactInfoEmailAddress?.markAsDirty();

      // act
      component.setErrors(false);

      // assert
      expect(component.contactInfoEmailAddress?.dirty).toBeTrue();
      expect(component.contactInfoPhoneNumber?.dirty).toBeTrue();
    });
  });

  it('onSave should dismiss active modal with delivery details form values', () => {
    // act
    component.onSave();

    // assert
    expect(activeModalSpy.dismiss)
      .toHaveBeenCalledWith(component.deliveryDetailsFormGroup.value);
  });

  it('onCancel should dismiss active modal', () => {
    // act
    component.onCancel();

    // assert
    expect(activeModalSpy.dismiss).toHaveBeenCalled();
  });
});
