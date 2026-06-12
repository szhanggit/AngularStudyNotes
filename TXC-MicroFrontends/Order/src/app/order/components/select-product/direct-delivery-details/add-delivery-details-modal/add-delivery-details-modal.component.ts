import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormInputTypeEnum } from 'src/app/shared/enums/form-input-type.enum';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { AddDeliveryDetailsFieldDefinition } from 'src/app/shared/models/fields-definition/add-delivery-details-fields-definition.model';

@Component({
  selector: 'app-add-delivery-details-modal',
  templateUrl: './add-delivery-details-modal.component.html',
  styleUrls: ['./add-delivery-details-modal.component.scss'],
})
export class AddDeliveryDetailsModalComponent implements OnInit {
  productType!: ProductTypeEnum;
  deliveryDetailsFormGroup!: FormGroup;
  addDetailsFieldsDefinition!: AddDeliveryDetailsFieldDefinition;
  contactInfoEmailAddressModel: InputModel = {
    type: FormInputTypeEnum.Textbox,
    label: 'Email address',
    subField: true,
    formControlName: 'contactInfoEmailAddress',
    required: false,
    placeholder: 'Email address',
    subText: 'Please fill at least one contact info.',
  };
  editDeliveryDetails: any;
  existingTableRows: any[] = [];
  hasDuplicate: boolean = false;
  faceValueRange!: string;

  get duplicateFieldsMessage() {
    return `Contact info/voucher quantity${
      this.productType === ProductTypeEnum.DynamicFaceValue ? '/face value' : ''
    } combination already exists.`;
  }

  get addDeliveryDetailsFormModel(): FormModel {
    return {
      formGroup: this.deliveryDetailsFormGroup,
      title: 'Add delivery details',
      fieldsDefinition: this.addDetailsFieldsDefinition.define(),
    };
  }

  get faceValue() {
    return this.deliveryDetailsFormGroup.get('faceValue');
  }

  get contactInfoPhoneNumber() {
    return this.deliveryDetailsFormGroup.get('contactInfoPhoneNumber');
  }

  get contactInfoEmailAddress() {
    return this.deliveryDetailsFormGroup.get('contactInfoEmailAddress');
  }

  get postCode() {
    return this.deliveryDetailsFormGroup.get('postCode');
  }

  get address() {
    return this.deliveryDetailsFormGroup.get('address');
  }

  get voucherQuantity() {
    return this.deliveryDetailsFormGroup.get('voucherQuantity');
  }

  get postCodeAddress() {
    return this.deliveryDetailsFormGroup.get('postCodeAddress');
  }

