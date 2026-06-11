import { FormGroup } from '@angular/forms';
import { InputModel } from './input.model';

export interface FormModel {
    title?: string;
    formGroup: FormGroup;
    fieldsDefinition: InputModel[];
    withHorizontalRule?: boolean;
    withActionButton?: boolean;
    actionButtons?: ActionButton[];
}

interface ActionButton {
    text: string;
    formControlName: string;
}