import { InputModel } from '@txc-angular/component-library';
import { FieldsDefinition } from './field-definition.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';

export class UploadBatchFieldsDefinition implements FieldsDefinition {
    private uploadFile: InputModel;
    private definitionFields: InputModel[];
  
    constructor() {
      this.uploadFile = {
        type: FormInputTypeEnum.FileInput,
        label: 'Upload file',
        formControlName: 'uploadFile',
        required: false,
        takeAllRow: true,
        watchForValueChanges: true,
        fileTypes: ['xls', 'xlsx'],
      };
  
      this.definitionFields = [
        this.uploadFile,
      ];
    }
  
    define(): InputModel[] {
      return this.definitionFields;
    }
  }
  