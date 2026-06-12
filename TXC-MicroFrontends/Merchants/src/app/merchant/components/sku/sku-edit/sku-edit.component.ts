import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { SkuService } from 'src/app/merchant/services/sku.service';
import { formatDate } from '@angular/common';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { SKUFormGroup } from 'src/app/merchant/models/sku-form-group.model';
import { SkuTypeEnum } from 'src/app/merchant/constants/sku_constant';
import { TxcDateTimeService } from '@txc-angular/component-library';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { CharacterValidator } from 'src/app/merchant/validators/character.validator';
import { SKUFormComponent } from '../sku-form/sku-form.component';
import { Contract_CONSTANTS } from 'src/app/merchant/constants/Contract_CONSTANTS';
@Component({
  selector: 'app-sku-edit',
  templateUrl: './sku-edit.component.html',
  styleUrls: ['./sku-edit.component.scss']
})
export class SkuEditComponent implements OnInit {
  merchantId: number;
  tenant: string;
  formGroup: FormGroup;
  skuId: number;
  contractId: number;
  skuJsonList: any;
  fromDate!: NgbDate;
  toDate: NgbDate | null = null;
  skuEditDetails: any;
  CONTRACTDETAILS = 'contractDetails';
  CostValuePercntage!:number;
  skuFormGroup: SKUFormGroup = new SKUFormGroup();
  @ViewChild(SKUFormComponent) skuForm!: SKUFormComponent;
  CostSchema: any[] = Contract_CONSTANTS.costSchemeList;  
  constructor(private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _skuService: SkuService,
    private readonly _txcdatetimeService:TxcDateTimeService,
    private readonly _contractService: ContractService,
    @Inject(LOCALE_ID) public locale: string) {

    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    const skuIdFromRoute = this._route.snapshot.params.id;
    const contractIdFromRoute = this._route.snapshot.queryParamMap.get('contractId');
    this.tenant = this._tenantConfigService.getTenant().name;
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    this.skuId = skuIdFromRoute ? Number.parseInt(skuIdFromRoute) : 0;
    this.contractId = contractIdFromRoute ? Number.parseInt(contractIdFromRoute) : 0;
    this.formGroup = this.skuFormGroup.define(this._formBuilder, false, true);

  }

