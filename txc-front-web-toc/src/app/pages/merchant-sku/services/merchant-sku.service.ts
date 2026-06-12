import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { MerchantSkuModule } from '../merchant-sku.module';

@Injectable({
  providedIn: 'root'
})
export class MerchantSkuService {

  WIKI_URL : string = 'http://localhost:8081/merchants';

  constructor(private http: HttpClient) { }

  search(term : string){
    return this.http
    .get<any>(this.WIKI_URL, {})
    .pipe(
      map((response : any) => {
        console.log(response);
        return response.filter((v :any) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      })
    );
  }
}
