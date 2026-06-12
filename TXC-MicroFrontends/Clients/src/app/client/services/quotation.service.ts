import { HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TenantConfigService } from './tenant-config.service';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseResponse, BaseResponseQ } from '../models/base-response.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) 
    { }

    private _getURL(): string {
      let splited = window.location.toString().split('\/');
      return splited[0] + "//" + environment.apiUrl;
    }
    
    //GraphQL post request
    getAll(pageIndex : number = 0, pageSize : number = 20, clientIdentityCode : string = "",keyword:string="",clientName:string="", validAt : NgbDate|null): Observable<BaseResponse> {
      let url = `${this._getURL()}api/QuotationList`;      
      const data = '';   
      return this.http.post(url, data , { 
        headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) 
      }) as Observable<BaseResponse>;
    }

  getQuotationList(pageIndex : number = 0, pageSize : number = 20, clientIdentityCode : string ,keyword:string="",status:number, validAt : string): 
   Observable<BaseResponseQ> {   
    let queryParams = new HttpParams();
   queryParams = queryParams.append('pageSize', pageSize);
   queryParams = queryParams.append('pageIndex', pageIndex);
   queryParams = queryParams.append('clientCode', clientIdentityCode);
   queryParams = queryParams.append('keyword', keyword);
   queryParams = queryParams.append('status', 32);   
   queryParams = queryParams.append('validAt', validAt); 
   let url = `${this._getURL()}api/Quotation`; 
   return this.http.get(url, {headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()), params: queryParams }) as Observable<BaseResponseQ>;
  }
}
