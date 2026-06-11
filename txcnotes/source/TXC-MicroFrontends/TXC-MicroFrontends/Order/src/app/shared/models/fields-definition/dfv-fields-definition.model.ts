import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { InputModel } from '../dumb-models/input.model';
import { FieldsDefinition } from './field-definition.model';

export class DfvDetailsFieldsDefinition implements FieldsDefinition {
    private faceValue: InputModel;
    private voucherQuantity: InputModel;
    private definitionFields: InputModel[];
    constructor() {
        this.faceValue = {
            type: FormInputTypeEnum.Textbox,
            label: 'Face value',
            formControlName: 'faceValue',
            placeholder: '100 to 2000',
            hideLabel: true,
            isNumberOnly: true,
            required: true,
            validatorsErrorMessage: {
                pattern: 'Only positive numbers and zero are accepted.',
                min: 'Face value is out of range.',
                max: 'Face value is out of range.'
              }
        };

        this.voucherQuantity = {
            type: FormInputTypeEnum.Textbox,
            label: 'Quantity',
            formControlName: 'voucherQuantity',
            hideLabel: true,
            isNumberOnly: true,
            required: true,
            validatorsErrorMessage: {
                pattern: 'Only positive numbers are accepted.'
              }
        };

        this.definitionFields = [
           this.faceValue,
           this.voucherQuantity
        ];
    }
    define(): InputModel[] {
        return this.definitionFields;
    }
    
}