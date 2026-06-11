import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmationModel } from 'src/app/core/models/common/confirmation-model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  confirm: BehaviorSubject<ConfirmationModel> = new BehaviorSubject<ConfirmationModel>(new ConfirmationModel());
  constructor() {
      
  }


  showConfirm(confirmationModel:ConfirmationModel){
    this.confirm.next(confirmationModel);
  }

  getConfirmation(callbackFn:any){
    let subscriber = this.confirm.asObservable()
    .subscribe({
      next:res=> callbackFn(res)
      , complete: ()=>{
        subscriber.unsubscribe();
      }
    });
  }
}
