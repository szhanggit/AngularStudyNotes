import { Injectable } from '@angular/core';
import { TenantModel } from 'src/app/core/models/tenant/tenant-model';
import { ModalService } from '../../tools/modal.service';
import { TenantService } from './tenant.service';

@Injectable({
  providedIn: 'root'
})
export class DialogModelInitializationService {

  editMode: boolean;
  
  currentDate = new Date(Date.now());
  constructor(private readonly modalSvc: ModalService
    , private readonly tenantSvc: TenantService) { }
  
  initialize(callbackFunction:any){
    this.modalSvc.getModalInfo()
    .subscribe({
      next: res=>{
        if(!res.display) return;

        if(res.title.indexOf("Edit") >=0 ){          
          this.editMode = true;
          this.getTenantBasicInfo(res.data as TenantModel, callbackFunction);
        }else{
          this.editMode = false;
          let model = <TenantModel>{
            tenantBasicInfoId: null,
            name: null,
            countryCode: null,
            timezone: null,
            timeFormat: null,
            currencySymbol: null,
            companyTaxType: null,
            companyTaxRate: null,
            effectivityDate: null,
            language: null,
            logo: null
            
          };
          callbackFunction(model);          
        }
        this.currentDate.setDate(this.currentDate.getDate() +1);
      }
    });
  }

  private getTenantBasicInfo(tenant:TenantModel,callbackFunction:any){
    const subscriber = this.tenantSvc.getTenantById(tenant.tenantBasicInfoId)
    .subscribe({
      next:res=>{
        callbackFunction(res);      
      }, error: e=>{
        console.log(e);
        subscriber.unsubscribe();
      }, complete: ()=>{
        subscriber.unsubscribe();
      }
    })
  }
}
