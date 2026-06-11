import { InputModel } from '../dumb-models/input.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FieldsDefinition } from './field-definition.model';

export class DownloadExcelFileFieldsDefinition implements FieldsDefinition {
  private excelPassword: InputModel;
  private definitionFields: InputModel[];

  constructor() {
    this.excelPassword = {
      type: FormInputTypeEnum.Textbox,
      label: 'Excel password',
      formControlName: 'excelPassword',
      required: false,
      takeAllRow: true,
      withCopyButton: true,
      readonly: true,
    };

    this.definitionFields = [this.excelPassword];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
