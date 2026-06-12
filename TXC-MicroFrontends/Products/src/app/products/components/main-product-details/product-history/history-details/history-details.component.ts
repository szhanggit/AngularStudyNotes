import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PRODUCT_CONSTANTS } from 'src/app/products/constants/product-constants';
import { AcceptanceLoop } from 'src/app/products/models/acceptance-loop.model';
import { ProductType } from 'src/app/products/models/product-type.model';
import { Product } from 'src/app/products/models/product.model';
import { IProgram } from 'src/app/products/models/program.model';
import { VoucherNumberRule } from 'src/app/products/models/voucher-number-rule.model';
import { AcceptanceLoopService } from 'src/app/products/services/acceptance-loop.service';
import { BrandService } from 'src/app/products/services/brand.service';
import { MerchantService } from 'src/app/products/services/merchant.service';
import { ProductCustomizationService } from 'src/app/products/services/product-customization.service';
import { ProductService } from 'src/app/products/services/product.service';
import { SkuService } from 'src/app/products/services/sku.service';
import { VoucherNumberRuleService } from 'src/app/products/services/voucher-number-rule.service';
// import { LayoutEventType } from 'src/app/core/constants/events';
// import { EventService } from 'src/app/core/service/event.service';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})
export class HistoryDetailsComponent implements OnInit {
  productDetailsCollapsed = false;
  selectedTenant: string = 'TW';
  product!: Product;
  merchantSKUData: any = [];
  acceptanceLoopData!: AcceptanceLoop[];
  acceptanceLoopList: AcceptanceLoop[] = [];
  shopCount!: number;
  acceptanceLoopErrorMessage!: string;
  merchantId!: number;
  merchantDetails: any = [];
  isMonoMerchant = true;
  voucherNumberRuleList: VoucherNumberRule[] = [];
  vnrErrorMessage!: string;
  merchantProgram: IProgram = { isEdenred: true, name: '', displayName: '', id: 999 };
  selectedAcceptanceLoopId!: number;
  selectedType!: ProductType;
  
  constructor(
    private readonly _productService: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly brandService: BrandService,
    public productCustomizationService: ProductCustomizationService,
    private readonly _skuService: SkuService,
    private readonly _acceptanceLoopService: AcceptanceLoopService,
    private readonly _voucherNumberRuleService: VoucherNumberRuleService,
    private readonly _merchantService: MerchantService
  ) { }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }
    this._activatedRoute.params.subscribe((params: any) => {
      this._productService.getProductHistoryDetails(params.id).subscribe(res => {
        if (!res.data.productBasicInfo) return;

        this.product = res.data.productBasicInfo;
        this.selectedAcceptanceLoopId = this.product.acceptanceLoopId!;
        this.brandService.getBrandsByBrandID(this.product?.brandId!).subscribe(res => {
          let brandsArray = JSON.parse(res.data);
          brandsArray?.brands?.items.length ? this.product.brandName = brandsArray?.brands?.items[0].brandName : this.product.brandName = "";
        })
        this.selectedType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find(productType => productType.key === this.product?.productType) as ProductType;
        // get sku data
        this._skuService.getSKUbySKUId(this.product?.skuId!).subscribe(res=> {
          let skuData = JSON.parse(res.data)
          this.merchantSKUData = skuData?.contractSKUDetails?.items
          if(this.merchantSKUData.length > 0){
            this.merchantId = this.merchantSKUData[0].contractSKUCosts[0].skuCostContract.merchantId;
            // get merchant data by merchant id
            this._merchantService.getMerchantById(this.merchantId).subscribe(res => this.merchantDetails = res.data.merchantDetails[0])
            // acceptance loop get
            this._acceptanceLoopService.getMonoAcceptanceLoopByMerchantIdAndAcceptanceLoopId(this.merchantId,this.product.acceptanceLoopId!).subscribe(
              res => {
                if (res.success) {
                  this.acceptanceLoopList = JSON.parse(res.data).monoAcceptanceLoopByMerchantId.items;
                  this._acceptanceLoopService.getMerchantShop(this.merchantId).subscribe((res) => {
                    if (res.success) {
                      this.shopCount = res.data.totalCount;
                    }
                  });
                  if (!this.acceptanceLoopList.length) {
                    this.acceptanceLoopErrorMessage = `No available acceptance loop for this merchant, please <a href="/merchants/details?merchantId=${this.merchantId}">go to merchant</a> to create one`;
                  }
                }
              });
            this._voucherNumberRuleService
              .getSpecificVoucherNumberRule(
                this.merchantId,
                this.merchantSKUData[0]?.voucherNumberRule.voucherNumberRuleId
              )
              .subscribe({
                next: (res) => {
                  this.voucherNumberRuleList = res ?? [];
                  if (!this.voucherNumberRuleList.length) {
                    this.vnrErrorMessage = `No available voucher number rule for this merchant, please go to <a href="/merchants/details?merchantId=${this.merchantId}">merchant</a> to create one`;
                  }
                },
              });
          }else{
            this.acceptanceLoopErrorMessage = 'No available acceptance loop for this merchant';
            this.vnrErrorMessage = 'No available voucher number rule for this merchant';
          }
        })
      });
    });
  }

  navigateBackToProductHistory() {
    this._router.navigateByUrl(`products/product/history/${this.product.productId}`);
  }

}
