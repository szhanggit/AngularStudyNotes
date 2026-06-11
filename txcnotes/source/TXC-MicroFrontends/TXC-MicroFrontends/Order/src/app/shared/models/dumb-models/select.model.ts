import { Select2Data } from 'ng-select2-component';
import { InputModel } from './input.model';

export interface SelectModel extends InputModel {
    select2Data: Select2Data;
}