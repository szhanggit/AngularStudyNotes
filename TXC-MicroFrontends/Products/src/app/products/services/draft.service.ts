import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { BehaviorSubject, debounceTime, delay, Observable, Subject, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../models/base-response.model';
import { Draft } from '../models/draft.model';
import { GetProductsResp } from '../models/get-products-response';
import { Product } from '../models/product.model';
import { TableState } from '../models/table-state.model';

@Injectable({
  providedIn: 'root'
})
export class DraftService {
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _drafts$ = new BehaviorSubject<Draft[]>([]);
  private _draftTotal$ = new BehaviorSubject<number>(0);

  private _state: TableState = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    status: 1,
    productType: 0,
    createdBy: 0
  }

  constructor(private http: HttpClient,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._getDrafts()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe((res: BaseResponse) => {
      if (res.data) {
        this._drafts$.next(res.data.productWizardSummaryList);
        this._draftTotal$.next(res.data.totalCount);
      } else {
        this._drafts$.next([]);
        this._draftTotal$.next(0);
      }
    });

    this._search$.next();
  }

  get drafts$() { return this._drafts$.asObservable(); }
  get draftTotal$() { return this._draftTotal$.asObservable(); }
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

  private _getDrafts(): Observable<BaseResponse> {
    const { pageSize, page } = this._state;
    const url = `https://${environment.apiUrl}api/Product/ProductWizard?RowCount=${pageSize}&PageNumber=${page}`;
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.get(url, { headers }) as Observable<GetProductsResp>;
  }

  deleteDraft(wizardKey: string): Observable<BaseResponse> {
    const url = `https://${environment.apiUrl}api/Product/ProductWizard`;
    const body = {
      wizardKey
    };
    const headers = new HttpHeaders().append('loading-indicator', 'none');
    return this.http.delete(url, { headers, body }) as Observable<BaseResponse>;
  }

  private _set(patch: Partial<TableState>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  refresh() {
    this._search$.next();
  }

  reset(pageSize = 20) {
    this._search$.next();
    this.page = 1;
    this.pageSize = pageSize;
    this.searchTerm = '';
  }
}
