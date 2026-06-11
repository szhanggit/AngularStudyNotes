import { Injectable } from '@angular/core';
import { TableState } from '../model/table.state.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _state: TableState = {
    page: 1,
    pageSize: 20,
    searchTerm: '',
    status: 1,
    productType: 0,
    createdBy: 0
  }

  constructor() { }

  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get status() { return this._state.status }
  get productType() { return this._state.productType; }
  get createdBy() { return this._state.createdBy; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm: searchTerm }); }
  set status(status: number) { this._set({ status }); }
  set productType(productType: number) { this._set({ productType }); }
  set createdBy(createdBy: number) { this._set({ createdBy }); }

  private _set(patch: Partial<TableState>) {
    Object.assign(this._state, patch);
    //this._search$.next();
  }

  public _getProducts(): void {
    const { pageSize, page, searchTerm, status, productType } = this._state;
    console.log(`pageSize: ${pageSize} page: ${page} searchTerm: ${searchTerm} status: ${status} productType: ${productType}`);
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
}
