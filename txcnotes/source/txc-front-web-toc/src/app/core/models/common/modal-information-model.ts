import { Component } from "@angular/core";

export class ModalInformationModel {
    title:string;
    display:boolean;
    data: any;
    component: any;    
    onSave: any;
    onCancel: any;
    dimention: ModalDimention;
}

export class ModalDimention{
    width: any;
    height: any;
}
