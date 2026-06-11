import { InputModel } from '../dumb-models/input.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FieldsDefinition } from './field-definition.model';
import { SelectModel } from '../dumb-models/select.model';

export class SendFileFieldsDefinition implements FieldsDefinition {
  private emailAddress: SelectModel;
  private definitionFields: InputModel[];

  constructor() {
    this.emailAddress = {
      type: FormInputTypeEnum.Select,
      label: 'Email address',
      formControlName: 'emailAddress',
      required: false,
      takeAllRow: true,
      placeholder: 'Please select an email',
      select2Data: [],
    };

    this.definitionFields = [this.emailAddress];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
