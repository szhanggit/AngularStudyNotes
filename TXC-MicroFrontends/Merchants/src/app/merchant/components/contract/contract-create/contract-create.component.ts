import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MerchantService } from 'src/app/merchant/services/merchant.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { CharacterValidator } from 'src/app/merchant/validators/character.validator';

@Component({
  selector: 'app-contract-create',
  templateUrl: './contract-create.component.html',
  styleUrls: ['./contract-create.component.scss']
})
export class ContractCreateComponent implements OnInit {

  merchantId: number;
  tenant: string;
  formGroup: FormGroup;
  programId:number;

  constructor(private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _tenantConfigService: TenantConfigService,
    private _merchantService: MerchantService) { 

      const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    this.tenant = this._tenantConfigService.getTenant().name;
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    this.programId=this.grtProgramId();

    this.formGroup = this._formBuilder.group({
      name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(128)]),
      period: new FormControl({ value: '', disabled: false }, [Validators.required]),
      paymentterm: new FormControl({ value: '', disabled: false }, [Validators.required]),
      priceoption: new FormControl({ value: '', disabled: false }, [Validators.required]),
      costscheme: new FormControl({ value: '', disabled: false }, [Validators.required]),
      cost: new FormControl({ value: '', disabled: false }, [Validators.required,CharacterValidator.allowDecimal(3,4)]) ,
      roundingrule: new FormControl({ value: '', disabled: false }, [Validators.required]),
      roundingdecimalplaces: new FormControl({ value: '', disabled: false }, [Validators.required]),
    });

    }

  ngOnInit(): void {
  }
  /// <summary>
  /// call this method for the get program Id.
  /// </summary>
grtProgramId():any{
    this._merchantService.getMerchantById(this.merchantId).pipe(
      ).subscribe(
        (res: { data: { merchantDetails: { programId: number; }[]; }; }) => {          
          this.programId=res.data.merchantDetails[0].programId;
        });
  }
}
