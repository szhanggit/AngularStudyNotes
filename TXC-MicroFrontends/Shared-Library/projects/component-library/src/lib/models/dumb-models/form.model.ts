import { FormGroup } from '@angular/forms';
import { InputModel } from './input.model';

export interface FormModel {
    title?: string;
    description?: string;
    formGroup: FormGroup;
    fieldsDefinition: InputModel[];
    withHorizontalRule?: boolean;
    withActionButton?: boolean;
    actionButtons?: ActionButton[];
    getSampleFile?: GetSampleFile;
}

interface ActionButton {
    text: string;
    formControlName: string;
}

interface GetSampleFile {
    text: string;
    event: (...args: any[]) => any;
}