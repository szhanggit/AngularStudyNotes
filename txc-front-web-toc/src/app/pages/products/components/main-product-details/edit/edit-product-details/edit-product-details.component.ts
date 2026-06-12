import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutEventType } from 'src/app/core/constants/events';
import { EventService } from 'src/app/core/service/event.service';
import { Product } from 'src/app/pages/products/models/product.model';
import { ProductService } from 'src/app/pages/products/services/product.service';

@Component({
  selector: 'app-edit-product-details',
  templateUrl: './edit-product-details.component.html',
  styleUrls: ['./edit-product-details.component.scss']
})
export class EditProductDetailsComponent implements OnInit {
  product!: Product;
  detailsFormGroup: FormGroup;
  selectedTenant: string = 'TW';

  constructor(private _productSvc: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _formBuilder: FormBuilder,
    private eventService: EventService) {
  }

  ngOnInit(): void {
    this.eventService.subscribe(LayoutEventType.CHANGE_TENANT_COUNTRY, (tenantCountry) => {
      this.selectedTenant = tenantCountry as string;
    });

    this._activatedRoute.params.subscribe(params => {
      this._productSvc.getProduct(params.id).subscribe(res => {
        this.product = res.data.productBasicInfo;

        this.detailsFormGroup = this._formBuilder.group({
          productId: new FormControl({ value: this.product.productId }),
          productName: new FormControl({ value: this.product.productName, disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
          productDescription: new FormControl({ value: this.product.description, disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
          productCode: new FormControl({ value: this.product.productCode, disabled: true }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
          externalProductCode: new FormControl({ value: this.product.externalProductCode, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          merchantAcquirer: new FormControl({ value: this.product.merchantSKU, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          productIssuerDropdown: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
          productIssuer: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
          productTag: new FormControl({ value: this.product.productTag, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          productCategory: new FormControl({ value: this.product.productCategory, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          brand: new FormControl({ value: this.product.brandId, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          brandImage: new FormControl({ value: '', disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          availableMerchants: new FormControl({ value: this.product.merchantSKUId, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          voucherNumberRule: new FormControl({ value: this.product.voucherIssuerId, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          operationNotes: new FormControl({ value: this.product.operationNote, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          salesNotes: new FormControl({ value: this.product.salesNote, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
          customerServiceNotes: new FormControl({ value: this.product.customerServiceNote, disabled: false }, [Validators.minLength(2), Validators.maxLength(100)]),
        });
      });
    });
  }

  navigateBackToProductDetails() {
    this._router.navigateByUrl(`products/${this.product.productId}`);
  }

}
