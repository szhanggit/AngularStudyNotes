import { InputModel } from '../dumb-models/input.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FieldsDefinition } from './field-definition.model';

export class QAToolsSelectProductFieldsDefinition implements FieldsDefinition {
  private simulateDuplicateError: InputModel;
  private simulateValidationError: InputModel;
  private definitionFields: InputModel[];

  constructor() {
    this.simulateDuplicateError = {
      type: FormInputTypeEnum.ToggleButton,
      label: 'Simulate Duplicate Error On Batch Upload',
      formControlName: 'simulateDuplicateError',
      required: true,
    };

    this.simulateValidationError = {
      type: FormInputTypeEnum.ToggleButton,
      label: 'Simulate Validation Error On Batch Upload',
      formControlName: 'simulateValidationError',
      required: true,
    };

    this.definitionFields = [
      this.simulateDuplicateError,
      this.simulateValidationError
    ];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
