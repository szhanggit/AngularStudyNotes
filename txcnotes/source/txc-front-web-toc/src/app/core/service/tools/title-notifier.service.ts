import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleNotifierService {

  titleName: BehaviorSubject<string> = new BehaviorSubject<string>("");
  constructor() { }
  
  dispose(){
    this.titleName.next("");
    this.titleName.unsubscribe();
  }
  getTitleName(): Observable<string>{
    return this.titleName.asObservable();
  }
}
