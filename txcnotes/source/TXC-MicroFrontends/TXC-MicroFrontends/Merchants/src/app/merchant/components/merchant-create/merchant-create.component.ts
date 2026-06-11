import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDefineFormGroup } from '../../models/define-form-group.model';
import { GlobalMerchantFormGroup, GlobalRewardsMerchantFormGroup, IndiaMerchantFormGroup, SingaporeMerchantFormGroup, TaiwanMerchantFormGroup } from '../../models/merchant-form-group.model';
import { TenantConfigService } from '../../services/tenant-config.service';

@Component({
  selector: 'app-merchant-create',
  templateUrl: './merchant-create.component.html',
  styleUrls: ['./merchant-create.component.scss']
})
export class MerchantCreateComponent implements OnInit {
  tenant!: string;
  formGroupDefinitions: IDefineFormGroup[] =[
    new TaiwanMerchantFormGroup(),
    new GlobalMerchantFormGroup(),
    new IndiaMerchantFormGroup(),
    new SingaporeMerchantFormGroup(),
    new GlobalRewardsMerchantFormGroup()
  ];
  merchantFormGroup: FormGroup = new FormGroup({});;

  constructor(private readonly _route: ActivatedRoute,
    _formBuilder: FormBuilder,
    _tenantConfigService: TenantConfigService) {
    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    this.tenant = _tenantConfigService.getTenant(tenantFromRoute).name;

    let def = this.formGroupDefinitions.find(f=> f.tenantCode === this.tenant)
    if (def) {
      this.merchantFormGroup = def.define(_formBuilder, false);
    }
  }

  ngOnInit(): void {
  }
}
