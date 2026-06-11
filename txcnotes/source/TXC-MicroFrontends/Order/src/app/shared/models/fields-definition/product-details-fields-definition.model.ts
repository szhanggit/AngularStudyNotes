import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { DatepickerModel } from '../dumb-models/datepicker.model';
import { InputModel } from '../dumb-models/input.model';
import { RadioButtonModel } from '../dumb-models/radio-button.model';
import { SelectModel } from '../dumb-models/select.model';
import { FieldsDefinition } from './field-definition.model';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';

export class ProductDetailsFieldsDefinition implements FieldsDefinition {
  private expiryScheme: SelectModel;
  private expiryDate: DatepickerModel;
  private voucherQuantity: InputModel;
  private reservationCode: InputModel;
  private clientOrderNumber: InputModel;
  private isShortUrlNeeded: RadioButtonModel;
  private definitionFields: InputModel[];
  private orderMode?: OrderMode;

  constructor(orderMode: OrderMode) {
    this.orderMode = orderMode;
    this.expiryScheme = {
      type: FormInputTypeEnum.Select,
      label: 'Expiry scheme',
      formControlName: 'expiryScheme',
      required: true,
      placeholder: 'Select',
      select2Data: [
        {
          label: 'Fix end of day',
          value: 1,
        },
      ],
    };

    this.expiryDate = {
      type: FormInputTypeEnum.Date,
      label: 'Expiry date',
      formControlName: 'expiryDate',
      required: true,
      datepickerType: 'calendar',
      selectMode: 'single',
    };

    this.voucherQuantity = {
      type: FormInputTypeEnum.Textbox,
      label: 'Voucher quantity',
      formControlName: 'voucherQuantity',
      required: true,
      hidden: this.isFieldHidden('voucherQuantity'),
      isNumberOnly: true,
      validatorsErrorMessage: {
        pattern: 'Only accept positive integers.',
      },
    };

    this.reservationCode = {
      type: FormInputTypeEnum.Textbox,
      label: 'Reservation code',
      formControlName: 'reservationCode',
      required: false,
    };

    this.clientOrderNumber = {
      type: FormInputTypeEnum.Textbox,
      label: 'Client order no.',
      formControlName: 'clientOrderNumber',
      required: false,
      hidden: this.isFieldHidden('voucherQuantity'),
    };

    this.isShortUrlNeeded = {
      type: FormInputTypeEnum.RadioButton,
      label: 'Need Short URL',
      formControlName: 'isShortUrlNeeded',
      required: false,
      options: [
        {
          label: 'Yes',
          value: 1,
        },
        {
          label: 'No',
          value: 2,
        },
      ],
    };

    this.definitionFields = [
      this.expiryScheme,
      this.expiryDate,
      this.voucherQuantity,
      this.reservationCode,
      this.clientOrderNumber,
      this.isShortUrlNeeded,
    ];
  }

  private isFieldHidden(formControlName?: string) {
    let orderModes: OrderModeEnum[] = [];
    switch (formControlName) {
      case 'voucherQuantity':
        orderModes = [OrderModeEnum.DirectNonAPI];
        break;
      case 'clientOrderNumber':
        orderModes = [OrderModeEnum.API, OrderModeEnum.DirectNonAPI];
        break;
    }
    return this.orderMode ? orderModes.includes(this.orderMode.key) : false;
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
