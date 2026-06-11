import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { InputModel } from '../dumb-models/input.model';
import { FieldsDefinition } from './field-definition.model';

export class UploadBatchOrderFieldsDefinition implements FieldsDefinition {
  private attachments: InputModel;
  private definitionFields: InputModel[];

  constructor() {
    this.attachments = {
      type: FormInputTypeEnum.FileInput,
      label: 'Attachments',
      formControlName: 'attachments',
      required: false,
      takeAllRow: true,
      watchForValueChanges: true,
    };

    this.definitionFields = [this.attachments];
  }
  define(): InputModel[] {
    return this.definitionFields;
  }
}
