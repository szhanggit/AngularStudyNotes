import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PRODUCT_CONSTANTS } from 'src/app/products/constants/product-constants';
import { ProductType } from 'src/app/products/models/product-type.model';
import { Product } from 'src/app/products/models/product.model';
import { ProductService } from 'src/app/products/services/product.service';
import {
  GlobalProductDetailsFormGroup,
  GlobalRewardsProductDetailsFormGroup,
  IndiaProductDetailsFormGroup,
  SingaporeProductDetailsFormGroup,
  TaiwanProductDetailsFormGroup
} from 'src/app/products/models/product-form-group/product-details-form-group.model';
import { IDefineFormGroup } from 'src/app/products/models/define-form-group.model';
import { Brand } from 'src/app/products/models/brand.model';
import { BrandService } from 'src/app/products/services/brand.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Dictionary } from 'src/app/products/models/dictionary.model';
import { DictionaryService } from 'src/app/products/services/dictionary.service';
import { Merchant } from 'src/app/products/models/merchant.model';
import { SkuService } from 'src/app/products/services/sku.service';
import { MerchantService } from 'src/app/products/services/merchant.service';
import { AcceptanceLoopService } from 'src/app/products/services/acceptance-loop.service';
import { ProgramService } from 'src/app/products/services/program.service';
import { VoucherNumberRuleService } from 'src/app/products/services/voucher-number-rule.service';
import { ContractSKUCosts, SKU } from 'src/app/products/models/sku.model';
import { AcceptanceLoop, GroupAcceptanceLoop } from 'src/app/products/models/acceptance-loop.model';
import { IProgram } from 'src/app/products/models/program.model';
import { VoucherNumberRule } from 'src/app/products/models/voucher-number-rule.model';
import { MediaService } from 'src/app/products/services/media.service';
import { Media } from 'src/app/products/models/media.model';
import { ProductWizardStepOne } from 'src/app/products/models/product-wizard-dto.model';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { GraphqlCollectionSegment } from 'src/app/products/models/graphql-collection-segment.model';
import { BehaviorSubject, ReplaySubject, map, of, switchMap, takeUntil } from 'rxjs';
import { MerchantGroupService } from 'src/app/products/services/merchant-group.service';
import { BaseResponse } from 'src/app/products/models/base-response.model';

