import { GridReadyEvent } from "ag-grid-community";
import { Subscription } from "rxjs";

export interface IDetailArgs {
    type:string;
    editingModel:any;
    editIndex:number;
    delSubscriber:Subscription;
    edtSubscriber:Subscription;

    unsubscribeListeners():void;
    subListeners( variable:string):void;

    fnAdd():void;
    fnUpdate():void;

    onGridReady(e:GridReadyEvent):void;
}
