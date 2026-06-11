import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { ProductTypeEnum } from '../../enums/product-type.enum';
import { InputModel } from '../dumb-models/input.model';
import { FieldsDefinition } from './field-definition.model';

export class AddDeliveryDetailsFieldDefinition implements FieldsDefinition {
  private benificiaryName: InputModel;
  private voucherQuantity: InputModel;
  private contactInfoPhoneNumber: InputModel;
  private clientOrderNumber: InputModel;
  private faceValue: InputModel;
  private edOrderNumber: InputModel;
  private language: InputModel;
  private postCode: InputModel;
  private address: InputModel;

  constructor(productType?: ProductTypeEnum) {
    this.benificiaryName = {
      type: FormInputTypeEnum.Textbox,
      label: 'Beneficiary name',
      formControlName: 'beneficiaryName',
      required: false,
    };

    this.voucherQuantity = {
      type: FormInputTypeEnum.Textbox,
      label: 'Voucher quantity',
      formControlName: 'voucherQuantity',
      required: true,
      isNumberOnly: true,
      validatorsErrorMessage: {
        pattern: 'Only accept positive integers.',
        min: 'Only accept positive integers.',
      },
    };

    this.contactInfoPhoneNumber = {
      type: FormInputTypeEnum.Textbox,
      label: 'Contact info',
      formControlName: 'contactInfoPhoneNumber',
      required: true,
      placeholder: 'Mobile number',
      withSubField: true,
    };

    this.clientOrderNumber = {
      type: FormInputTypeEnum.Textbox,
      label: 'Client order no.',
      formControlName: 'clientOrderNumber',
      required: false,
    };


    this.faceValue = {
      type: FormInputTypeEnum.Textbox,
      label: 'Face value',
      formControlName: 'faceValue',
      required: true,
      hidden: productType !== ProductTypeEnum.DynamicFaceValue,
      isNumberOnly: true,
      subText: 'Face value range: {range}',
      validatorsErrorMessage: {
        pattern: 'Only accept positive integers.',
        min: 'Face value is out of range.',
        max: 'Face value is out of range.',
      },
    };

    this.edOrderNumber = {
      type: FormInputTypeEnum.Textbox,
      label: 'ED Order No.',
      formControlName: 'edOrderNumber',
      required: false,
    };

    this.language = {
      type: FormInputTypeEnum.Textbox,
      label: 'Language',
      formControlName: 'language',
      required: false,
    };

    this.postCode = {
      type: FormInputTypeEnum.Textbox,
      label: 'Post code',
      formControlName: 'postCode',
      required: false,
    };

    this.address = {
      type: FormInputTypeEnum.Textbox,
      label: 'Address',
      formControlName: 'address',
      required: false,
    };
  }

  define(): InputModel[] {
    return [
      this.benificiaryName,
      this.voucherQuantity,
      this.contactInfoPhoneNumber,
      this.clientOrderNumber,
      this.faceValue,
      this.edOrderNumber,
      this.language,
      this.postCode,
      this.address,
    ];
  }
}
