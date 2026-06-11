import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDefineFormGroup } from 'src/app/merchant/models/define-form-group.model';
import { GlobalRewardsVNRFormGroup, GlobalVNRFormGroup, IndiaVNRFormGroup, MerchantGroupFormGroup, SingaporeVNRFormGroup, TaiwanVNRFormGroup } from 'src/app/merchant/models/voucher-number-rule-form-group.model';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';


@Component({
  selector: 'app-voucher-number-rule-create',
  templateUrl: './voucher-number-rule-create.component.html',
  styleUrls: ['./voucher-number-rule-create.component.scss']
})
export class VoucherNumberRuleCreateComponent implements OnInit {
  merchantId: number;
  isEdenredProgram: boolean;
  tenant: string;
  voucherNumberRuleForm: FormGroup = new FormGroup({});
  isMerchantGroup: boolean;

  formGroupDefinitions: IDefineFormGroup[] =[
    new TaiwanVNRFormGroup(),
    new GlobalVNRFormGroup(),
    new IndiaVNRFormGroup(),
    new SingaporeVNRFormGroup(),
    new GlobalRewardsVNRFormGroup()
  ];

  constructor(private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _tenantConfigService: TenantConfigService) {

    // get query params from routes
    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    const isEdenredProgramFromRoute = this._route.snapshot.queryParamMap.get('isEdenredProgram');
    
    // try to parse values to primitive
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    this.isEdenredProgram = isEdenredProgramFromRoute === 'true';
    this.tenant = this._tenantConfigService.getTenant().name;
    this.isMerchantGroup = this._route.snapshot.queryParamMap.get('isMerchantGroup') == 'true';
    
    // form group for multi-brand
    if (this.isMerchantGroup) {
      this.voucherNumberRuleForm = (new MerchantGroupFormGroup()).define(this._formBuilder, true);
    }
    // form group for mono-brand
    else {
      const def = this.formGroupDefinitions.find(f=> f.tenantCode === this.tenant);
      if (def) {
        this.voucherNumberRuleForm = def.define(this._formBuilder, this.isEdenredProgram);
      }
    }
  }

  ngOnInit(): void {
    
  }
}
