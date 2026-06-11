import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Product } from "./product.model";
import { catchError } from "rxjs/operators";

export const REST_URL = new InjectionToken("rest_url");

@Injectable()
export class RestDataSource {
    constructor(private http: HttpClient, @Inject(REST_URL) private url: string) { }
    getData(): Observable<Product[]> {
        //return this.http.get<Product[]>(this.url);
        return this.sendRequest<Product[]>("GET", this.url);
        //return this.http.jsonp<Product[]>(this.url, "callback");
        /*
            JSONP can be used only for get requests, which are sent using the HttpClient.jsonp method. When
            you call this method, you must provide the URL for the request and the name for the callback parameter. 
        */
    }

    saveProduct(product: Product): Observable<Product> {
        //return this.http.post<Product>(this.url, product);
        return this.sendRequest<Product>("POST", this.url, product);
    }

    updateProduct(product: Product): Observable<Product> {
        //return this.http.put<Product>(`${this.url}/${product.id}`, product);
        return this.sendRequest<Product>("PUT",`${this.url}/${product.id}`, product);
    }

    deleteProduct(id: number): Observable<Product> {
        //return this.http.delete<Product>(`${this.url}/${id}`);
        return this.sendRequest<Product>("DELETE", `${this.url}/${id}`);
    }

    private sendRequest<T>(verb: string, url: string, body?: Product): Observable<T> {

        let myHeaders = new HttpHeaders();
        myHeaders = myHeaders.set("Access-Key", "<secret>");
        myHeaders = myHeaders.set("Application-Names", ["exampleApp", "proAngular"]);

        return this.http.request<T>(verb, url, {
            body: body,
            /*headers: new HttpHeaders({
                "Access-Key": "<secret>",
                "Application-Name": "exampleApp"
            })*/
            headers: myHeaders
        }).pipe(catchError((error: Response) =>
        throwError(`Network Error: ${error.statusText} (${error.status})`)));
    }
}