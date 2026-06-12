import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DebugElement, Injectable } from '@angular/core';
import { flush } from '@angular/core/testing';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ClientFormComponent } from '../components/client-form/client-form.component';
import { TENANTS } from '../enums/tenants';
import { BaseResponse } from '../models/base-response.model';
import { ClientCreateContactRequest, ClientCreateRequest, ClientUpdateContactRequest, ClientUpdateSecurityKeyRequest } from '../models/client.model';
import { TenantConfigService } from './tenant-config.service';
import { SendSecuirtyKey } from '../models/security-key.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly ACTIVE=1;
  private readonly INACTIVE=0;
  constructor(private http: HttpClient,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) { }
    
    private _getURL(): string {
      let splited = window.location.toString().split('\/');
      return splited[0] + "//" + environment.apiUrl;
    }

   
    getClientDetailsById(clientId:number,tenant:string): Observable<BaseResponse> 
    {
      const url = `${this._getURL()}api/GraphQL/Query`;
      let data: any
      let qrycommonContactDataFetch="clientContact(status: true) {clientContactId, position, name, email, mobileNumber}"
      switch(tenant)
      {
        case TENANTS.TW:
        {
            data = { query: `query{
              clientByID(clientID:${clientId}) {
                clientName
                businessTypeId
                businessType {
                  displayName
                }
                description       
                securityKey
                securityAlgorithm
                identityCode
                invoiceTitle
                invoiceRegisterNumber
                mandatoryAutoBilling
                enableStatusSubscription
                statusProviderId    
                salesEmail
                ${qrycommonContactDataFetch}
                addressId
                address {
                addressId
                countryId
                 country {
                 displayName
                }
                provinceId       
                state {
                  displayName
                }
                cityId
                city {
                  displayName
                }
                district
                detailAddressLine
                postCode
                 }
                       memo
                       status
                 
                }
              }
           `
          };
          break;
        }

        case TENANTS.IN:
        {
          data = { query: `query{
            clientByID(clientID:${clientId}) {
              clientName
              businessTypeId
              businessType {
                displayName
              }
              description       
              securityKey
              securityAlgorithm
              identityCode
              invoiceTitle
              invoiceRegisterNumber
              emailSenderName
              emailSenderAddress
              emailServiceProvider{
                providerCode
                name
                vendorCode
              }
              sMSSenderName
              smsServiceProvider{
                providerCode
                name
                vendorCode
              }
              smsEntityId
              logoMediaId
              clientLogo {
                nodeUrl
                width
                height
                keyword
                mediaId
              }
              bannerMediaId
              banner {
                nodeUrl
                width
                height
                keyword
                mediaId
              }
              subURL
              salesEmail
              ${qrycommonContactDataFetch}
              addressId
              address {
              addressId
              countryId
              country {
                displayName
              }
              provinceId       
              state {
                displayName
              }
              cityId
              city {
                displayName
              }
              district
              detailAddressLine
              postCode
              }	
              memo
              status  
               
            }
            }
           `
          };
          break;
        }
        case TENANTS.GL:
        {
          data = { query: `query{
            clientByID(clientID:${clientId}) {
              clientName
                voucherIssuerId
                voucherIssuer{
                    displayName
                }
              businessTypeId
              businessType {
                displayName
              }
              description       
              securityKey
              securityAlgorithm
              identityCode	
              emailSenderName
              emailSenderAddress	
              sMSSenderName	
              logoMediaId
              clientLogo {
                nodeUrl
                width
                height 
                keyword
                mediaId
              }
              bannerMediaId
              banner {
                nodeUrl
                width
                height
                keyword
                mediaId
              }
              subURL
              salesEmail
              ${qrycommonContactDataFetch}
              addressId
              address {
              addressId
              countryId
              country {
                displayName
              }
              provinceId       
              state {
                displayName
              }
              cityId
              city {
                displayName
              }
              district
              detailAddressLine
              postCode
              }		
              status  
              memo
               
            }
            }
           `
           
          };
          
          break;
        }
        case TENANTS.SG:
        case TENANTS.GR:
        {
            data = { query: `query{
              clientByID(clientID:${clientId}) {
                clientName
                businessTypeId
                businessType {
                  displayName
                }
                description       
                securityKey
                securityAlgorithm
                identityCode	
                emailSenderName
                emailSenderAddress	
                sMSSenderName	
                logoMediaId
                clientLogo {
                  nodeUrl
                  width
                  height 
                  keyword
                  mediaId
                }
                bannerMediaId
                banner {
                  nodeUrl
                  width
                  height
                  keyword
                  mediaId
                }
                subURL
                salesEmail
                ${qrycommonContactDataFetch}
                addressId
                address {
                addressId
                countryId
                country {
                  displayName
                }
                provinceId       
                state {
                  displayName
                }
                cityId
                city {
                  displayName
                }
                district
                detailAddressLine
                postCode
                }		
                memo
                status
                
              }
              }
             `             
            };
            
            break;
        }
      }
      return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;

    }
    
    
    getAll(pageIndex : number = 0, pageSize : number = 20, searchTerm : string = "", iVoucherIssuerId:number|null): Observable<BaseResponse> {
      let url = `${this._getURL()}api/GraphQL/Query`;
      let strVoucherIssuerWhere: string = iVoucherIssuerId != null ? `{ voucherIssuerId: { eq: ${iVoucherIssuerId} } },`: "";
      let strInvoiceRegisterNumber: string = this._tenantConfigService.getTenant().name == 'TW' ? `{ invoiceRegisterNumber: { contains: "${searchTerm}" } },`: "";
      let strVoucherIssuerSelect: string = this._tenantConfigService.getTenant().name == 'GL' ? "voucherIssuer{ displayName }": "";

      const data = { query: `query{
        client(
          skip: ${pageIndex} 
          take: ${pageSize} 
          where: {
            and: [
              { or: [
                  { clientName: { contains: "${searchTerm}" } },
                  ${strInvoiceRegisterNumber}
                  { identityCode: { contains: "${searchTerm}" } }
              ]},
              ${strVoucherIssuerWhere}
            ]
          }
          order: { id: DESC}
            ){
            totalCount
            items{
                id,
                clientName,
                identityCode,
                voucherIssuerId,
                ${strVoucherIssuerSelect}
                status,
                invoiceRegisterNumber
            }
        }
      }`};
   
      return this.http.post(url, data , { 
        headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) 
      }) as Observable<BaseResponse>;
    }

