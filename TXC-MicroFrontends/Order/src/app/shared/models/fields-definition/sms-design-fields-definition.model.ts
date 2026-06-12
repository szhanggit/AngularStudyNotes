import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { InputModel } from '../dumb-models/input.model';
import { SelectModel } from '../dumb-models/select.model';
import { TypeaheadModel } from '../dumb-models/typeahead.model';
import { Template } from '../template.model';
import { FieldsDefinition } from './field-definition.model';

export class SmsDesignFieldsDefinition implements FieldsDefinition {
  voucherTemplate: TypeaheadModel;
  productName: InputModel;
  language: SelectModel;
  applyLanguage: InputModel;
  smsGreetings: InputModel;

  tagCategories: SelectModel;
  templatePart: SelectModel;

  definitionFields: InputModel[];

  constructor(
    isVoucherTemplateEmpty: boolean = true,
    templateList: Template[] = []
  ) {
    this.voucherTemplate = {
      type: FormInputTypeEnum.Typeahead,
      label: 'Voucher template',
      formControlName: 'smsVoucherTemplate',
      placeholder: 'Search voucher template',
      required: false,
      withPreview: !isVoucherTemplateEmpty,
      list: templateList,
    };

    this.productName = {
      type: FormInputTypeEnum.Textbox,
      label: 'Product name',
      formControlName: 'productName',
      required: false,
      hidden: isVoucherTemplateEmpty,
    };

    this.language = {
      type: FormInputTypeEnum.Select,
      label: 'Language',
      formControlName: 'language',
      placeholder: 'Select language',
      required: false,
      hidden: isVoucherTemplateEmpty,
      select2Data: [
        {
          value: 56,
          label: 'Chinese - Taiwan',
        },
        {
          value: 2,
          label: 'English - United States',
        },
        {
          value: 3,
          label: 'English - UK',
        },
        {
          value: 4,
          label: 'Chinese - China',
        },
      ],
      readonly: true,
    };

    this.applyLanguage = {
      type: FormInputTypeEnum.ToggleButton,
      label: 'Apply language',
      formControlName: 'applyLanguage',
      required: false,
      hidden: isVoucherTemplateEmpty,
      readonly: true,
    };

    this.smsGreetings = {
      type: FormInputTypeEnum.Textbox,
      label: 'SMS Greetings',
      formControlName: 'smsGreetings',
      required: false,
      hidden: isVoucherTemplateEmpty,
    };

    this.tagCategories = {
      type: FormInputTypeEnum.Select,
      required: false,
      label: 'Tag category',
      formControlName: 'tagCategory',
      select2Data: [
        { value: 0, label: 'Tag categories' },
        { value: 1, label: 'System tag used only' },
        { value: 2, label: 'System tag can modify' },
        { value: 3, label: 'Others' },
        {
          value: 4,
          label: '{E}TagCategory_SelectedBySystem',
        },
      ],
    };

    this.templatePart = {
      type: FormInputTypeEnum.Select,
      required: false,
      label: 'Template part',
      formControlName: 'templatePart',
      select2Data: [
        { value: 1, label: 'One part' },
        { value: 2, label: 'Two part' },
        { value: 3, label: 'Three part' },
      ],
    };

    this.definitionFields = [
      this.voucherTemplate,
      this.productName,
      this.language,
      this.applyLanguage,
      this.smsGreetings,
    ];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
