import { Injectable } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgGridColFitToSizeService {

  private _fitToSize = new BehaviorSubject<number>(0);  
  private _api: GridApi = {} as GridApi;

  constructor() { 
    this.subscribeFitToSize(); 
  }

  set gridApi(g:GridApi){
    console.log('asdfasdfasdf');
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
            if(Object.keys(this._api).length !== 0){
              console.log("random",r);
            }
             
            setTimeout(()=>{
              if(Object.keys(this._api).length !== 0){
                this._api?.sizeColumnsToFit();
              }
            },200);
            
          }
        }
      })
    }
  
    //=============Subscribers==============//
}
