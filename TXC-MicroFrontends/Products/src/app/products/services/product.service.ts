import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { TableState } from '../models/table-state.model';
import { GetProductsResp } from '../models/get-products-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GetSingleProductResp } from '../models/get-single-product-response';
import { GetProductHistoryResp } from '../models/get-product-history-response';
import { BaseResponse } from '../models/base-response.model';
import { GetProductPriceResp } from '../models/get-product-price-response';
import { ProductPrice } from '../models/product-price.model';
import { ExternalPropertyBody } from '../models/external-property-body';
import { GetProductExternalPropertyResp } from '../models/get-product-external-property';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { GetProductExpirationPolicyResp } from '../models/get-product-expiration-policy';
import { getProductConditionResponse } from '../models/get-product-condition-response';
import { getProductRestrictionResponse } from '../models/get-product-restriction-response';
import { GraphqlApiService } from './graphql-api.service';
import { ProductTemplate } from '../models/product-wizard-dto.model';
import { ProductCondition } from '../models/product-wizard-dto.model';
import { restrictionUpdateBodyModel } from '../models/product-restriction.model';
import { StateService } from './state.service';

interface ProductState {
  products: Product[];
  selectedProductId: number | undefined;
}

const INITIAL_STATE: ProductState = {
  products: [],
  selectedProductId: undefined
};

@Injectable({
  providedIn: 'root'
})
export class ProductService extends StateService<ProductState>{
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _products$ = new BehaviorSubject<Product[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  currentProducts$: Observable<Product[]> = this.select(state => state.products);

  selectedProduct$: Observable<Product | undefined> = this.select((state) => {
    return state.products.find((product) => product.productId === state.selectedProductId);
  });

  private _state: TableState = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    status: 1,
    productType: 0,
    createdBy: 0
  }

