import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { InputModel } from '../dumb-models/input.model';
import { TypeaheadModel } from '../dumb-models/typeahead.model';
import { Merchant } from '../merchant.model';
import { FieldsDefinition } from './field-definition.model';

export class DownloadTemplateFieldsDefinition implements FieldsDefinition {
    private merchant: TypeaheadModel;
    private definitionFields: InputModel[];
  
    constructor(merchantsList: Merchant[]) {
      this.merchant = {
        type: FormInputTypeEnum.Typeahead,
        formControlName: 'merchant',
        placeholder: 'Select merchant',
        required: false,
        withPreview: false,
        list: merchantsList,
      },

      this.definitionFields = [
        this.merchant,
      ];
    }
  
    define(): InputModel[] {
      return this.definitionFields;
    }
  }
  