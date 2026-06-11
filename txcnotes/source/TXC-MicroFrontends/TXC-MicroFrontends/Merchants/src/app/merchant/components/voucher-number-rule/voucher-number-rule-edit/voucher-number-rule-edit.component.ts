import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDefineFormGroup } from 'src/app/merchant/models/define-form-group.model';
import { GlobalRewardsVNRFormGroup, GlobalVNRFormGroup, IndiaVNRFormGroup, MerchantGroupFormGroup, SingaporeVNRFormGroup, TaiwanVNRFormGroup } from 'src/app/merchant/models/voucher-number-rule-form-group.model';
import { VoucherNumberRule } from 'src/app/merchant/models/voucher-number-rule.model';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { VoucherNumberRuleService } from 'src/app/merchant/services/voucher-number-rule.service';

@Component({
  selector: 'app-voucher-number-rule-edit',
  templateUrl: './voucher-number-rule-edit.component.html',
  styleUrls: ['./voucher-number-rule-edit.component.scss']
})
export class VoucherNumberRuleEditComponent implements OnInit {
  merchantId: number;
  tenant: string;
  vnrId: number;
  voucherNumberRuleForm: FormGroup = new FormGroup({});
  voucherNumberRule!: VoucherNumberRule | undefined;
  isEdenredProgram: boolean;
  isMerchantGroup: boolean;

  formGroupDefinitions: IDefineFormGroup[] = [
    new TaiwanVNRFormGroup(),
    new GlobalVNRFormGroup(),
    new IndiaVNRFormGroup(),
    new SingaporeVNRFormGroup(),
    new GlobalRewardsVNRFormGroup()
  ];

  constructor(private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _voucherNumberRuleService: VoucherNumberRuleService) {
    
    // retrieve values from routes
    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    const isEdenredProgramFromRoute = this._route.snapshot.queryParamMap.get('isEdenredProgram');
    this.isEdenredProgram = isEdenredProgramFromRoute === 'true';
    this.isMerchantGroup = this._route.snapshot.queryParamMap.get('isMerchantGroup') == 'true';

    // parse the merchant id from route
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;

    // parse the vnr id from route
    this.vnrId = Number.parseInt(this._route.snapshot.paramMap.get('id') as string);

    // fetch tenant
    this.tenant = this._tenantConfigService.getTenant().name;

    // form group for multi-brand
    if (this.isMerchantGroup) {
      this.voucherNumberRuleForm = (new MerchantGroupFormGroup()).define(this._formBuilder, true);
    }
    // form group for mono-brand
    else {
      // retrieve form group definition
      const def = this.formGroupDefinitions.find(f => f.tenantCode === this.tenant)
      if (def) {
        this.voucherNumberRuleForm = def.define(this._formBuilder, this.isEdenredProgram);
      };
    }

    // retrieve voucher number rule
    this._voucherNumberRuleService.getSpecificVoucherNumberRule(this.merchantId, this.vnrId).subscribe(res => {
      if (res) {
        this.voucherNumberRule = res[0]
      }
    })
  }

  ngOnInit(): void {

  }

}
