import { Component, OnInit, ViewChild} from '@angular/core';
import { BaseResponse } from '../../models/base-response.model';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantConfigService } from '../../services/tenant-config.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { HttpErrorResponse } from '@angular/common/http';
import { TENANTS } from '../../enums/tenants';
import { UtilityService } from '../../services/utility.service';
import { Contact } from '../../models/client.model';
import { ClientPermissionService } from '../../services/client-permission.service';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  client : any;
  clientDetailsCollapsed = true;
  clientId: number=0;
  quotationCollapsed=false;
  clientIdentityCode: string='';      
  tenant!: string;
  isClientViewer:boolean=true;
  historyId:number=0;
  versionId:number=0;
  selectedTenantUTC!: string;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  lstClientContact:Contact[]=[];
  clientLogo={
    nodeUrl:'',
    height:0,
    width:0
  }
  banner={
    nodeUrl:'',
    height:0,
    width:0
  }
  
  voucherIssuerVisible:boolean=true;
  invoiceTitleVisible:boolean=true;
  invoiceNumberVisible:boolean=true;
  mandatoryAutoBillingVisible:boolean=true;
  statusSubscriptionVisible:boolean=true;
  statusProviderIdVisible:boolean=true;
  emailSenderNameVisible:boolean=true;
  emailSenderAddressVisible:boolean=true;
  emailServiceProviderVisible:boolean=true;
  smsSenderNameVisible:boolean=true;
  smsServiceproviderVisible:boolean=true;  
  customization:boolean=true;  
  notesVisible:boolean=true;
  smsEntityIdVisible:boolean=false;
  clientContactDetails!: [];

  constructor(private readonly _client: ClientService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _tenantConfigService: TenantConfigService,
    public _clientPermissionService : ClientPermissionService,

    private utilityService: UtilityService) { 
      this.selectedTenantUTC=utilityService.FetchLocalTimeFromUTC();
    }

  ngOnInit(): void {
    const clientHistoryIdFromRoute = this._route.snapshot.queryParamMap.get('historyId');
    this.historyId = clientHistoryIdFromRoute ? Number.parseInt(clientHistoryIdFromRoute) : 0; 
    const clientVersionIdFromRoute = this._route.snapshot.queryParamMap.get('versionId');
    this.versionId = clientVersionIdFromRoute ? Number.parseInt(clientVersionIdFromRoute) : 0; 

    this.getClientDetails();
  }
  //Get client detail by client Id based on Tenant
  getClientDetails(): void{      

    const clientIdFromRoute = this._route.snapshot.queryParamMap.get('clientId');
    this.clientId = clientIdFromRoute ? Number.parseInt(clientIdFromRoute) : 0; 
    const clientIdentityCodeFromRoute = this._route.snapshot.queryParamMap.get('identityCode');
    this.clientIdentityCode = clientIdentityCodeFromRoute ? clientIdentityCodeFromRoute : ''; 
    this.tenant = this._tenantConfigService.getTenant().name;
    this.showHideFields(this.tenant);
    if(this.historyId>0)
    {
      this.clientDetailsCollapsed=false;
      this._client.getClientHistoryDetailsById(this.historyId,this.tenant).subscribe((response:BaseResponse)=>{ 
        if (response.success) {
          let data = JSON.parse(response.data).clientHistoryById;        
          if(data.length > 0){
            this.client = data[0];  
            this.clientContactDetails = this.client?.clientContact;        
            this.FormatClientContactBannerLogo(this.tenant,this.client);                      
          }
          else{
            setTimeout(() => {
            let message = "No data found for client";
            this.toast?.showDanger(message);
               }, 2000);
            this._router.navigate(['clients']);
          }
          
        } 
        else {
          setTimeout(() => {
            let message = "There was a problem getting client data";
            this.toast?.showDanger(message);
            }, 2000); 
            
            this._router.navigate(['clients']);
        }
      },
      (err : HttpErrorResponse)=>{
        setTimeout(() => {
          this.toast?.showDanger(err.error.Message);
          }, 2000); 
  
          this._router.navigate(['clients']);
      });
    }
    else{
    this._client.getClientDetailsById(this.clientId,this.tenant).subscribe((response:BaseResponse)=>{ 
      if (response.success) {
        let data = JSON.parse(response.data).clientByID;        
        if(data.length > 0){
          this.client = data[0];
          this.clientContactDetails = this.client?.clientContact; 
          this.FormatClientContactBannerLogo(this.tenant,this.client);                      
        }
        else{
          setTimeout(() => {
          let message = "No data found for client";
          this.toast?.showDanger(message);
             }, 2000);
          this._router.navigate(['clients']);
        }        
      } 
	    else {
        setTimeout(() => {
          let message = "There was a problem getting client data";
          this.toast?.showDanger(message);
          }, 2000); 
          
          this._router.navigate(['clients']);
      }
    },
    (err : HttpErrorResponse)=>{
      setTimeout(() => {
        this.toast?.showDanger(err.error.Message);
        }, 2000); 

        this._router.navigate(['clients']);
    });
  }
}

