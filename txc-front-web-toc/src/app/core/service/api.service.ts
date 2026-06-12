import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  currentBaseUrl: string;
  private options = { headers: new HttpHeaders().set("Content-Type", "application/json; charset=utf-8") };
  // serviceUrl: string = env.apiUrl;
  constructor(private readonly httpClient: HttpClient,
      private configSvc:ConfigService) {

        let splited = window.location.toString().split('\/');

        this.currentBaseUrl = splited[0] + "//" +  environment.apiUrl + "api/";
        // this.configSvc.currentUrl.asObservable()
        // .subscribe({next:res=> {
        //   if((res) && (res.replace(' ','') !== "")){
        //     this.currentBaseUrl = res;
        //   }
        // }
        // });
   }


  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {

    return this.httpClient.get(this.currentBaseUrl + path, { params });
  }

  getSpecific<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.httpClient.get<T>(this.currentBaseUrl + path, { params });
  }

  customServiceUrlGet(serviceUrl: string, path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.get(this.currentBaseUrl + path, { params });
  }



  put(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(this.currentBaseUrl + path, JSON.stringify(body), this.options)
      ;
  }

  postModel(path: string, body: any): Observable<any> {
    return this.httpClient
      .post(this.currentBaseUrl + path, body, this.options);
  }

  post(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(this.currentBaseUrl + path, JSON.stringify(body), this.options);
  }

  customServiceUrlPost(serviceUrl: string, path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(serviceUrl + path, JSON.stringify(body), this.options);
  }

  download(path: string, body: object = {}): Observable<any> {

    var opt = { headers: new HttpHeaders().set("Content-Type", "application/json; charset=utf-8"), responseType: 'blob' as 'json' };

    return this.httpClient.post<Blob>(this.currentBaseUrl + path, body, opt);
  }


  customDownload(serviceUrl: string, path: string, body: object = {}) {
    var opt = { headers: new HttpHeaders().set("Content-Type", "application/json; charset=utf-8"), responseType: 'blob' as 'json' };

    return this.httpClient.post<Blob>(serviceUrl + path, body, opt);
  }


  downloadFile(path: string) {
    var opt = { headers: new HttpHeaders().set("Content-Type", "application/json; charset=utf-8"), responseType: 'blob' as 'json' };

    return this.httpClient.get<Blob>(this.currentBaseUrl + path, opt);
  }

  postUnstringified(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(this.currentBaseUrl + path, body, this.options)
      ;
  }

  delete(path: string): Observable<any> {
    return this.httpClient.delete(this.currentBaseUrl + path);
  }

  uploadFile(path: string, formData: any): Observable<any> {
    const req = new HttpRequest(
      "POST", this.currentBaseUrl + path, formData, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }

  replaceFile(path: string, formData: any): Observable<any> {
    const req = new HttpRequest(
      "PUT", this.currentBaseUrl + path, formData, {
      reportProgress: true,
    });
    return this.httpClient.request(req);
  }
}
