import { FormGroup } from '@angular/forms';
import { InputModel } from '../dumb-models/input.model';
import { SelectModel } from '../dumb-models/select.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FieldsDefinition } from './field-definition.model';
import { DatepickerModel } from '../dumb-models/datepicker.model';
import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';

export class OrderBasicInfoFieldsDefinition implements FieldsDefinition {
  private orderName: InputModel;
  private publishDate: DatepickerModel;
  private hasNoTargetPublishDate: InputModel;
  private activationTypeSelect: SelectModel;
  private activationDate: DatepickerModel;
  private afterPublished: InputModel;
  private definitionFields: InputModel[];
  private orderMode?: OrderMode;

  constructor(orderMode?: OrderMode) {
    this.orderMode = orderMode;
    this.orderName = {
      type: FormInputTypeEnum.Textbox,
      label: 'Order name',
      formControlName: 'orderName',
      required: true,
      validatorsErrorMessage: {
        maxlength: 'Only accept at most 100 characters.',
      },
    };

    this.hasNoTargetPublishDate = {
      type: FormInputTypeEnum.Checkbox,
      label: 'No specific time, order will be processed after getting approved',
      formControlName: 'hasNoTargetPublishDate',
      required: false,
    };

    this.publishDate = {
      type: FormInputTypeEnum.Date,
      label: 'Target publish date',
      formControlName: 'publishDate',
      required: true,
      withCheckbox: true,
      checkBoxModel: this.hasNoTargetPublishDate,
      datepickerType: 'both',
      selectMode: 'single',
    };

    this.activationTypeSelect = {
      type: FormInputTypeEnum.Select,
      label: 'Activation type',
      formControlName: 'activationType',
      placeholder: 'Please select a activation type',
      required: true,
      hidden: this.isFieldHidden('activationType'),

      select2Data: [
        {
          label: 'Same as publish date',
          value: 1,
        },
        {
          label: 'n days from publish date',
          value: 2,
        },
        {
          label: 'Fixed of date',
          value: 3,
        },
        {
          label: 'Inactive',
          value: 4,
        },
      ],
    };

    this.activationDate = {
      type: FormInputTypeEnum.Date,
      label: 'Activation date',
      formControlName: 'activationDate',
      required: true,
      datepickerType: 'both',
      selectMode: 'single',
      hidden: this.isFieldHidden('activationDate'),
    };

    this.afterPublished = {
      type: FormInputTypeEnum.Textbox,
      label: 'Activation date',
      formControlName: 'afterPublished',
      required: true,
      hidden: true,
      isNumberOnly: true,
      inlineTextbox: true,
      inlineText: 'days',
    };

    this.definitionFields = [
      this.orderName,
      this.publishDate,
      this.activationTypeSelect,
      this.activationDate,
      this.afterPublished,
    ];
  }

  private isFieldHidden(formControlName?: string) {
    let orderModes: OrderModeEnum[] = [];
    switch (formControlName) {
      case 'activationType':
      case 'activationDate':
        orderModes = [OrderModeEnum.API, OrderModeEnum.PaperVoucher];
        break;
    }
    return this.orderMode ? orderModes.includes(this.orderMode.key) : false;
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
