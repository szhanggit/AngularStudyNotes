import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileToBase64 } from './file-to-base64';

@Injectable({
  providedIn: 'root'
})
export class FileToBase64Service {//extends FileToBase64 {

  base64: BehaviorSubject<any>;
  constructor(){
    this.base64 = new BehaviorSubject<any>("");
  }
  
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
