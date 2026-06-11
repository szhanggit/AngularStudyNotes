import { RadioButtonModel } from '../dumb-models/radio-button.model';
import { InputModel } from '../dumb-models/input.model';
import { SelectModel } from '../dumb-models/select.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FieldsDefinition } from './field-definition.model';
import { BusinessUnitEnum } from '../../enums/tenant.enum';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { OrderMode } from 'src/app/order/models/quotation-type.model';

export class OrderSettingsFieldsDefinition implements FieldsDefinition {
  private excelFormat: RadioButtonModel;
  private excelShortUrl: RadioButtonModel;
  private barcodeInfo: RadioButtonModel;
  private emailAttachment: RadioButtonModel;
  private shortUrlAuthCodeGenerationWay: RadioButtonModel;
  private generateSequenceNumber: InputModel;
  private channelId: SelectModel;
  private definitionFields: InputModel[];
  private orderMode?: OrderMode;

  constructor(orderMode?: OrderMode) {
    this.orderMode = orderMode;
    this.excelFormat = {
      type: FormInputTypeEnum.RadioButton,
      label: 'Excel Format',
      formControlName: 'excelFormat',
      required: true,
      hidden: this.isFieldHidden('excelFormat'),
      options: [
        {
          label: 'Without voucher number',
          value: 1,
        },
        {
          label: 'With voucher number',
          value: 2,
        },
      ],
    };

    // replace with datepicker
    this.excelShortUrl = {
      type: FormInputTypeEnum.RadioButton,
      label: 'Excel short URL',
      formControlName: 'excelShortUrl',
      required: true,
      hidden: this.isFieldHidden('excelShortUrl'),
      options: [
        {
          label: 'Alias',
          value: 1,
        },
        {
          label: 'GUID',
          value: 2,
        },
      ],
    };

    this.barcodeInfo = {
      type: FormInputTypeEnum.RadioButton,
      label: 'Barcode info',
      formControlName: 'barcodeInfo',
      required: true,
      hidden: this.isFieldHidden('barcodeInfo'),
      options: [
        {
          label: 'Without barcode info',
          value: 1,
        },
        {
          label: 'With barcode info',
          value: 2,
        },
      ],
    };

    this.emailAttachment = {
      type: FormInputTypeEnum.RadioButton,
      label: 'Email attachment',
      formControlName: 'emailAttachment',
      required: true,
      hidden: this.isFieldHidden('emailAttachment'),
      options: [
        {
          label: 'None',
          value: 1,
        },
        {
          label: 'Short URL image',
          value: 2,
        },
      ],
    };

    this.shortUrlAuthCodeGenerationWay = {
      type: FormInputTypeEnum.RadioButton,
      label: 'Short URL auth code generation way',
      formControlName: 'shortUrlAuthCodeGenerationWay',
      required: true,
      options: [
        {
          label: 'Auto generate',
          value: 1,
        },
        {
          label: 'Last 4 voucher number',
          value: 2,
        },
      ],
    };

    this.generateSequenceNumber = {
      type: FormInputTypeEnum.ToggleButton,
      label: 'Generate sequence number',
      formControlName: 'generateSequenceNumber',
      required: false,
      hidden: this.isFieldHidden('generateSequenceNumber'),
    };

    this.channelId = {
      type: FormInputTypeEnum.Select,
      label: 'Channel',
      formControlName: 'channelId',
      required: false,
      placeholder: 'Please select a channel',
      hidden: this.isFieldHidden('channelId'),
      select2Data: [
        {
          label: 'MyEdenredApp',
          value: 1,
        },
      ],
      buSpecificField: true,
      businessUnits: [BusinessUnitEnum.Taiwan],
    };

    this.definitionFields = [
      this.excelFormat,
      this.excelShortUrl,
      this.barcodeInfo,
      this.emailAttachment,
      this.shortUrlAuthCodeGenerationWay,
      this.generateSequenceNumber,
      this.channelId,
    ];
  }

  private isFieldHidden(formControlName?: string) {
    let orderModes: OrderModeEnum[] = [];
    switch (formControlName) {
      case 'excelFormat':
      case 'barcodeInfo':
      case 'generateSequenceNumber':
        orderModes = [OrderModeEnum.API, OrderModeEnum.PaperVoucher];
        break;
      case 'excelShortUrl':
      case 'channelId':
        orderModes = [
          OrderModeEnum.DirectNonAPI,
          OrderModeEnum.API,
          OrderModeEnum.PaperVoucher,
        ];
        break;
      case 'emailAttachment':
        orderModes = [OrderModeEnum.PaperVoucher];
        break;
    }
    return this.orderMode ? orderModes.includes(this.orderMode.key) : false;
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
