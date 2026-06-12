import { InputModel } from '../dumb-models/input.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FieldsDefinition } from './field-definition.model';

export class OrderAttachmentFieldsDefinition implements FieldsDefinition {
  private attachments: InputModel;
  private definitionFields: InputModel[];

  constructor(withoutApi: boolean = true) {
    this.attachments = {
      type: FormInputTypeEnum.FileInput,
      label: 'Attachments',
      formControlName: 'attachments',
      required: false,
      takeAllRow: true,
      watchForValueChanges: true,
      hideActionButton: true,
      eventWithApi: !withoutApi,
    };

    this.definitionFields = [this.attachments];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
