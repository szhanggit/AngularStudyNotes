import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastStateService {
  private _toast$ = new Subject<any>();

  get toast$() {
    return this._toast$.asObservable();
  }

  set toast(value: any) {
    this._toast$.next(value);
  }
  constructor() {}
}
