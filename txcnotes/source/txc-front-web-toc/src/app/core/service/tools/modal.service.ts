import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalDimention, ModalInformationModel } from 'src/app/core/models/common/modal-information-model';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  cancel: BehaviorSubject<any>;
  save: BehaviorSubject<any>;
  close:BehaviorSubject<any>;
  modalInfo: BehaviorSubject<ModalInformationModel>;

  constructor() {
    this.modalInfo = new BehaviorSubject<ModalInformationModel>(<ModalInformationModel>{
      title:"",
      display:false,
      dimention: new ModalDimention()
    });

    this.save = new BehaviorSubject<any>(false);
    this.cancel = new BehaviorSubject<any>(false);
    this.close = new BehaviorSubject<any>(false);
   }

   getModalInfo():Observable<ModalInformationModel>{
     return this.modalInfo.asObservable();
   }

   onSave(callbackFunction:any){
     return this.save.asObservable()
     .subscribe({next:res=> callbackFunction(res)});
   }

   onCancel(): Observable<any>{
     return this.cancel.asObservable();
   }

   onClose(): Observable<any>{
    return this.close.asObservable();
   }
   
}
