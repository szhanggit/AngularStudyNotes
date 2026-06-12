import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BehaviorSubject, forkJoin, Subject, takeUntil } from 'rxjs';
import { PRODUCT_CONSTANTS } from 'src/app/products/constants/product-constants';
import { IDefineFormGroup } from 'src/app/products/models/define-form-group.model';
import { Merchant } from 'src/app/products/models/merchant.model';

import {
  DynamicFaceValuePricingFormGroup,
  ProductBasedPricingFormGroup,
  SmartBookletPricingFormGroup,
  SmartChoiceVoucherPricingFormGroup,
  SuperVoucherPricingFormGroup,
  ValueBasedPricingFormGroup
} from 'src/app/products/models/product-form-group/product-pricing-form-group.model';

import { ProductPrice } from 'src/app/products/models/product-price.model';
import { ProductType } from 'src/app/products/models/product-type.model';
import { IProgram } from 'src/app/products/models/program.model';
import { SKU } from 'src/app/products/models/sku.model';
import { MathService } from 'src/app/products/services/math.service';
import { MerchantService } from 'src/app/products/services/merchant.service';
import { ProductService } from 'src/app/products/services/product.service';
import { ProgramService } from 'src/app/products/services/program.service';
import { SkuService } from 'src/app/products/services/sku.service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-edit-pricing-expiry',
  templateUrl: './edit-pricing-expiry.component.html',
  styleUrls: ['./edit-pricing-expiry.component.scss']
})
export class EditPricingExpiryComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  PRODUCT_UPDATED_ACTION = 'productUpdated';
  PRODUCT_PRICING_PANEL = 'productPricing';

  product!: Product;
  productPrice!: ProductPrice;
  pricingFormGroup!: FormGroup;
  selectedTenant: string = 'TW';
  selectedType!: ProductType;
  selectedMerchant!: Merchant;
  merchantProgram!: IProgram;
  fixExpiryDate!: string | undefined;

  pricingFormGroupDefinition: IDefineFormGroup[] = [
    new ProductBasedPricingFormGroup(),
    new ValueBasedPricingFormGroup(),
    new SmartBookletPricingFormGroup(),
    new DynamicFaceValuePricingFormGroup(),
    new SmartChoiceVoucherPricingFormGroup(),
    new SuperVoucherPricingFormGroup(),
  ];
  expirySchemeList: any;
  selectedSKU!: SKU;

  actionLoading$ = new BehaviorSubject<boolean>(false);
  destroy$ = new Subject();

  // form
  get f(): any {
    return this.pricingFormGroup.controls;
  }

  constructor(private _productSvc: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly _skuService: SkuService,
    private readonly _merchantService: MerchantService,
    private readonly _programService: ProgramService,
    private readonly _mathService: MathService,
    // private eventService: EventService
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    };
    const productTypePassedFromRoute = Number.parseInt(this._route.snapshot.queryParamMap.get('productType') as string);
    this.selectedType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find(productType => productType.key === productTypePassedFromRoute) as ProductType;
    this._setupPricingForm();

    this._activatedRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params: any) => {
      this._productSvc.selectedProduct$.pipe(takeUntil(this.destroy$)).subscribe(product => {
        if (!product) {
          this._productSvc.getProduct(parseInt(params.id));
          return;
        }
        this.product = product;
        forkJoin({
          // price fetch
          priceInfo: this._productSvc.getProductPrice(params.id),
          // merchant details fetch
          skuInfo: this._skuService.getSKUbySKUId(this.product?.skuId!)
        }).pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              if (res.priceInfo.success) {
                this.productPrice = res.priceInfo.data;
                this._populatePricingForm();
              }
              if (res.skuInfo.success) {
                const contractSKUDetails = JSON.parse(res.skuInfo.data).contractSKUDetails.items[0];
                this.selectedSKU = contractSKUDetails;
                const merchantId = contractSKUDetails?.contractSKUCosts[0].skuCostContract.merchantId;
                if (contractSKUDetails) {
                  this._merchantService.getMerchantById(merchantId, true).subscribe(
                    res => {
                      this.selectedMerchant = res.data.merchantDetails[0];
                      // For merchant program data
                      this._programService.getProgramById(this.selectedMerchant.programId).subscribe(
                        res => {
                          this.merchantProgram = JSON.parse(res.data).programs.items[0];
                        },
                        () => {
                          this.toast.showDanger('Error loading program details. Please try again later.')
                        }
                      );
                    })
                } else {
                  this.toast.showDanger('Error loading sku data. Please try again later')
                }
              }
              if (res.priceInfo.success && res.skuInfo.success) {
                this.setCalculatedPriceValue();
                this._populatePricingForm();
              }
            },
            error: () => {
              this.toast.showDanger('Error loading price and sku data. Please try again later');
            }
          });
        // Product Expiration Policy API Fetch
        this._productSvc.getProductExpirationPolicy(params.id).pipe(takeUntil(this.destroy$)).subscribe(res => {
          this.fixExpiryDate = res.data.fixedExpiryDate
          const schemeList = res.data.expirationPolicyList.filter(scheme => scheme.inUse == 1);
          const expirationPolicyIds = schemeList.map((scheme) => scheme.expirationPolicyId);
          this.expirySchemeList = expirationPolicyIds;
          if (this.expirySchemeList.length) {
            this.pricingFormGroup.controls['requiredExpiryList'].setValue(this.expirySchemeList.length);
          }
        });
      });
    });
    this.checkExpiryPolicyType();
  }

  checkExpiryPolicyType(){
    const id = Number(this._route.snapshot.paramMap.get('id'));
    if (id) {
      this._productSvc.getExpiryPolicyType(id).subscribe((value) => {
        const policy = JSON.parse(value.data)?.products?.items;
        const isFixedExpiry = policy[0].isFixedExpiryPolicy;
        if (policy.length > 0) {
          this.f.isFixedExpiryPolicy.setValue(isFixedExpiry);
          this.f.fixExpiryDate.setValue(
            isFixedExpiry ? policy[0].expiryDate : ''
          );
        }
      });
    } 
  }


  navigateBackToProductDetails() {
    this._router.navigateByUrl(`products/${this.product.productId}`);
  }

  _setupPricingForm(): void {
    const pricingFormDefinition = this.pricingFormGroupDefinition.find(f => f.productType === this.selectedType.key);
    if (pricingFormDefinition) {
      this.pricingFormGroup = pricingFormDefinition.define(this._formBuilder, false);
    }
  }

  _populatePricingForm(): void {
    this.pricingFormGroup.patchValue(this.productPrice)
  }


  OnExpiryListChanged($event: number[]) {
    const isChanged = this.isExpiryListChanged(this.expirySchemeList, $event)
    if(!isChanged) {
      return
    } 
    this.expirySchemeList = $event;
    this.pricingFormGroup.markAsDirty();
  }

  isExpiryListChanged(a: number[], b:number[]): boolean {
    if (a.length !== b.length) {
      return true;
    }
  
    const sortedA = JSON.stringify(a.slice().sort());
    const sortedB = JSON.stringify(b.slice().sort());
    
    return sortedA !== sortedB;
  }

  savePricing(): void {
    this.actionLoading$.next(true);
    let body = this.pricingFormGroup.getRawValue();
    body.productId = this.product.productId;
    let expirationBody = {
      "productId": this.product.productId,
      "fixedExpiryDate": body?.fixExpiryDate,
      "selectedExpirationPolicyList": [],
      "isFixedExpiryPolicy": body?.isFixedExpiryPolicy
    }
    expirationBody.selectedExpirationPolicyList = this.expirySchemeList.map((exPolNum: number) => {
      return { expirationPolicyId: exPolNum }
    });
    this._productSvc.updateProductPrice(body).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.success) {
        this._productSvc.updateExpirationPolicy(expirationBody).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res.success) {
            this._router.navigate([`/products/${this.product.productId}`], {
              state: {
                action: this.PRODUCT_UPDATED_ACTION,
                panel: this.PRODUCT_PRICING_PANEL,
                message: `${this.product.productName} updated successfully`
              }
            });
          } else {
            this.toast.showDanger(res.message)
          }
        }, (err) => {
          this.toast?.showDanger(`Error : ${err.error.message}`)
        })
      } else {
        this.toast.showDanger('Error while updating pricing details. Please try after sometime.')
      }
    }, (err) => {
      this.toast?.showDanger(`Error : ${err.error.message}`)
    }, () => {
      this.actionLoading$.next(false);
    });
  }

  private setCalculatedPriceValue() {
    if (this.selectedType?.key === 2 && this.productPrice
      && this.selectedSKU && this.selectedSKU.faceValueWithTax) {
      this.productPrice.customerFeePrepaidWithTax = this._mathService.divideAndToPercentage(
        this.productPrice?.sellingPricePrepaidWithTax
        , this.selectedSKU.faceValueWithTax
        , 4) ?? 0;
    }
  }
}