getDictionaryForDropdown(category : string = "", parent_id : number = 0): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;

    let parentIdClause = parent_id > 0 ? `parentId: {eq: ${parent_id}}` : "";

    const data = { query: `query{
      dictionaries(
          where: {
              category: {eq: "${category}"}
              ${parentIdClause}
          }
      ){
          dictionaryId,
          displayName
      }
    }`};
   
    return this.http.post(url, data , { 
      headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) 
    }) as Observable<BaseResponse>;
  }

  //Get email and SMS service provider
  getServiceProviderForDropdown(messageType : number = 0): Observable<BaseResponse> {
    const url = `${this._getURL()}api/GraphQL/Query`;
    
    const data = { query: `query{
      communicationVendorsByMessageTypeId(messageTypeId:${messageType} where:{isActive:{eq:true}})
      {
          providerCode
          name
          isDefaultVendorForTenant
          vendorCode
      }
  }`};
   
    return this.http.post(url, data , { 
      headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) 
    }) as Observable<BaseResponse>;
  }
  // Get the client history list by client id
  getClientHistoryByClientId(clientId:number): Observable<BaseResponse> {
    
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
      clientHistoryByClientId(clientID:${clientId}
        order:{id:DESC}) {
          id
          clientName
          createdOn
          createdBy
          status
    }
  }`
    };
    return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
  // Get the client history details by id
  getClientHistoryDetailsById(clientHistoryID:number,tenant:string): Observable<BaseResponse> 
    {
      const url = `${this._getURL()}api/GraphQL/Query`;
      let strQuery : string="";
      switch(tenant)
      {
          case TENANTS.TW:
          {
            strQuery="invoiceTitle,invoiceRegisterNumber,mandatoryAutoBilling,  enableStatusSubscription, statusProviderId, memo  ";
            break;
          }
          case TENANTS.IN:
          {
            strQuery="invoiceTitle,invoiceRegisterNumber, emailSenderName,emailSenderAddress,emailServiceProvider{providerCode,name,vendorCode},sMSSenderName, smsServiceProvider{providerCode,name,vendorCode},smsEntityId, logoMediaId, clientLogo, {nodeUrl,width,height, keyword,mediaId }bannerMediaId,banner {nodeUrl,width,height, keyword,mediaId,},subURL,memo";
            break;
          }
          case TENANTS.GL:
          {
            strQuery="voucherIssuerId,voucherIssuer{displayName},emailSenderName,emailSenderAddress,sMSSenderName,logoMediaId, clientLogo, {nodeUrl,width,height, keyword,mediaId }bannerMediaId,banner {nodeUrl,width,height, keyword,mediaId,},subURL";
            break;
          }
          case TENANTS.SG:
          case TENANTS.GR:
          {
            strQuery="emailSenderName,emailSenderAddress,sMSSenderName,logoMediaId, clientLogo, {nodeUrl,width,height, keyword,mediaId }bannerMediaId,banner {nodeUrl,width,height, keyword,mediaId,},subURL,memo";
          break;
        }
      }
      let data: any
      
            data = { query: `query{
              clientHistoryById(clientHistoryID:${clientHistoryID}) 
              {
                clientName             
                businessTypeId
                businessType {
                  displayName
                }
                description       
                securityKey
                securityAlgorithm
                identityCode 
                salesEmail                
                addressId
                address {
                addressId
                countryId
                country {
                 displayName
                }
                provinceId       
                state {
                  displayName
                }
                cityId
                city {
                  displayName
                }
                district
                detailAddressLine
                postCode
                 }
                 historyMapping
                 { contactHistory(status: true) 
                    {
                      name, 
                      position, 
                      email, 
                      mobileNumber
                    }
                  },
                 status
                 createdOn
                 ${strQuery}
                }              
            }`};
            console.log(data);
      return this.http.post(url, data , { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;

    }

  create(data : ClientCreateRequest): Observable<BaseResponse>{
    const url = `${this._getURL()}api/Client`;
    const headers : HttpHeaders = this._authorizationLibraryService.getAMMHeaders(
      this._tenantConfigService.getTenant());
    return this.http.post(url, data, {headers}) as Observable<BaseResponse>;
  }

  update(data : ClientCreateRequest): Observable<BaseResponse>{
    const url = `${this._getURL()}api/Client`;
    const headers : HttpHeaders = this._authorizationLibraryService.getAMMHeaders(
      this._tenantConfigService.getTenant());
    return this.http.put(url, data , {headers}) as Observable<BaseResponse>;
  }

  patch(clientId : number, body : any): Observable<BaseResponse>{
    const url = `${this._getURL()}api/Client/${clientId}`;
    return this.http.patch(url, body, { headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) }) as Observable<BaseResponse>;
  }
  getCountByStatusProviderID(statusProviderId : number, clientId : number): Observable<BaseResponse> 
  {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
      client(where: {
        and: {
          enableStatusSubscription: {
            eq: true
          }
          statusProviderId: {
            eq: ${statusProviderId}
           
          }
          id: {
            neq: ${clientId}
          }
        }
    
      }) {
        totalCount
      }
    }`};
    return this.http.post(url, data , { 
      headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) 
    }) as Observable<BaseResponse>;
  }

  getCountByClientName(clientName : string, clientId : number): Observable<BaseResponse> 
  {
    const url = `${this._getURL()}api/GraphQL/Query`;
    const data = { query: `query {
      client(where: {
        and: {
          clientName: {
            eq: "${clientName}"
          }         
          id: {
            neq: ${clientId}
          }
        }
    
      }) {
        totalCount
      }
    }`};
    return this.http.post(url, data , { 
      headers: this._authorizationLibraryService.getAMMHeaders(this._tenantConfigService.getTenant()) 
    }) as Observable<BaseResponse>;
  }
  

  //To Generate the Unique ID
  createGuid(){  
    function customeGuid() {  
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);  
    }  
    return (customeGuid() + customeGuid() + "-" + customeGuid() + "-4" + customeGuid().substr(0,3) + "-" + customeGuid() + "-" + customeGuid() + customeGuid() + customeGuid()).toLowerCase();  
 }  

 //Add Dynamic controls for contact details

 public addNewContactDetailsControls(formcontrolArray:any,_formBuilder:any,data:any=null) {
  if(data== null)
  {
  let newId = this.createGuid();
  formcontrolArray.insert(0, _formBuilder.group({
    contactid: new FormControl({ value: newId, disabled: false }),
    newcontactPersonName: new FormControl({ value: '', disabled: false }, [Validators.maxLength(30)]),
    newcontacPersonJobTitle: new FormControl({ value: '', disabled: false }, [Validators.maxLength(100)]),
    newcontactEmail: new FormControl({ value: '', disabled: false }, [Validators.email, Validators.maxLength(255)]),
    newcontactPhoneNumber: new FormControl({ value: '', disabled: false }, [Validators.maxLength(15)]),
    isActive: new FormControl({ value: true, disabled: false }),
    isUpdated: new FormControl({ value: false, disabled: false }),
    isNewEntry: new FormControl({ value: true, disabled: false })
  }
  ));
} 
else
{
  formcontrolArray.insert(0, _formBuilder.group({
    contactid: new FormControl({ value: data.id, disabled: false }),
    newcontactPersonName: new FormControl({ value: data.name, disabled: false }, [Validators.maxLength(30)]),
    newcontacPersonJobTitle: new FormControl({ value: data.position, disabled: false }, [Validators.maxLength(100)]),
    newcontactEmail: new FormControl({ value: data.email, disabled: false }, [Validators.email, Validators.maxLength(255)]),
    newcontactPhoneNumber: new FormControl({ value: data.phonenumber, disabled: false }, [Validators.maxLength(15)]),
    isActive: new FormControl({ value: true, disabled: false }),
    isUpdated: new FormControl({ value: false, disabled: false }),
    isNewEntry: new FormControl({ value: false, disabled: false })
  })); 
 }
}