  get faceValueRangeValues() {
    const [min, max] = this.faceValueRange
      ? this.faceValueRange?.split(' to ')?.map(Number)
      : [];

    return { min: min, max: max };
  }

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.initializeAddDeliveryDetailsFieldDefinition();
    this.initializeDeliveryDetailsFormGroup();
    this.listenToCheckDuplicateFieldValues();
  }

  initializeAddDeliveryDetailsFieldDefinition() {
    this.addDetailsFieldsDefinition = new AddDeliveryDetailsFieldDefinition(
      this.productType
    );
    this.addDetailsFieldsDefinition['faceValue']['subText'] =
      this.addDetailsFieldsDefinition['faceValue']['subText']?.replace(
        '{range}',
        this.faceValueRange
      );
  }

  listenToCheckDuplicateFieldValues() {
    this.deliveryDetailsFormGroup.valueChanges.subscribe((value) => {
      if (this.editDeliveryDetails) {
        if (
          this.editDeliveryDetails.contactInfoPhoneNumber ===
            value.contactInfoPhoneNumber &&
          this.editDeliveryDetails.contactInfoEmailAddress ===
            value.contactInfoEmailAddress &&
          this.editDeliveryDetails.voucherQuantity === value.voucherQuantity &&
          (this.productType === ProductTypeEnum.DynamicFaceValue
            ? this.editDeliveryDetails.faceValue === value.faceValue
            : true)
        ) {
          this.hasDuplicate = false;
          return;
        }
      }

      if (this.existingTableRows.length >= 1) {
        this.hasDuplicate = this.existingTableRows.some(
          (r) =>
            r.contactInfoPhoneNumber === value.contactInfoPhoneNumber &&
            r.contactInfoEmailAddress === value.contactInfoEmailAddress &&
            r.voucherQuantity === value.voucherQuantity &&
            (this.productType === ProductTypeEnum.DynamicFaceValue
              ? r.faceValue === value.faceValue
              : true)
        );
      }

      this.setErrors(this.hasDuplicate);
    });
  }

  initializeDeliveryDetailsFormGroup() {
    this.deliveryDetailsFormGroup = this.formBuilder.group({
      beneficiaryName: '',
      voucherQuantity: [''],
      contactInfoPhoneNumber: [''],
      contactInfoEmailAddress: [''],
      clientOrderNumber: [''],
      faceValue: [''],
      edOrderNumber: [''],
      language: [''],
      postCode: [''],
      address: [''],
      postCodeAddress: [''],
    });

    this.patchDeliveryDetailValuesOnEdit();
  }

  patchDeliveryDetailValuesOnEdit() {
    if (this.editDeliveryDetails) {
      this.deliveryDetailsFormGroup.patchValue(this.editDeliveryDetails);
    }
  }

  setErrors(hasDuplicate: boolean) {
    this.setContactInfoErrors(this.hasDuplicate);
    if (hasDuplicate) {
      if (this.voucherQuantity?.value) {
        this.voucherQuantity?.setErrors({ hasDuplicate: true });
      }
      if (this.faceValue?.value) {
        this.faceValue?.setErrors({ hasDuplicate: true });
      }
    } else {
      this.voucherQuantity?.setErrors(null);
      this.voucherQuantity?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^[0-9]\d*$/),
      ]);
      if (this.productType === ProductTypeEnum.DynamicFaceValue) {
        this.faceValue?.setValidators([
          Validators.required,
          Validators.min(this.faceValueRangeValues.min),
          Validators.max(this.faceValueRangeValues.max),
          Validators.pattern(/^[0-9]\d*$/),
        ]);
      } else {
        this.faceValue?.clearValidators();
      }

      this.voucherQuantity?.updateValueAndValidity({ emitEvent: false });
      this.faceValue?.updateValueAndValidity({ emitEvent: false });
    }
  }

  setContactInfoErrors(hasDuplicate: boolean) {
    if (hasDuplicate) {
      if (this.contactInfoPhoneNumber?.value) {
        this.contactInfoPhoneNumber?.setErrors({ hasDuplicate: true });
      }
      if (this.contactInfoEmailAddress?.value) {
        this.contactInfoEmailAddress?.setErrors({ hasDuplicate: true });
      }
    } else {
      if (
        !this.contactInfoPhoneNumber?.value &&
        !this.contactInfoEmailAddress?.value
      ) {
        this.contactInfoPhoneNumber?.setErrors({ required: true });
        this.contactInfoEmailAddress?.setErrors({ required: true });
      } else {
        this.contactInfoPhoneNumber?.setErrors(null);
        this.contactInfoEmailAddress?.setErrors(null);
      }

      if (
        this.contactInfoPhoneNumber?.dirty ||
        this.contactInfoEmailAddress?.dirty
      ) {
        this.contactInfoPhoneNumber?.markAsDirty();
        this.contactInfoEmailAddress?.markAsDirty();
      }

      if (this.contactInfoEmailAddress?.value) {
        this.contactInfoEmailAddress.setValidators(Validators.email);
        this.contactInfoEmailAddress.updateValueAndValidity({
          emitEvent: false,
        });
      }
    }
  }

  onSave() {
    this.postCodeAddress?.setValue(
      `${this.postCode?.value}, ${this.address?.value}`
    );
    this.activeModal.dismiss(this.deliveryDetailsFormGroup.value);
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
