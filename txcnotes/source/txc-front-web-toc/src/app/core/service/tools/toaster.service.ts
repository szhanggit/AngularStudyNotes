import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  toaster = new BehaviorSubject<NgbdToastGlobal>(null);
  private _toaster : NgbdToastGlobal;
  constructor(

  ) {
    if(this.toaster){
      this.toaster.subscribe(d => this._toaster = d);
    }
    }

  fnDanger(message : string){
    if((this._toaster)  && (message))
    this._toaster.showDanger(message);
  }
}
