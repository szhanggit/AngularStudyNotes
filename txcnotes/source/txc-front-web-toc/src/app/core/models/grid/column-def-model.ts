export class ColumnDefModel {
    name: string;
    field: string;
    width?: number;
    
    colDataFormatter:(data:any)=>string;
}
