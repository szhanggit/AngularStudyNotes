import { FormGroup } from '@angular/forms';
import { InputModel } from '../dumb-models/input.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FieldsDefinition } from './field-definition.model';

export class OrderMemoFieldsDefinition implements FieldsDefinition {
  private memo: InputModel;
  private definitionFields: InputModel[];

  constructor(takeAllRow?: boolean) {
    this.memo = {
      type: FormInputTypeEnum.TextArea,
      label: 'Notes',
      formControlName: 'memo',
      required: false,
      takeAllRow: takeAllRow
    };

    this.definitionFields = [this.memo];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
