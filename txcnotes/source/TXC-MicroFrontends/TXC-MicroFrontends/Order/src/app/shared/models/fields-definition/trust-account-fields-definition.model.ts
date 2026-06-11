import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { DatepickerModel } from '../dumb-models/datepicker.model';
import { InputModel } from '../dumb-models/input.model';
import { RadioButtonModel } from '../dumb-models/radio-button.model';
import { SelectModel } from '../dumb-models/select.model';
import { FieldsDefinition } from './field-definition.model';

export class TrustAccountFieldsDefinition implements FieldsDefinition {
  private isTrustAccountNeeded: RadioButtonModel;
  private trustAccount: SelectModel;
  private trustAccountFee: InputModel;
  private trustAccountBank: InputModel;
  private trustAccountBatchNumber: InputModel;
  private trustAccountOption: SelectModel;
  private trustAmount: InputModel;
  private trustExpiryScheme: SelectModel;
  private trustExpiryDate: DatepickerModel;
  private validPeriod: DatepickerModel;

  private definitionFields: InputModel[];
  constructor(editMode = false) {
    this.isTrustAccountNeeded = {
      type: FormInputTypeEnum.RadioButton,
      label: 'Need Trust Account',
      formControlName: 'isTrustAccountNeeded',
      required: false,
      takeAllRow: editMode,
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    };

    this.trustAccount = {
      type: FormInputTypeEnum.Select,
      label: 'Trust account',
      formControlName: 'trustAccount',
      required: false,
      hidden: false,
      select2Data: [
        {
          label: 'Select',
          value: -1,
        },
      ],
    };

    this.trustAccountBank = {
      type: FormInputTypeEnum.Textbox,
      label: 'Trust account bank',
      formControlName: 'trustAccountBank',
      required: false,
    };

    this.trustAccountFee = {
      type: FormInputTypeEnum.Textbox,
      label: 'Trust account fee',
      formControlName: 'trustAccountFee',
      required: false,
      hidden: false,
    };

    this.trustAccountBatchNumber = {
      type: FormInputTypeEnum.Textbox,
      label: 'Trust account batch number',
      formControlName: 'trustAccountBatchNumber',
      required: false,
      isNumberOnly: true,
      hidden: false,
      validatorsErrorMessage: {
        pattern: 'Only accept numbers.',
      },
    };

    this.trustAccountOption = {
      type: FormInputTypeEnum.Select,
      label: 'Trust account option',
      formControlName: 'trustAccountOption',
      required: false,
      hidden: false,
      select2Data: [
        {
          label: 'Default',
          value: 'Default',
        },
        {
          label: 'Custom',
          value: 'Custom',
        },
      ],
    };

    this.trustAmount = {
      type: FormInputTypeEnum.Textbox,
      label: 'Trust amount',
      formControlName: 'trustAmount',
      required: false,
      hidden: false,
      validatorsErrorMessage: {
        pattern: 'Only accept at most two decimal places.',
      },
    };

    this.trustExpiryScheme = {
      type: FormInputTypeEnum.Select,
      label: 'Trust expiry scheme',
      formControlName: 'trustExpiryScheme',
      required: false,
      hidden: false,
      select2Data: [
        {
          label: 'Select',
          value: -1,
        },
      ],
    };

    this.trustExpiryDate = {
      type: FormInputTypeEnum.Date,
      label: 'Trust expiry date',
      formControlName: 'trustExpiryDate',
      required: false,
      hidden: false,
      datepickerType: 'calendar',
      selectMode: 'single',
    };

    this.validPeriod = {
      type: FormInputTypeEnum.Date,
      label: 'Valid period',
      formControlName: 'validPeriod',
      required: false,
      datepickerType: 'calendar',
      selectMode: 'range',
    };

    this.definitionFields = [
      this.isTrustAccountNeeded,
      this.trustAccount,
      this.trustAccountFee,
      this.trustAccountBatchNumber,
      this.trustAccountOption,
      this.trustAmount,
      this.trustExpiryScheme,
      this.trustExpiryDate,
    ];

    if (editMode) {
      this.definitionFields = [
        ...this.definitionFields.slice(0, 2),
        this.trustAccountBank,
        ...this.definitionFields.slice(2),
        this.validPeriod,
      ];
    }
  }
  define(): InputModel[] {
    return this.definitionFields;
  }
}
