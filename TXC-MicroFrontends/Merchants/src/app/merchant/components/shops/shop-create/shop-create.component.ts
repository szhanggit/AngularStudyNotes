import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Observable } from 'rxjs';
import { Shop } from 'src/app/merchant/models/shop.model';
import { ShopService } from 'src/app/merchant/services/shop.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { AlreadyExistValidator } from 'src/app/merchant/validators/already-exists.validator';
import { PhoneNumberValidator } from 'src/app/merchant/validators/phone-number.validator';

@Component({
  selector: 'app-shop-create',
  templateUrl: './shop-create.component.html',
  styleUrls: ['./shop-create.component.scss']
})
export class ShopCreateComponent implements OnInit {
  merchantId: number;
  tenant: string;
  shopFormGroup: FormGroup;

  shop$: Observable<Shop[]>;

  constructor(private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _shopService: ShopService,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authorizationLibraryService: AuthorizationLibraryService) {

    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    this.tenant = this._tenantConfigService.getTenant().name;
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;

    this.shopFormGroup = this._formBuilder.group({
      status: new FormControl({ value: 1, disabled: false }),
      name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
      externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(50)]),
      identityCode: new FormControl({ value: '', disabled: true }),
      sameExternalCode: new FormControl({ value: false, disabled: false }),
      contactPhone: new FormControl({ value: '', disabled: false }, [Validators.maxLength(50)]),
      securityKey: new FormControl({ value: '', disabled: true }),
      address: new FormGroup({
        countryId: new FormControl({ value: 0, disabled: false }),
        stateOrProvinceId: new FormControl({ value: 0, disabled: true }),
        cityId: new FormControl({ value: 0, disabled: true }),
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

    this.shop$ = _shopService.shops$;
    this.shop$.subscribe(shops => {
      const shopExternalCodes = shops.map((shop: Shop) => shop.externalCode?.toLowerCase().trim());
      if (shopExternalCodes) {
        this.shopFormGroup.controls.externalCode.setValidators([AlreadyExistValidator.isAlreadyExists(shopExternalCodes), Validators.required, Validators.maxLength(50)]);
      }
      this._authorizationLibraryService.isLoading.next(false);
    });
  }

  ngOnInit(): void {
    if (this.merchantId) {
      this._shopService.merchantId = this.merchantId;
      this._authorizationLibraryService.isLoading.next(true);
      this._shopService.refresh();
    }
  }
}
