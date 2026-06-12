import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TenantModel } from 'src/app/core/models/tenant/tenant-model';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class TenantListService {

  private list: BehaviorSubject<TenantModel[]> = new BehaviorSubject<TenantModel[]>(null);
  constructor(private readonly tenantSvc: TenantService) { }

  getList(callbackFunction: any){
    const subscriber = this.tenantSvc.getTenants()
    .subscribe({
      next: res=>{
        this.list.next(res);
        callbackFunction(res);
      }, error: e=>{
        console.log(e);
        subscriber.unsubscribe();
      }, complete: ()=>{
        subscriber.unsubscribe();
      }
    });
  }

  subscribeToList(): Observable<TenantModel[]>{
    return this.list.asObservable();
  }



}
