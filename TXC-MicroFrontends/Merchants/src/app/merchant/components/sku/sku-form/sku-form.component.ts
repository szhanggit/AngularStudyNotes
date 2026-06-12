import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbTooltip, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { ContractCreateRequest, ContractSkuCosts, ContractSKURequest, SkuCreateRequest, SkuUpdateRequest } from 'src/app/merchant/models/contract-create-request';
import { IProgram } from 'src/app/merchant/models/program.model';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { MerchantService } from 'src/app/merchant/services/merchant.service';
import { ProgramService } from 'src/app/merchant/services/program.service';
import { VoucherNumberRuleService } from 'src/app/merchant/services/voucher-number-rule.service';
import { SkuService } from 'src/app/merchant/services/sku.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { BaseResponse } from 'src/app/merchant/models/base-response.model';
import { SkuTypeEnum, SKU_CONSTANTS } from 'src/app/merchant/constants/sku_constant';
import { formatDate } from '@angular/common';
import { CharacterValidator } from 'src/app/merchant/validators/character.validator';
import { TxcDateTimeService } from '@txc-angular/component-library';
import { DateOutputValues } from 'src/app/merchant/enums/date-picker.enum';
import { CostCalculationPipe } from 'src/app/merchant/pipes/cost-calculation.pipe';
import { Pipe, PipeTransform } from '@angular/core';
import { Contract_CONSTANTS } from 'src/app/merchant/constants/Contract_CONSTANTS';
@Component({
  selector: 'app-sku-form',
  templateUrl: './sku-form.component.html',
  styleUrls: ['./sku-form.component.scss'],
  providers: [ CostCalculationPipe ]
})
export class SKUFormComponent implements OnInit {

  @Output() onCancel:EventEmitter<any>= new EventEmitter();
  
  @Input() merchantId!: number;
  @Input() index!: number;
  @Input() tenant!: string;
  @Input() formGroup!: FormGroup;
  @Input() isEdit = false;
  @Input() skuId!: number;
  @Input() contractId!: number;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  contract: ContractCreateRequest;
  programs: IProgram[] = [];
  currentProgram: any;
  merchant: any;
  termList!: any[];
  skuTypeList: any[] = SKU_CONSTANTS.SKU_TYPE;
  SkuTypeEnum = SkuTypeEnum;  
  vnrList!: any[];
  isExistingSKU : boolean = false;
  existingSKU : any;
  statusApproved : number=2;
  isAfterBulkUploader: boolean = false;
  fromDateCost: any[] = [];
  toDateCost: any[] = [];
  contractStatus: string | null;
  CONTRACTDETAILS = 'contractDetails';
  counterItem:number =0;
  CostValuePercntage!:number;
  CostSchema: any[] = Contract_CONSTANTS.costSchemeList;  
  public expiredCostModelData: Array<any> = [];

  get f(): any {
    return this.formGroup.controls;
  }

  get costs(): FormArray {
    return this.formGroup.get('costs') as FormArray;
  }

  formGroupCtrl(fb: any): FormGroup {
    return fb as FormGroup;
  }

  getFromDate(index : number): any{
    if(this.fromDateCost.length > index)
      return this.fromDateCost[index].fromDate as NgbDate;
    else
      return undefined;
  }

  getToDate(index : number): any{
    if(this.fromDateCost.length > index)
      return this.fromDateCost[index].toDate as NgbDate;
    else
      return undefined;
  }

  constructor(
    private readonly _activeroute: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private _merchantService: MerchantService,
    private _vnrService: VoucherNumberRuleService,
    private readonly _programService: ProgramService,
    private readonly _contractService: ContractService,
    private readonly _skuService: SkuService,
    private _modalService: NgbModal,
    private readonly _tenantConfigService: TenantConfigService,
     private costCalculationPipe: CostCalculationPipe ,
    @Inject(LOCALE_ID) public locale: string,
    private readonly _txcDateTimeService: TxcDateTimeService) {
    this.contract = this._contractService._getContract();
    this.tenant = this._tenantConfigService.getTenant().name;
    const contractIdFromRoute = this._activeroute.snapshot.queryParamMap.get('contractId');
    this.contractId = contractIdFromRoute ? Number.parseInt(contractIdFromRoute) : 0;
    this.contractStatus = this._activeroute.snapshot.queryParamMap.get('status');   
    if(this.contract.startDate != "" && this.contract.endDate != ""){
      let startDate = this.contract.startDate;
      let fromDate = new NgbDate(new Date(this._txcDateTimeService.getLocalDateTime(startDate)).getFullYear(), new Date(this._txcDateTimeService.getLocalDateTime(startDate)).getMonth() + 1, new Date(this._txcDateTimeService.getLocalDateTime(startDate)).getDate());

      let endDate = this.contract.endDate;
      let toDate = new NgbDate(new Date(this._txcDateTimeService.getLocalDateTime(endDate)).getFullYear(), new Date(this._txcDateTimeService.getLocalDateTime(endDate)).getMonth() + 1, new Date(this._txcDateTimeService.getLocalDateTime(endDate)).getDate());

      this.addCostValue(0, fromDate, toDate);      
    }     
    const queryStringValueIndex = this._activeroute.snapshot.queryParamMap.get('index');
    this.index = queryStringValueIndex ? Number.parseInt(queryStringValueIndex) : -1;
     
  }