//Create Request payload
public SetClientRequestPayload(requestFormData : FormGroup,clientForm:ClientFormComponent,clientID:number) : any
{ 
  var requestDataMapper: ClientCreateRequest = {
    ClientId: clientID,
    clientName: requestFormData.controls.clientName.value,
    invoiceRegisterNumber: requestFormData.contains("invoiceNumber") ? requestFormData.controls.invoiceNumber.value : "NA",
    voucherIssuerId: requestFormData.contains("voucherIssuer") ? requestFormData.controls.voucherIssuer.value : null,
    businessTypeId: requestFormData.controls.businessType.value == "" ? null : requestFormData.controls.businessType.value,
    status: clientID > 0 ? requestFormData.controls.status.value : this.INACTIVE,
    securityAlgorithm: requestFormData.controls.securityAlgo.value,       
    logoMediaId: requestFormData.contains("logoMediaId") ? clientForm.selectedLogoMediaItemId : null,
    bannerMediaId: requestFormData.contains("bannerMediaId") ? clientForm.selectedBannerMediaItemId : null,
    mandatoryAutoBilling: requestFormData.contains("mandatoryAutoBilling") ? requestFormData.controls.mandatoryAutoBilling.value : false,
    invoiceTitle: requestFormData.contains("invoiceTitle") ? requestFormData.controls.invoiceTitle.value : "NA",
    subURL: requestFormData.contains("subURL") ? requestFormData.controls.subURL.value : null,
    emailProviderCode: requestFormData.contains("emailProviderCode") ? requestFormData.controls.emailProviderCode.value : null,
    emailSenderName: requestFormData.contains("emailSenderName") ? (requestFormData.controls.emailSenderName.value == "" ? null : requestFormData.controls.emailSenderName.value) : null,
    emailSenderAddress: requestFormData.contains("emailSenderAddress") ? (requestFormData.controls.emailSenderAddress.value == "" ? null : requestFormData.controls.emailSenderAddress.value) : null,
    applyEmailSubject: null,
    smsProviderCode: requestFormData.contains("smsProviderCode") ? requestFormData.controls.smsProviderCode.value : null,
    smsSenderName: requestFormData.contains("smsSenderName") ? (requestFormData.controls.smsSenderName.value == "" ? null : requestFormData.controls.smsSenderName.value) : null,
    smsEntityId: requestFormData.contains("smsEntityId") ? requestFormData.controls.smsEntityId.value : null,
    salesEmail: requestFormData.controls.salesEmail.value == "" ? null : requestFormData.controls.salesEmail.value,
    memo: requestFormData.controls.memo.value,
    description: requestFormData.controls.description.value == "" ? null : requestFormData.controls.description.value,
    detailAddressLine: requestFormData.controls.detailAddress.value.trim(),
    district: requestFormData.controls.district.value.trim(),
    cityId: requestFormData.controls.city.value,
    stateOrProvinceId: requestFormData.controls.state.value,
    postcode: requestFormData.controls.postcode.value,
    countryId: requestFormData.controls.country.value,
    addressStatus: this.ACTIVE,
    statusSubscriptionEnabled: requestFormData.contains("statusSubscriptionEnabled") ? requestFormData.controls.statusSubscriptionEnabled.value : false,
    statusProviderId: requestFormData.contains("statusSubscriptionEnabled") && requestFormData.controls.statusProviderId.value ? requestFormData.controls.statusProviderId.value : null,
    longitude: null,
    latitude: null,
    createClientContacts: clientID == 0 ?  this.getClientcontactList(requestFormData) : [],
    updateClientContacts: clientID > 0 ?  this.getClientcontactListUpdated(requestFormData):  [],
    emailHeaderMediaId: null,
    emailFooterMediaId: null,
  }
  return requestDataMapper;
}

