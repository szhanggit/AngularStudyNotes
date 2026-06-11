import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, delay, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { TableState } from '../models/table-state.model';
import { GetProductsResp } from '../models/get-products-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GetSingleProductResp } from '../models/get-single-product-response';
import { GetProductHistoryResp } from '../models/get-product-history-response';
import { BaseResponse } from '../models/base-response';
import { GetProductPriceResp } from '../models/get-product-price-response';
import { ProductPrice } from '../models/product-price.model';
import { ExternalPropertyBody } from '../models/external-property-body';
import { GetProductExternalPropertyResp } from '../models/get-product-external-property';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _products$ = new BehaviorSubject<Product[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: TableState = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    status: 1,
    productType: 0,
    createdBy: 0
  }

  constructor(private http: HttpClient) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._getProducts()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe((res: GetProductsResp) => {
      if (res.data) {
        this._products$.next(res.data.productDtos);
        this._total$.next(res.data.totalCount);
      } else {
        this._products$.next([]);
        this._total$.next(0);
      }
    });

    this._search$.next();
  }

  get products$() { return this._products$.asObservable(); }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get status() { return this._state.status }
  get productType() { return this._state.productType; }
  get createdBy() { return this._state.createdBy; }
  // default
  get sortBy() { return 'created_on' };
  get sortDir() { return 'DESC' };

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm: searchTerm.toLowerCase() }); }
  set status(status: number) { this._set({ status }); }
  set productType(productType: number) { this._set({ productType }); }
  set createdBy(createdBy: number) { this._set({ createdBy }); }

  private getHeaders(type: number = 0): HttpHeaders {
    if (type === 0) {
      return new HttpHeaders()
      .set('content-type', 'application/json')
      // default
      .set('TenantName', 'IN')
      .set('TenantBasicInfoId', '2');
    } else {
      return new HttpHeaders()
      // default
      .set('TenantName', 'IN')
      .set('TenantBasicInfoId', '2');
    }
  }

  private _getProducts(): Observable<GetProductsResp> {
    const { pageSize, page, searchTerm, status, productType } = this._state;
    const url = `http://${environment.apiUrl}api/TxProduct?Keyword=${searchTerm}&Type=${productType}&MerchantAcquirerId=${this.createdBy}&Status=${status > 1 ? false : true}&RowCount=${pageSize}&PageNumber=${page}&SortBy=${this.sortBy}&SortDirection=${this.sortDir}`;
    return this.http.get(url, { headers: this.getHeaders() }) as Observable<GetProductsResp>;
  }

  private _set(patch: Partial<TableState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  refresh() {
    this._search$.next();
  }

  getProduct(id: number): Observable<GetSingleProductResp> {
    const url = `http://${environment.apiUrl}api/TxProduct/GetById?ProductId=${id}`;
    return this.http.get(url, { headers: this.getHeaders() }) as Observable<GetSingleProductResp>;
  }

  getProductHistory(id: number): Observable<GetProductHistoryResp> {
    const url = `http://${environment.apiUrl}api/TxProduct/History?ProductId=${id}`;
    return this.http.get(url, { headers: this.getHeaders() }) as Observable<GetProductHistoryResp>;
  }

  getProductHistoryDetails(id: number): Observable<GetSingleProductResp> {
    const url = `http://${environment.apiUrl}api/TxProduct/GetByVersionId?ProductVersionId=${id}`;
    return this.http.get(url, { headers: this.getHeaders() }) as Observable<GetSingleProductResp>;
  }

  getProductPrice(id: number): Observable<GetProductPriceResp> {
    const url = `http://${environment.apiUrl}api/TxProduct/Price?ProductId=${id}`;
    return this.http.get(url, { headers: this.getHeaders() }) as Observable<GetProductPriceResp>;
  }

  updateProductPrice(body: ProductPrice): Observable<BaseResponse> {
    const url = `http://${environment.apiUrl}api/TxProduct/Price`;
    return this.http.put(url, body, { headers: this.getHeaders()}) as Observable<BaseResponse>;
  }

  getProductExternalProperty(id: number): Observable<GetProductExternalPropertyResp> {
    const url = `http://${environment.apiUrl}api/TxProduct/ExternalProperty?ProductId=${id}`;
    return this.http.get(url, { headers: this.getHeaders() }) as Observable<GetProductExternalPropertyResp>;
  }

  createProductExternalProperty(body: ExternalPropertyBody): Observable<BaseResponse> {
    const url = `http://${environment.apiUrl}api/TxProduct/ExternalProperty`;
    return this.http.post(url, body, { headers: this.getHeaders()}) as Observable<BaseResponse>;
  }

  setStatus(productId: number, status: number): Observable<BaseResponse> {
    const formData: any = new FormData();
    formData.append('ProductId', productId.toString());
    formData.append('Status', status.toString());

    const url = `http://${environment.apiUrl}api/TxProduct/Status`;
    return this.http.put(url, formData, { headers: this.getHeaders(1) }) as Observable<BaseResponse>;
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
