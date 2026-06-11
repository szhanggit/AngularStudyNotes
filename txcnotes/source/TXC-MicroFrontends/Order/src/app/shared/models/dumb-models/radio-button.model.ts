import { InputModel } from './input.model';

export interface RadioButtonModel extends InputModel {
    options: { label: string, value: number | boolean, htmlValue?: string }[];
}