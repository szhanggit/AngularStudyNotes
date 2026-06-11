import { InputModel } from '../dumb-models/input.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FieldsDefinition } from './field-definition.model';

export class CloseOrderFieldsDefinition implements FieldsDefinition {
  private reason: InputModel;
  private definitionFields: InputModel[];

  constructor() {
    this.reason = {
      type: FormInputTypeEnum.TextArea,
      label: 'Close order reason',
      formControlName: 'reason',
      hideLabel: true,
      required: false,
      placeholder: 'Please specify your close reason (optional)',
      takeAllRow: true,
      rows: 5
    };

    this.definitionFields = [this.reason];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
