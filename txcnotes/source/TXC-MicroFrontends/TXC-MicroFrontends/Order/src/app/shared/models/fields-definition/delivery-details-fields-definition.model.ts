import { EmailTemplateOption } from 'src/app/order/interface/product-state.interface';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { MsgEncodingType } from '../../enums/msg-encoding-type.enum';
import { InputModel } from '../dumb-models/input.model';
import { SelectModel } from '../dumb-models/select.model';
import { FieldsDefinition } from './field-definition.model';

export class DeliveryDetailsFieldsDefinition implements FieldsDefinition {
  private emailTemplate: SelectModel;
  private emailSubject: InputModel;
  private emailGreeting: InputModel;
  private msgEncoding: SelectModel;
  private smsGreeting: InputModel;
  private definitionFields: InputModel[];
  constructor(
    emailTemplateOptions: EmailTemplateOption[] = [],
    viewMode: boolean = false
  ) {
    this.emailTemplate = {
      type: FormInputTypeEnum.Select,
      label: 'Email template',
      formControlName: 'emailTemplate',
      required: true,
      takeAllRow: !viewMode,
      columns: 6,
      placeholder: 'Select',
      select2Data: emailTemplateOptions,
    };

    this.emailSubject = {
      type: FormInputTypeEnum.TextArea,
      label: 'Email subject',
      formControlName: 'emailSubject',
      required: true,
      rows: 2,
      alignTextAreaValue: true,
      validatorsErrorMessage: {
        maxlength: 'The email subject must not exceed 500 characters.',
      },
    };

    this.emailGreeting = {
      type: FormInputTypeEnum.TextArea,
      label: 'Email greeting',
      formControlName: 'emailGreeting',
      required: false,
      rows: 2,
      alignTextAreaValue: true,
      validatorsErrorMessage: {
        maxlength: 'The email greeting must not exceed 500 characters.',
      },
    };

    this.msgEncoding = {
      type: FormInputTypeEnum.Select,
      label: 'Message encoding',
      formControlName: 'msgEncoding',
      required: true,
      hidden: false,
      hintMsg:
        'Select "Unicode" if the message is not written in Mandarin or English',
      select2Data: [
        {
          label: 'Big5',
          value: MsgEncodingType.Big5,
        },
        {
          label: 'Unicode',
          value: MsgEncodingType.Unicode,
        },
      ],
    };

    this.smsGreeting = {
      type: FormInputTypeEnum.TextArea,
      label: 'SMS greeting',
      formControlName: 'smsGreeting',
      required: false,
      alignTextAreaValue: true,
      rows: 2,
    };

    this.definitionFields = [
      this.emailTemplate,
      this.emailSubject,
      this.emailGreeting,
      this.msgEncoding,
      this.smsGreeting,
    ];
  }
  define(): InputModel[] {
    return this.definitionFields;
  }
}
