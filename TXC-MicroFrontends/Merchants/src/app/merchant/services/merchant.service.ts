import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetMerchantResponse } from '../models/get-merchant-response.model';
import { MerchantTableState } from '../models/merchant-table-state.model';
import { Merchant } from '../models/merchant.model';
import { BaseResponse } from './base-response.model';
import { TenantConfigService } from './tenant-config.service';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  // initialize observables
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _merchants$ = new BehaviorSubject<Merchant[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  // default merchant table state values
  private _state: MerchantTableState = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    status: 1,
    merchantId: 0,
    createdBy: 0,
    merchantAcquireId: 0
  }

  // merchant table property getters, might return observables or values
  get merchants$() { return this._merchants$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get status() { return this._state.status }
  get merchantId() { return this._state.merchantId; }
  get createdBy() { return this._state.createdBy; }
  get merchantAcquireId() { return this._state.merchantAcquireId; }

  // merchant table property setters, when change will reactively call merchantService._getMerchants based on properties provided
  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm: searchTerm }); }
  set status(status: number) { this._set({ status }); }
  set merchantId(merchantId: number) { this._set({ merchantId }); }
  set createdBy(createdBy: number) { this._set({ createdBy }); }
  set merchantAcquireId(merchantAcquireId: number) { this._set({ merchantAcquireId }); };

  // returns the right protocol http | https
  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) {
    // subscribe into _search$ observable to fetch merchants if there are changes in the properties
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(1000),
      switchMap(() => this._getMerchants()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe((res: GetMerchantResponse) => {
      if (res.data) {
        // trigger next if there are data retrieve
        this._merchants$.next(res.data.merchantDetails);
        this._total$.next(res.data.totalCount);
      } else {
        this._merchants$.next([]);
        this._total$.next(0);
      }
    });

    this._search$.next();
  }

  // will call on get merchants endpoints: MerchantInfo
  private _getMerchants(): Observable<GetMerchantResponse> {
    const { pageSize, page, searchTerm, status, merchantId, merchantAcquireId } = this._state;

    const url = `${this._getURL()}api/MerchantInfo${merchantAcquireId !== 0 ? '/GetByAcquirerId?MerchantAcquirerId=' + merchantAcquireId +'&' : '?'}${searchTerm != '' ? 'SearchKeyword=' : ''}${searchTerm}${this.merchantId != 0 ? '&MerchantId=' : ''}${this.merchantId != 0 ? merchantId : ''}&RowCount=${pageSize}&PageNumber=${page}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<GetMerchantResponse>;
  }

  private _set(patch: Partial<MerchantTableState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  // will retrieve specific merchant: MerchantInfo?MerchantId={value}, method: get
  getMerchantById(merchantId: number): Observable<GetMerchantResponse> {
    const url = `${this._getURL()}api/MerchantInfo?MerchantId=${merchantId}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<GetMerchantResponse>;
  }

  // call create merchant endpoint: MerchantInfo, method: post
  createMerchant(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantInfo`;
    return this.http.post(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  // call update merchant endpoint: MerchantInfo, method: put
  updateMerchant(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantInfo`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  reset() {
    this._search$.next();
    this.page = 1;
    this.pageSize = 20;
    this.searchTerm = '';
    this.merchantAcquireId = 0
  }
}
