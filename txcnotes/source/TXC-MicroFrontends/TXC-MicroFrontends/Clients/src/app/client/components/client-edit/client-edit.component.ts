import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse } from '../../models/base-response.model';
import { IndiaClientFormGroup, TaiwanClientFormGroup,GRClientFormGroup,SingaporeClientFormGroup, GLClientFormGroup } from '../../models/client-form-group.model';
import { IDefineFormGroup } from '../../models/define-form-group.model';
import { ClientService } from '../../services/client.service';
import { SecurityKeyService } from '../../services/security-key.service';
import { TenantConfigService } from '../../services/tenant-config.service';
import { ClientFormComponent } from '../client-form/client-form.component';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { ClientDetailEdit } from '../../models/client.model';
@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.scss']
})
export class ClientEditComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  isEdit!: boolean;
  tenant!: string;
  clientId: number=0;
  clientIdentityCode!: string;
  formGroupDefinitions: IDefineFormGroup[] =[
    new TaiwanClientFormGroup(),
    new IndiaClientFormGroup(),
    new SingaporeClientFormGroup(),
    new GRClientFormGroup() ,
    new GLClientFormGroup() , 
  ];
  clientFormGroup: FormGroup = new FormGroup({});
  editSubmitted : boolean = false;
  mediaLogo: any = undefined;
  mediaBanner: any = undefined;
  clientname!: string;
  clientDetailEdit!: ClientDetailEdit | undefined;
  clientContactDetails!: [];
  @ViewChild(ClientFormComponent) clientForm!: ClientFormComponent;
 
  readonly ACTIVE_STATE:string="1";

  constructor(private readonly _router: Router,   
    private readonly securityKeyService: SecurityKeyService,
    private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    _tenantConfigService: TenantConfigService,
    private readonly clientService : ClientService
    ) { const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    this.tenant = _tenantConfigService.getTenant(tenantFromRoute).name;
    let def = this.formGroupDefinitions.find(f=> f.tenantCode === this.tenant)
    if (def) {
      this.clientFormGroup = def.define(_formBuilder, true,false,"");      
    }    
    const contractIdFromRoute = this._route.snapshot.params.id;
    this.clientId = contractIdFromRoute ? Number.parseInt(contractIdFromRoute) : 0;
  }

  getData(): void{    
    this.clientService.getClientDetailsById(this.clientId,this.tenant).subscribe((response:BaseResponse)=>{      
      if(response.success){  
        if(JSON.parse(response.data).clientByID.length == 0)
        {
          return;
        }        
        let data = JSON.parse(response.data).clientByID; 
        this.clientContactDetails = data[0]?.clientContact;
        if(data.length > 0){          
           this.clientFormGroup.controls.clientName.setValue(data[0].clientName);
           this.clientDetailEdit = data[0];
           this.clientFormGroup.contains("voucherIssuer")? this.clientFormGroup.controls.voucherIssuer.setValue(data[0].voucherIssuerId): null;
           this.clientFormGroup.controls.description.setValue(data[0].description);
           this.clientFormGroup.controls.businessType.setValue(data[0].businessTypeId);                
           this.clientFormGroup.controls.securityKey.setValue(data[0].securityKey);  
           this.clientFormGroup.controls.securityAlgo.setValue(data[0].securityAlgorithm);   
           this.clientFormGroup.controls.identityCode.setValue(data[0].identityCode);   
           this.clientFormGroup.controls.status.setValue(data[0].status); 
           this.clientIdentityCode=data[0].identityCode;
           if(this.clientFormGroup.contains("statusSubscriptionEnabled") == true)
           {            
            this.clientFormGroup.controls.statusSubscriptionEnabled.setValue(data[0].enableStatusSubscription);
            this.clientFormGroup.controls.statusProviderId.setValue(data[0].statusProviderId);      
          }
          
          this.clientFormGroup.contains("invoiceTitle") ? this.clientFormGroup.controls.invoiceTitle.setValue(data[0].invoiceTitle): null;
          this.clientFormGroup.contains("invoiceNumber") ? this.clientFormGroup.controls.invoiceNumber.setValue(data[0].invoiceRegisterNumber): null;
           this.clientFormGroup.controls.salesEmail.setValue(data[0].salesEmail);
           this.clientFormGroup.controls.contactPersonName.setValue(data[0].contactName);
           this.clientFormGroup.controls.contacPersonJobTitle.setValue(data[0].contactPersonJobTitle);//set static value. field is not available in graphql service
           this.clientFormGroup.controls.contactEmail.setValue(data[0].contactEmail);
           this.clientFormGroup.controls.contactPhoneNumber.setValue(data[0].contactPhone);
           this.clientFormGroup.controls.postcode.setValue(data[0].address[0].postCode);
           this.clientFormGroup.controls.district.setValue(data[0].address[0].district);
           this.clientFormGroup.controls.detailAddress.setValue(data[0].address[0].detailAddressLine);
           this.clientFormGroup.controls.country.setValue(data[0].address[0].countryId);
           this.clientFormGroup.controls.memo.setValue(data[0].memo);
           this.clientFormGroup.contains("mandatoryAutoBilling") ? this.clientFormGroup.controls.mandatoryAutoBilling.setValue(data[0].mandatoryAutoBilling):"";

           this.clientFormGroup.contains("emailSenderName") ?  this.clientFormGroup.controls.emailSenderName.setValue(data[0].emailSenderName):"";
           this.clientFormGroup.contains("emailSenderAddress") ? this.clientFormGroup.controls.emailSenderAddress.setValue(data[0].emailSenderAddress):"";
           this.clientFormGroup.contains("emailProviderCode") ? this.clientFormGroup.controls.emailProviderCode.setValue(data[0].emailServiceProvider.length>0? data[0].emailServiceProvider[0].providerCode:""):"";
           this.clientFormGroup.contains("smsSenderName") ? this.clientFormGroup.controls.smsSenderName.setValue(data[0].sMSSenderName):"";
           this.clientFormGroup.contains("smsProviderCode") ? this.clientFormGroup.controls.smsProviderCode.setValue(data[0].smsServiceProvider.length > 0? data[0].smsServiceProvider[0].providerCode:""):"";        
           this.clientFormGroup.contains("smsEntityId") ? this.clientFormGroup.controls.smsEntityId.setValue(data[0].smsEntityId):"";
           this.setClientContactDetails(data[0].clientContact);
           data[0].subURL==undefined || null || "" ? null : (this.clientFormGroup.contains("subURL") ? this.clientFormGroup.controls.subURL.setValue(data[0].subURL):null);
           if(this.clientForm != undefined)
           {
            if(this.clientFormGroup.contains("logoMediaId")== true || this.clientFormGroup.contains("bannerMediaId")==true)
            {
             
              if(data[0].clientLogo.length>0)
              {
                this.clientFormGroup.contains("logoMediaId") ? this.clientFormGroup.controls.logoMediaId.setValue(data[0].clientLogo[0].keyword):"";

                this.mediaLogo = [
                  { keyword: data[0].clientLogo[0].keyword, nodeUrl: data[0].clientLogo[0].nodeUrl,width:data[0].clientLogo[0].width ,height:data[0].clientLogo[0].height,mediaId:data[0].clientLogo[0].mediaId}
                ];
                this.clientForm.getLogo(this.mediaLogo);
                
              }
             
              if(data[0].banner.length>0)
              {
                this.clientFormGroup.contains("bannerMediaId") ? this.clientFormGroup.controls.bannerMediaId.setValue(data[0].banner[0].keyword):"";
                this.mediaBanner = [
                  { keyword: data[0].banner[0].keyword, nodeUrl: data[0].banner[0].nodeUrl,width:data[0].banner[0].width ,height:data[0].banner[0].height,mediaId:data[0].banner[0].mediaId}
                ];
                this.clientForm.getBanner(this.mediaBanner);
               
              }
             
            }
            this.clientForm.onCountryChanged(data[0].address[0].countryId);
            this.clientForm.onStateChanged(data[0].address[0].provinceId);            
            this.clientForm.bindCity(data[0].address[0].cityId);
           }
        }
      }      
    }) 
  }

  //Set the Client contact Details
  setClientContactDetails(clientcontactData:any)
  {
    for (let index = 0; index < clientcontactData.length; index++) {
      let responsedata = 
      {
        id:clientcontactData[index].clientContactId,
        name:clientcontactData[index].name,
        position:clientcontactData[index].position,
        email:clientcontactData[index].email,
        phonenumber:clientcontactData[index].mobileNumber,
      };
      this.clientService.addNewContactDetailsControls(this.contactDetailcontrols,this._formBuilder,responsedata);
    }

    //Add Default control
    this.clientService.addNewContactDetailsControls(this.contactDetailcontrols,this._formBuilder);
  }

     //Form Events 
   get contactDetailcontrols(): FormArray {
      return this.clientFormGroup.get('contactDetails') as FormArray;
    }

    
  ngOnInit(): void {      
  this.getData();
   }

  navToClientDetail(action?: string): void {
      this._router.navigate(['clients/details'],
      {
        queryParams: {
          tenantName: this.tenant,
          clientId: this.clientId,
          identityCode: this.clientIdentityCode
        }
      })    
  }
  onCancel(){
     this.navToClientDetail();        
  } 
  //Update the client request
  onSubmit():void{
    if(!this.editSubmitted){
      this.editSubmitted = true;
      let clientUpdateRequest =   this.clientService.SetClientRequestPayload( this.clientFormGroup,this.clientForm,this.clientId);
      this.clientService.update(clientUpdateRequest).subscribe((data : BaseResponse)=>{
        if(data.success){    
          setTimeout(() => { let message = data.message;
          this.toast.showSuccess("client details updated successfully.");}, 1000);
          this.navToClientDetail("clientUpdated");
         
        }
        else{
          this.editSubmitted = false;
          this.toast?.showDanger(data.message);
        }       
      },
      (err : HttpErrorResponse)=>{        
        if(err.error.data instanceof Array){
          for (let index = 0; index < err.error.data.length; index++) {
            this.toast?.showDanger(err.error.data[index]);          
          }
        }
        else{
          this.toast?.showDanger(err.error.message);
        }
        this.editSubmitted = false;
      });
    }
    else{
      this.editSubmitted=false;
    }  
  }
}
