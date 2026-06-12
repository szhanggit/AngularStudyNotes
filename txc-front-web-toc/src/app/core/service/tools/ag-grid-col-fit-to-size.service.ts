import { Injectable } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgGridColFitToSizeService {

  private _fitToSize = new BehaviorSubject<number>(0);  
  private _api: GridApi;
  
  constructor() {   
    this.subscribeFitToSize(); 
  }
  
  set gridApi(g:GridApi){
    this._api = g;
  }

  broadcast(){
    this._fitToSize.next(Math.random() * 10);
  }

  //=============Subscribers==============//


  private subscribeFitToSize(){
    this._fitToSize.subscribe({
      next:r=> {
        if(r){
          console.log("random",r); 
          setTimeout(()=>{
            this._api.sizeColumnsToFit(); 
          },200);
          
        }
      }
    })
  }

  //=============Subscribers==============//
}
