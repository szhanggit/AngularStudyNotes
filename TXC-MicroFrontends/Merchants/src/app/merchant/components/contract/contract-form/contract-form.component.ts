import { AfterViewInit, Component, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import { BaseResponse } from 'src/app/merchant/models/base-response.model';
import { ContractCreateRequest, ContractDraftEditRequest, ContractSKURequest, ContractUpdateRequest } from 'src/app/merchant/models/contract-create-request';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { NgbdToastGlobal, TxcDateTimeService } from '@txc-angular/component-library';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { Contract_CONSTANTS } from 'src/app/merchant/constants/Contract_CONSTANTS';
import { ContractModalAddSkuComponent } from '../contract-modal-add-sku/contract-modal-add-sku.component';
import { SkuBlukReuploadModalComponent } from '../modals/sku-bluk-reupload-modal/sku-bluk-reupload-modal.component';


@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit, AfterViewInit  {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

   readonly DELIMITER = '/';
   termList: any[] =  Contract_CONSTANTS.termList; 
   costSchemeList: any[] = Contract_CONSTANTS.costSchemeList;
   roundingRuleList: any[] = Contract_CONSTANTS.roundingRuleList; 
   roundingDecimalPlacesList: any[] = Contract_CONSTANTS.roundingDecimalPlacesList;  

  @Input() merchantId!: number;
  @Input() tenant!: string;
  @Input() formGroup!: FormGroup;
  @Input() isEdit = false;
  @Input() programId!:number;
  hoveredDate: NgbDate | null = null;

  today: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  selectedterm: any;

  priceOptionList: any[] = [];
  currentProgram: any;
  isUploader: boolean = false;
  errorMessageskuValidation: string = "";
  skuList: any[] = [];
  skuListFormatted: any[] = [];
  skuListData:any[]=[];
  selectedValuePrice : number=0;
  oldCostScheme : any;
  contractId:number;
  contractStatus: string | null;

  // form
  get f(): any {
    return this.formGroup.controls;
  }
  
  constructor(private readonly _router: Router,
    private readonly _routeactivate: ActivatedRoute,
    private modalService: NgbModal,
    calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private contractService: ContractService,
    private utilityService: UtilityService,
    @Inject(LOCALE_ID) public locale: string,
    private readonly _txcDateTimeService: TxcDateTimeService) {
    this.today = new NgbDate(calendar.getToday().year, calendar.getToday().month, calendar.getToday().day);
    this.fromDate = this.today;
    this.toDate = this.today;
    const contractIdFromRoute = this._routeactivate.snapshot.params.id;
    this.contractId = contractIdFromRoute ? Number.parseInt(contractIdFromRoute) : 0;       
    this.isUploader = history.state?.data;      
    this.isUploader == undefined ? false : this.isUploader ;
    this.contractStatus = this._routeactivate.snapshot.queryParamMap.get('status');  
    }
  ngOnInit(): void {
      if (this.contractService._getContract().merchantId != 0) {     
      let data = this.contractService._getContract();
      this.f.name.setValue(data.contractName);
      this.fromDate = new NgbDate(new Date(this._txcDateTimeService.getLocalDateTime(data.startDate)).getFullYear(), new Date(this._txcDateTimeService.getLocalDateTime(data.startDate)).getMonth() + 1, new Date(this._txcDateTimeService.getLocalDateTime(data.startDate)).getDate());
      this.toDate = new NgbDate(new Date(this._txcDateTimeService.getLocalDateTime(data.endDate)).getFullYear(), new Date(this._txcDateTimeService.getLocalDateTime(data.endDate)).getMonth() + 1, new Date(this._txcDateTimeService.getLocalDateTime(data.endDate)).getDate());
      this.f.period.setValue(this.toModel(this.fromDate) + ' ~ ' + this.toModel(this.toDate));
      this.f.paymentterm.setValue(data.paymentTermId);
      this.OnPaymentTermSelectionChanged();    
      this.f.priceoption.setValue(data.priceOptionId);
      this.selectedValuePrice= data.priceOptionId;
      this.f.costscheme.setValue(data.costSchemeId);
      this.setCost(data.costPercentage);
      this.f.roundingrule.setValue(data.costRoundingRuleId);
      this.contractStatus=="DraftEdit" ? data.costRoundingPlacesId = (data as any).costRoundingPlaceId :data.costRoundingPlacesId
      this.f.roundingdecimalplaces.setValue(data.costRoundingPlacesId);      
      this.skuList = data.listSku;
    }
  }

  ngOnChanges() {
    this.f.period.setValue(this.f.period.value)
  }

  //US-29702 implemetation
  ngAfterViewInit(): void {
    if (this.contractService._getContract().merchantId != 0){
      this.f.paymentterm.disable();
      this.f.priceoption.disable();
    }
    else{
      this.f.paymentterm.setValue(3);
      this.OnPaymentTermSelectionChanged();
      this.f.paymentterm.disable();
      this.f.priceoption.setValue(3);
      this.selectedValuePrice= 3;
      this.f.priceoption.disable();
    }
  }
  EditautopopulatePriceOption()
  {   
    if(this.isEdit)
    {
      if(this.f.paymentterm.value != "")
      {      
        if (this.priceOptionList.length == 0){
          this.priceOptionList= Contract_CONSTANTS.termList[(this.f.paymentterm.value)-1].priceOptionList;
         if(this.f.priceoption != undefined)  
         {
          this.selectedValuePrice=this.f.priceoption.value; 
         }                             
        }
      }
    }   
  }
 
  toModel(date: NgbDate | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl, message: string = '') {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl, message });
    }
  }

  navigateToCreateSKU(): void {
    if(this.contractStatus == "DraftEdit")
    {
      let data = this.setContractData();
      this._router.navigate(['/merchants/contract/sku/create'], { queryParams: 
        { 
        merchantId: this.merchantId,
        contractId:this.contractId,
        status:"DraftEdit" 
      } 
      });
    }
    else
    {
      let data = this.setContractData();
      this._router.navigate(['/merchants/contract/sku/create'], { queryParams: { merchantId: this.merchantId } });
    }
     
  }

  open(content: any) {
   
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' , centered:true}).result.then(
      (result: any) => {
        //this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  OnPaymentTermSelectionChanged(): void {   
    if(this.formGroup.value.paymentterm == "")
    {
      this.f.paymentterm.setValidators([Validators.required]);
      this.f.paymentterm.updateValueAndValidity();
    }
    else{
      this.f.priceoption.setValue("");
      this.selectedterm = this.termList.find(x => x.value == this.formGroup.value.paymentterm);
      if (this.selectedterm != undefined) {
        this.priceOptionList = this.selectedterm.priceOptionList;
        if (this.priceOptionList.length == 1) {
          this.selectedValuePrice= this.priceOptionList[0].value;
        }      
       
      }
      else {
        this.priceOptionList = [];
      }
    } 
  
  }

  OnCostSchemeSelectionChanged(modal : any): void {
    if(!this.hasSkuCost(modal)){
      this.setCost(0);
    }
  }

  setCost(value: number){
    this.oldCostScheme = this.formGroup.value.costscheme;
    if (this.formGroup.value.costscheme == "2") {
      this.f.cost.setValue("N/A");
      this.f.cost.disable();
    }
    else {
      this.f.cost.setValue(value ? value : "");
      this.f.cost.enable();
    }
  }

  getUtcDateTime(value: string) {
    const date = value
    const datestr= date.split("~");
    const startStringDate= datestr[0].trim();
    const endStringDate= datestr[1].trim();

    return {
      startDate: this._txcDateTimeService.getUtcDateTime(new Date(`${startStringDate} 00:00:00`)),
      endDate: this._txcDateTimeService.getUtcDateTime(new Date(`${endStringDate} 23:59:59`))
    }
  }

  setContractData(): ContractCreateRequest {
    const dateRange = this.f.period.value?.selectedDateRange || this.f.period.value;               
    var data: ContractCreateRequest = {
      contractName: this.formGroup.value.name,
      startDate: this.getUtcDateTime(dateRange).startDate,
      endDate: this.getUtcDateTime(dateRange).endDate,
      merchantId: this.merchantId,
      paymentTermId: this.f.paymentterm.value,
      priceOptionId: this.f.priceoption.value,
      costSchemeId: this.formGroup.value.costscheme,     
      costPercentage: this.formGroup.value.cost,
      costRoundingRuleId: this.formGroup.value.roundingrule,
      costRoundingPlacesId: this.formGroup.value.roundingdecimalplaces,
      listSku: this.skuList,
    };
    this.contractService._setContract(data);
    return data;
  }
  setContractDraftData(): ContractDraftEditRequest {
    const dateRange = this.f.period.value?.selectedDateRange || this.f.period.value;  
     var data: ContractDraftEditRequest = {
       contractId: this.contractId,
       contractName: this.formGroup.value.name,    
       startDate: this.getUtcDateTime(dateRange).startDate,
       endDate: this.getUtcDateTime(dateRange).endDate,  
       merchantId: this.merchantId,
       paymentTermId: this.f.paymentterm.value,
       priceOptionId: this.f.priceoption.value,
       //costSchemeId: this.formGroup.value.costscheme,
       costSchemeId: this.f.costscheme.value,
       costPercentage: this.formGroup.value.costscheme == "2" ? null :this.formGroup.value.cost,
       costRoundingRuleId: this.formGroup.value.roundingrule,
       costRoundingPlaceId: this.formGroup.value.roundingdecimalplaces,     
     };
     this.contractService._setContract(data);
     return data;
   }

   setContractDraftDataAddSku(): ContractUpdateRequest {
    const dateRange = this.f.period.value?.selectedDateRange || this.f.period.value;  
    var data: ContractUpdateRequest = {
      contractId:  this.contractId,
      contractName:this.formGroup.value.name,
      startDate: this.getUtcDateTime(dateRange).startDate,
      endDate: this.getUtcDateTime(dateRange).endDate, 
      paymentTermId: this.f.paymentterm.value,
      priceOptionId: this.f.priceoption.value,
      costSchemeId: this.f.costscheme.value,
      costPercentage: this.formGroup.value.costscheme == "2" ? null :this.formGroup.value.cost,
      costRoundingRuleId: this.formGroup.value.roundingrule,
      costRoundingPlaceId: this.formGroup.value.roundingdecimalplaces, 
      sku: []

    };

    for (let index = 0; index < this.skuList.length; index++) {
      let element = <ContractSKURequest>this.skuList[index];
      let firstIndex = data.sku.findIndex(x => x.skuName == element.skuName && x.skuNumber == element.skuNumber);
      if(firstIndex === -1){
        data.sku.push({
          skuName : element.skuName,
          skuNumber : element.skuNumber,
          skuTypeId : element.skuTypeId,
          voucherNumberRuleId : element.voucherNumberRuleId,
          faceValueWithTax : element.faceValueWithTax,
          multiplier : element.multiplier,
          skuCost : [{
            contractId : Number(this._routeactivate.snapshot.queryParamMap.get('contractId')),
            costWithTax : element.costWithTax,
            validstartDate :element.validstartDate,
            validEndDate : element.validEndDate,
            statusId : 2
          }]
        });
      }
      else{
        data.sku[firstIndex].skuCost.push({
          contractId : Number(this._routeactivate.snapshot.queryParamMap.get('contractId')),
          costWithTax : element.costWithTax,
          validstartDate : element.validstartDate,
          validEndDate : element.validEndDate,
          statusId : 2,
          skuCostId : 0
        });
      }
    }
     return data;
   }

   OnSubmit(modalContent: any): void { 
     if (!this.isEdit  && this.contractStatus != "DraftEdit") {        
       let data = this.setContractData();
    this.contractService.create(data).subscribe(
      (data: BaseResponse) => {
        let response = data.data;        
        if (response.id > 0) {
          if (this.skuList.length > 0) {
            this.isUploader = false;           
            this.goBack("contractCreated", this.formGroup.value.name);
          }
          else {
            this.open(modalContent);
          }
        }
        else {
          if (response.contractValidatonErrorDtos != null && response.contractValidatonErrorDtos.length > 0) {
            for (let index = 0; index < response.contractValidatonErrorDtos.length; index++) {
              const element = response.contractValidatonErrorDtos[index];
              this.toast?.showDanger(element.errorMessage);
            }
          }
          if (response.skuValidatonErrorDtos != null && response.skuValidatonErrorDtos.length > 0) {
            for (let index = 0; index < response.skuValidatonErrorDtos.length; index++) {
              const element = response.skuValidatonErrorDtos[index];
              this.toast?.showDanger(element.errorMessage);
            }
          }
        }
      },
      (err: any) => {       
        if (Array.isArray(err.error.data)) {
          this.utilityService.ShowUniqueValidationErrors(err.error.data,this.toast);
        }
        else {
          if (err.error.data.contractValidatonErrorDtos != null && err.error.data.contractValidatonErrorDtos.length > 0) {
            this.utilityService.ShowUniqueValidationErrors(err.error.data.contractValidatonErrorDtos,this.toast);           
          }
          if (err.error.data.skuValidatonErrorDtos != null && err.error.data.skuValidatonErrorDtos.length > 0) {
            this.utilityService.ShowUniqueValidationErrors(err.error.data.skuValidatonErrorDtos,this.toast);           
          }
        }
      });
  }
  else if(this.contractStatus == "DraftEdit")
  {
    this.EditDraftContractAddSku();
  }
  else{  
    let data = this.setContractDraftData();
      this.contractService.editContractDraft(data).subscribe(
        (data: BaseResponse) => {
          let response = data.data;         
          if (data.success) {
            this.toast?.showSuccess(data.message);
            this.goBack("contractUpdated", this.formGroup.value.name);           
          }else{
            if (response.contractValidationError != null && response.contractValidationError.length > 0) {
              for (let index = 0; index < response.contractValidationError.length; index++) {
                const element = response.contractValidationError[index];
                this.toast?.showDanger(element.errorMessage);
              }              
            }
          }
        },
        (err: any) => {  
          if (Array.isArray(err.error.data)) {
            for (let index = 0; index < err.error.data.length; index++) {
              const element = err.error.data[index];
              this.toast?.showDanger(element);
            }
          }
          else {
            if (err.error.data.contractValidationError != null && err.error.data.contractValidationError.length > 0) {
              for (let index = 0; index < err.error.data.contractValidationError.length; index++) {
                const element = err.error.data.contractValidationError[index];
                this.toast?.showDanger(element.errorMessage);
              }
            }            
          }
        }
      )
    }
  }
//Purpose of this function is used to update the draft contract and add sku.
  EditDraftContractAddSku()
  {
    let data = this.setContractDraftDataAddSku();
      this.contractService.editContract(data).subscribe(
        (data: BaseResponse) => {
          let response = data.data;         
          if (data.success) {
            this.toast?.showSuccess(data.message);
            this.goBack("contractUpdated", this.formGroup.value.name);           
          }else{
            if (response.contractSkuCostValidationError != null && response.contractSkuCostValidationError.length > 0) {
              for (let index = 0; index < response.contractSkuCostValidationError.length; index++) {
                const element = response.contractSkuCostValidationError[index];
                this.toast?.showDanger(element.errorMessage);
              }              
            }
          }
        },
        (err: any) => {  
          if (Array.isArray(err.error.data)) {
            for (let index = 0; index < err.error.data.length; index++) {
              const element = err.error.data[index];
              this.toast?.showDanger(element);
            }
          }
          else {
            if (err.error.data.contractSkuCostValidationError != null && err.error.data.contractSkuCostValidationError.length > 0) {
              for (let index = 0; index < err.error.data.contractSkuCostValidationError.length; index++) {
                const element = err.error.data.contractSkuCostValidationError[index];
                this.toast?.showDanger(element.errorMessage);
              }
            }            
          }
        }
      )
   
      }

  OnCancel(modalContent: any): void {
    if (this.skuList.length > 0) {
      this.open(modalContent);
    }
    else {
      this.goBack("contractCancelled");
    }
  }

  goBack(action : string, contractName : string = ""): void {
    this._router.navigate(['/merchants/details'],
      {
        queryParams:
        {
          tenantName: this.tenant,
          merchantId: this.merchantId
        },
        state: {
          action: action,
          contractName : contractName
        }

      });
  }

  ////US-29702 implemetation

  // autopopulatePriceOption() { 
  //   if(!this.isEdit)
  //   {
  //     if (this.priceOptionList.length == 1) {
  //       this.f.priceoption.setValue(this.priceOptionList[0].value);
  //       return true;
  //     }
  //     return false;
  //   }
  //   else{     
  //     this.f.priceoption.setValue(this.f.priceoption.value)
  //     return true;
  //   }
  // }

  dateType(): void {
    this.f.period.setValue("");
  }

  openReupload() : void{       
    this.isEdit == true ? this.contractStatus = "DraftEdit" : "undefined"; 
    let data = this.isEdit == true ?this.setContractDraftData() : this.setContractData();   
    const modalRef = this.modalService.open(SkuBlukReuploadModalComponent);
    modalRef.componentInstance.merchantId = this.merchantId;
    modalRef.componentInstance.programId=this.programId;   
    modalRef.componentInstance.costSchemeId= this.isEdit == true ? this.f.costscheme.value :this.formGroup.value.costscheme.toString();
    if(this.isEdit)
    {
      modalRef.componentInstance.contractStatus = "DraftEdit" ;   
    }  
    modalRef.result.then((data) => {
      this.skuList = [];
      this.errorMessageskuValidation="";
      this.isUploader=true;    
      if(data.success)
      {
        this.skuList = data.data.listSku;
      }
      else
      {    
        this.errorMessageskuValidation=data.message.toString();
      }
    }, (reason) => {});
  }

  /// <summary>
  /// This method used for thr open common model Add sku and bulk upload sku.
  /// </summary>


  navigateToAddSKU() : void{  
    this.isEdit == true ? this.contractStatus = "DraftEdit" : "undefined";
    let data = this.isEdit == true ?this.setContractDraftData() : this.setContractData();
    const modalRef = this.modalService.open(ContractModalAddSkuComponent);
    modalRef.componentInstance.merchantId = this.merchantId;
    modalRef.componentInstance.contractId = this.isEdit == true ? this.contractId : 0 
    modalRef.componentInstance.programId = this.programId;
    modalRef.componentInstance.costSchemeId= this.isEdit == true ? this.f.costscheme.value :this.formGroup.value.costscheme.toString();
    if(this.isEdit)
    {
      modalRef.componentInstance.contractStatus = "DraftEdit" ;   
    }   
    modalRef.result.then((data) => {
      this.isUploader=true;    
      if(data.success)
      {
        this.skuList = data.data.listSku;
      }
      else
      {    
        this.errorMessageskuValidation=data.message.toString();
      }
    }, (reason) => {});
  }

   /// <summary>
  /// If change the cost scheme type id then check has sku in sku list.
  /// </summary>
  hasSkuCost(modal : any): boolean {
    if(this.skuList.length > 0)
    {
      this.open(modal);
      return true
    }
    return false;
  }

  /// <summary>
  /// Confirmed change the cost scheme type.
  /// </summary>
  removeSkuCost(): void {
      this.skuList = [];
      this.setCost(0);
  }

  /// <summary>
  /// Canceled change the cost scheme type.
  /// </summary>
  resetCostScheme(): void {
    this.f.costscheme.setValue(this.oldCostScheme ? this.oldCostScheme : "");
  }
}
