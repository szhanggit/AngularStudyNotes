import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Merchant } from '../../../models/merchant.model';
import { MerchantService } from '../../../services/merchant.service';
import { SecurityKeyService } from '../../../services/security-key.service';
import { ShopService } from '../../../services/shop.service';

@Component({
  selector: 'app-shop-create',
  templateUrl: './shop-create.component.html',
  styleUrls: ['./shop-create.component.scss']
})
export class ShopCreateComponent implements OnInit {
  merchant!: Merchant;
  shopFormGroup: FormGroup;

  // form
  get f(): any {
    return this.shopFormGroup.controls;
  }

  constructor(private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _shopService: ShopService,
    private readonly _router: Router,
    private readonly _securityKeyService: SecurityKeyService,
    private readonly _merchantService: MerchantService) {

    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    const id = idFromRoute ? Number.parseInt(idFromRoute) : 0;

    if (idFromRoute) {
      this._merchantService.getMerchantById(id).subscribe(res => {
        this.merchant = res.data.merchantDetails[0];
      });
    }

    this.shopFormGroup = this._formBuilder.group({
      //details
      status: new FormControl({ value: 0, disabled: false }),
      name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
      externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
      identityCode: new FormControl({ value: '', disabled: true }),
      sameExternalCode: new FormControl({ value: false, disabled: false }),
      contactPhone: new FormControl({ value: '', disabled: false }),
      shopAddress: new FormControl({ value: '', disabled: false }),
      securityKey: new FormControl({ value: '123465789545623', disabled: true }),
    });

    this.generateSecurityKey();
  }

  ngOnInit(): void {
  }

  generateSecurityKey() {
    this.f.securityKey.setValue(this._securityKeyService.generateSecurityKey(31));
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  OnSubmit(): void {
    if (this.shopFormGroup.valid) {
      const shop = { ...this.shopFormGroup.getRawValue() };
      shop.merchantId = this.merchant.merchantId;
      shop.contactName = shop.name;
      shop.lastModifier = 'TXC';

      if (shop.sameExternalCode) {
        shop.identityCode = shop.externalCode;
      }

      const address = { detailAddressLine: shop.shopAddress };
      delete shop.shopAddress;
      const body = { shop: [{shop, address}] };

      this._shopService.createShop(body).subscribe(res => {
        this.navigateToMerchantDetails(res.success);
      });
    }
  }

  navigateToMerchantDetails(created: boolean) {
    if (created) {
      this._router.navigate(['merchant-list/details'],
      {
        queryParams: {
          tenantName: 'TW',
          merchantId: this.merchant.merchantId
        },
        state: {
          action: 'shopCreated',
          shopName: this.f.name.value
        }
      });
    } else {
      this._router.navigate(['merchant-list/details'],
      {
        queryParams: {
          tenantName: 'TW',
          merchantId: this.merchant.merchantId
        }
      });
    }
  }
}
