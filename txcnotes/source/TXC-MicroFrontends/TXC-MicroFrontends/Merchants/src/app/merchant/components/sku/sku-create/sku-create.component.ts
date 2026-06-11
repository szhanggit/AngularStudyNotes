import { formatDate } from '@angular/common';
import { AfterViewInit, Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractCreateRequest } from 'src/app/merchant/models/contract-create-request';
import { SKUFormGroup } from 'src/app/merchant/models/sku-form-group.model';
import { BaseResponse } from 'src/app/merchant/services/base-response.model';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { SKUFormComponent } from '../sku-form/sku-form.component';
import { TxcDateTimeService } from '@txc-angular/component-library';
import { SkuTypeEnum } from 'src/app/merchant/constants/sku_constant';
import { Contract_CONSTANTS } from 'src/app/merchant/constants/Contract_CONSTANTS';

@Component({
  selector: 'app-sku-create',
  templateUrl: './sku-create.component.html',
  styleUrls: ['./sku-create.component.scss']
})
export class SKUCreateComponent implements OnInit, AfterViewInit {

  @ViewChild(SKUFormComponent) skuForm!: SKUFormComponent;

  merchantId: number;
  contractId: number;
  contractStatus: string | null;
  tenant: string;
  formGroup: FormGroup;
  skuFormGroup : SKUFormGroup = new SKUFormGroup();
  contract: ContractCreateRequest | undefined = undefined;
  isBulkUpload: any;
  skuIndex:number;
  CostSchema: any[] = Contract_CONSTANTS.costSchemeList;  
  get costs(): FormArray {
    return this.formGroup.get('costs') as FormArray;
  }
  
  constructor(@Inject(LOCALE_ID) public locale: string,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _contractService: ContractService,
    private readonly _txcdatetimeService:TxcDateTimeService) { 

    this.tenant = this._tenantConfigService.getTenant().name;
    const merchantIdFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    this.merchantId = merchantIdFromRoute ? Number.parseInt(merchantIdFromRoute) : 0;

    const contractIdFromRoute = this._route.snapshot.queryParamMap.get('contractId');
    this.contractId = contractIdFromRoute ? Number.parseInt(contractIdFromRoute) : 0;

    this.contractStatus = this._route.snapshot.queryParamMap.get('status');

    this.formGroup = this.skuFormGroup.define(this._formBuilder, true);
    const queryStringValueIndex = this._route.snapshot.queryParamMap.get('index');
    this.skuIndex = queryStringValueIndex ? Number.parseInt(queryStringValueIndex) : -1;
    if(this.contractId > 0 && this.skuIndex < 0){     
      this._contractService.getByID(this.merchantId,this.contractId).subscribe((response:BaseResponse)=>{
        if(response.success){
          if(true){
            let contract = JSON.parse(response.data).contracts.items;
            if(contract.length > 0){       
              this.setDate(contract[0].startDate, contract[0].endDate, contract[0].contractCostScheme.id, contract[0].costPercentage);
            }
          }
        }
      });
    }
    else{
      this.contract = this._contractService._getContract();
      this.setDate(this.contract.startDate, this.contract.endDate, this.contract.costSchemeId, this.contract.costPercentage);     
    }
    this.isBulkUpload = this._router.getCurrentNavigation()?.extras.state;
  }
  get f(): any { return this.formGroup.controls; }

  ngOnInit(): void {
  }

  ngAfterViewInit() {  
    this.skuForm.checkExistingSKU(this.f.number.value,"");    
  }

  setDate(_startDate : string, _endDate : string, _costSchemeId : number, _costPercentage : number){
    if(_startDate != "" && _endDate != ""){
      for (let index = 0; index < this.costs.controls.length; index++) {
        if (_costSchemeId == 1) {
          (<FormGroup>this.costs.controls[index]).controls.cost.setValue(_costPercentage.toString()); 
          (<FormGroup>this.costs.controls[index]).controls.cost.disable();
        }
        let startDate = new Date(this._txcdatetimeService.getLocalDateTime(_startDate));
        let startStringDate = formatDate(startDate, 'yyyy/MM/dd', this.locale);        
        let endDate = new Date(this._txcdatetimeService.getLocalDateTime(_endDate));
        let endStringDate = formatDate(endDate.setDate(endDate.getDate() ), 'yyyy/MM/dd', this.locale);        
        
        if (Date.parse(startStringDate.toString().slice(0,10)) <= Date.parse((formatDate(new Date(), 'yyyy/MM/dd', this.locale)).toString().slice(0,10))) {
          let todayStartDate = formatDate(new Date(), 'yyyy/MM/dd', this.locale);
          (<FormGroup>this.costs.controls[index]).controls.isFuturePeriod.setValue(true);
          (<FormGroup>this.costs.controls[index]).controls.period.setValue(todayStartDate + " ~ " + endStringDate);      
         }
        else {
          (<FormGroup>this.costs.controls[index]).controls.isFuturePeriod.setValue(true);
          (<FormGroup>this.costs.controls[index]).controls.period.setValue(startStringDate + " ~ " + endStringDate);
        }
      }
      if(this.skuForm != undefined)
      {
        this.skuForm.showHideddlSkuElement(_costSchemeId);  
        if(this.skuIndex >=0 )
        {
          this.skuForm.OnSkuTypeSelectionChanged(this.f.skutype.value);
        }
        else
        { 
          this.f.facevalue.IsDisplay=true;
        }

      }
      else{
        this.f.facevalue.IsDisplay=true;
      }
    }
  }

  onCancel(event : any):void{
    if(this.contractStatus === "Valid"){
      this._router.navigate(['merchants/contract/details/' + this.contractId],
      {
        queryParams: {
          merchantId: this.merchantId
        },
        state : {
          action : event.action,
          message: event.message         
        }
      });
    }
    else if(this.contractStatus === "Draft"){
      this._router.navigate([`merchants/contract/${this.contractId}/sku/create/draft/details`],
      {
        queryParams :{
          type : "single",
          status:"Draft"
        }
      }
      );
    }
    else if (this.contractStatus === "DraftEdit"){
      this._router.navigate(['merchants/contract/edit/' + this.contractId], { 
        queryParams: { 
          merchantId: this.merchantId,         
          status:"DraftEdit"
        },
        state : {        
          data: (this.isBulkUpload !== undefined && this.isBulkUpload.data == true)
        }      
      });
    }
    else{
      this._router.navigate(['merchants/contract/create'], { 
        queryParams: { 
          merchantId: this.merchantId 
        },
        state : {        
          data: (this.isBulkUpload !== undefined && this.isBulkUpload.data == true)
        }      
      });
    }
  }
}
