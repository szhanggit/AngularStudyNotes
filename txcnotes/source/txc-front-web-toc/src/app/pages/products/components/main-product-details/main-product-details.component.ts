import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LayoutEventType } from 'src/app/core/constants/events';
import { EventService } from 'src/app/core/service/event.service';
import { PRODUCT_CONSTANTS } from '../../constants/product-constants';
import { ExpiryScheme } from '../../models/expiry-scheme.model';
import { ExternalProperty } from '../../models/external-property';
import { ProductPrice } from '../../models/product-price.model';
import { ProductType } from '../../models/product-type.model';
import { Product } from '../../models/product.model';
import { ProductCustomizationService } from '../../services/product-customization.service';
import { ProductService } from '../../services/product.service';

const mockMerchants = [
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
  {
    merchantName: 'AvailableMerchantName',
    merchantInternalCode: '0000000000123',
    shops: 'All (N shops)'
  },
];

@Component({
  selector: 'app-main-product-details',
  templateUrl: './main-product-details.component.html',
  styleUrls: ['./main-product-details.component.scss']
})
export class MainProductDetailsComponent implements OnInit {
  product!: Product;
  productPrice!: ProductPrice;
  selectedTenant: string = 'TW';
  selectedType!: ProductType;

  productDetailsCollapsed = false;
  pricingContractExpiryCollapsed = false;
  productTemplateImageCollapsed = false;
  externalPropertiesCollapsed = false;

  availableMerchantShowAll = false;

  stopIssueTimeModel!: NgbDateStruct;

  selectedExpirySchemes: ExpiryScheme[] = [
    {
      expiryDateType: 'Fixed',
      expiryCondition: 'No expiration date (2999/12/31)',
      checked: false
    },
    {
      expiryDateType: 'Fixed',
      expiryCondition: 'Fixed end of day',
      checked: false
    },
  ];

  currentExternalProperties: ExternalProperty[];

  constructor(private readonly _productService: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _modalService: NgbModal,
    private readonly _eventService: EventService,
    public productCustomizationService: ProductCustomizationService) {
    this._activatedRoute.params.subscribe(params => {
      this._productService.getProduct(params.id).subscribe(res => {
        this.product = res.data.productBasicInfo;
        this.selectedType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find(productType => productType.key === this.product.productType);
      });

      this._productService.getProductPrice(params.id).subscribe(res => this.productPrice = res.data.productPriceDto);

      this._productService.getProductExternalProperty(params.id).subscribe(res => this.currentExternalProperties = res.data);
    });
  }

  get stopIssueTimeColor() {
    const currentDate = new Date(Date.now());
    const productStopIssueTime = new Date(this.product.stopIssueTime);

    return productStopIssueTime > currentDate;
  }

  get merchants(): { displayed: any[], all: any[] } {
    if (this.availableMerchantShowAll) {
      return { displayed: mockMerchants, all: mockMerchants };
    } else {
      return { displayed: mockMerchants.slice(0, 5), all: mockMerchants };
    }
  }

  get stopIssueTime() {
    return this.product.stopIssueTime;
  }

  stopIssueTimeViaDatepicker(datepicker: any) {
    this.product.stopIssueTime = `${this.stopIssueTimeModel.month}/${this.stopIssueTimeModel.day}/${this.stopIssueTimeModel.year}`;
    datepicker.close();
  }


  ngOnInit(): void {
    this._eventService.subscribe(LayoutEventType.CHANGE_TENANT_COUNTRY, (tenantCountry) => {
      this.selectedTenant = tenantCountry as string;
    });
  }

  openModal(content: TemplateRef<NgbModal>): void {
    this._modalService.open(content, { size: 'sm' , backdrop: 'static', centered: true });
  }

  navigateToEditProductDetails() {
    this._router.navigateByUrl(`products/product/edit-details/${this.product.productId}`);
  }

  navigateToEditPricingExpiry() {
    this._router.navigate([`products/product/edit-pricing/${this.product.productId}`], {
      queryParams: {
        productType: this.product.productType
      }
    });
  }

  navigateToEditExternalProperties() {
    this._router.navigateByUrl(`products/product/edit-external-properties/${this.product.productId}`);
  }

  navigateToProductHistory() {
    this._router.navigateByUrl(`products/product/history/${this.product.productId}`);
  }

}
