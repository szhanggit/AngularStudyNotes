import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class RefCountryService {

  private controller: string = "Tnt/RefCountry";
  constructor(private apiSvc: ApiService) { }

  getRefCountries():Observable<any[]>{
    return this.apiSvc.get(this.controller);
  }
}
