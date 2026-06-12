import { Injectable } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TenantModel } from 'src/app/core/models/tenant/tenant-model';
import { ApiService } from '../../api.service';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  private controller: string = 'Tnt/Tenant';
  constructor(private apiSvc: ApiService) { }

  getTenants():Observable<TenantModel[]>{
    return this.apiSvc.get(this.controller);
  }

  getTenantById(id:number):Observable<TenantModel>{
    return this.apiSvc.get(`${this.controller}/${id}`);
  }

  addTenant(parameter:TenantModel, callbackFn:any){
   const subscriber =  this.apiSvc.post(this.controller,parameter)
    .subscribe({
      next: res=>{
        callbackFn(true);
      }, error:e=>{
        if((e.error) && (e.error.errors)){
           let errors = e.error.errors;
           let keys = Object.keys(errors);
           keys.forEach(key => {
            //  this.toastr.error(errors[key][0],"Error");
           });
        }
        callbackFn(false);
        subscriber.unsubscribe();
      }, complete: ()=>{
        subscriber.unsubscribe();        
      }
    })
  }

  updateTenant(parameter:TenantModel, callbackFn: any){
    const subscriber = this.apiSvc.put(this.controller, parameter)
    .subscribe({
      next: res=>{
        callbackFn(true);
      }, error:e=>{
        if((e.error) && (e.error.errors)){
           let errors = e.error.errors;
           let keys = Object.keys(errors);
           keys.forEach(key => {
            //  this.toastr.error(errors[key][0],"Error");
           });
        }
        callbackFn(false);
        subscriber.unsubscribe();
      }, complete: ()=>{
        subscriber.unsubscribe();        
      }
    })    
  }

  deleteTenant(id: number, callbackFunction:any){
    const subscriber = this.apiSvc.delete(`${this.controller}/${id}`)
    .subscribe({
      next:res=>{
        callbackFunction(res);
      }, error:e=>{
        console.log(e);
        subscriber.unsubscribe();
      }, complete: ()=>{
        subscriber.unsubscribe();
      }
    })
  }
}
