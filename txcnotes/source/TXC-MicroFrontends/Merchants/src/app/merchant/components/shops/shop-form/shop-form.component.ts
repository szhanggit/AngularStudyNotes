import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, forkJoin, takeUntil, ReplaySubject } from 'rxjs';
import { SecurityKeyService } from 'src/app/merchant/services/security-key.service';
import { ShopService } from 'src/app/merchant/services/shop.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { DictionaryService } from 'src/app/merchant/services/dictionary.service';
import { Dictionary } from 'src/app/merchant/models/dictionary.model';
import { Select2Data } from 'ng-select2-component';
import { Shop } from 'src/app/merchant/models/shop.model';
import { MerchantService } from 'src/app/merchant/services/merchant.service';
import { Merchant } from 'src/app/merchant/models/merchant.model';

@Component({
  selector: 'app-shop-form',
  templateUrl: './shop-form.component.html',
  styleUrls: ['./shop-form.component.scss']
})
export class ShopFormComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  @Input() merchantId!: number;
  @Input() shopId!: number;
  @Input() tenant!: string;
  @Input() shopFormGroup!: FormGroup;
  @Input() isEdit = false;

  hideGenerateSecKey = false;
  actionLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loading$ = new BehaviorSubject<boolean>(true);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  selectedAccepatanceLoop: number[] = []

  userName: string = '';

  countriesSelect2Data: Select2Data = [];

  cities: Dictionary[] = [];
  citiesSelect2Data: Select2Data = [];

  statesOrProvinces: Dictionary[] = [];
  statesOrProvincesSelect2Data: Select2Data = [];

  // form
  get f(): any {
    return this.shopFormGroup.controls;
  }

  constructor(
    private readonly _router: Router,
    private readonly _securityKeyService: SecurityKeyService,
    private readonly _shopService: ShopService,
    private readonly _merchantService: MerchantService,
    private readonly authSvc: AuthorizationLibraryService,
    private readonly _dictionaryService: DictionaryService) {

    this.authSvc.userAuthClaim.subscribe(data => {
      this.userName = data.user.userName ? data.user.userName : "";
    });
  }

  ngOnInit(): void {
    if (this.isEdit) {
      this._setValue(this.shopId);
    }

    forkJoin(
 [     this._dictionaryService.getDictionaryItemsByCategory('Country'),
      this._dictionaryService.getDictionaryItemsByCategory('City'),
      this._dictionaryService.getDictionaryItemsByCategory('StateOrProvince'),
      this._merchantService.getMerchantById(this.merchantId).
        pipe(
          takeUntil(this.destroyed$))]
    ).subscribe(([countries, cities, statesOrProvinces, merchantDetails]) => {
      this.countriesSelect2Data = JSON.parse(countries.data).dictionaries.map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
      this.statesOrProvinces = JSON.parse(statesOrProvinces.data).dictionaries;
      this.cities = JSON.parse(cities.data).dictionaries;

      if (merchantDetails.success) {
        const merchant: Merchant = merchantDetails.data.merchantDetails[0];

        if (merchant.sameKeyWithShop) {
          this.f.securityKey.setValue(merchant.securityKey);
          this.hideGenerateSecKey = true;
        } 

        if (!this.isEdit && !this.hideGenerateSecKey) {
          this.generateSecurityKey();
        }
      }

      if (this.isEdit) {
        const countryValue = this.shopFormGroup.get('address.countryId')?.value;
        const stateOrProvinceValue = this.shopFormGroup.get('address.stateOrProvinceId')?.value;
        this.statesOrProvincesSelect2Data = this.statesOrProvinces.filter(dictionary => dictionary.parentId === countryValue).map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
        this.citiesSelect2Data = this.cities.filter(dictionary => dictionary.parentId === stateOrProvinceValue).map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
      }
    },
      () => {
        this.toast.showDanger('Error loading dropdown values. Please try again later.');
      },
      () => {
        Promise.allSettled([
          this.countriesSelect2Data,
          this.statesOrProvincesSelect2Data,
          this.citiesSelect2Data,
        ]).then(() => {
          this.loading$.next(false);
        });
      });

    this.shopFormGroup.get('address.countryId')!
      .valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value: number) => {
        this.shopFormGroup.get('address.stateOrProvinceId')?.setValue(0);
        this.shopFormGroup.get('address.stateOrProvinceId')?.enable();
        this.statesOrProvincesSelect2Data = this.statesOrProvinces.filter(dictionary => dictionary.parentId === value).map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
      });

    this.shopFormGroup.get('address.stateOrProvinceId')!
      .valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value: number) => {
        this.shopFormGroup.get('address.cityId')?.setValue(0);
        this.shopFormGroup.get('address.cityId')?.enable();
        this.citiesSelect2Data = this.cities.filter(dictionary => dictionary.parentId === value).map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } });
      });
  }

  _setValue(id: number): void {
    this._shopService.getShop(id).subscribe(res => {
      const shop = res.data;
      const address = {
        countryId: res.data.address.countryId,
        stateOrProvinceId: res.data.address.stateOrProvinceId,
        cityId: res.data.address.cityId,
        detailAddressLine: res.data.address.detailAddressLine,
        district: res.data.address.district,
        postcode: res.data.address.postcode
      };
      let mappedShop: Shop = {
        id: shop.shopId,
        name: shop.shopName,
        identityCode: shop.identityCode,
        externalCode: shop.externalCode,
        subsidiaryName: shop.subsidiaryName,
        subsidiaryUen: shop.subsidiaryUen,
        address: address,
        contactPhone: shop.contactPhone,
        status: shop.shopStatus,
        securityKey: shop.securityKey
      };

      this.shopFormGroup.setValue(mappedShop);
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  generateSecurityKey() {
    this.f.securityKey.setValue(this._securityKeyService.generateSecurityKey(31));

    if (!this.shopFormGroup.dirty) {
      this.shopFormGroup.markAsDirty();
    }
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
      this.actionLoading$.next(true);
      const shop = { ...this.shopFormGroup.getRawValue() };
      if (!this.isEdit) {
        shop.merchantId = this.merchantId;
        shop.contactName = '';
        shop.lastModifier = this.userName;

        if (shop.sameExternalCode) {
          shop.identityCode = shop.externalCode;
        }

        const address = this.f.address.getRawValue();
        delete shop.shopAddress;
        const body = { shop: [{ shop, address, acceptanceLoopId: this.selectedAccepatanceLoop }] };

        this._shopService.createShop(body).subscribe(
          res => {
            this.navigateToMerchantDetails(res.success, 'shopCreated');
            this.actionLoading$.next(false);
          }, err => {
            this.toast.showDanger(err.error.message ?? 'Something went wrong');
            this.actionLoading$.next(false);
          });
      } else {
        const body = { shop: shop, address: this.f.address.getRawValue() };
        body.shop.lastModifier = this.userName;
        body.shop.contactName = '';

        this._shopService.updateShop(body).subscribe(res => {
          this.navigateToMerchantDetails(res.success, 'shopUpdated');
          this.actionLoading$.next(false);
        }, err => {
          this.toast.showDanger(err.error.message ?? 'Something went wrong');
          this.actionLoading$.next(false);
        });
      }
    }
  }

  navigateToMerchantDetails(withAction: boolean, action?: string) {
    if (withAction) {
      this._router.navigate(['merchants/details'],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: this.merchantId
          },
          state: {
            action: action,
            shopName: this.f.name.value
          }
        });
    }
    else {
      this._router.navigate(['merchants/details'],
        {
          queryParams: {
            tenantName: this.tenant,
            merchantId: this.merchantId,
          },
          state: {
            action: 'shopCancelled'
          }
        });
    }
  }

  onALSelectChanged(event: any): void {
    console.log("onALSelectChanged", event);

    this.selectedAccepatanceLoop = event;
  }
}
