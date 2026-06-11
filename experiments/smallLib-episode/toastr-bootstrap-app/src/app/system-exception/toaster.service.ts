import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BootstrapTXCComponent } from '../bootstrap-txc/bootstrap-txc.component';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  defaultComponent :BootstrapTXCComponent = {} as BootstrapTXCComponent;
  toaster = new BehaviorSubject<BootstrapTXCComponent>(this.defaultComponent);
  private _toaster : BootstrapTXCComponent;
  constructor() { 
    this._toaster = {} as BootstrapTXCComponent;
    if(this.toaster){
      console.log('---->');
      this.toaster.subscribe(d => this._toaster = d);
    }
  }

  fnDanger(message : string){    
    if((this._toaster)  && (message)){
      this._toaster.showDanger(message);
    }
  }
}
