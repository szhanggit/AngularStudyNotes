import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TenantModel } from 'src/app/core/models/tenant/tenant-model';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitsAsRefService {

  list = new BehaviorSubject<TenantModel[]>(null);
  constructor() { }

  getList(): Observable<TenantModel[]>{
    return this.list.asObservable();
  }
}
