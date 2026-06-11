import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventStateService {
  private _batchListLoading$ = new BehaviorSubject<boolean>(false);
  private _isUploadSuccess$ = new Subject<{
    isSuccess: boolean;
    errorMessage?: string;
  }>();
  private _commonErrorMessage$ = new Subject<string>();

  get batchListLoading$() {
    return this._batchListLoading$.asObservable();
  }

  set batchListLoading(value: boolean) {
    this._batchListLoading$.next(value);
  }

  get isUploadSuccess$() {
    return this._isUploadSuccess$.asObservable();
  }

  set isUploadSuccess(value: { isSuccess: boolean; errorMessage?: string }) {
    this._isUploadSuccess$.next(value);
  }

  get commonErrorMessage$() {
    return this._commonErrorMessage$.asObservable();
  }

  set commonErrorMessage(value: string) {
    this._commonErrorMessage$.next(value);
  }

  constructor() {}
}
