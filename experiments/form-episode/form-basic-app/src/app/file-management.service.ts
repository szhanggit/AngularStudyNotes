import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileManagementService {

  constructor() { }

  public converToBase64(file:File, callbackFunction:any){

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ()=>{
      let res = reader.result;
      if(res != undefined){
        callbackFunction(res);
      }          
    }

    reader.onerror=(e)=>{
      console.log("Error: ",e);
    }
  }
}
