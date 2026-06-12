import { PickerType, SelectMode } from '@danielmoncada/angular-datetime-picker';
import { InputModel } from './input.model';

export interface DatepickerModel extends InputModel {
    datepickerType: PickerType;
    selectMode: SelectMode;
    customMinDate?: boolean;
    minDate?: Date;
}