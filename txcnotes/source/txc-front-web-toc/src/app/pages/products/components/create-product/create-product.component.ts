import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutEventType } from 'src/app/core/constants/events';
import { EventService } from 'src/app/core/service/event.service';
import { PRODUCT_CONSTANTS } from '../../constants/product-constants';
import { ExternalProperty } from '../../models/external-property';
import { ExternalPropertyBody } from '../../models/external-property-body';
import { ProductType } from '../../models/product-type.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  selectedType: ProductType;
  step = 0;
  selectedTenant: string = 'TW';

  // duplicate
  productId!: number;

  // form
  detailsFormGroup: FormGroup;
  pricingFormGroup: FormGroup;

  currentExternalProperties: ExternalProperty[] = [];

  get detailsControls() {
    return this.detailsFormGroup.controls;
  }

  get masterVoucherKeys() {
    return PRODUCT_CONSTANTS.PRODUCT_TYPE_EXCEPTION;
  }

  // product types
  private _productTypes: ProductType[] = PRODUCT_CONSTANTS.PRODUCT_TYPE;

  constructor(private router: Router,
    private readonly eventService: EventService,
    private readonly _formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly _productService: ProductService) {
    this.selectedType = { key: 0, value: '', isChild: false };

    this.productId = Number.parseInt(this.route.snapshot.queryParamMap.get('productId'));
    const productTypePassedFromRoute = Number.parseInt(this.route.snapshot.queryParamMap.get('productType'));

    if (this.productId) {
      this.step = 5;
      this.selectedType = this._productTypes.find((productType: ProductType) => productType.key === productTypePassedFromRoute);
    }
  }

  ngOnInit(): void {
    this.eventService.subscribe(LayoutEventType.CHANGE_TENANT_COUNTRY, (tenantCountry) => {
      this.selectedTenant = tenantCountry as string;
    });

    this.detailsFormGroup = this._formBuilder.group({
      productId: new FormControl({ value: '' }),
      productName: new FormControl({ value: this.route.snapshot.queryParamMap.get('productName'), disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      productDescription: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      productCode: new FormControl({ value: this.route.snapshot.queryParamMap.get('productCode'), disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      externalProductCode: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      merchantAcquirer: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      productIssuerDropdown: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      productIssuer: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      productTag: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      productCategory: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      brand: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      brandImage: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      availableMerchants: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      voucherNumberRule: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      operationNotes: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      salesNotes: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
      customerServiceNotes: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
    });

    this._setupPricingForm();

    if (this.productId) {
      this._productService.getProduct(this.productId).subscribe(res => {
        this.detailsControls.productDescription.setValue(res.data.productBasicInfo.description);
        this.detailsControls.externalProductCode.setValue(res.data.productBasicInfo.externalProductCode);
        this.detailsControls.productIssuer.setValue(res.data.productBasicInfo.productIssuer);
        this.detailsControls.productIssuerDropdown.setValue(res.data.productBasicInfo.productIssuer);
        this.detailsControls.productTag.setValue(res.data.productBasicInfo.productTag);
        this.detailsControls.brand.setValue(res.data.productBasicInfo.brandId);
        this.detailsControls.operationNotes.setValue(res.data.productBasicInfo.operationNote);
        this.detailsControls.salesNotes.setValue(res.data.productBasicInfo.salesNote);
        this.detailsControls.customerServiceNotes.setValue(res.data.productBasicInfo.customerServiceNote);
      });
    }
  }

  prev(): void {
    if (this.step === 0) {
      this.router.navigateByUrl('/products');
    } else {
      this.step--;
    }
  }

  next(): void {
    if ((this.step === 4 && !this.masterVoucherKeys.includes(this.selectedType.key) ||
      (this.step === 5 && this.masterVoucherKeys.includes(this.selectedType.key)))
      && this.currentExternalProperties.length > 0) {
      const externalPropertyBody: ExternalPropertyBody = {
        productId: 1,
        productExternalPropertyList: this.currentExternalProperties
      }

      this._productService.createProductExternalProperty(externalPropertyBody).subscribe(res => {
        console.log(res.message);
      });
    }

    this.step++;
  }

  getNextValidity(): boolean {
    if (this.step === 0) {
      return !this.selectedType.key;
    }

    return false;
  }

  OnProductSelected(event: ProductType) {
    this.selectedType = event;

    this._setupPricingForm();
  }

  OnStepChanged(step: number) {
    this.step = step;
  }

  OnExternalPropertyChanged(externalProperties: ExternalProperty[]) {
    this.currentExternalProperties = externalProperties;
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
          balance: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)])
        });
        break;
      }
      // dynamic face value
      case 4: {
        this.pricingFormGroup = this._formBuilder.group({
          productId: new FormControl({ value: '' }),
          defaultSellingPrice: new FormControl({ value: 0, disabled: false }, [Validators.required, Validators.min(1)])
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
        });
        break;
      }
    }
  }
}
