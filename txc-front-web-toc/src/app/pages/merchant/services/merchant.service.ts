import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, delay, Observable, Subject, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../../products/models/base-response';
import { GetMerchantResponse } from '../models/get-merchant-response.model';
import { MerchantTableState } from '../models/merchant-table-state.model';
import { Merchant } from '../models/merchant.model';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _merchants$ = new BehaviorSubject<Merchant[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: MerchantTableState = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    status: 1,
    merchantId: 0,
    createdBy: 0
  }

  get merchants$() { return this._merchants$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get status() { return this._state.status }
  get merchantId() { return this._state.merchantId; }
  get createdBy() { return this._state.createdBy; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm: searchTerm.toLowerCase() }); }
  set status(status: number) { this._set({ status }); }
  set merchantId(merchantId: number) { this._set({ merchantId }); }
  set createdBy(createdBy: number) { this._set({ createdBy }); }


  private _getHeaders(type: number = 0): HttpHeaders {
    return new HttpHeaders()
      .set('content-type', 'application/json')
      // default
      .set('TenantName', 'TW')
      .set('TenantBasicInfoId', '7')
      .set('TX2UserName', 'edenred');
  }

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  constructor(private http: HttpClient) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(1000),
      switchMap(() => this._getMerchants()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe((res: GetMerchantResponse) => {
      if (res.data) {
        this._merchants$.next(res.data.merchantDetails);
        this._total$.next(res.data.totalCount);
      } else {
        this._merchants$.next([]);
        this._total$.next(0);
      }
    });

    this._search$.next();
  }

  private _getMerchants(): Observable<GetMerchantResponse> {
    const { pageSize, page, searchTerm, status, merchantId } = this._state;
    const url = `${this._getURL()}api/MerchantInfo?${this.searchTerm != '' ? 'SearchKeyword=' : ''}${searchTerm}${this.merchantId != 0 ? '&MerchantId=' : ''}${this.merchantId != 0 ? merchantId : ''}&RowCount=${pageSize}&PageNumber=${page}`;
    return this.http.get(url, { headers: this._getHeaders() }) as Observable<GetMerchantResponse>;
  }

  private _set(patch: Partial<MerchantTableState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  refresh() {
    this._search$.next();
  }

  getMerchantById(merchantId: number): Observable<GetMerchantResponse> {
    const url = `${this._getURL()}api/MerchantInfo?MerchantId=${merchantId}`;
    return this.http.get(url, { headers: this._getHeaders() }) as Observable<GetMerchantResponse>;
  }

  createMerchant(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantInfo`;
    return this.http.post(url, body, { headers: this._getHeaders()}) as Observable<BaseResponse>;
  }

  updateMerchant(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantInfo`;
    return this.http.put(url, body, { headers: this._getHeaders()}) as Observable<BaseResponse>;
  }
}