@Component({
  selector: 'app-edit-product-details',
  templateUrl: './edit-product-details.component.html',
  styleUrls: ['./edit-product-details.component.scss']
})
export class EditProductDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  PRODUCT_DETAILS_PANEL = 'productDetails';
  PRODUCT_UPDATED_ACTION = 'productUpdated';

  product!: Product;
  detailsFormGroup!: FormGroup;
  selectedTenant: string = 'TW';
  selectedType!: ProductType;
  brandList: Brand[] = [];
  merchantAcquirers: Dictionary[] = [];
  selectedMerchant!: Merchant;
  selectedSKU!: SKU | undefined;
  skuList: SKU[] = [];
  acceptanceLoopList: AcceptanceLoop[] = [];
  acceptanceLoopErrorMessage!: string;
  selectedAcceptanceLoop!: AcceptanceLoop;
  acceptanceLoopPage = 1;
  merchantProgram!: IProgram;
  voucherNumberRuleList: VoucherNumberRule[] = [];
  vnrErrorMessage!: string;
  shopCount: number = 0;
  isMonoMerchant = true;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  actionLoading$ = new BehaviorSubject<boolean>(false);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  detailFormGroupDefinitions: IDefineFormGroup[] = [
    new TaiwanProductDetailsFormGroup(),
    new GlobalProductDetailsFormGroup(),
    new IndiaProductDetailsFormGroup(),
    new SingaporeProductDetailsFormGroup(),
    new GlobalRewardsProductDetailsFormGroup()
  ];

  constructor(private _productSvc: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _formBuilder: FormBuilder,
    private readonly _brandService: BrandService,
    private readonly _dictionaryService: DictionaryService,
    private readonly _skuService: SkuService,
    private readonly _merchantService: MerchantService,
    private readonly _merchantGroupService: MerchantGroupService,
    private readonly _acceptanceLoopService: AcceptanceLoopService,
    private readonly _programService: ProgramService,
    private readonly _voucherNumberRuleService: VoucherNumberRuleService,
    private readonly _mediaService: MediaService,
    private readonly authService: AuthorizationLibraryService
    // private eventService: EventService
  ) {
  }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    };

    this.selectedType = { key: 0, value: '', isChild: false };
    const detailFormDefinition = this.detailFormGroupDefinitions.find(f => f.tenantCode === this.selectedTenant);
    if (detailFormDefinition) {
      this.detailsFormGroup = detailFormDefinition.define(this._formBuilder, false);
      this.detailsFormGroup.controls['productCode'].disable()
    }

    this._activatedRoute.params.subscribe((params: any) => {
      this._productSvc.selectedProduct$.pipe(
        takeUntil(this.destroyed$)
      ).subscribe(product => {
        if (!product) {
          this._productSvc.getProduct(parseInt(params.id));
          return;
        };
        product.productDescription = product.description;
        this.product = product;
        this.selectedType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find((productType: ProductType) => productType.key === this.product.productType) as ProductType;
        this.detailsFormGroup.patchValue(this.product);
        // setting resellermerchantname value
        if (this.product?.productIssuer == 2) {
          this._merchantService.getMerchantById(this.product?.issueMerchant, true).pipe(
            takeUntil(this.destroyed$)
          ).subscribe(res => {
            let merchantDetails = res.data?.merchantDetails;
            const resellerMerchantNameValue = merchantDetails?.find((data: any) => data.merchantId == this.product?.issueMerchant) ?? '';
            this.detailsFormGroup.patchValue({ resellerMerchantName: resellerMerchantNameValue })
          })
        }
        this._brandService.getAllBrands(1000).pipe(
          takeUntil(this.destroyed$)
        ).subscribe(
          res => {
            this.brandList = JSON.parse(res.data).brands.items;
          },
          () => {
            this.toast.showDanger('Error in loading brands. Please try again later');
          }
        );

        if (this.product.brandId) {
          let selectedBrand: Brand;
          this._brandService.getBrandsByBrandID(this.product?.brandId).pipe(
            takeUntil(this.destroyed$),
            switchMap((value: BaseResponse) => {
              selectedBrand = JSON.parse(value.data).brands.items[0];
              return this._mediaService.getMediaById(selectedBrand.mediaId);
            })
          ).subscribe(res => {
            if (selectedBrand) {
              const media: Media = JSON.parse(res.data).mediaById[0];
              this.detailsFormGroup.patchValue({ brandName: selectedBrand, brandImage: media });
            }
          });
        }

        this._skuService.getSKUbySKUId(this.product.skuId!).pipe(
          takeUntil(this.destroyed$)
        ).subscribe(
          res => {
            const contractSKUDetails = JSON.parse(res.data).contractSKUDetails.items[0];
            this.selectedSKU = contractSKUDetails;
            this.skuList = [contractSKUDetails];
            let merchantId = contractSKUDetails?.contractSKUCosts[0].skuCostContract.merchantId;
            this.detailsFormGroup.controls['merchantId'].setValue(merchantId);
            this.detailsFormGroup.controls['skuName'].setValue(contractSKUDetails);
            this.detailsFormGroup.controls['skuName'].disable();
            if (this.selectedSKU?.voucherNumberRule) {
              this.detailsFormGroup.controls['vnrId'].setValue(this.selectedSKU.voucherNumberRule.voucherNumberRuleId);
            }

            if (!this.selectedSKU?.merchantGroupId) {
              this.isMonoMerchant = true;
              if (this.product.acceptanceLoopId) {
                this._acceptanceLoopService.getAcceptanceLoopById(this.product.acceptanceLoopId).pipe(takeUntil(this.destroyed$)).subscribe(
                  res => {
                    merchantId = JSON.parse(res.data).acceptanceLoops.items[0].acceptanceLoopMerchant[0].merchantId;
                    this.detailsFormGroup.controls['merchantId'].setValue(merchantId);
                    const filteredContractSKUCost = this.selectedSKU?.contractSKUCosts
                      .filter((contractSkuCost: ContractSKUCosts) => contractSkuCost.skuCostContract.merchantId === merchantId);
                    if (filteredContractSKUCost) {
                      this.selectedSKU!.contractSKUCosts = filteredContractSKUCost;
                    }

                    this._merchantService.getMerchantById(merchantId, true).pipe(
                      takeUntil(this.destroyed$)
                    ).subscribe(
                      res => {
                        this.selectedMerchant = res.data.merchantDetails[0];
                        this._acceptanceLoopService.getMonoAcceptanceLoopByMerchantId(merchantId).pipe(
                          takeUntil(this.destroyed$)
                        ).subscribe(
                          res => {
                            if (res.success) {
                              this.acceptanceLoopList = JSON.parse(res.data).monoAcceptanceLoopByMerchantId.items;

                              this._acceptanceLoopService.getMerchantShop(merchantId).pipe(
                                takeUntil(this.destroyed$)
                              ).subscribe((res) => {
                                if (res.success) {
                                  this.shopCount = res.data.totalCount;
                                }
                              });

                              if (!this.acceptanceLoopList.length) {
                                this.toast.showDanger('No available acceptance loop for this merchant, please go to merchant to create one');
                              } else {
                                const getSelected = this.acceptanceLoopList.find(ac => ac.acceptanceLoopId === this.product?.acceptanceLoopId);
                                if (getSelected)
                                  this.selectedAcceptanceLoop = getSelected;
                              }
                            }
                          },
                          () => {
                            this.toast.showDanger('Error loading acceptance loop list. Please try again later.');
                          }
                        );

                        this._programService.getProgramById(this.selectedMerchant.programId).pipe(
                          takeUntil(this.destroyed$)
                        ).subscribe(
                          res => {
                            this.merchantProgram = JSON.parse(res.data).programs.items[0];
                            if (this.selectedSKU) {
                              if (this.merchantProgram) {
                                this._voucherNumberRuleService.getSpecificVoucherNumberRule(merchantId, this.selectedSKU?.voucherNumberRule.voucherNumberRuleId).subscribe({
                                  next: res => {
                                    this.voucherNumberRuleList = res ?? [];
                                    if (!this.voucherNumberRuleList.length) {
                                      this.toast.showDanger('No available voucher number rule for this merchant & sku, please go to merchant to create one');
                                      this.vnrErrorMessage = `No available voucher number rule for this merchant & sku, <a href="/merchants/details?merchantId=${this.selectedMerchant?.merchantId}">go to merchant</a> to create one`;
                                    }
                                  },
                                  error: () => {
                                    this.toast.showDanger('Error loading voucher number rule list. Please try again later.');
                                  }
                                })
                              } else {
                                this.toast.showDanger('Error loading program details. Please try again later.')
                              }
                            }
                          },
                          () => {
                            this.toast.showDanger('Error loading program details. Please try again later.')
                          }
                        );
                      },
                      () => {
                        this.toast.showDanger('Error loading merchant & sku details. Please try again later.')
                      }
                    )
                  });
              }
            } else {
              this.isMonoMerchant = false;
              this._merchantService.getMerchantByGroupId(this.selectedSKU.merchantGroupId).pipe(
                takeUntil(this.destroyed$)
              ).subscribe(res => {
                this.selectedMerchant = JSON.parse(res.data).merchants.items[0];
                this._programService.getProgramById(this.selectedMerchant.programId).pipe(
                  takeUntil(this.destroyed$)
                ).subscribe(
                  res => {
                    this.merchantProgram = JSON.parse(res.data).programs.items[0];
                    if (this.selectedSKU) {
                      if (this.merchantProgram) {
                        this._voucherNumberRuleService.getSpecificVoucherNumberRule(this.selectedMerchant.merchantId, this.selectedSKU?.voucherNumberRule.voucherNumberRuleId).subscribe({
                          next: res => {
                            this.voucherNumberRuleList = res ?? [];
                          },
                          error: () => {
                            this.toast.showDanger('Error loading voucher number rule list. Please try again later.');
                          }
                        })
                      } else {
                        this.toast.showDanger('Error loading program details. Please try again later.')
                      }
                    }
                  },
                  () => {
                    this.toast.showDanger('Error loading program details. Please try again later.')
                  }
                );
                this._acceptanceLoopService.getAcceptanceLoopsAggregationByMerchantGroupId(this.selectedSKU?.merchantGroupId as number).pipe(
                  takeUntil(this.destroyed$)
                ).subscribe(
                  res => {
                    if (res.success) {
                      let ac: GraphqlCollectionSegment<GroupAcceptanceLoop> = JSON.parse(res.data).acceptanceLoopsAggregation;
                      ac.items?.forEach(x => {
                        // setting for merchant expansion
                        x.isExpanded = false;
                        x.merchantsDisplay = x.merchantAggregation.slice(0, 5);
                        // special handling for default acceptance loop
                        if (x.isDefault) {
                          x.merchantAggregation.forEach(y => {
                            y.availableShopCount = y.merchantActiveShopCount;
                          });
                        }
                      });
                      this.acceptanceLoopList = ac.items ?? [];
                      this._acceptanceLoopService.getMerchantShop(merchantId).pipe(
                        takeUntil(this.destroyed$)
                      ).subscribe((res) => {
                        if (res.success) {
                          this.shopCount = res.data.totalCount;
                        }
                      });
                      if (!this.acceptanceLoopList.length) {
                        this.acceptanceLoopErrorMessage = `No available acceptance loop for this merchant, please <a href="/merchants/details?merchantId=${merchantId}">go to merchant</a> to create one`;
                      }
                    }
                  });
              });
            }
          },
          () => {
            this.toast.showDanger('Error loading merchant & sku details. Please try again later.')
          },
          () => {
            this.isLoading$.next(false);
          });
      });
    });
    if (this.selectedTenant === 'GL') {
      this._dictionaryService.getDictionaryItemsByCategory('VoucherIssuer').pipe(
        takeUntil(this.destroyed$)
      ).subscribe(
        res => {
          this.merchantAcquirers = JSON.parse(res.data).dictionaries;
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  OnMerchantChanged($event: { merchant: Merchant, sku: SKU, skuList: SKU[], acceptanceLoopList: AcceptanceLoop[], vrnList: VoucherNumberRule[], program: IProgram, shopCount: number, programGeneratedByChanged: boolean }) {
    this.selectedMerchant = $event.merchant;
    this.selectedSKU = $event.sku;
    this.voucherNumberRuleList = $event.vrnList;
    this.acceptanceLoopList = $event.acceptanceLoopList;
    this.merchantProgram = $event.program;
    this.skuList = $event.skuList;
    this.shopCount = $event.shopCount;
  }

  navigateBackToProductDetails() {
    this._router.navigateByUrl(`products/${this.product.productId}`);
  }

  saveEditedDetails() {
    this.actionLoading$.next(true);
    const body: any = new ProductWizardStepOne(this.detailsFormGroup.getRawValue());
    body.productId = this.product.productId;
    body.lastUpdatedBy = this.authService.userName;
    body.description = body.productDescription;

    // Fix 32735: dont overwrite multipleSelectionType
    if (this.selectedTenant !== 'TW') {
      body.multipleSelectionType = this.product.multipleSelectionType;
    }

    this._productSvc.updateProduct(body).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(res => {
      if (res.success) {
        this._productSvc.getProduct(this.product.productId, true, body);
        this._router.navigate([`/products/${this.product.productId}`], {
          state: {
            action: this.PRODUCT_UPDATED_ACTION,
            panel: this.PRODUCT_DETAILS_PANEL,
            message: `${this.product.productName} updated successfully`
          }
        });
      } else {
        this.toast.showDanger(res.message);
      }
    }, (err) => {
      this.toast.showDanger(err.message ?? err.error.message);
    }, () => {
      this.actionLoading$.next(false);
    });
  }
}
