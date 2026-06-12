import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GridEditDeleteMainService {

  edit: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  delete: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor() { }




  editObserver():Observable<any>{
    return this.edit.asObservable();
  }

  deleteObserver():Observable<any>{
    return this.delete.asObservable();
  }
}
