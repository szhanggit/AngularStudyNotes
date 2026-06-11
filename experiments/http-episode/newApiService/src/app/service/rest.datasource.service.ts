import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { BaseResponse } from "../model/base-response.model";

export const REST_URL = new InjectionToken("rest_url");

@Injectable({
  providedIn: 'root'
})
export class RestDatasourceService {
  private options = { headers: new HttpHeaders().set("Content-Type", "application/json; charset=utf-8") };
  constructor(private http: HttpClient, @Inject(REST_URL) private url: string) { }

  getData<T>(controller: string, action: string): Observable<T> {
    return this.sendRequest<T>("GET", `${this.url}${controller}${action}`);
  }

  getDataList<T>(): Observable<T[]> {
    return this.sendRequest<T[]>("GET", this.url);
  }

  saveData<T>(data: T): Observable<T> {
    return this.sendRequest<T>("POST", this.url, data);
  }

  updateDataWithID<T>(data: T, id: number): Observable<T> {
    return this.sendRequest<T>("PUT",`${this.url}/${id}`, data);
  }

  updateData<T>(controller: string, action: string, data: T): Observable<T> {
    return this.sendRequest<T>("PUT",`${this.url}${controller}${action}`, data);
  }

  updateData_V2(controller: string, action: string, body: object = {}): Observable<BaseResponse> {
    return this.http.put(`${this.url}${controller}${action}`, JSON.stringify(body), this.options) as Observable<BaseResponse>;
  }

  deleteProduct<T>(id: number): Observable<T> {
    return this.sendRequest<T>("DELETE", `${this.url}/${id}`);
  }

  private sendRequest<T>(verb: string, url: string, body?: T): Observable<T> {

    let myHeaders = new HttpHeaders();
    //myHeaders = myHeaders.set("Access-Key", "<secret>");
    //myHeaders = myHeaders.set("Application-Names", ["exampleApp", "proAngular"]);
    myHeaders = myHeaders.set("Content-Type", "application/json; charset=utf-8");

    return this.http.request<T>(verb, url, {
        body: body,
        headers: myHeaders
    }).pipe(catchError((error: Response) =>
    throwError(`Network Error: ${error.statusText} (${error.status})`)));
  }
}
