import { ColumnDefModel } from "./column-def-model";

export class GridContextModel {
    colDefs: ColumnDefModel[];
    rowData?: any[];
    enableDefaultAction?: boolean;
    enableMultipleSelection?: boolean;
    showPagination: boolean;
}