  constructor(private http: HttpClient,
    private readonly _authorizationLibraryService: AuthorizationLibraryService,
    private readonly _graphqlApiService: GraphqlApiService) {
    super(INITIAL_STATE);
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
  set searchTerm(searchTerm: string) { this._set({ searchTerm: searchTerm }); }
  set status(status: number) { this._set({ status }); }
  set productType(productType: number) { this._set({ productType }); }
  set createdBy(createdBy: number) { this._set({ createdBy }); }

  private _getProducts(): Observable<GetProductsResp> {
    const { pageSize, page, searchTerm, status, productType } = this._state;
    if (status === 3) {
      return of([] as any);
    }
    const url = `https://${environment.apiUrl}api/Product${searchTerm ? '?Keyword=' : ''}${searchTerm ? searchTerm + '&' : '?'}Type=${productType}&MerchantAcquirerId=${this.createdBy}&Status=${status > 1 ? false : true}&RowCount=${pageSize}&PageNumber=${page}&SortBy=${this.sortBy}&SortDirection=${this.sortDir}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<GetProductsResp>;
  }

  private _set(patch: Partial<TableState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  refresh() {
    this._search$.next();
  }

  reset() {
    this._state = {
      page: 1,
      pageSize: 20,
      searchTerm: '',
      status: 1,
      productType: 0,
      createdBy: 0
    }
  }

  getProduct(id: number, reset = false, product: Product | undefined = undefined): void {
    const url = `https://${environment.apiUrl}api/Product/GetById?ProductId=${id}`;
    if (reset && product) {
      const removeIndex = this.state.products.findIndex(product => product.productId === id);
      this.state.products.splice(removeIndex, 1);
      this.setState({products: [...this.state.products, product], selectedProductId: id});
      return;
    }
    this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }).subscribe((res: any) => {
      this.setState({products: [...this.state.products, res.data.productBasicInfo as Product], selectedProductId: id});
    });
  }

  selectProduct(id: number) {
    this.setState({selectedProductId: id});
  }

  updateProduct(body: any): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>;
  }

  getProductHistory(id: number): Observable<GetProductHistoryResp> {
    const url = `https://${environment.apiUrl}api/Product/History?ProductId=${id}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<GetProductHistoryResp>;
  }

  getProductHistoryDetails(id: number): Observable<GetSingleProductResp> {
    const url = `https://${environment.apiUrl}api/Product/GetByVersionId?ProductVersionId=${id}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<GetSingleProductResp>;
  }

  getProductPrice(id: number): Observable<GetProductPriceResp> {
    const url = `https://${environment.apiUrl}api/Product/Price?ProductId=${id}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<GetProductPriceResp>;
  }

  updateProductPrice(body: ProductPrice): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Price`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>;
  }

  getProductExternalProperty(id: number): Observable<GetProductExternalPropertyResp> {
    const url = `https://${environment.apiUrl}api/Product/ExternalProperty?ProductId=${id}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<GetProductExternalPropertyResp>;
  }

  updateProductExternalProperty(body: ExternalPropertyBody): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ExternalProperty`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>;
  }

  getProductExpirationPolicy(id: number): Observable<GetProductExpirationPolicyResp> {
    const url = `https://${environment.apiUrl}api/Product/ExpirationPolicy?ProductId=${id}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<GetProductExpirationPolicyResp>;
  }

  updateExpirationPolicy(body: any): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ExpirationPolicy`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>;
  }

  getProductCondition(id: Number): Observable<getProductConditionResponse> {
    const url = `https://${environment.apiUrl}api/Product/Condition?ProductId=${id}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<getProductConditionResponse>
  }

  updateProductCondition(body: ProductCondition): Observable<BaseResponse>{
    const url = `https://${environment.apiUrl}api/Product/Condition`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>
  }

  getProductRestriction(id: Number): Observable<getProductRestrictionResponse> {
    const url = `https://${environment.apiUrl}api/Product/Restriction?ProductId=${id}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<getProductRestrictionResponse>
  }

  updateProductRestriction(body: restrictionUpdateBodyModel): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Restriction`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>
  }

  getProductTemplate(id: Number, templateType: Number): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Template?ProductId=${id}&TemplateType=${templateType}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>
  }

  updateProductTemplate(body: { productId: number, product_template_item: ProductTemplate[] }): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/Template`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>;
  }

  getProductWalletSetting(id: Number): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/WalletSetting?ProductId=${id}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>
  }

  updateProductWalletSetting(body: {productId: number, addToWallet: boolean, walletStatus: number, walletDescription: string, walletImage: number}): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/WalletSetting`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>;
  }

  getBannerImageSetting(id: Number): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/BannerImageSetting?ProductId=${id}`;
    return this.http.get(url, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>
  }

  updateBannerImageSettings(body: {productId: number, hexColor: string, fontSize: number, pointX: number, pointY: number}): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/BannerImageSetting`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>
  }

  setStopIssueTime(body: any): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/StopIssue`;
    return this.http.put(url, body, { headers: this._authorizationLibraryService.getAMMHeaders() }) as Observable<BaseResponse>
  }

  setStatus(productId: number, status: number): Observable<BaseResponse> {
    const formData: any = new FormData();
    formData.append('ProductId', productId.toString());
    formData.append('Status', status.toString());
    const url = `https://${environment.apiUrl}api/Product/Status`;
    return this.http.put(url, formData, { headers: this._authorizationLibraryService.getAMMHeaders().delete('content-type', 'application/json') }) as Observable<BaseResponse>;
  }

  getProductCountByProductCode(productCode: string): Observable<BaseResponse> {
    const query = `
      query {
        products(
          where: { productCode: { eq: "${productCode}" } }
        ) {
          totalCount
        }
      }`;
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this._graphqlApiService.postQuery(query, headers);
  }

  getProductReverseLimit() : Observable<BaseResponse>{
    const query = `
    query {
      productReverseLimit {
        items {
          reverseLimitId 
          name 
          description
        }
      }
    }`;
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this._graphqlApiService.postQuery(query, headers);
  }

  getExpiryPolicyType(id: number) {
    const query = `query {
        products(
            where: { productId: { eq: ${id} } }
        ) {
            items {
                productName
                isFixedExpiryPolicy
                expiryDate
            }
        }
    }`;
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this._graphqlApiService.postQuery(query, headers);
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
