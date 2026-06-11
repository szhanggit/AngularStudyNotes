import { InputModel } from '@txc-angular/component-library';
import { FieldsDefinition } from './field-definition.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { RadioButtonModel } from '../dumb-models/radio-button.model';

export class UploadVoucherOperationsFieldsDefinition implements FieldsDefinition {
    private format: RadioButtonModel;
    private attachments: InputModel;
    private definitionFields: InputModel[];
  
    constructor() {
        this.format = {
            type: FormInputTypeEnum.RadioButton,
            label: 'Format',
            formControlName: 'format',
            required: false,
            columns: 4,
            options: [
                {
                    label: 'Voucher number',
                    value: 1,
                },
                {
                    label: 'Alias',
                    value: 2,
                },
                {
                    label: 'GUID',
                    value: 3,
                }
            ],
        };

        this.attachments = {
            type: FormInputTypeEnum.FileInput,
            formControlName: 'attachments',
            required: false,
            takeAllRow: true,
            watchForValueChanges: true,
        };
        
        this.definitionFields = [
            this.format,
            this.attachments,
        ];
    }
    
    define(): InputModel[] {
        return this.definitionFields;
    }
}