  ngOnInit(): void {
    let isContractStart:boolean=false;
    this._skuService.getSkuById(this.skuId).subscribe(
      (res) => {
        this.skuJsonList = JSON.parse(res.data)
        if(Array.isArray(this.skuJsonList.skuById) && this.skuJsonList.skuById.length > 0)
          this.skuJsonList.skuById= this.skuJsonList.skuById[0];
        this.skuEditDetails = this.skuJsonList.skuById;
        this.f.name.setValue(this.skuJsonList.skuById?.skuName);
        this.f.number.setValue(this.skuJsonList.skuById?.skuNumber);
        this.f.type.setValue(this.skuJsonList.skuById?.typeId);
        this.f.facevalue.IsDisplay = true;
        this.f.number.disable = true;
        
        if (this.skuJsonList.skuById?.typeId ==SkuTypeEnum.DynamicFaceValue) {
          this.f.facevalue.IsDisplay = false;
        } 
        else if(this.skuJsonList.skuById?.typeId ==SkuTypeEnum.ValueBased) {
          this.f.facevalue.IsDisplay=true;
          this.f.facevalue.setValidators([Validators.required, CharacterValidator.allowDecimal(8,2, 20000000)]) ;
          this.f.facevalue.updateValueAndValidity();
        }
        else { 
          this.f.facevalue.IsDisplay = true; 
          this.f.facevalue.setValidators([Validators.required, CharacterValidator.allowDecimal(8,2, 20000000),Validators.min(0)]) ;
          this.f.facevalue.updateValueAndValidity();
        }
        this.f.multiplier.IsDisplay = true;
        if (this.skuJsonList.skuById?.typeId ==SkuTypeEnum.SmartBooklet) {
          this.f.multiplier.IsDisplay = true;
        } else {
          this.f.multiplier.IsDisplay = false;
        }
        
        this.f.facevalue.setValue(this.skuJsonList.skuById?.faceValueWithTax);
       
        this.f.vnr.setValue(this.skuJsonList.skuById?.voucherNumberRule.voucherNumberRuleId);
        this.f.multiplier.setValue(this.skuJsonList.skuById?.typeId ==SkuTypeEnum.SmartBooklet ? this.skuJsonList.skuById?.multiplier : 1)
        let counter:number=0
        for (let index = 0; index < this.skuJsonList.skuById.contractSKUCosts.length; index++) {
          //Validation - checking if contract sku cost record(merchant_info.tb_contract_sku_cost.status_id) status is approved(2)
          // and valid end date of contract sku cost is greter than today
          if(new Date(this.skuJsonList.skuById.contractSKUCosts[index].skuCostContract.startDate)< new Date())  
            {
              isContractStart=true;
            }
          if (this.skuJsonList.skuById.contractSKUCosts[index].contractId == this.contractId
            && this.skuJsonList.skuById.contractSKUCosts[index].contractSkuStatus.id == 2
            && ((new Date(this.skuJsonList.skuById.contractSKUCosts[index].validEndDate).getTime()) > (new Date().getTime()))) {
            this.costs.push(this._formBuilder.group({
              cost: new FormControl({ value: '', disabled: false }, [Validators.required, CharacterValidator.allowDecimal(11,4)]) ,
              period: new FormControl({ value: '', disabled: false }, [Validators.required]),
              contractName: new FormControl({ value: '', disabled: false }),
              contractNumber: new FormControl({ value: '', disabled: false }),
              costSkuId: new FormControl({ value: '', disabled: false }),
              isFuturePeriod: new FormControl({ value: true, disabled: true }),
              validStartDate: new FormControl({ value: '', disabled: true }),
              costIndex: new FormControl({ value: counter, disabled: false }),     
              isActive: new FormControl({ value: true, disabled: false }),
              costwithouttax : new FormControl({ value: '', disabled: true }),
            }));

            (<FormGroup>this.costs.controls[counter]).controls.contractName.setValue(this.skuJsonList.skuById.contractSKUCosts[index].skuCostContract.contractName);
            (<FormGroup>this.costs.controls[counter]).controls.costSkuId.setValue(this.skuJsonList.skuById.contractSKUCosts[index].id);
            (<FormGroup>this.costs.controls[counter]).controls.contractNumber.setValue(this.skuJsonList.skuById.contractSKUCosts[index].skuCostContract.contractNumber);
            (<FormGroup>this.costs.controls[counter]).controls.cost.setValue(this.skuJsonList.skuById.contractSKUCosts[index].costWithTax);
            (<FormGroup>this.costs.controls[counter]).controls.costwithouttax.setValue(this._skuService.getCostWithoutTax(this.skuJsonList.skuById.contractSKUCosts[index].costWithTax));
            if(this.tenant== 'IN')
            {
              if(this.skuJsonList.skuById?.typeId == SkuTypeEnum.ValueBased && this.skuJsonList.skuById.contractSKUCosts[index].skuCostContract.contractCostScheme.id==this.CostSchema[0].value)
              {
                this.skuForm.costPercentageValueCalculate(this.skuJsonList.skuById?.faceValueWithTax,this.skuJsonList.skuById.contractSKUCosts[index].costWithTax);
              }
            }
            let startDate = new Date(this._txcdatetimeService.getLocalDateTime(this.skuJsonList.skuById.contractSKUCosts[index].validStartDate))
            let startStringDate = formatDate(startDate, 'yyyy/MM/dd', this.locale);
            this.fromDate = new NgbDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
            let endDate = new Date(this._txcdatetimeService.getLocalDateTime(this.skuJsonList.skuById.contractSKUCosts[index].validEndDate));
            let endStringDate = formatDate(endDate, 'yyyy/MM/dd', this.locale);
            this.toDate = new NgbDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate());
            if ( Date.parse(startDate.toLocaleString('en-US').slice(0,10).replace(',','')) <= Date.parse(new Date().toLocaleString('en-US').slice(0,10).replace(',',''))) {
              (<FormGroup>this.costs.controls[counter]).controls.isFuturePeriod.setValue(false);
              (<FormGroup>this.costs.controls[counter]).controls.period.setValue(endStringDate);
              (<FormGroup>this.costs.controls[counter]).controls.validStartDate.setValue(startDate);
              (<FormGroup>this.costs.controls[counter]).controls.costIndex.setValue(counter);
            }
            else {
              (<FormGroup>this.costs.controls[counter]).controls.isFuturePeriod.setValue(true);
              (<FormGroup>this.costs.controls[counter]).controls.period.setValue(startStringDate + " ~ " + endStringDate);
            }
            //If cost period is future and cost scheme type is fixed then enable cost amount.
            if ((startDate.getTime()) > (new Date().getTime())
              && this.skuJsonList.skuById.contractSKUCosts[index].skuCostContract.contractCostScheme.value == "Fixed") {
              (<FormGroup>this.costs.controls[counter]).controls.cost.enable();
            }
            else {
              (<FormGroup>this.costs.controls[counter]).controls.cost.disable();
            }      
               
            counter=counter+1;
            this._contractService._setContract({
              contractName : this.skuJsonList.skuById.contractSKUCosts[index].skuCostContract.contractName,
              contractNumber:this.skuJsonList.skuById.contractSKUCosts[index].skuCostContract.contractNumber,
              costSchemeId : this.skuJsonList.skuById.contractSKUCosts[index].skuCostContract.contractCostScheme.id,
              costPercentage : this.skuJsonList.skuById.contractSKUCosts[index].costWithTax
            }) ;
          }
        }

       
        //If check contract is not start and sku type is not DFV then editable the face value
        //To check if Product not associated then should be enable
        if(this.skuJsonList.skuById?.typeId != SkuTypeEnum.DynamicFaceValue && JSON.parse(res.data)?.productsBySkuIds?.length == 0)
        {
          this.f.facevalue.enable();
         
        }
      }
    );
  }
  get f(): any {
    return this.formGroup.controls;
  }

  get costs(): FormArray {
    return this.formGroup.get('costs') as FormArray;
  }

  onCancel(event : any):void{
    if(event.redirectToAction===this.CONTRACTDETAILS)
    {
      this._router.navigate(['merchants/contract/details/'+this.contractId],
      {
        queryParams: {
          merchantId: this.merchantId 
         }
        }
      );
    }
    else
    {
      this._router.navigate(['merchants/details'],
      {
        queryParams: {
          tenantName: this.tenant,
          merchantId: this.merchantId
        },
        state : {
          action : event.action,
          message: event.message
        }
      });
    }
    
  }

}


