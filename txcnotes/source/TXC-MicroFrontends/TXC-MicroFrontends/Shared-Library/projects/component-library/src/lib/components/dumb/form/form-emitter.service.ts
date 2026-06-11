import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'; 
@Injectable({
  providedIn: 'root'
})
export class FormEmitterService {
  emitEvent: Subject<string> = new Subject();
  constructor() { }
}
