import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { GetShopResponse } from '../models/get-merchant-shop-response.model';
import { MerchantTableState } from '../models/merchant-table-state.model';
import { Shop } from '../models/shop.model';
import { BaseResponse } from './base-response.model';
import { TenantConfigService } from './tenant-config.service';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _shops$ = new BehaviorSubject<Shop[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: MerchantTableState = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    status: 1,
    merchantId: 0,
    createdBy: 0,
    merchantAcquireId: 0
  }

  get shops$() { return this._shops$.asObservable(); }
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

  private _getURL(): string {
    let splited = window.location.toString().split('\/');
    return splited[0] + "//" + environment.apiUrl;
  }

  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(1000),
      switchMap(() => this._getMerchantShop()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe((res: GetShopResponse) => {
      if (res.data) {
        this._shops$.next(res.data.shopDetailsModel);
        this._total$.next(res.data.totalCount);
      } else {
        this._shops$.next([]);
        this._total$.next(0);
      }
    });

    this._search$.next();
  }

  private _getMerchantShop(): Observable<GetShopResponse> {
    const { pageSize, page, searchTerm, status, merchantId } = this._state;
    if (this.merchantId === 0) {
      return of({
        data: {
          shopDetailsModel: [],
          totalCount: 0
        },
        message: 'Success',
        success: true
      });
    }
    const url = `${this._getURL()}api/MerchantShop?${this.searchTerm != '' ? 'SearchKeyword=' : ''}${searchTerm}${this.merchantId != 0 ? '&MerchantId=' : ''}${this.merchantId != 0 ? merchantId : ''}&RowCount=${pageSize}&PageNumber=${page}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<GetShopResponse>;
  }

  public exportAllMerchantShops(): Observable<GetShopResponse> {
    const url = `${this._getURL()}api/MerchantShop?&MerchantId=${this.merchantId}&RowCount=2147483647&PageNumber=1`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<GetShopResponse>;
  }

  private _set(patch: Partial<MerchantTableState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  refresh() {
    this._search$.next();
  }

  getShop(shopId: number): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantShop/GetById?ShopId=${shopId}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant())}) as Observable<BaseResponse>;
  }

  createShop(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantShop`;
    return this.http.post(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }

  updateShop(body: any): Observable<BaseResponse> {
    const url = `${this._getURL()}api/MerchantShop`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
}