  ngOnInit(): void {
    this._merchantService.getMerchantById(this.merchantId).subscribe(
      (res) => {
        this.merchant = res.data.merchantDetails[0];
        this._programService.getProgramId(this.merchant.programId).subscribe(res => {
          this.currentProgram = JSON.parse(res.data).programs.items[0];

          this._vnrService.getVoucherNumberRulesGraphQL(this.merchantId, this.currentProgram.isEdenred).subscribe(
            (res) => {
              this.vnrList = JSON.parse(res.data).voucherNumberRules.items;
            });
        });
      });

      this.showHideddlSkuElement(this.contract.costSchemeId);
      if(this.index >= 0)
      {
        this.getSkuDetails();
      }
      this._skuService.updateCompanyTaxRate();
  }
  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl, message : string = "") {
    if (tooltip.isOpen()) {      
      tooltip.close();
    } else {
      tooltip.open({ formControl, message });
    }
  }

  onDateSelectionChange(event: DateOutputValues, ct: any, index: number) {
    if (event) {
      this.formGroupCtrl(ct).controls.period.setValue(
        event?.selectedDateRange || event?.simpleDate
      );
      this.addCostValue(index, event.ngbFromDate!, event.ngbToDate!);
    }
  }

  addCostValue(index: number, fromDate : NgbDate, toDate : NgbDate): void {
    let costIndex = this.fromDateCost.findIndex(x => x.index == index);
    let cost: any = {
      index: index,
      fromDate: fromDate,
      toDate: toDate,
    }
    if (costIndex > -1) {
      this.fromDateCost[costIndex] = cost;
    }
    else {
      this.fromDateCost.push(cost);
    }
  }

  

  OnSkuTypeSelectionChanged(skutype : any): void {
    if (skutype == SkuTypeEnum.SmartBooklet) {    
      this.f.multiplier.IsDisplay=true;
      this.f.facevalue.IsDisplay=true;    
      this.f.facevalue.setValidators([Validators.required, CharacterValidator.allowDecimal(8,2, 20000000),Validators.min(0)]) ;
      this.f.facevalue.updateValueAndValidity();
    }
    else if (skutype == SkuTypeEnum.DynamicFaceValue) { 
      this.f.facevalue.IsDisplay=false;
      this.f.facevalue.setValue(null);
      this.f.facevalue.clearValidators();
      this.f.facevalue.updateValueAndValidity();      
    }
    else if(skutype == SkuTypeEnum.ProductBased)
    {
      this.f.multiplier.IsDisplay=false;
      this.f.facevalue.IsDisplay=true;
      this.f.facevalue.setValidators([Validators.required, CharacterValidator.allowDecimal(8,2, 20000000),Validators.min(0)]) ;
      this.f.facevalue.updateValueAndValidity();
    }
    else{
      this.f.multiplier.IsDisplay=false;
      this.f.facevalue.IsDisplay=true;     
      this.f.facevalue.setValidators([Validators.required, CharacterValidator.allowDecimal(8,2, 20000000)]) ;
      this.f.facevalue.updateValueAndValidity();
      if(this.tenant== 'IN')
      {
        this.costPercentageValueCalculate(this.f.facevalue.value,this.f.costs.controls[0].controls.cost.value);
      }      
    }
  }

  addCost() {
    this.costs.push(this._formBuilder.group({   
      cost: new FormControl({ value: '', disabled: false }, [Validators.required,CharacterValidator.allowDecimal(11,4)]) ,
      period: new FormControl({ value: '', disabled: false }, [Validators.required]),
      isFuturePeriod: new FormControl({ value: true, disabled: true }),
      validStartDate: new FormControl({ value: '', disabled: true }),
      contractName: new FormControl({ value: '', disabled: false }),
      contractNumber: new FormControl({ value: '', disabled: false }),
      costIndex: new FormControl({ value: this.counterItem, disabled: false }),
      isActive: new FormControl({ value: true, disabled: false }),
      costwithouttax: new FormControl({ value: '', disabled: true }),
    }));
    this.counterItem= this.costs.controls.length - 1;
    (<FormGroup>this.costs.controls[this.costs.controls.length - 1]).controls.costIndex.setValue(this.counterItem);
    if (this.contract.costSchemeId == 1) {
      (<FormGroup>this.costs.controls[this.costs.controls.length - 1]).controls.cost.setValue(this._contractService._getContract().costPercentage);
      (<FormGroup>this.costs.controls[this.costs.controls.length - 1]).controls.cost.disable();
      (<FormGroup>this.costs.controls[this.costs.controls.length - 1]).controls.contractName.setValue(this._contractService._getContract().contractName);
      (<FormGroup>this.costs.controls[this.costs.controls.length - 1]).controls.contractNumber.setValue(this._contractService._getContract().contractNumber);
    }
    
  }

  removeCost(index: number): void {   
    if(this.formGroup.value.costs[index].costSkuId!=undefined)
    {
      this.formGroup.value.costs[index].isActive=false;
    }else{
      this.costs.removeAt(index);
    }
  }

  //Event Onsubmit
  OnSubmit(): void { 
    if (!this.isEdit && !this.isExistingSKU) { 
      if(this.index >= 0){
        this.resetSkuDetails();
      }
      if(this.contractId <= 0 || this.contractStatus == "Draft"){
        if (this.costs.length > 0) {
          this.SaveDraftSKUContract();
        }
      }
      else if(this.contractId >0 && this.contractStatus=="DraftEdit")
      {
        this.DraftEditContractAddSku();        
      }
      else{
        this.SaveSKUContractDetails();
      }
    }
    else {   
      if(this.contractId >0 && this.contractStatus=="Valid")
      {
        if (this.costs.length > 0) {
          this.UpdateSKUDetails();
        }
      }
      else if(this.contractId >0 && (this.contractStatus==null || this.contractStatus==undefined))
      {
        if (this.costs.length > 0) {
          this.UpdateSKUDetails();
        }
      }
      else{
        this.SaveDraftSKUContract();
      }
      
    }
  }
  DraftEditContractAddSku():void
  {
    if (this.costs.length > 0) {
      for (let index = 0; index < this.costs.length; index++) {
        const element = <FormGroup>this.costs.controls[index];
        let dateIndex = this.fromDateCost.findIndex(x => x.index == index);
        if (dateIndex > -1) {
          let startDate: NgbDate = this.fromDateCost[dateIndex].fromDate;
          let endDate: NgbDate = this.fromDateCost[dateIndex].toDate;
          let skuTypeText: string | undefined = this.skuTypeList.find(x => x.value == (this.isExistingSKU ? this.existingSKU.skuType.id : this.formGroup.value.type))?.text;
          let voucherNumberRuleText: string = this.vnrList.find(x => x.voucherNumberRuleId == (this.isExistingSKU ? this.existingSKU.voucherNumberRule.voucherNumberRuleId : this.formGroup.value.vnr)).ruleName;
          let faceValue=  (this.isExistingSKU ? this.existingSKU.skuType.id : this.formGroup.value.type)  ===  SkuTypeEnum.DynamicFaceValue ? null : (this.isExistingSKU ? this.existingSKU.faceValueWithTax : this.formGroup.value.facevalue.trimEnd().trimStart());
          let multiplier= this.isExistingSKU ? ( this.existingSKU.skuType.id == SkuTypeEnum.SmartBooklet ?this.existingSKU.multiplier:null):(this.formGroup.value.type == SkuTypeEnum.SmartBooklet ? this.formGroup.value.multiplier : null);
          let sku: ContractSKURequest = this.ContractSKURequestMapper(skuTypeText, faceValue, voucherNumberRuleText, element, startDate, endDate, multiplier)
          this.contract.listSku.push(sku);
          this.contract.data = {
            success : true,
            message : ""
          }              
          this.OnCancel("","");
        }
      }
    } 
  }

    //Mpaper for the Request Contract SKU
    private ContractSKURequestMapper(skuTypeText: string | undefined, faceValue: any, voucherNumberRuleText: string, element: FormGroup, startDate: NgbDate, endDate: NgbDate, multiplier: any): ContractSKURequest {
      return {
        skuName: this.formGroup.value.name != undefined ? this.formGroup.value.name : this.formGroup.controls.name.value,
        skuNumber: this.formGroup.value.number,
        skuTypeId: this.isExistingSKU ? this.existingSKU.skuType.id : this.formGroup.value.type,
        skuTypeText: skuTypeText ? skuTypeText : "",
        faceValueWithTax: faceValue == "" ? null : faceValue,
        voucherNumberRuleId: this.isExistingSKU ? this.existingSKU.voucherNumberRule.voucherNumberRuleId : this.formGroup.value.vnr,
        voucherNumberRuleText: voucherNumberRuleText,
        costWithTax: this.contract.costSchemeId == 1 ? this.contract.costPercentage : element.value.cost,
        validstartDate: this._txcDateTimeService.getUtcDateTime(new Date(startDate.year + "-" + (startDate.month.toString().padStart(2, '0')) + "-" + startDate.day.toString().padStart(2, '0') + " 00:00:00")),
        validEndDate: this._txcDateTimeService.getUtcDateTime(new Date(endDate.year + "-" + (endDate.month.toString().padStart(2, '0')) + "-" + endDate.day.toString().padStart(2, '0') + " 23:59:59")),
        multiplier: multiplier == "" ? null : multiplier,
      };
    }

  //Update SKU Details

  private UpdateSKUDetails() {    
    let skuCost: SkuUpdateRequest = this.UpdateRequestMapper();
    let counter=0;
    if (this.formGroup.value.costs.length > 0) {
      const contractIdFromRoute = this._activeroute.snapshot.queryParamMap.get('contractId');
      this.costs.controls.filter( (item) => item.value.isActive == true).forEach(ct => {
        let index = ct.value.costIndex;
        let isActive = ct.value.isActive;
        const element = <FormGroup>this.costs.controls[counter];
        const dateRangeFromElement = element.value.period?.selectedDateRange || element.value.period
        let dateRange = dateRangeFromElement.split("~");
        let startDate: Date;
        let endDate: Date;
        if (dateRange.length == 2) {
          startDate = new Date(dateRange[0].trimEnd().trimStart());
          endDate = new Date(dateRange[1].trimEnd().trimStart());
        }
        else {
          startDate = new Date(element.controls.validStartDate.value);
          endDate = new Date(dateRange[0].trimEnd().trimStart());
        }

        if (element.value.costSkuId == undefined) {
          let contractSkuCost: ContractSkuCosts = {
            skuCostId: 0,
            contractId: this.contractId,
            statusId: isActive== true ?  this.statusApproved : 3,
            validstartDate: this._txcDateTimeService.getUtcDateTime(new Date(startDate.getFullYear() + "-" + ((startDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + startDate.getDate().toString().padStart(2, '0') + " 00:00:00")),
            validEndDate: this._txcDateTimeService.getUtcDateTime(new Date(endDate.getFullYear() + "-" + ((endDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + endDate.getDate().toString().padStart(2, '0') + " 23:59:59")),
            costWithTax: element.value.cost == undefined ? element.controls.cost.value : element.value.cost
          };
          skuCost.contractSkuCosts.push(contractSkuCost);
        }
        else {
          let contractSkuCost: ContractSkuCosts = {
            skuCostId: element.value.costSkuId,
            contractId: this.contractId,
            statusId: isActive== true ?  this.statusApproved : 3,
            validstartDate: this._txcDateTimeService.getUtcDateTime(new Date(startDate.getFullYear() + "-" + ((startDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + startDate.getDate().toString().padStart(2, '0') + " 00:00:00")),
            validEndDate: this._txcDateTimeService.getUtcDateTime(new Date(endDate.getFullYear() + "-" + ((endDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + endDate.getDate().toString().padStart(2, '0') + " 23:59:59")),
            costWithTax: element.value.cost == undefined ? element.controls.cost.value : element.value.cost
          };
          skuCost.contractSkuCosts.push(contractSkuCost);         
          
        }
        counter++;
      })     
    }

    this._skuService.updatesku(skuCost).subscribe(
      (sku: BaseResponse) => {
        let response = sku.data;
        if (sku.success) {

          this.OnCancel("SKUUpdated", sku.message);
        }
        else {
          if (response.skuValidationError != null && response.skuValidationError.length > 0) {
            for (let index = 0; index < response.skuValidationError.length; index++) {
              const element = response.skuValidationError[index];
              this.toast?.showDanger(element.errorMessage);
            }
          }
          if (response.skuCostValidationError != null && response.skuCostValidationError.length > 0) {
            for (let index = 0; index < response.skuCostValidationError.length; index++) {
              const element = response.skuCostValidationError[index];
              this.toast?.showDanger(element.errorMessage);
            }
          }

        }
      },
      err => {
        if (err.error.data.skuValidationError != null && err.error.data.skuValidationError.length > 0) {
          for (let index = 0; index < err.error.data.skuValidationError.length; index++) {
            const element = err.error.data.skuValidationError[index];
            this.toast?.showDanger(element.errorMessage);
          }
        }
        if (err.error.data.skuCostValidationError != null && err.error.data.skuCostValidationError.length > 0) {
          for (let index = 0; index < err.error.data.skuCostValidationError.length; index++) {
            const element = err.error.data.skuCostValidationError[index];
            this.toast?.showDanger(element.errorMessage);
          }
        }
      }
    );
  }

  //Update Request
  private UpdateRequestMapper(): SkuUpdateRequest {
    return {
      skuId: this.skuId,
      skuName: this.formGroup.value.name != undefined ? this.formGroup.value.name : this.formGroup.controls.name.value,
      faceValueWithTax: this.formGroup.value.facevalue != undefined ? this.formGroup.value.facevalue : this.formGroup.controls.type.value == SkuTypeEnum.DynamicFaceValue ? null : this.formGroup.controls.facevalue.value,
      multiplier: this.formGroup.controls.type.value == SkuTypeEnum.SmartBooklet ? this.formGroup.controls.multiplier.value : null,
      contractSkuCosts: []
    };
  }

  //Save Contract
  private SaveSKUContractDetails() {    
    let skuTypeId = this.isExistingSKU ? this.existingSKU.skuType.id : this.formGroup.value.type;
    let faceValue = (skuTypeId == SkuTypeEnum.DynamicFaceValue ? null : (this.isExistingSKU ? this.existingSKU.faceValueWithTax : this.formGroup.value.facevalue.trimEnd().trimStart()));
    let multiplier = (skuTypeId == SkuTypeEnum.SmartBooklet ? (this.isExistingSKU ? this.existingSKU.multiplier : this.formGroup.value.multiplier) : null);
    let sku: SkuCreateRequest = this.SaveContractRequestMapper(skuTypeId, faceValue, multiplier);
    if (this.formGroup.value.costs.length > 0) {
      this.costs.controls.forEach(ct => {
        let isActive = ct.value.isActive;
        if(isActive == true)
        {
        let index = ct.value.costIndex;     
        const element = <FormGroup>this.costs.controls[index];        
        let dateRange = element.value.period.selectedDateRange.split("~");
        let startDate: Date;
        let endDate: Date;
        if (dateRange.length == 2) {
          startDate = new Date(dateRange[0].trimEnd().trimStart());
          endDate = new Date(dateRange[1].trimEnd().trimStart());
        }
        else {
          startDate = new Date(element.controls.validStartDate.value);
          endDate = new Date(dateRange[0].trimEnd().trimStart());
        }
        element.controls.cost.enable();
        let contractSkuCost: ContractSkuCosts = this.ContractSKUCostMapper(startDate, endDate, element);
        element.controls.cost.disable();
        sku.contractSkuCosts.push(contractSkuCost);
      }
      })
    }

    this._skuService.createSKU(sku).subscribe(
      (sku: BaseResponse) => {
        let response = sku.data;
        if (sku.success) {
          this.OnCancel("skuCreated", sku.message);
        }
        else {
          if (response.skuValidationError != null && response.skuValidationError.length > 0) {
            for (let index = 0; index < response.skuValidationError.length; index++) {
              const element = response.skuValidationError[index];
              this.toast?.showDanger(element.errorMessage);
            }
          }
          if (response.skuCostValidationError != null && response.skuCostValidationError.length > 0) {
            for (let index = 0; index < response.skuCostValidationError.length; index++) {
              const element = response.skuCostValidationError[index];
              this.toast?.showDanger(element.errorMessage);
            }
          }
        }
      },
      err => {
        if (err.error.data.skuValidationError != null && err.error.data.skuValidationError.length > 0) {
          for (let index = 0; index < err.error.data.skuValidationError.length; index++) {
            const element = err.error.data.skuValidationError[index];
            this.toast?.showDanger(element.errorMessage);
          }
        }
        if (err.error.data.skuCostValidationError != null && err.error.data.skuCostValidationError.length > 0) {
          for (let index = 0; index < err.error.data.skuCostValidationError.length; index++) {
            const element = err.error.data.skuCostValidationError[index];
            this.toast?.showDanger(element.errorMessage);
          }
        }
      }
    );
  }

  //Contract SKU Cost Mapper
  private ContractSKUCostMapper(startDate: Date, endDate: Date, element: FormGroup): ContractSkuCosts {
    return {
      skuCostId: 0,
      contractId: this.contractId,
      statusId: this.statusApproved,
      validstartDate: this._txcDateTimeService.getUtcDateTime(new Date(startDate.getFullYear() + "-" + ((startDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + startDate.getDate().toString().padStart(2, '0') + " 00:00:00")),
      validEndDate: this._txcDateTimeService.getUtcDateTime(new Date(endDate.getFullYear() + "-" + ((endDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + endDate.getDate().toString().padStart(2, '0') + " 23:59:59")),
      costWithTax: element.controls.cost.value
    };
  }

  //Save contract Request Mapper
  private SaveContractRequestMapper(skuTypeId: any, faceValue: any, multiplier: any): SkuCreateRequest {
    return {
      skuName: this.formGroup.value.name != undefined ? this.formGroup.value.name : this.formGroup.controls.name.value,
      skuNumber: this.formGroup.value.number,
      skuTypeId: skuTypeId,
      faceValueWithTax: faceValue == "" ? null : faceValue,
      multiplier: multiplier == "" ? null : multiplier,
      voucherNumberRuleId: this.isExistingSKU ? this.existingSKU.voucherNumberRule.voucherNumberRuleId : this.formGroup.value.vnr,
      contractSkuCosts: []
    };
  }
  //Save Draft contract
private SaveDraftSKUContract() {  
  let skuCheck= this.contract.listSku.filter((i)=>i.skuNumber== this.formGroup.value.number).length;
  if(skuCheck>0)
  {
    this.contract.listSku= this.contract.listSku.filter((i)=>i.skuNumber != this.formGroup.value.number);
  }

  this.costs.controls.filter( (item) => item.value.isActive == true).forEach(ct => {
    let isActive = ct.value.isActive;
    let index = ct.value.costIndex;   
    const element = <FormGroup>this.costs.controls[index];
    let dateIndex = this.fromDateCost.findIndex(x => x.index == index);  
    if (dateIndex > -1) {
      let startDate: NgbDate = this.fromDateCost[dateIndex].fromDate;
      let endDate: NgbDate = this.fromDateCost[dateIndex].toDate;
      let skuTypeText: string | undefined = this.skuTypeList.find(x => x.value == (this.isExistingSKU ? this.existingSKU.skuType.id : this.formGroup.value.type))?.text;
      let voucherNumberRuleText: string = this.vnrList.find(x => x.voucherNumberRuleId == (this.isExistingSKU ? this.existingSKU.voucherNumberRule.voucherNumberRuleId : this.formGroup.value.vnr)).ruleName;
      let faceValue = (this.isExistingSKU ? this.existingSKU.skuType.id : this.formGroup.value.type) == SkuTypeEnum.DynamicFaceValue ? null : (this.isExistingSKU ? this.existingSKU.faceValueWithTax : this.formGroup.value.facevalue.trimEnd().trimStart());
      let multiplier = this.isExistingSKU ? (this.existingSKU.skuType.id == SkuTypeEnum.SmartBooklet ? this.existingSKU.multiplier : null) : (this.formGroup.value.type == SkuTypeEnum.SmartBooklet ? this.formGroup.value.multiplier : null);
      let sku: ContractSKURequest = this.CreateSKURequestMapper(skuTypeText, faceValue, voucherNumberRuleText, element, startDate, endDate, multiplier);
      this.contract.listSku.push(sku);
      this.contract.data = {
        success: true,
        message: ""
      };
      this.OnCancel("", "");
    }
  });  
}

  //Create SKU Request mapper
  private CreateSKURequestMapper(skuTypeText: string | undefined, faceValue: any, voucherNumberRuleText: string, element: FormGroup, startDate: NgbDate, endDate: NgbDate, multiplier: any): ContractSKURequest {
    return {
      skuName: this.formGroup.value.name != undefined ? this.formGroup.value.name : this.formGroup.controls.name.value,
      skuNumber: this.formGroup.value.number,
      skuTypeId: this.isExistingSKU ? this.existingSKU.skuType.id : this.formGroup.value.type,
      skuTypeText: skuTypeText ? skuTypeText : "",
      faceValueWithTax: faceValue == "" ? null : faceValue,
      voucherNumberRuleId: this.isExistingSKU ? this.existingSKU.voucherNumberRule.voucherNumberRuleId : this.formGroup.value.vnr,
      voucherNumberRuleText: voucherNumberRuleText,
      costWithTax: this.contract.costSchemeId == 1 ? this.contract.costPercentage : element.value.cost,
      validstartDate: this._txcDateTimeService.getUtcDateTime(new Date(startDate.year + "-" + (startDate.month.toString().padStart(2, '0')) + "-" + startDate.day.toString().padStart(2, '0') + " 00:00:00")),
      validEndDate: this._txcDateTimeService.getUtcDateTime(new Date(endDate.year + "-" + (endDate.month.toString().padStart(2, '0')) + "-" + endDate.day.toString().padStart(2, '0') + " 23:59:59")),
      multiplier: multiplier == "" ? null : multiplier,
    };
  }

  OnCancel(action:string,message:string): void {  
    if(this._activeroute.snapshot.queryParamMap.get('action')==this.CONTRACTDETAILS)
    {
      this.onCancel.emit({ action : action, message : message,redirectToAction:this.CONTRACTDETAILS});
    }
    else
    {
      this.onCancel.emit({ action : action, message : message });
    }
      
  }

  

  dateType(): void {
    this.f.period.setValue("");
  }

  ShowExpiredCostDetails(expiredCostContentModalRef: any): void {
    this.expiredCostModelData = [];
    this._skuService.getExpiredCostBySkuId(this.skuId).subscribe(res => {
      let respose: any = JSON.parse(res.data);
      //Validation - checking if response from graphQL is recieved or not
      if (respose != null
        && respose.contractSKUCost != null
        && respose.contractSKUCost.items != null
        && respose.contractSKUCost.items.length > 0) {
        //Validation - checking if contract sku cost record(merchant_info.tb_contract_sku_cost.status_id) status is approved(2)
        // and valid end date of contract sku cost is less than today
        let expiredCostData: any = [];
        respose.contractSKUCost.items.forEach(function (costDataItem: any) {
          if (costDataItem.contractSkuStatus.id == 2
            && ((new Date(costDataItem.validEndDate).getTime()) < (new Date().getTime()))) {
            expiredCostData.push(costDataItem);
          }
        });
        this.expiredCostModelData = expiredCostData;
      }
      this.openExpiredCostModal(expiredCostContentModalRef);
    });
  }

  openExpiredCostModal(modalRef: any) {
    this._modalService.open(modalRef, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        //this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  showHideddlSkuElement(costSchemeId : number)
  {
    //costSchemeId 1- means defaultcost
     //costSchemeId 2- means fixed
    if (costSchemeId == 1) {
      this.skuTypeList = this.skuTypeList.filter(item => item.value != 1 && item.value != 3);
     }
    else if (costSchemeId == 2) {
      this.skuTypeList = this.skuTypeList.filter(item => item.value != 4 && item.value != 2);
    }
  }

  checkExistingSKU(keyword : string, type : string){
    if(keyword.length > 2 && !this.isEdit){      
      this.existingSKU = undefined;
      this._skuService.getAll(undefined,undefined,keyword, undefined, this.merchantId).subscribe(
        (response: BaseResponse) => {
          if(response.success){
            let totalCount = JSON.parse(response.data).contractSkuByMerchantId.totalCount;
            if(totalCount > 0){
              this.existingSKU = JSON.parse(response.data).contractSkuByMerchantId.items.find((x :any) => x.skuNumber?.toLowerCase() == keyword?.toLowerCase() && this.skuTypeList.map(x=> x.value).includes(x.skuType.id));
              if(this.existingSKU){
                let skyType = this.skuTypeList.find((x:any)=> x.value == this.existingSKU.skuType.id)
                if(skyType){
                  this.skuId = this.existingSKU.id;
                  this.f.name.setValue(this.existingSKU.skuName);
                  this.f.number.setValue(this.existingSKU.skuNumber);           
                  this.f.type.setValue(this.existingSKU.skuType.id);
                  this.f.name.disable();
                  if(skyType.value!=SkuTypeEnum.DynamicFaceValue){
                  this.f.facevalue.setValue(this.existingSKU.faceValueWithTax.toString());
                  if(this.tenant== 'IN')
                  {
                    this.costPercentageValueCalculate(this.existingSKU.faceValueWithTax.toString(),0);
                  }
                  
                  this.f.facevalue.disable();
                  this._skuService.getSkuProductById(this.skuId).subscribe(
                    (res) => {
                      if(JSON.parse(res?.data)?.productsBySkuIds?.length > 0)
                      {
                        this.f.facevalue.disable();
                      }
                    });
                  }
                  this.f.vnr.setValue(this.existingSKU.voucherNumberRule.voucherNumberRuleId);           
                  this.f.vnr.disable();
                  this.OnSkuTypeSelectionChanged(this.existingSKU.skuType.id);
                  this.f.multiplier.setValue(this.existingSKU.skuType.id == SkuTypeEnum.SmartBooklet ? this.existingSKU.multiplier : 1);
                  this.f.multiplier.disable();
                  this.isExistingSKU = true;
                  this.f.type.disable();
                }
              }
            } else{
                          this.f.type.enable();
                          this.f.facevalue.enable();           
                          this.f.vnr.enable();
                          this.f.name.enable();
                          this.isExistingSKU = false;
                        }
          }
           if(!this.existingSKU){
             this.f.type.enable();
             this.f.facevalue.enable();           
             this.f.vnr.enable();
             this.f.name.enable();
             this.isExistingSKU = false;
           }
        });
    }
  }

  getSkuDetails()
  {
    this.f.name.setValue(this.contract.listSku[this.index].skuName);
    this.f.number.setValue(this.contract.listSku[this.index].skuNumber);
    this.f.type.setValue(this.contract.listSku[this.index].skuTypeId);   
    this.f.vnr.setValue(this.contract.listSku[this.index].voucherNumberRuleId);
    this.f.facevalue.setValue(this.contract.listSku[this.index].faceValueWithTax?.toString());
    this.OnSkuTypeSelectionChanged(this.contract.listSku[this.index].skuTypeId);
    this.f.multiplier.setValue(this.contract.listSku[this.index].multiplier?.toString());
    
    let elements = this.contract.listSku.filter(x => x.skuNumber === this.f.number.value && x.skuName === this.f.name.value);
    if(this.contract.listSku[this.index].skuTypeId == SkuTypeEnum.ProductBased
      || this.contract.listSku[this.index].skuTypeId == SkuTypeEnum.ValueBased
      || this.contract.listSku[this.index].skuTypeId == SkuTypeEnum.DynamicFaceValue){
      this.f.multiplier.clearValidators();
    }

    for (let index = 0; index < elements.length ; index++) 
    {
      if(index > 0){
        this.addCost();
      }
      (<FormGroup>this.costs.controls[index]).controls.cost.setValue(elements[index].costWithTax.toString());

      let startDate = new Date(this._txcDateTimeService.getLocalDateTime(elements[index].validstartDate));
      let fromDate = new NgbDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());

      let endDate = new Date(this._txcDateTimeService.getLocalDateTime(elements[index].validEndDate));
      let toDate = new NgbDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate());

      this.addCostValue(index, fromDate, toDate); 
      
      let startStringDate = formatDate(startDate, 'yyyy/MM/dd', this.locale);        
      let endStringDate = formatDate(endDate, 'yyyy/MM/dd', this.locale);
      this.onCostChanged(index);
      (<FormGroup>this.costs.controls[index]).controls.period.setValue(startStringDate + " ~ " + endStringDate);
    }
  }

  resetSkuDetails()
  {
    let deleteElement = this.contract.listSku.filter(x => x.skuName ==  this.contract.listSku[this.index].skuName && x.skuNumber == this.contract.listSku[this.index].skuNumber);
    this.contract.listSku.splice(this.index, deleteElement.length);
  }

  onCostChanged(index: number){
    if(this.contract.costSchemeId == 2){
      let costwithtax = this.formGroup.value.costs[index].cost;
      let costwithouttax = this._skuService.getCostWithoutTax(costwithtax);
      (<FormGroup>this.costs.controls[index]).controls.costwithouttax.setValue(costwithouttax);
    }
  }

  costPercentageValueCalculate(fValue:number,cost:number) {
    if(cost == 0)
    {
      var costValue = (this.f.costs.controls[0].controls.cost.value) != undefined || (this.f.costs.controls[0].controls.cost.value) != "" ? (this.f.costs.controls[0].controls.cost.value) : 0; 
      if(this.contract.costSchemeId == this.CostSchema[0].value && this.f.type.value==SkuTypeEnum.ValueBased)    
          this.CostValuePercntage = Number(this.costCalculationPipe.transform((this.f.facevalue.invalid != true ? fValue :0),costValue));   
    }
    else{      
      this.CostValuePercntage = Number(this.costCalculationPipe.transform(fValue,cost));   
    }
   
  }
}
