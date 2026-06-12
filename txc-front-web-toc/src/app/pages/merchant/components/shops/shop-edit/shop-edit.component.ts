import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Shop } from '../../../models/shop.model';
import { SecurityKeyService } from '../../../services/security-key.service';
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

  // form
  get f(): any {
    return this.shopFormGroup.controls;
  }

  constructor(private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _shopService: ShopService,
    private readonly _router: Router,
    private readonly _securityKeyService: SecurityKeyService) {

    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;

    this.shopId = Number.parseInt(this._route.snapshot.paramMap.get('id') as string);
    
    this.shopFormGroup = this._formBuilder.group({
      //details
      id: new FormControl({ value: 0, disabled: false }),
      status: new FormControl({ value: 0, disabled: false }),
      name: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]),
      externalCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]),
      internalCode: new FormControl({ value: '', disabled: true }),
      contactPhone: new FormControl({ value: '', disabled: false }),
      shopAddress: new FormControl({ value: '', disabled: false }),
      securityKey: new FormControl({ value: '00000000000000000000000000000000', disabled: true }),
    });

    this._setValue(this.shopId);
  }

  _setValue(id: number): void {
    this._shopService.getShop(id).subscribe(res => {
      const shop = res.data;
      let mappedShop: Shop = {
        id: shop.shopId,
        name: shop.shopName,
        internalCode: shop.identityCode,
        externalCode: shop.externalCode,
        shopAddress: shop.address.detailAddressLine,
        contactPhone: shop.contactPhone,
        status: shop.shopStatus,
        securityKey: shop.securityKey
      };

      this.shopFormGroup.setValue(mappedShop)
    });
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
      const body = { shop: this.shopFormGroup.getRawValue(), address: { detailAddressLine: this.f.shopAddress.value } };
      body.shop.lastModifier = 'TXC';

      this._shopService.updateShop(body).subscribe(res => {
        this.navigateToMerchantDetails(res.success);
      });
    }
  }

  navigateToMerchantDetails(edited: boolean) {
    if (edited) {
      this._router.navigate(['merchant-list/details'],
      {
        queryParams: {
          tenantName: 'TW',
          merchantId: this.merchantId
        },
        state: {
          action: 'shopUpdated',
          shopName: this.f.name.value
        }
      });
    } else {
      this._router.navigate(['merchant-list/details'],
      {
        queryParams: {
          tenantName: 'TW',
          merchantId: this.merchantId
        }
      });
    }
    
  }
}
