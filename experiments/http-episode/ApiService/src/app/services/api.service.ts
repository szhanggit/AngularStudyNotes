import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private currentBaseUrl: string = environment.apiUrl;
  private options = { headers: new HttpHeaders().set("Content-Type", "application/json; charset=utf-8") };
  constructor(private readonly httpClient: HttpClient) { 
    let splitted = window.location.toString().split('\/');
    console.log(`splitted: ${splitted}`);
  }


  get(path: string, params: HttpParams = new HttpParams()): Observable<any> 
  {
    return this.httpClient.get<any>(`${this.currentBaseUrl + path}`, { params });
  }

  getStudentById(path: string, studentId: number): Observable<any> 
  {
    return this.httpClient.get<any>(`${this.currentBaseUrl + path}/${studentId}`);
  }

  getSpecific<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.httpClient.get<T>(this.currentBaseUrl + path, { params });
  }

  post(path: string, body: object = {}): Observable<any> {
    return this.httpClient.post(this.currentBaseUrl + path, JSON.stringify(body), this.options);
  }

  postModel(path: string, body: any): Observable<any> {
    return this.httpClient.post(this.currentBaseUrl + path, body, this.options);
  }

  put(path: string, body: object = {}): Observable<any> {
    return this.httpClient.put(this.currentBaseUrl + path, JSON.stringify(body), this.options);
  }

  download(path: string, body: object = {}): Observable<any> {

    var opt = { headers: new HttpHeaders().set("Content-Type", "application/json; charset=utf-8"), responseType: 'blob' as 'json' };

    return this.httpClient.post<Blob>(this.currentBaseUrl + path, body, opt);
  }

  downloadFile(path: string, params: HttpParams = new HttpParams()) {
    var opt = { headers: new HttpHeaders().set("Content-Type", "application/json; charset=utf-8"), responseType: 'blob' as 'json', params: params };

    return this.httpClient.get<Blob>(this.currentBaseUrl + path, opt);
  }

  delete(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.httpClient.delete(this.currentBaseUrl + path, { params });
  }

  saveFile(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  uploadFile(path: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const req = new HttpRequest(
      "POST", this.currentBaseUrl + path, formData, {
      reportProgress: true,
    });

    return this.httpClient.request(req).pipe(map(event => this.getEventMessage(event)));
  }

  private getEventMessage(event: HttpEvent<any>): number {
    console.log(`event type is: ${event.type}`);
    switch (event.type) {
      case HttpEventType.UploadProgress:{
        console.log(`event.loaded: ${event.loaded}; event.total: ${event.total}; event.loaded / event.total: ${event.loaded / event.total!}`);
        return Math.round(100 * (event.loaded / event.total!));
      }
      case HttpEventType.Response:
        return 100;
      default:
        return 0;
    }
  }
}
