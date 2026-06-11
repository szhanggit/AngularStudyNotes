import { InputModel } from './input.model';
import { Select2Data } from 'ng-select2-component';

export interface SelectModel extends InputModel {
    select2Data: Select2Data;
}