import { Injectable } from '@angular/core';
import { VendorTableState } from '../models/vendor-table-state';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {BehaviorSubject, observable, Observable, of } from 'rxjs';
import { VendorRequest } from '../models/vendor-request.model';
import { VendorResponse } from '../models/vendor-response.model';
import { Vendor } from '../models/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  
   _total$ = new BehaviorSubject<number>(0);
  constructor( private http: HttpClient) {
    this._getVendor().subscribe(res => {
    });
   }

   private _state: VendorTableState = {
    page: 0,
    pageSize: 20,
    searchTerm: ''    
  }
  get total$() { return this._total$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({ page }); }
  set pageSize(pageSize: number) { this._set({ pageSize }); }
  set searchTerm(searchTerm: string) { this._set({ searchTerm: searchTerm.toLowerCase() }); }

  private _set(patch: Partial<any>) {
    Object.assign(this._state, patch);   
  }

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
  
  _getVendor(pageIndex : number = 0, pageSize : number = 20): Observable<VendorResponse> {     
    let body ={      
      query : `query{vendors(skip:${pageIndex}, take: ${pageSize},tenantId:2,where:{ or:[{ name:{contains:\"${this.searchTerm}\"}},{vendorCode:{contains:\"${this.searchTerm}\"}}]} ){totalCount items { id programCode vendorCode name createdBy createdBy createdOn status} pageInfo {hasNextPage hasPreviousPage}}}`
       };
       console.log("pag",body);   
    const url = `http://${environment.apiUrl}api/GraphQL/Query`;    
    return this.http.post(url, body, { headers: this.getHeaders()}) as Observable<VendorResponse>;
  }

  getVendorById(programCode:string,vendorCode:string): Observable<Vendor> {
    const url = `https://${environment.apiUrl}api/TPCVendor/GetTPCVendor?programCode=${programCode}&vendorCode=${vendorCode}`;
    return this.http.get(url,{ headers: this.getHeaders()}) as Observable<Vendor>;
  }  

  createVendor(body: any): Observable<VendorResponse> {
    const url = `https://${environment.apiUrl}api/TPCVendor/CreateTPCVendor`;
    return this.http.post(url, body, { headers: this.getHeaders()}) as Observable<VendorResponse>;
  }

  updateVendor(body: any): Observable<VendorResponse> {
    const url = `https://${environment.apiUrl}api/TPCVendor/EditTPCVendor`;
    return this.http.put(url, body, { headers: this.getHeaders()}) as Observable<VendorResponse>;
  }
}

    

