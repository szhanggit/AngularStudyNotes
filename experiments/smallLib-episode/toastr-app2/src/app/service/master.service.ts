import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { productmodel } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http:HttpClient) { }

  Getall(){
   return this.http.get<productmodel[]>('/api/products/');
  }
}
