import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddressBody } from 'src/app/merchant/models/merchant-body.model';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { PhoneNumberValidator } from 'src/app/merchant/validators/phone-number.validator';
import { Shop } from '../../../models/shop.model';
import { ShopService } from '../../../services/shop.service';

@Component({
  selector: 'app-shop-edit',
  templateUrl: './shop-edit.component.html',
  styleUrls: ['./shop-edit.component.scss']
})
export class ShopEditComponent implements OnInit {
  shopFormGroup: FormGroup;
  merchantId: number;
  shopId: number;
  tenant: string;

  // form
  get f(): any {
    return this.shopFormGroup.controls;
  }

  constructor(private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _shopService: ShopService,
    private readonly _tenantConfigService: TenantConfigService) {

    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    this.tenant = this._tenantConfigService.getTenant().name;

    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    this.shopId = Number.parseInt(this._route.snapshot.paramMap.get('id') as string);

    this.shopFormGroup = this._formBuilder.group({
      //details
      id: new FormControl({ value: 0, disabled: false }),
      status: new FormControl({ value: 0, disabled: false }),
      name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
      externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]),
      identityCode: new FormControl({ value: '', disabled: true }),
      contactPhone: new FormControl({ value: '', disabled: false }, [Validators.maxLength(50)]),
      securityKey: new FormControl({ value: '', disabled: true }),
      address: new FormGroup({
        countryId: new FormControl({ value: 0, disabled: false }),
        stateOrProvinceId: new FormControl({ value: 0, disabled: false }),
        cityId: new FormControl({ value: 0, disabled: false }),
        district: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
        detailAddressLine: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
        postcode: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
      }),
    });

    if (this.tenant === 'SG') {
      this.shopFormGroup.addControl('subsidiaryUen', new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(30)]));
      this.shopFormGroup.addControl('subsidiaryName', new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]));
    } else {
      this.shopFormGroup.addControl('subsidiaryUen', new FormControl({ value: '', disabled: false }));
      this.shopFormGroup.addControl('subsidiaryName', new FormControl({ value: '', disabled: false }));
    }
  }


  ngOnInit(): void {
  }
}
