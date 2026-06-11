import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  Approval_List(){
    return this.http
    .get(environment.apiUrl+"api/approval-list",{})
    .pipe(
      map((response : any) => {
        console.log(response);
        return response;//.filter((v :any) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      })
    );
  }

  BatchDetail_List(){
    return this.http
    .get(environment.apiUrl+"api/batch-detail-list",{})
    .pipe(
      map((response : any) => {
        console.log(response);
        return response;//.filter((v :any) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
      })
    );
  }

}
