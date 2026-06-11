import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/pages/products/models/product.model';
import { EventService } from 'src/app/core/service/event.service';
import { ProductService } from 'src/app/pages/products/services/product.service';
import { LayoutEventType } from 'src/app/core/constants/events';
import { PRODUCT_CONSTANTS } from 'src/app/pages/products/constants/product-constants';
import { ProductType } from 'src/app/pages/products/models/product-type.model';
import { ProductPrice } from 'src/app/pages/products/models/product-price.model';

@Component({
  selector: 'app-edit-pricing-expiry',
  templateUrl: './edit-pricing-expiry.component.html',
  styleUrls: ['./edit-pricing-expiry.component.scss']
})
export class EditPricingExpiryComponent implements OnInit {
  product!: Product;
  productPrice!: ProductPrice;
  pricingFormGroup: FormGroup;
  selectedTenant: string = 'TW';
  selectedType!: ProductType;

  // form
  get f() {
    return this.pricingFormGroup.controls;
  }

  constructor(private _productSvc: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.subscribe(LayoutEventType.CHANGE_TENANT_COUNTRY, (tenantCountry) => {
      this.selectedTenant = tenantCountry as string;
    });

    const productTypePassedFromRoute = Number.parseInt(this._route.snapshot.queryParamMap.get('productType'));
    this.selectedType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find(productType => productType.key === productTypePassedFromRoute);
    this._setupPricingForm();

    this._activatedRoute.params.subscribe(params => {
      this._productSvc.getProduct(params.id).subscribe(res => {
        this.product = res.data.productBasicInfo;
        this._productSvc.getProductPrice(params.id).subscribe(res => {
          this.productPrice = res.data.productPriceDto;
          this._populatePricingForm();
        });
      });
    });
  }

  navigateBackToProductDetails() {
    this._router.navigateByUrl(`products/${this.product.productId}`);
  }

  _setupPricingForm(): void {
    switch (this.selectedType.key) {
      // value based
      case 2: {
        this.pricingFormGroup = this._formBuilder.group({
          productId: new FormControl({ value: '' }),
          faceValueWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          faceValue: new FormControl({ value: 0, disabled: true }),
          sellingPricePrepaidWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          sellingPricePrepaid: new FormControl({ value: 0, disabled: true }),
          costWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          cost: new FormControl({ value: 0, disabled: true }),
          defaultSellingPrice: new FormControl({ value: 0, disabled: true })
        });
        break;
      }
      // smart booklet
      case 3: {
        this.pricingFormGroup = this._formBuilder.group({
          productId: new FormControl({ value: '' }),
          faceValueWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          faceValue: new FormControl({ value: 0, disabled: true }),
          sellingPricePrepaidWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          sellingPricePrepaid: new FormControl({ value: 0, disabled: true }),
          sellingPricePostpaidWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          sellingPricePostpaid: new FormControl({ value: 0, disabled: true }),
          balance: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          costWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          cost: new FormControl({ value: 0, disabled: true })
        });
        break;
      }
      // dynamic face value
      case 4: {
        this.pricingFormGroup = this._formBuilder.group({
          productId: new FormControl({ value: '' }),
          defaultSellingPrice: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          costWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          cost: new FormControl({ value: 0, disabled: true })
        });
        break;
      }
      // product based
      default: {
        this.pricingFormGroup = this._formBuilder.group({
          productId: new FormControl({ value: '' }),
          faceValueWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          faceValue: new FormControl({ value: 0, disabled: true }),
          sellingPricePrepaidWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          sellingPricePrepaid: new FormControl({ value: 0, disabled: true }),
          sellingPricePostpaidWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          sellingPricePostpaid: new FormControl({ value: 0, disabled: true }),
          costWithTax: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)]),
          cost: new FormControl({ value: 0, disabled: true })
        });
        break;
      }
    }
  }

  _populatePricingForm(): void {
    switch (this.selectedType.key) {
      // value based
      case 2: {
        this.f.productId.setValue(this.product.productId);
        this.f.faceValueWithTax.setValue(this.productPrice.faceValueWithTax);
        this.f.faceValue.setValue(this.productPrice.faceValue);
        this.f.sellingPricePrepaidWithTax.setValue(this.productPrice.sellingPricePrepaidWithTax);
        this.f.sellingPricePrepaid.setValue(this.productPrice.sellingPricePrepaid);
        this.f.costWithTax.setValue(this.productPrice.costWithTax);
        this.f.cost.setValue(this.productPrice.cost);
        this.f.defaultSellingPrice.setValue(this.productPrice.defaultSellingPrice);
        break;
      }
      // smart booklet
      case 3: {
        this.f.productId.setValue(this.product.productId);
        this.f.faceValueWithTax.setValue(this.productPrice.faceValueWithTax);
        this.f.faceValue.setValue(this.productPrice.faceValue);
        this.f.sellingPricePrepaidWithTax.setValue(this.productPrice.sellingPricePrepaidWithTax);
        this.f.sellingPricePrepaid.setValue(this.productPrice.sellingPricePrepaid);
        this.f.sellingPricePostpaidWithTax.setValue(this.productPrice.sellingPricePostpaidWithTax);
        this.f.sellingPricePostpaid.setValue(this.productPrice.sellingPricePostpaid);
        this.f.balance.setValue(this.productPrice.balance);
        this.f.costWithTax.setValue(this.productPrice.costWithTax);
        this.f.cost.setValue(this.productPrice.cost);
        break;
      }
      // dynamic face value
      case 4: {
        this.f.productId.setValue(this.product.productId);
        this.f.defaultSellingPrice.setValue(this.productPrice.defaultSellingPrice);
        this.f.costWithTax.setValue(this.productPrice.costWithTax);
        this.f.cost.setValue(this.productPrice.cost);
        break;
      }
      // product based
      default: {
        this.f.productId.setValue(this.product.productId);
        this.f.faceValueWithTax.setValue(this.productPrice.faceValueWithTax);
        this.f.faceValue.setValue(this.productPrice.faceValue);
        this.f.sellingPricePrepaidWithTax.setValue(this.productPrice.sellingPricePrepaidWithTax);
        this.f.sellingPricePrepaid.setValue(this.productPrice.sellingPricePrepaid);
        this.f.sellingPricePostpaidWithTax.setValue(this.productPrice.sellingPricePostpaidWithTax);
        this.f.sellingPricePostpaid.setValue(this.productPrice.sellingPricePostpaid);
        this.f.costWithTax.setValue(this.productPrice.costWithTax);
        this.f.cost.setValue(this.productPrice.cost);
        this.f.defaultSellingPrice.setValue(this.productPrice.defaultSellingPrice);
        break;
      }
    }
  }

  savePricing(): void {
    this._productSvc.updateProductPrice(this.pricingFormGroup.getRawValue()).subscribe((res) => {
      this.navigateBackToProductDetails();
    });
  }
}