//Get Create Client Contract List
getClientcontactList(requestFormData : FormGroup)
{
  var arrContactDetails: ClientCreateContactRequest[] = [];
  (requestFormData.get('contactDetails') as FormArray).controls.forEach(ct => {
    if(!this.isSkipContactDetails(ct))
    {
    let contactdetails: ClientCreateContactRequest = {
      email:(<FormGroup>ct).controls.newcontactEmail.value,
      mobileNo:(<FormGroup>ct).controls.newcontactPhoneNumber.value,
      name:(<FormGroup>ct).controls.newcontactPersonName.value,
      position:(<FormGroup>ct).controls.newcontacPersonJobTitle.value
    }
    arrContactDetails.push(contactdetails)
    }
  });
  return arrContactDetails;
}


//Get Update Client Contact List
getClientcontactListUpdated(requestFormData : FormGroup)
{
  var arrContactDetails: ClientUpdateContactRequest[] = [];
  (requestFormData.get('contactDetails') as FormArray).controls.forEach(ct => {
    if(!this.isSkipContactDetails(ct))
    {
      let contactdetails: ClientUpdateContactRequest = {
      clientContactId: (<FormGroup>ct).controls.isNewEntry.value == true ? 0  : (<FormGroup>ct).controls.contactid.value,
      email:(<FormGroup>ct).controls.newcontactEmail.value,
      mobileNo:(<FormGroup>ct).controls.newcontactPhoneNumber.value,
      name:(<FormGroup>ct).controls.newcontactPersonName.value,
      position:(<FormGroup>ct).controls.newcontacPersonJobTitle.value,
      isActive:(<FormGroup>ct).controls.isActive.value,
      isUpdated:(<FormGroup>ct).controls.isUpdated.value
    }
    arrContactDetails.push(contactdetails)
  }
  });

  return arrContactDetails;
}

