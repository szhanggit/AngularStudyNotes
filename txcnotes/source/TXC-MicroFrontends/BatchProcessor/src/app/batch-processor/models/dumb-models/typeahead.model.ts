import { InputModel } from './input.model';

export interface TypeaheadModel extends InputModel {
    withPreview: boolean;
    list: any[] | undefined;
}