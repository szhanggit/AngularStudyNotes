import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output ,ViewChild} from '@angular/core';
import { FormArray,AbstractControl, FormControl,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbTooltip,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CLIENT_CONSTANTS } from '../../constants/clients.constant';
import { BaseResponse } from '../../models/base-response.model';
import { ClientDetailEdit, ClientUpdateSecurityKeyRequest, emailProviderList, smsProviderList } from '../../models/client.model';
import { ClientService } from '../../services/client.service';
import { MediaLibraryService } from '../../services/media-library.service';
import { SecurityKeyService } from '../../services/security-key.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { MESSAGETYPES} from '../../enums/messageTypes';
import { HttpErrorResponse } from '@angular/common/http';
import { ClientPermissionService } from '../../services/client-permission.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit, AfterViewInit {

  @Output() onCancel:EventEmitter<any>= new EventEmitter();
  @Output() onSubmit:EventEmitter<any>= new EventEmitter();

  @Input() clientFormGroup: FormGroup = new FormGroup({});
  @Input() tenant!: string;
  @Input() isEdit!: boolean;
  @Input() clientDetailEdit!: ClientDetailEdit | undefined;
  @Input() clientContactDetails = [];

  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  displayclientname: string="";
  businessTypeList : any[] = [];
  voucherIssuerList : any[] = [];
  emailProviderList : emailProviderList[] = [];
  smsProviderList : smsProviderList[] = [];
  defaultEmailProvider:string="";
  defaultSmsProvider:string="";
  selectSecorityAlgo : number=0;

  securityAlgoList : any[] = CLIENT_CONSTANTS.SECURITY_ALGORITHM;
  countryList : any[] = [];
  stateList : any[] = [];
  cityList : any[] = [];

  logoMediaList : any[] = [];
  selectedLogoMediaItem : any = undefined;
  readonly MSG_ERR_CONTACT_DETAIL="Please enter the client contact info details."
  bannerMediaList : any[] = [];
  selectedBannerMediaItem : any = undefined;
  selectedValuestate : number=0;
  selectedValueCity : number=0;
  logoOnHover = false;
  bannerOnHover = false;
  clientId: number=0;
   constructor(
    private readonly securityKeyService: SecurityKeyService,
    private readonly clientService : ClientService,
    private readonly mediaLibraryService : MediaLibraryService,
    private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private modalService: NgbModal,
    public _clientPermissionService : ClientPermissionService,
    ) { 
      const contractIdFromRoute = this._route.snapshot.params.id;
      this.clientId = contractIdFromRoute ? Number.parseInt(contractIdFromRoute) : 0;
    }

  
  ngAfterViewInit(): void {
     this.clientFormGroup.markAllAsTouched();
    this.clientFormGroup.markAsTouched();
  }

  ngOnInit(): void {
    this.selectSecorityAlgo=this.f.securityAlgo.value;
    this.bindDropDown();
    this.onClientLogoAndBannerValueChanged();
    this.validationOnCondition();
  }

  bindDropDown():void{
    this.clientService.getDictionaryForDropdown("BusinessType").subscribe((data : BaseResponse)=>{
      if(data.success){
        this.businessTypeList = JSON.parse(data.data).dictionaries;
      }
    });
    this.clientService.getDictionaryForDropdown("Country").subscribe((data : BaseResponse)=>{
      if(data.success){
        this.countryList = JSON.parse(data.data).dictionaries;
      }
    });
    if(this.clientFormGroup.contains('voucherIssuer')){
      this.clientService.getDictionaryForDropdown("VoucherIssuer").subscribe((data : BaseResponse)=>{
        if(data.success){
          this.voucherIssuerList = JSON.parse(data.data).dictionaries;
        }
      });
    }

    this.clientService.getServiceProviderForDropdown(MESSAGETYPES.EMAIL).subscribe((data : BaseResponse)=>{
      if(data.success){        
        this.emailProviderList = JSON.parse(data.data).communicationVendorsByMessageTypeId;
        if(!this.isEdit)
        {
          this.defaultEmailProvider=this.emailProviderList.filter(x=>x.isDefaultVendorForTenant)[0].providerCode;
          this.f.emailProviderCode.setValue(this.defaultEmailProvider);
        }
        
      }
    });

    this.clientService.getServiceProviderForDropdown(MESSAGETYPES.SMS).subscribe((data : BaseResponse)=>{
      if(data.success){        
        this.smsProviderList = JSON.parse(data.data).communicationVendorsByMessageTypeId;
        if(!this.isEdit)
        {
          this.defaultSmsProvider=this.smsProviderList.filter(x=>x.isDefaultVendorForTenant)[0].providerCode;
          this.f.smsProviderCode.setValue(this.defaultSmsProvider);
        }
        
      }
    });

  }

  // form
  get f(): any {
    return this.clientFormGroup.controls;
  }

   //Form Events 
   get contactDetailcontrols(): FormArray {
    return this.clientFormGroup.get('contactDetails') as FormArray;
  }

  formGroupCtrl(fb: any): FormGroup {
    return fb as FormGroup;
  }


  get selectedLogoMediaItemId(): any {
    return this.selectedLogoMediaItem ? this.selectedLogoMediaItem.mediaId : "";
  }

  get selectedBannerMediaItemId(): any {
    return this.selectedBannerMediaItem ? this.selectedBannerMediaItem.mediaId : "";
  }

  get showSMSEntityID():boolean{
    return this.clientFormGroup.contains('smsEntityId') && this.smsProviderList.length > 0 && this.f.smsProviderCode.value == this.smsProviderList.filter(x=>x.vendorCode=='SMS_NETCORE')[0].providerCode;
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (formControl.valid) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  onCancelClicked() {
    this.onCancel.emit(true);
  }

  onCountryChanged(countryId : number):void {
    if(countryId>0){
      this.clientService.getDictionaryForDropdown("StateOrProvince", countryId).subscribe((data : BaseResponse)=>{
        if(data.success){
          this.stateList = JSON.parse(data.data).dictionaries;
        }
      });
    }
    else{
      this.stateList = [];
    }
  }

  onStateChanged(stateId : number):void {
    if(stateId>0){
      this.clientService.getDictionaryForDropdown("City", stateId).subscribe((data : BaseResponse)=>{
        if(data.success){
          this.cityList = JSON.parse(data.data).dictionaries;
          if(this.isEdit)
          {
            if(this.f.state != undefined)  
            {
              this.selectedValuestate=stateId;              
            } 
          }
        }
      });
    }
    else{
      this.cityList = [];
    }
  }
  bindCity(cityId : number)
  {
    this.selectedValueCity=cityId;
  }

  //On submit click event
  onSubmitClicked():void{
    if(this.validateRowforContactDetail())
    {
     if(!this.clientFormGroup.invalid){
      this.onSubmit.emit(this.clientFormGroup);
    }
    }
    else{
      this.toast?.showDanger(this.MSG_ERR_CONTACT_DETAIL); 
    }
  }

//Status change Event
  onStatusSubscriptionChanged():void{
    if(this.f.statusSubscriptionEnabled.value){
      this.f.statusProviderId.setValidators([Validators.required,Validators.minLength(0),Validators.maxLength(7), Validators.pattern("^[0-9]*$")]);
      this.f.statusProviderId.updateValueAndValidity();
    }
    else{
      this.f.statusProviderId.value = "";
      this.f.statusProviderId.clearValidators();
      this.f.statusProviderId.updateValueAndValidity();
    }
  }

  onLogoMediaDropTextChange():void{
    let wordSearch = this.f.logoMediaId.value;
    setTimeout(() => {
        if (wordSearch == this.f.logoMediaId.value) {
          this.mediaLibraryService.get(this.f.logoMediaId.value).subscribe((data : BaseResponse)=>{
            if(data.success){             
              this.logoMediaList = JSON.parse(data.data).media.items;
            }
          });
        }
    }, 1000);
    
  }

  onLogoMediaDropSelectChange(item : any):void{
    this.f.logoMediaId.setValue(item.keyword);
    this.selectedLogoMediaItem = item;  
  }

  onBannerMediaDropTextChange():void{
    let wordSearch = this.f.bannerMediaId.value;
    setTimeout(() => {
        if (wordSearch == this.f.bannerMediaId.value) {
          this.mediaLibraryService.get(this.f.bannerMediaId.value).subscribe((data : BaseResponse)=>{
            if(data.success){
              this.bannerMediaList = JSON.parse(data.data).media.items;
             
            }
          });
        }
    }, 1000);
    
  }

  onBannerMediaDropSelectChange(item : any):void{
    this.f.bannerMediaId.setValue(item.keyword);
    this.selectedBannerMediaItem = item;
   
  }


 
getLogo(mediaLogo:any): any[] { 
  this.logoMediaList= mediaLogo;
  this.selectedLogoMediaItem = mediaLogo[0]; 
  return mediaLogo; 
}

getBanner(mediaBanner:any): any[] { 
  this.bannerMediaList= mediaBanner; 
  this.selectedBannerMediaItem = mediaBanner[0];
  return mediaBanner; 
}

  removeLogo(): void {
   this.f.logoMediaId.setValue('');
   this.logoMediaList=[];
   this.selectedLogoMediaItem=undefined;
  }
  removeBanner(): void {
    this.f.bannerMediaId.setValue('');
    this.bannerMediaList=[];
    this.selectedBannerMediaItem=undefined;
   }

   onClientLogoAndBannerValueChanged(){
    if(this.clientFormGroup.contains('logoMediaId')){
      this.clientFormGroup.get("logoMediaId")?.valueChanges.subscribe(selectedValue => {
        this.applySubUrlValidation(selectedValue)
      });
    }
    if(this.clientFormGroup.contains('bannerMediaId')){
      this.clientFormGroup.get("bannerMediaId")?.valueChanges.subscribe(selectedValue => {
        this.applySubUrlValidation(selectedValue);
      });
    }
   }

   applySubUrlValidation(selectedValue : string):void{
    if(this.f.logoMediaId.value.trim() !== "" || this.f.bannerMediaId.value.trim() !== ""){
     this.f.subURL.setValidators([Validators.required,Validators.maxLength(6)]);
      this.f.subURL.updateValueAndValidity();
    }
    else{
      this.f.subURL.clearValidators();
      this.f.subURL.updateValueAndValidity();
    }
   }
  
   //Event for Button
   addNewContactDetails() {
    this.clientService.addNewContactDetailsControls(this.contactDetailcontrols,this._formBuilder);
    this.clientFormGroup.markAsDirty();
  }
    //To remove the contact detail row..  
    removeContactDetailRow(ct:any)
    {
      (<FormGroup>ct).controls.isActive.setValue(false);
     if((<FormGroup>ct).controls.isNewEntry.value == false) (<FormGroup>ct).controls.isUpdated.setValue(true);
      this.clientFormGroup.markAsDirty();
    }
 
    //It validate the row for the mandatory field
    //Return false if Invalid
    validateRowforContactDetail() : boolean
    {
      let isvalid=true;
      this.contactDetailcontrols.controls.forEach(ct => {
        if((<FormGroup>ct).controls.isActive.value == true)
        {
        if( 
              (
                   (<FormGroup>ct).controls.newcontactPersonName.value  != "" 
                && (<FormGroup>ct).controls.newcontacPersonJobTitle.value  != "" 
                && ((<FormGroup>ct).controls.newcontactEmail.value  != "" || (<FormGroup>ct).controls.newcontactPhoneNumber.value != "" )
              )
          || 
              (    (<FormGroup>ct).controls.newcontactPersonName.value  == "" 
                && (<FormGroup>ct).controls.newcontacPersonJobTitle.value  == "" 
                && (<FormGroup>ct).controls.newcontactEmail.value  == "" 
                && (<FormGroup>ct).controls.newcontactPhoneNumber.value == "" 
               )
        )
          {

            (<FormGroup>ct).controls.newcontactEmail.setErrors(null);
            (<FormGroup>ct).controls.newcontactPhoneNumber.setErrors(null);
            (<FormGroup>ct).controls.newcontactPersonName.setErrors(null);

           if(isvalid) isvalid=true;

          }
      else if((<FormGroup>ct).controls.newcontactPersonName.value=="")
          {
            isvalid=false;
            (<FormGroup>ct).controls.newcontactPersonName.setErrors({'required': true});
            (<FormGroup>ct).controls.newcontactPersonName.markAsTouched();
            (<FormGroup>ct).controls.newcontactPersonName.markAsDirty();
          }
      else if((<FormGroup>ct).controls.newcontactEmail.value=="" && (<FormGroup>ct).controls.newcontactPhoneNumber.value=="")
          {
            isvalid=false;
            if((<FormGroup>ct).controls.newcontactEmail.value=="")
             {(<FormGroup>ct).controls.newcontactEmail.setErrors({'required': true}); (<FormGroup>ct).controls.newcontactEmail.markAsTouched();(<FormGroup>ct).controls.newcontactEmail.markAsDirty();}
            if((<FormGroup>ct).controls.newcontactPhoneNumber.value=="") 
            {(<FormGroup>ct).controls.newcontactPhoneNumber.setErrors({'required': true});(<FormGroup>ct).controls.newcontactPhoneNumber.markAsTouched();(<FormGroup>ct).controls.newcontactPhoneNumber.markAsDirty();}
          }
        }
      });
      return isvalid;
    }
    
    //Remove InValid flag if number or email entered
    removeValidationForEmailAndNumner(ct:any)
    {
      if(ct.controls.newcontactEmail.value !="" || ct.controls.newcontactPhoneNumber.value !="")
      {
        if(ct.controls.newcontactEmail.value !="" && ct.controls.newcontactPhoneNumber.value=="" )(<FormGroup>ct).controls.newcontactPhoneNumber.setErrors(null);
        if(ct.controls.newcontactPhoneNumber.value !="" &&  ct.controls.newcontactEmail.value=="")(<FormGroup>ct).controls.newcontactEmail.setErrors(null);
      }
      this.ValidateField(ct);
    } 

    //Validate the Field for Update
    ValidateField(ct:any)
    {
      if((<FormGroup>ct).controls.newcontactEmail.touched 
      || (<FormGroup>ct).controls.newcontactPhoneNumber.touched 
      || (<FormGroup>ct).controls.newcontacPersonJobTitle.touched 
      || (<FormGroup>ct).controls.newcontactPersonName.touched )
      
      {
        if((<FormGroup>ct).controls.isNewEntry.value == false || (<FormGroup>ct).controls.isActive.value == true)  (<FormGroup>ct).controls.isUpdated.setValue(true);
      }
    } 

    //Open model content
    Open(content: any) {
   
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' , centered:true}).result.then(
        (result: any) => {
          //this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
          //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        },
      );
    }
   //End Button Event
   
   validationOnCondition()
   {
    if(this.clientFormGroup.contains("statusSubscriptionEnabled")== true)
     {
      if(this.f.statusSubscriptionEnabled.value== false)
      {
        this.f.statusProviderId.clearValidators();
        this.f.statusProviderId.updateValueAndValidity();        
      }  
     }
   } 

   isEmptyOrSpaces(event : any) {
    var strInvoiceTitle=this.f.invoiceTitle.value;
    if(strInvoiceTitle === null || strInvoiceTitle.match(/^ *$/) !== null )
     {
          this.clientFormGroup.controls['invoiceTitle'].setErrors({'isEmpty': true});
          this.clientFormGroup.controls['invoiceTitle'].invalid;
          this.clientFormGroup.controls['invoiceTitle'].markAsDirty();
     }
      // To prevent order of event when onblur event directly clicked on save button
      if (event.relatedTarget?.innerText === 'Save') {
          this.onSubmitClicked();
      }
}
   checkExistingStatusProviderId(statusProviderId : number, event : any)
   {
     if(this.clientFormGroup.contains("statusSubscriptionEnabled")== true)
     {
       if(this.f.statusSubscriptionEnabled.value== true)
       {
        this.f.statusProviderId.setValidators([Validators.required,Validators.minLength(0),Validators.maxLength(7), Validators.pattern("^[0-9]*$")]);
        this.f.statusProviderId.updateValueAndValidity();
        
         this.clientService.getCountByStatusProviderID(statusProviderId, this.clientId).subscribe((response:BaseResponse)=>{
           if(response.success){ 
             let data = JSON.parse(response.data);
             if(data.client.totalCount>0)
             {
               this.clientFormGroup.controls['statusProviderId'].setErrors({'DuplicateCheckStatusProviderID': true});
               this.clientFormGroup.controls['statusProviderId'].invalid;
               this.clientFormGroup.controls['statusProviderId'].markAsDirty();
             }
            // To prevent order of event when onblur event directly clicked on save button
            if (event.relatedTarget?.innerText === 'Save') {
              this.onSubmitClicked();
            }
           }
         });
       }      
     }  
   } 

   checkClientnameDuplicate(clientName : string, event : any)
   {
    this.clientService.getCountByClientName(clientName, this.clientId).subscribe((response:BaseResponse)=>{
      if(response.success){ 
        let data = JSON.parse(response.data);
        if(data.client.totalCount>0)
        {
          this.clientFormGroup.controls['clientName'].setErrors({'DuplicateCheckClientName': true});
          this.clientFormGroup.markAsDirty();
          this.clientFormGroup.invalid;
        }
        // To prevent order of event when onblur event directly clicked on save button
        if (event.relatedTarget?.innerText === 'Save') {
          this.onSubmitClicked();
        }
      }
    });
   } 
  
   updateSecurityKey()
   {    
    var data: ClientUpdateSecurityKeyRequest={
      clientId: this.clientId,
      securityAlgorithm: this.f.securityAlgo.value 
    };    
    this.clientService.updateSecurityKey(data).subscribe((response:BaseResponse)=>{
      if(response.success){ 
        this.f.securityKey.setValue(response.data); 
        this.selectSecorityAlgo=this.f.securityAlgo.value ; 
        this.toast?.showSuccess("Security Key updated successfully.");
      }
      else{
        this.f.securityAlgo.setValue(this.selectSecorityAlgo); 
        this.toast?.showSuccess(response.message);
      }
    },
    (err : HttpErrorResponse)=>{
      this.f.securityAlgo.setValue(this.selectSecorityAlgo); 
      this.toast?.showDanger(err.error.message);
    });
    this.clientFormGroup.markAsPristine(); 
   }

   OnCancel()
   {
    this.f.securityAlgo.setValue(this.selectSecorityAlgo); 
    this.clientFormGroup.markAsPristine(); 
   }
}