//Show and hide fields based on tenants
showHideFields(tenant:string)
{
  if(tenant==TENANTS.TW)
  {
    this.voucherIssuerVisible=false;
    this.emailSenderNameVisible=false;
    this.emailSenderAddressVisible=false;
    this.emailServiceProviderVisible=false;
    this.smsSenderNameVisible=false;
    this.smsServiceproviderVisible=false;    
    this.customization=false;  
  }
  if(tenant==TENANTS.IN)
  {
    this.voucherIssuerVisible=false;
    this.mandatoryAutoBillingVisible=false;
    this.statusSubscriptionVisible=false;
    this.statusProviderIdVisible=false;
  }
  if(tenant==TENANTS.GL || tenant==TENANTS.SG || tenant== TENANTS.GR)
  {
    if(tenant==TENANTS.SG || tenant== TENANTS.GR)
    {
      this.voucherIssuerVisible=false;
    }
    this.invoiceTitleVisible=false;
    this.invoiceNumberVisible=false;
    this.mandatoryAutoBillingVisible=false;
    this.statusSubscriptionVisible=false;
    this.statusProviderIdVisible=false;
    this.emailServiceProviderVisible=false;     
    this.smsServiceproviderVisible=false;    
  }
}
  //Map clientContact,ClientLogo and Banner image
  private FormatClientContactBannerLogo(tenant:string,data: any) 
  {    
      if(this.historyId>0)
      {
          for (var contact of data.historyMapping) {                                
            this.lstClientContact.push({
              position:contact.contactHistory[0].position,
              name:contact.contactHistory[0].name,
              email:contact.contactHistory[0].email,
              mobileNumber:contact.contactHistory[0].mobileNumber
          })  }
      }
      else{  
          for (var contact of data.clientContact) {  
            this.lstClientContact.push({
              position:contact.position,
              name:contact.name,
              email:contact.email,
              mobileNumber:contact.mobileNumber
            })         
          }
      }
    //Map Banner Image
    if(data.bannerMediaId!=null && data?.banner?.length>0)
     {
       this.banner={
         nodeUrl: data.banner[0].nodeUrl,
         height:data.banner[0].height,
         width:data.banner[0].width,  
       }       
     }
     else{
      this.banner={
        nodeUrl:"",
        height:0,
        width:0, 
      }
     }
     //MapClientLogo 
     if(data.logoMediaId!=null && data?.clientLogo?.length>0)
     {
       this.clientLogo={
         nodeUrl:data.clientLogo[0].nodeUrl,
         height:data.clientLogo[0].height,
         width:data.clientLogo[0].width,    
       }
     }
     else{
      this.clientLogo={nodeUrl:"",
        height:0,
        width:0, };
     }
      
     //Map Sms entityId    
      if(tenant==TENANTS.IN && data?.smsServiceProvider?.length > 0 && data?.smsServiceProvider[0].vendorCode=='SMS_NETCORE')
      {
        this.smsEntityIdVisible=true;
      }    
  }

  navigateToclientEdit(): void {
    this._router.navigate(['clients/edit/' + this.clientId]
   );
  }
  //Page redirect to client history page
  navigateToclientHistory(): void {
    this._router.navigate(['clients/history/' + this.clientId]
   );
  }
  
  get isClientHistory():boolean{
    return this.historyId>0?true:false;
  }

}
