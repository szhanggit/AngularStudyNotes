import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MerchantService } from 'src/app/merchant/services/merchant.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { BaseResponse } from 'src/app/merchant/services/base-response.model';
import { Contract_CONSTANTS } from 'src/app/merchant/constants/Contract_CONSTANTS';
import { formatDate } from '@angular/common';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { TxcDateTimeService } from '@txc-angular/component-library';
import { CharacterValidator } from 'src/app/merchant/validators/character.validator';

@Component({
  selector: 'app-contract-edit',
  templateUrl: './contract-edit.component.html',
  styleUrls: ['./contract-edit.component.scss']
})
export class ContractEditComponent implements OnInit {
  merchantId: number;
  tenant: string;
  formGroup: FormGroup;
  programId:number;
  contractId:number;
  selectedterm: any;
  priceOptionList: any[]=[];
  termList: any[] =  Contract_CONSTANTS.termList; 

  constructor(private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _tenantConfigService: TenantConfigService,
    private _merchantService: MerchantService,
    private _contractService : ContractService,
    private utilityService: UtilityService,
    @Inject(LOCALE_ID) public locale: string,
    private readonly _txcDateTimeService: TxcDateTimeService) { 
      const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
      const contractIdFromRoute = this._route.snapshot.params.id;
      this.tenant = this._tenantConfigService.getTenant().name;
      this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
      this.contractId = contractIdFromRoute ? Number.parseInt(contractIdFromRoute) : 0;
      this.programId=this.grtProgramId();     
      this.formGroup = this._formBuilder.group({
        name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(128)]),
        period: new FormControl({ value: '', disabled: false }, [Validators.required]),
        paymentterm: new FormControl({ value: '', disabled: false }, [Validators.required]),
        priceoption: new FormControl({ value: '', disabled: false }, [Validators.required]),
        costscheme: new FormControl({ value: '', disabled: false }, [Validators.required]),
        cost: new FormControl({ value: '', disabled: false }, [Validators.required, CharacterValidator.allowDecimal(3,4)]),
        roundingrule: new FormControl({ value: '', disabled: false }, [Validators.required]),
        roundingdecimalplaces: new FormControl({ value: '', disabled: false }, [Validators.required]),
       });  
    }

  ngOnInit(): void {        
   this.getContractDataById();    
  }
 
  grtProgramId():any{
    this._merchantService.getMerchantById(this.merchantId).pipe(
      ).subscribe(
        (res: { data: { merchantDetails: { programId: number; }[]; }; }) => {          
          this.programId=res.data.merchantDetails[0].programId;
        });
  }
  getContractDataById(): void{
    this._contractService.getByID(this.merchantId, this.contractId).
    subscribe((response:BaseResponse)=>{
      if(response.success){
        let data = JSON.parse(response.data).contracts.items;
        if(data.length > 0){            
          this.f.name.setValue(data[0].contractName);         
          this.f.paymentterm.setValue(data[0].contractPaymentTerm.id); 
          this.f.costscheme.setValue(data[0].contractCostScheme.id);
          this.f.costscheme.disable();         
          this.f.cost.setValue(data[0].contractCostScheme.id  == "2" ? "N/A" : data[0].costPercentage);
          if(data[0].contractCostScheme.id  == "2")
          {
            this.f.cost.disable();
          }else{
            this.f.cost.enable();
          }
          this.f.roundingrule.setValue(data[0].contractCostRoundingRule.id); 
          this.f.roundingdecimalplaces.setValue(data[0].contractCostRoundingPlaces.id); 
          let startStringDate = formatDate(this._txcDateTimeService.getLocalDateTime(data[0].startDate), 'yyyy/MM/dd' ,this.locale); 
          let endStringDate = formatDate(this._txcDateTimeService.getLocalDateTime(data[0].endDate), 'yyyy/MM/dd' ,this.locale); 
          this.f.period.setValue(startStringDate + ' ~ ' + endStringDate); 
          this.f.priceoption.setValue(data[0].contractPriceOption.id); 
        }
      }
    })
  }
  get f(): any {
    return this.formGroup.controls;
  }
}
