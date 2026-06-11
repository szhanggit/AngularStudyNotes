import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { BusinessUnitEnum } from '../../enums/tenant.enum';
import { DatepickerModel } from '../dumb-models/datepicker.model';
import { InputModel } from '../dumb-models/input.model';
import { FieldsDefinition } from './field-definition.model';

export class ImportVoucherFieldsDefinition implements FieldsDefinition {
  private skuCode: InputModel;
  private useDefaultDate: InputModel;
  private expiryDate: DatepickerModel;
  private availableStartDate: DatepickerModel;
  private availableEndDate: DatepickerModel;
  private attachments: InputModel;
  private definitionFields: InputModel[];

  constructor(merchant: string = '', hasError: boolean = false) {
    const hintMessage = merchant
      ? `Merchant name: ${merchant}`
      : hasError
      ? ''
      : 'The associated merchant name will be filled automatically';

    this.skuCode = {
      type: FormInputTypeEnum.Textbox,
      label: 'SKU Code',
      formControlName: 'skuCode',
      required: true,
      buSpecificField: true,
      hintMsg: hintMessage,
      businessUnits: [BusinessUnitEnum.Taiwan],
    };

    this.useDefaultDate = {
      type: FormInputTypeEnum.Checkbox,
      label: 'Use default date',
      formControlName: 'useDefaultDate',
      required: false,
      buSpecificField: true,
      businessUnits: [
        BusinessUnitEnum.Taiwan,
        BusinessUnitEnum.Singapore,
        BusinessUnitEnum.Global,
      ],
    };

    this.expiryDate = {
      type: FormInputTypeEnum.Date,
      label: 'Expiry date',
      formControlName: 'expiryDate',
      required: true,
      datepickerType: 'calendar',
      selectMode: 'single',
      withCheckbox: true,
      checkBoxModel: this.useDefaultDate,
      buSpecificField: true,
      businessUnits: [
        BusinessUnitEnum.Taiwan,
        BusinessUnitEnum.Singapore,
        BusinessUnitEnum.Global,
      ],
    };

    this.availableStartDate = {
      type: FormInputTypeEnum.Date,
      label: 'Available start date',
      formControlName: 'availableStartDate',
      required: true,
      datepickerType: 'calendar',
      selectMode: 'single',
      buSpecificField: true,
      businessUnits: [
        BusinessUnitEnum.Taiwan,
        BusinessUnitEnum.Singapore,
        BusinessUnitEnum.Global,
      ],
    };

    this.availableEndDate = {
      type: FormInputTypeEnum.Date,
      label: 'Available end date',
      formControlName: 'availableEndDate',
      required: true,
      datepickerType: 'calendar',
      selectMode: 'single',
      buSpecificField: true,
      businessUnits: [
        BusinessUnitEnum.Taiwan,
        BusinessUnitEnum.Singapore,
        BusinessUnitEnum.Global,
      ],
    };

    this.attachments = {
      type: FormInputTypeEnum.FileInput,
      label: 'Attachments',
      formControlName: 'attachments',
      required: false,
      takeAllRow: true,
      watchForValueChanges: true,
    };

    this.definitionFields = [
      this.skuCode,
      this.expiryDate,
      this.availableStartDate,
      this.availableEndDate,
      this.attachments,
    ];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
