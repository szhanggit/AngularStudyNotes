
import { PickerType } from '@danielmoncada/angular-datetime-picker';
import { ValidatorsErrorMessage } from './validators-error.message';
import { Select2Data } from 'ng-select2-component';

export interface InputModel {
    type: number;
    label?: string;
    formControlName: string;
    required: boolean;
    placeholder?: string;
    select2Data?: Select2Data;
    options?: any[];
    withCheckbox?: boolean;
    checkBoxModel?: InputModel;
    hidden?: boolean;
    datepickerType?: PickerType;
    isNumberOnly?: boolean;
    preview?: string;
    inlineTextbox?: boolean;
    inlineText?: string;
    takeAllRow?: boolean;
    watchForValueChanges?: boolean;
    hideActionButton?: boolean;
    hideLabel?: boolean;
    buSpecificField?: boolean;
    businessUnits?: string[];
    withInputControl?: boolean;
    inputControl?: string;
    rows?: number;
    withCopyButton?: boolean;
    readonly?: boolean;
    validatorsErrorMessage?: ValidatorsErrorMessage;
    hintMsg?: string;
    withSubField?: boolean;
    subField?: boolean;
    subText?: string
    alignTextAreaValue?: boolean;
    columns?: number;
    eventWithApi?: boolean;
    hasDraftAttachments?: boolean;
    fileTypes?: string[];
}