//To check for SKIP contact Details
isSkipContactDetails(ct :AbstractControl) :boolean
{
  if (
  (  
     (<FormGroup>ct).controls.newcontactPersonName.value  == "" 
  && (<FormGroup>ct).controls.newcontacPersonJobTitle.value  == "" 
  && (<FormGroup>ct).controls.newcontactEmail.value  == "" 
  && (<FormGroup>ct).controls.newcontactPhoneNumber.value == "" && (<FormGroup>ct).controls.isNewEntry.value == true 
 ) 
   ||
  ((<FormGroup>ct).controls.isActive.value  == false) && (<FormGroup>ct).controls.isNewEntry.value  == true)
  {
    return true;
  }
  return false;
}
//Update security key
updateSecurityKey(data : ClientUpdateSecurityKeyRequest): Observable<BaseResponse>{ 
  const url = `${this._getURL()}api/Client/UpdateSecurityKey`;
  const headers : HttpHeaders = this._authorizationLibraryService.getAMMHeaders(
    this._tenantConfigService.getTenant());
  return this.http.post(url, data , {headers}) as Observable<BaseResponse>;
}

//Send security key
sendSecurityKey(body: SendSecuirtyKey): Observable<BaseResponse> {
  const url = `${this._getURL()}api/Client/SendSecurityKey`;
  const headers : HttpHeaders = this._authorizationLibraryService.getAMMHeaders(
    this._tenantConfigService.getTenant());
  return this.http.post(url, body, {headers}) as Observable<BaseResponse>;
}

}

