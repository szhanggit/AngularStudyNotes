import {
  Component,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PRODUCT_CONSTANTS } from '../../constants/product-constants';
import {
  AcceptanceLoop,
  GroupAcceptanceLoop,
} from '../../models/acceptance-loop.model';
import { IDefineFormGroup } from '../../models/define-form-group.model';
import { ExternalProperty } from '../../models/external-property';
import { ExpirationPolicy } from '../../models/product-expiration-policy.model';
import {
  DynamicFaceValueTemplateFormGroup,
  GeneralProductTemplateFormGroup,
} from '../../models/product-form-group/product-template-form-group.model';
import { ProductPrice } from '../../models/product-price.model';
import { ProductRestrictionModel } from '../../models/product-restriction.model';
import { ProductType } from '../../models/product-type.model';
import {
  ProductCondition,
  TagValue,
} from '../../models/product-wizard-dto.model';
import { Product } from '../../models/product.model';
import { IProgram } from '../../models/program.model';
import { TemplateTag } from '../../models/template-tag.model';
import { VoucherNumberRule } from '../../models/voucher-number-rule.model';
import { AcceptanceLoopService } from '../../services/acceptance-loop.service';
import { BrandService } from '../../services/brand.service';
import { DictionaryService } from '../../services/dictionary.service';
import { MediaService } from '../../services/media.service';
import { MerchantService } from '../../services/merchant.service';
import { ProductCustomizationService } from '../../services/product-customization.service';
import { ProductService } from '../../services/product.service';
import { SkuService } from '../../services/sku.service';
import { TemplateService } from '../../services/template.service';
import { VoucherNumberRuleService } from '../../services/voucher-number-rule.service';
import { TemplatePreviewComponent } from '../create-product/product-template/template-preview/template-preview.component';
import { Template } from '../../models/template.model';
import {
  NgbdToastGlobal,
  TxcDateTimeService,
} from '@txc-angular/component-library';
import {
  Subject,
  takeUntil,
  BehaviorSubject,
  switchMap,
  of,
  map,
  forkJoin,
  catchError,
  EMPTY,
} from 'rxjs';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { ProductTypeEnum } from '../../enums/product-type.enum';
import { Media } from '../../models/media.model';
import { Dictionary } from '../../models/dictionary.model';
import { BannerImageSetting } from '../../models/bannerimage-setting.model';
import { ProgramService } from '../../services/program.service';
import { GraphqlCollectionSegment } from '../../models/graphql-collection-segment.model';
import { MathService } from '../../services/math.service';
import { ReverseLimit } from '../../models/reverselimit.model';
import { TenantConfigService } from '../../services/tenant-config.service';
import { TimezoneService } from '../../services/timezone.service';
import { ContractSKUCosts } from '../../models/sku.model';
import { TagType } from '../../models/product-template.model';

@Component({
  selector: 'app-main-product-details',
  templateUrl: './main-product-details.component.html',
  styleUrls: ['./main-product-details.component.scss'],
})
export class MainProductDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('returnToListModal') returnToListModal!: TemplateRef<NgbModal>;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  productDetailsLoading$ = new BehaviorSubject<boolean>(true);
  productPricingLoading$ = new BehaviorSubject<boolean>(true);
  productTemplateLoading$ = new BehaviorSubject<boolean>(true);
  productAdvanceSettingsLoading$ = new BehaviorSubject<boolean>(true);

  PRODUCT_TEMPLATE_PANEL = 'productTemplate';
  PRODUCT_UPDATED_ACTION = 'productUpdated';
  PRODUCT_DETAILS_PANEL = 'productDetails';
  PRODUCT_PRICING_PANEL = 'productPricing';
  PRODUCT_ADVANCE_PANEL = 'productAdvance';

  componentDestroyed$: Subject<boolean> = new Subject();
  product!: Product;
  productPrice!: ProductPrice;
  selectedTenant: string = 'TW';
  selectedType!: ProductType;

  productDetailsCollapsed = false;
  pricingContractExpiryCollapsed = false;
  productTemplateImageCollapsed = false;
  advanceSettingsCollapsed = true;

  availableMerchantShowAll = false;

  // selectedExpirySchemes: ExpiryScheme[] = [];
  selectedExpirySchemes: ExpirationPolicy[] = [];
  productConditionData!: ProductCondition;
  productRestrictionData!: ProductRestrictionModel;
  currentExternalProperties: ExternalProperty[] = [];
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
  merchantProgram: IProgram = {
    isEdenred: true,
    name: '',
    displayName: '',
    id: 999,
  };

  walletImageData: any;

  productTemplateType = {
    VoucherDesign: 1,
    SMSDesign: 2,
  };
  productTemplateData: any = [];
  emailTemplateTags: TemplateTag[] = [];
  smsTemplateTags: TemplateTag[] = [];
  expiryCountStart = 0;
  expiryCountEnd = 10;

  templateFormGroup!: FormGroup;
  templateFormGroupDefinitions: IDefineFormGroup[] = [
    new GeneralProductTemplateFormGroup(),
    new DynamicFaceValueTemplateFormGroup(),
  ];
  templateFormGroupDefinition!: IDefineFormGroup | undefined;
  reminders: Dictionary[] = [];
  reversalLimits: ReverseLimit[] = [];
  bannerSettingsDFV!: BannerImageSetting;
  ProductType = ProductTypeEnum;
  isEmailTemplateNew!: boolean;
  isSMSTemplateNew!: boolean;
  fixExpiryDate!: string | undefined;
  private isModalOpen: boolean = false;

  applyToOrderValue = 25;
  get showApplyToOrder() {
    return environment.applyTemplateFeature;
  }

  public getTemplateListFormGroup(index: number): FormGroup {
    const productTemplateList = <FormArray>(
      this.templateFormGroup.controls['productTemplateList']
    );
    return <FormGroup>productTemplateList.controls[index];
  }

  get isProductEditor(): boolean {
    return this._authLibService.getElementOperationFlag([
      environment.product_create_op_id,
    ]);
  }

  templateList: Template[] = [];
  selectedEmailTemplate!: Template | undefined;
  selectedSMSTemplate!: Template | undefined;
  templateType: number = 0;

  showAllExpiryScheme: boolean = false;
  selectedAcceptanceLoopId!: number;
  userLocalTodayDate: Date = new Date();
  todayDate: Date = new Date(this.userLocalTodayDate);
  startDate = new Date(
    this.todayDate.getFullYear(),
    this.todayDate.getMonth(),
    this.todayDate.getDate(),
    23,
    59
  );
  minDate = new Date(
    this.todayDate.getFullYear(),
    this.todayDate.getMonth(),
    this.todayDate.getDate()
  );
  modelStopIssueTime!: Date | null;
  selectedTenantUTC!: string;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private readonly _productService: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _modalService: NgbModal,
    private readonly _skuService: SkuService,
    private readonly _acceptanceLoopService: AcceptanceLoopService,
    private readonly _voucherNumberRuleService: VoucherNumberRuleService,
    private readonly _merchantService: MerchantService,
    private readonly _programService: ProgramService,
    private readonly _dictionaryService: DictionaryService,
    private readonly templateService: TemplateService,
    private readonly brandService: BrandService,
    private readonly mediaService: MediaService,
    private readonly _formBuilder: FormBuilder,
    private readonly _authLibService: AuthorizationLibraryService,
    private readonly _mathService: MathService,
    private readonly tenantConfigService: TenantConfigService,
    private readonly timezoneService: TimezoneService,
    private txcDateTimeService: TxcDateTimeService,
    public productCustomizationService: ProductCustomizationService
  ) {
    this.selectedTenantUTC = tenantConfigService.fetchLocalTimeFromUTC();
    this.initTenantDateTime();
    _activatedRoute.params.subscribe(() => {
      if (this._router.getCurrentNavigation()?.extras?.state) {
        const routeData = JSON.parse(
          JSON.stringify(this._router.getCurrentNavigation()?.extras?.state)
        );
        if (routeData.action === this.PRODUCT_UPDATED_ACTION) {
          setTimeout(() => {
            switch (routeData.panel) {
              case this.PRODUCT_DETAILS_PANEL:
                this.productDetailsCollapsed = false;
                this.pricingContractExpiryCollapsed = true;
                this.productTemplateImageCollapsed = true;
                this.advanceSettingsCollapsed = true;
                break;
              case this.PRODUCT_PRICING_PANEL:
                this.productDetailsCollapsed = true;
                this.pricingContractExpiryCollapsed = false;
                this.productTemplateImageCollapsed = true;
                this.advanceSettingsCollapsed = true;
                break;
              case this.PRODUCT_TEMPLATE_PANEL:
                this.productDetailsCollapsed = true;
                this.pricingContractExpiryCollapsed = true;
                this.productTemplateImageCollapsed = false;
                this.advanceSettingsCollapsed = true;
                break;
              case this.PRODUCT_ADVANCE_PANEL:
                this.productDetailsCollapsed = true;
                this.pricingContractExpiryCollapsed = true;
                this.productTemplateImageCollapsed = true;
                this.advanceSettingsCollapsed = false;
                break;
              default:
                this.productDetailsCollapsed = false;
                this.pricingContractExpiryCollapsed = false;
                this.productTemplateImageCollapsed = false;
                this.advanceSettingsCollapsed = true;
                break;
            }
            this.toast.showSuccess(routeData.message);
          }, 500);
        }
      }
    });
  }

  private initTenantDateTime() {
    this.userLocalTodayDate = new Date();
    this.todayDate = this.timezoneService.shiftDateTimeByUtcOffset(
      this.userLocalTodayDate,
      this.selectedTenantUTC
    );
    this.startDate = new Date(
      this.todayDate.getUTCFullYear(),
      this.todayDate.getUTCMonth(),
      this.todayDate.getUTCDate(),
      23,
      59,
      59
    );
    this.minDate = new Date(this.startDate);
  }

  get stopIssueTimeColor() {
    const currentDate = new Date(Date.now());
    const productStopIssueTime = new Date(this.product.stopIssueTime as string);

    return productStopIssueTime > currentDate;
  }

  get stopIssueTime() {
    if (this.product.stopIssueTime == '0001-01-01T00:00:00') {
      return '';
    } else {
      return this.product.stopIssueTime;
    }
  }

  updateStopIssueTime() {
    if (!this.modelStopIssueTime) {
      this.toast?.showDanger('Please enter valid stop issue time');
      return;
    }
    // convert the UI displayed time to match the tenant (BU) time
    const userLocalOffset = this.userLocalTodayDate.getTimezoneOffset();
    const tenantOffset = this.timezoneService.getUtcOffsetInMinutes(
      this.selectedTenantUTC
    );
    const inputIssueTime = this.timezoneService.shiftDateTimeByTimezoneOffset(
      this.modelStopIssueTime,
      tenantOffset,
      userLocalOffset
    );
    if (!inputIssueTime) {
      this.toast?.showDanger(
        'Timezone conversion error. Please enter valid stop issue time'
      );
      return;
    }

    const currentDate = new Date();
    if (inputIssueTime.getTime() >= currentDate.getTime()) {
      // send UTC time to API
      const date = inputIssueTime.toISOString();
      const formData: any = new FormData();
      formData.append('ProductId', this.product.productId);
      formData.append('CanIssue', false);
      formData.append('StopIssueTime', date);
      this._productService
        .setStopIssueTime(formData)
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(
          (res: any) => {
            if (res.success) {
              this.product.stopIssueTime =
                this.txcDateTimeService.getLocalDateTime(`${date}`);
              this.toast?.showSuccess('Set stop issue time successful!');
            } else {
              this.toast?.showDanger('Error while setting stop issue time.');
            }
            this._productService.refresh();
          },
          (err) => {
            this.toast?.showDanger(`Error : ${err.error.message}`);
            this.modelStopIssueTime = null;
          }
        );
    } else {
      this.toast?.showDanger(
        'Selected date should be greater or equal to current date.'
      );
      this.modelStopIssueTime = null;
    }
  }

  clearStopIssueTimeInput() {
    this.modelStopIssueTime = null;
  }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }
    this._activatedRoute.params.subscribe((params: any) => {
      this._productService.selectProduct(parseInt(params.id));
      this._productService.selectedProduct$
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(
          (product) => {
            if (!product) {
              this._productService.getProduct(parseInt(params.id));
              return;
            }

            this.product = product;
            // convert stop issue time to tenant time
            this.product.stopIssueTime = this.stopIssueTime
              ? this.txcDateTimeService.getLocalDateTime(
                  `${this.product?.stopIssueTime}`
                )
              : '';
            this.selectedAcceptanceLoopId = this.product.acceptanceLoopId!;
            this.brandService
              .getBrandsByBrandID(this.product?.brandId!)
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe((res) => {
                let brandsArray = JSON.parse(res.data);
                brandsArray?.brands?.items.length
                  ? (this.product.brandName =
                      brandsArray?.brands?.items[0].brandName)
                  : (this.product.brandName = '');
              });
            this.selectedType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find(
              (productType) => productType.key === this.product?.productType
            ) as ProductType;
            // get merchant id by acl id
            if (this.product.acceptanceLoopId) {
              this._acceptanceLoopService
                .getAcceptanceLoopById(this.product.acceptanceLoopId)
                .pipe(takeUntil(this.componentDestroyed$))
                .subscribe((res) => {
                  this.merchantId = JSON.parse(
                    res.data
                  ).acceptanceLoops.items[0].acceptanceLoopMerchant[0].merchantId;
                  // get sku data
                  this._skuService
                    .getSKUbySKUId(this.product?.skuId!)
                    .pipe(takeUntil(this.componentDestroyed$))
                    .subscribe(
                      (res) => {
                        let skuData = JSON.parse(res.data);
                        this.merchantSKUData =
                          skuData?.contractSKUDetails?.items[0];
                        if (this.merchantSKUData) {
                          this.setCalculatedPriceValue();
                          if (this.merchantSKUData.merchantGroupId) {
                            this.isMonoMerchant = false;
                            this._merchantService
                              .getMerchantByGroupId(
                                this.merchantSKUData.merchantGroupId
                              )
                              .pipe(takeUntil(this.componentDestroyed$))
                              .subscribe((res) => {
                                this.merchantDetails = JSON.parse(
                                  res.data
                                ).merchants.items[0];
                                this.merchantId =
                                  this.merchantDetails.merchantId;
                                this._programService
                                  .getProgramById(
                                    this.merchantDetails.programId
                                  )
                                  .pipe(takeUntil(this.componentDestroyed$))
                                  .subscribe(
                                    (res) => {
                                      this.merchantProgram = JSON.parse(
                                        res.data
                                      ).programs.items[0];
                                      if (this.merchantProgram) {
                                        this._voucherNumberRuleService
                                          .getSpecificVoucherNumberRule(
                                            this.merchantId,
                                            this.merchantSKUData
                                              ?.voucherNumberRule
                                              .voucherNumberRuleId
                                          )
                                          .subscribe({
                                            next: (res) => {
                                              this.voucherNumberRuleList =
                                                res ?? [];
                                            },
                                            error: () => {
                                              this.toast.showDanger(
                                                'Error loading voucher number rule list. Please try again later.'
                                              );
                                            },
                                          });
                                      } else {
                                        this.toast.showDanger(
                                          'Error loading program details. Please try again later.'
                                        );
                                      }
                                    },
                                    () => {
                                      this.toast.showDanger(
                                        'Error loading program details. Please try again later.'
                                      );
                                    }
                                  );
                                this._acceptanceLoopService
                                  .getAcceptanceLoopsAggregationByMerchantGroupId(
                                    this.merchantSKUData.merchantGroupId
                                  )
                                  .pipe(takeUntil(this.componentDestroyed$))
                                  .subscribe((res) => {
                                    if (res.success) {
                                      let ac: GraphqlCollectionSegment<GroupAcceptanceLoop> =
                                        JSON.parse(
                                          res.data
                                        ).acceptanceLoopsAggregation;
                                      ac.items?.forEach((x) => {
                                        // setting for merchant expansion
                                        x.isExpanded = false;
                                        x.merchantsDisplay =
                                          x.merchantAggregation.slice(0, 5);
                                        // special handling for default acceptance loop
                                        if (x.isDefault) {
                                          x.merchantAggregation.forEach((y) => {
                                            y.availableShopCount =
                                              y.merchantActiveShopCount;
                                          });
                                        }
                                      });
                                      this.acceptanceLoopList = ac.items ?? [];
                                      this._acceptanceLoopService
                                        .getMerchantShop(this.merchantId)
                                        .pipe(
                                          takeUntil(this.componentDestroyed$)
                                        )
                                        .subscribe((res) => {
                                          if (res.success) {
                                            this.shopCount =
                                              res.data.totalCount;
                                          }
                                        });
                                      if (!this.acceptanceLoopList.length) {
                                        this.acceptanceLoopErrorMessage = `No available acceptance loop for this merchant, please <a href="/merchants/details?merchantId=${this.merchantId}">go to merchant</a> to create one`;
                                      }
                                    }
                                  });
                              });
                          } else {
                            this.isMonoMerchant = true;
                            const filteredContractSKUCost =
                              this.merchantSKUData?.contractSKUCosts.filter(
                                (contractSkuCost: ContractSKUCosts) =>
                                  contractSkuCost.skuCostContract.merchantId ===
                                  this.merchantId
                              );
                            if (filteredContractSKUCost) {
                              this.merchantSKUData!.contractSKUCosts =
                                filteredContractSKUCost;
                            }
                            this._merchantService
                              .getMerchantById(this.merchantId, true)
                              .pipe(takeUntil(this.componentDestroyed$))
                              .subscribe((res) => {
                                this.merchantDetails =
                                  res.data.merchantDetails[0];
                                this._programService
                                  .getProgramById(
                                    this.merchantDetails.programId
                                  )
                                  .pipe(takeUntil(this.componentDestroyed$))
                                  .subscribe(
                                    (res) => {
                                      this.merchantProgram = JSON.parse(
                                        res.data
                                      ).programs.items[0];
                                      if (this.merchantProgram) {
                                        this._voucherNumberRuleService
                                          .getSpecificVoucherNumberRule(
                                            this.merchantId,
                                            this.merchantSKUData
                                              ?.voucherNumberRule
                                              .voucherNumberRuleId
                                          )
                                          .subscribe({
                                            next: (res) => {
                                              this.voucherNumberRuleList =
                                                res ?? [];
                                            },
                                            error: () => {
                                              this.toast.showDanger(
                                                'Error loading voucher number rule list. Please try again later.'
                                              );
                                            },
                                          });
                                      } else {
                                        this.toast.showDanger(
                                          'Error loading program details. Please try again later.'
                                        );
                                      }
                                    },
                                    () => {
                                      this.toast.showDanger(
                                        'Error loading program details. Please try again later.'
                                      );
                                    }
                                  );
                                this._acceptanceLoopService
                                  .getMonoAcceptanceLoopByMerchantIdAndAcceptanceLoopId(
                                    this.merchantId,
                                    this.product.acceptanceLoopId!
                                  )
                                  .pipe(takeUntil(this.componentDestroyed$))
                                  .subscribe((res) => {
                                    if (res.success) {
                                      this.acceptanceLoopList = JSON.parse(
                                        res.data
                                      ).monoAcceptanceLoopByMerchantId.items;
                                      this._acceptanceLoopService
                                        .getMerchantShop(this.merchantId)
                                        .pipe(
                                          takeUntil(this.componentDestroyed$)
                                        )
                                        .subscribe((res) => {
                                          if (res.success) {
                                            this.shopCount =
                                              res.data.totalCount;
                                          }
                                        });
                                      if (!this.acceptanceLoopList.length) {
                                        this.acceptanceLoopErrorMessage = `No available acceptance loop for this merchant, please <a href="/merchants/details?merchantId=${this.merchantId}">go to merchant</a> to create one`;
                                      }
                                    }
                                  });
                              });
                          }
                        } else {
                          this.acceptanceLoopErrorMessage =
                            'No available acceptance loop for this merchant';
                          this.vnrErrorMessage =
                            'No available voucher number rule for this merchant';
                        }
                      },
                      () => {
                        this.toast.showDanger(
                          'Error loading SKU details. Please try again later.'
                        );
                      },
                      () => {
                        this.productDetailsLoading$.next(false);
                      }
                    );
                });
            }

            this.productDetailsLoading$.next(false);
            let pricingLoadingDetailsCount = 2;
            // Product Price API Fetch
            this._productService
              .getProductPrice(params.id)
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe(
                (res) => {
                  this.productPrice = res.data;
                  this.setCalculatedPriceValue();
                },
                () => {
                  this.toast.showDanger(
                    'Error loading pricing details. Please try again later.'
                  );
                },
                () => {
                  pricingLoadingDetailsCount--;

                  if (!pricingLoadingDetailsCount) {
                    this.productPricingLoading$.next(false);
                  }

                  // Product Expiration Policy API Fetch
                  this._productService
                    .getProductExpirationPolicy(params.id)
                    .pipe(takeUntil(this.componentDestroyed$))
                    .subscribe(
                      (res) => {
                        this.fixExpiryDate = res.data.fixedExpiryDate;

                        let inUseExpirationSchemes =
                          res.data.expirationPolicyList.filter(
                            (scheme) => scheme.inUse == 1
                          );
                        this.selectedExpirySchemes =
                          inUseExpirationSchemes.sort(
                            (current, next) =>
                              current.typeName.length - next.typeName.length
                          );
                        this.selectedExpirySchemes.length > 10
                          ? (this.showAllExpiryScheme = true)
                          : (this.showAllExpiryScheme = false);
                      },
                      () => {
                        this.toast.showDanger(
                          'Error loading expiration policies. Please try again later.'
                        );
                      },
                      () => {
                        pricingLoadingDetailsCount--;

                        if (!pricingLoadingDetailsCount) {
                          this.productPricingLoading$.next(false);
                        }
                        this.templateFormGroupDefinition =
                          this.templateFormGroupDefinitions.find((f) =>
                            f.productTypes?.includes(this.selectedType.key)
                          ) ?? undefined;
                        if (this.templateFormGroupDefinition) {
                          let templateInfoLoadingDetailsCount = 4;
                          this.templateFormGroup =
                            this.templateFormGroupDefinition.define(
                              this._formBuilder,
                              false
                            );
                          // Product Template API Fetch For Voucher
                          this._productService
                            .getProductTemplate(
                              params.id,
                              this.productTemplateType.VoucherDesign
                            )
                            .pipe(takeUntil(this.componentDestroyed$))
                            .subscribe(
                              (res) => {
                                if (res.success) {
                                  this.productTemplateData.VoucherDesign =
                                    res.data.productTemplate[0];
                                  this.getTemplateListFormGroup(0).patchValue(
                                    this.productTemplateData?.VoucherDesign
                                      ?.productTemplateVersion[0]
                                  );
                                  const defaultVersion =
                                    this.productTemplateData.VoucherDesign?.productTemplateVersion.find(
                                      (ptv: Template) =>
                                        ptv.languageId ===
                                        this.productTemplateData.VoucherDesign
                                          .defaultLanguageId
                                    );
                                  this.getContentTags(
                                    defaultVersion ??
                                      this.productTemplateData.VoucherDesign
                                        ?.productTemplateVersion[0],
                                    this.productTemplateType.VoucherDesign
                                  );
                                  this.getCurrentVersion(1);
                                }
                              },
                              () => {
                                this.toast.showDanger(
                                  'Error loading voucher design template. Please try again later.'
                                );
                              },
                              () => {
                                templateInfoLoadingDetailsCount--;

                                if (!templateInfoLoadingDetailsCount) {
                                  this.productTemplateLoading$.next(false);
                                }

                                // Product Template API Fetch For SMS
                                this._productService
                                  .getProductTemplate(
                                    params.id,
                                    this.productTemplateType.SMSDesign
                                  )
                                  .pipe(takeUntil(this.componentDestroyed$))
                                  .subscribe(
                                    (res) => {
                                      if (res.success) {
                                        this.productTemplateData.SMSDesign =
                                          res.data.productTemplate[0];
                                        this.getTemplateListFormGroup(
                                          1
                                        ).patchValue(
                                          this.productTemplateData?.SMSDesign
                                            ?.productTemplateVersion[0]
                                        );
                                        const defaultVersion =
                                          this.productTemplateData.SMSDesign?.productTemplateVersion.find(
                                            (ptv: Template) =>
                                              ptv.languageId ===
                                              this.productTemplateData.SMSDesign
                                                .defaultLanguageId
                                          );
                                        this.getContentTags(
                                          defaultVersion ??
                                            this.productTemplateData.SMSDesign
                                              ?.productTemplateVersion[0],
                                          this.productTemplateType.SMSDesign
                                        );
                                        this.getCurrentVersion(2);
                                      }
                                    },
                                    () => {
                                      this.toast.showDanger(
                                        'Error loading sms template. Please try again later.'
                                      );
                                    },
                                    () => {
                                      templateInfoLoadingDetailsCount--;

                                      if (!templateInfoLoadingDetailsCount) {
                                        this.productTemplateLoading$.next(
                                          false
                                        );
                                      }

                                      // Product wallet setting API Call
                                      this._productService
                                        .getProductWalletSetting(params.id)
                                        .pipe(
                                          takeUntil(this.componentDestroyed$)
                                        )
                                        .subscribe(
                                          (res) => {
                                            this.walletImageData = res.data;
                                            this.templateFormGroup.patchValue(
                                              this.walletImageData
                                            );
                                            if (
                                              this.walletImageData?.walletImage
                                            ) {
                                              this.mediaService
                                                .getMediaById(
                                                  this.walletImageData
                                                    .walletImage
                                                )
                                                .pipe(
                                                  takeUntil(
                                                    this.componentDestroyed$
                                                  )
                                                )
                                                .subscribe((res) => {
                                                  this.walletImageData.media =
                                                    JSON.parse(
                                                      res.data
                                                    )?.mediaById[0];
                                                });
                                            }
                                          },
                                          () => {
                                            this.toast.showDanger(
                                              'Error loading wallet settings. Please try again later.'
                                            );
                                          },
                                          () => {
                                            templateInfoLoadingDetailsCount--;

                                            if (
                                              !templateInfoLoadingDetailsCount
                                            ) {
                                              this.productTemplateLoading$.next(
                                                false
                                              );
                                            }

                                            // Banner image setting api call
                                            this._productService
                                              .getBannerImageSetting(params.id)
                                              .pipe(
                                                takeUntil(
                                                  this.componentDestroyed$
                                                )
                                              )
                                              .subscribe(
                                                (res) =>
                                                  (this.bannerSettingsDFV =
                                                    res.data),
                                                () => {
                                                  this.toast.showDanger(
                                                    'Error loading banner settings. Please try again later.'
                                                  );
                                                },
                                                () => {
                                                  templateInfoLoadingDetailsCount--;

                                                  if (
                                                    !templateInfoLoadingDetailsCount
                                                  ) {
                                                    this.productTemplateLoading$.next(
                                                      false
                                                    );
                                                  }
                                                }
                                              );
                                          }
                                        );
                                    }
                                  );
                              }
                            );
                        }
                      }
                    );
                }
              );

            let advanceSettingsDetailsLoadingCount = 3;
            // Product Condition API Fetch
            this._productService
              .getProductCondition(params.id)
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe(
                (res) => (this.productConditionData = res.data),
                () => {
                  this.toast.showDanger(
                    'Error loading product conditions. Please try again later.'
                  );
                },
                () => {
                  advanceSettingsDetailsLoadingCount--;

                  if (!advanceSettingsDetailsLoadingCount) {
                    this.productAdvanceSettingsLoading$.next(false);
                  }
                }
              );
            // Product Restriction API Fetch
            this._productService
              .getProductRestriction(params.id)
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe(
                (res) => (this.productRestrictionData = res.data),
                () => {
                  this.toast.showDanger(
                    'Error loading product restrictions. Please try again later.'
                  );
                },
                () => {
                  advanceSettingsDetailsLoadingCount--;

                  if (!advanceSettingsDetailsLoadingCount) {
                    this.productAdvanceSettingsLoading$.next(false);
                  }
                }
              );
            // Product External Property API Fetch
            this._productService
              .getProductExternalProperty(params.id)
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe(
                (res) => (this.currentExternalProperties = res.data),
                () => {
                  this.toast.showDanger(
                    'Error loading external properties. Please try again later.'
                  );
                },
                () => {
                  advanceSettingsDetailsLoadingCount--;

                  if (!advanceSettingsDetailsLoadingCount) {
                    this.productAdvanceSettingsLoading$.next(false);
                  }
                }
              );

            // Dictionary data api
            this._dictionaryService
              .getDictionaryItemsByCategory('ProductReminder')
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe(
                (res) => (this.reminders = JSON.parse(res.data).dictionaries)
              );
            this._productService
              .getProductReverseLimit()
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe(
                (res) =>
                  (this.reversalLimits = JSON.parse(
                    res.data
                  ).productReverseLimit?.items)
              );
          },
          () => {
            this.toast.showDanger(
              'Error loading product details. Please try again later.'
            );
            this.productDetailsLoading$.next(false);
          },
          () => {}
        );
    });
  }

  openModal(content: TemplateRef<NgbModal>): void {
    if (this.stopIssueTime) {
      this.modelStopIssueTime = new Date(this.stopIssueTime);
      this.startDate = new Date(this.stopIssueTime);
    }
    this._modalService.open(content, {
      size: 'sm',
      backdrop: 'static',
      centered: true,
    });
  }

  navigateToProductList() {
    this._router.navigateByUrl(`products`);
  }

  navigateToEditProductDetails() {
    this._router.navigateByUrl(
      `products/product/edit-details/${this.product.productId}`
    );
  }

  navigateToEditPricingExpiry() {
    this._router.navigate(
      [`products/product/edit-pricing/${this.product.productId}`],
      {
        queryParams: {
          productType: this.product.productType,
        },
      }
    );
  }

  navigateToEditProductTemplate() {
    this._router.navigateByUrl(
      `products/product/edit-template/${this.product.productId}`
    );
  }

  navigateToEditExternalProperties() {
    this._router.navigateByUrl(
      `products/product/edit-external-properties/${this.product.productId}`
    );
  }

  navigateToProductHistory() {
    this._router.navigateByUrl(
      `products/product/history/${this.product.productId}`
    );
  }

  ShowPreview(templateType: number, event: any): void {
    event.preventDefault();
    this.setTemplateData(templateType);
    this.getTemplate('preview', templateType);
  }

  ExportTemplate(templateType: number, event: any): void {
    event.preventDefault();
    this.setTemplateData(templateType);
    this.getTemplate('export', templateType);
  }

  getTemplateVersionId(
    templateType: number,
    defaultLanguageId: number
  ): number {
    let defaultLang;
    if (templateType === 1) {
      defaultLang =
        this.productTemplateData.VoucherDesign?.productTemplateVersion.find(
          (i: { languageId: number }) => i.languageId === defaultLanguageId
        ).templateVersionId;
    } else {
      defaultLang =
        this.productTemplateData.SMSDesign?.productTemplateVersion.find(
          (i: { languageId: number }) => i.languageId === defaultLanguageId
        ).templateVersionId;
    }

    return defaultLang;
  }

  setTemplateData(templateType: number): void {
    this.templateService.templateName =
      templateType === 1
        ? this.productTemplateData.VoucherDesign?.templateName
        : this.productTemplateData.SMSDesign?.templateName;
    this.templateType = templateType;
    this.templateService.type = templateType;
  }

  getTemplate(eventType: string, templateType: number): void {
    const defaultLangId =
      templateType === 1
        ? this.productTemplateData.VoucherDesign?.defaultLanguageId
        : this.productTemplateData.SMSDesign?.defaultLanguageId;
    const templateVersionID = this.getTemplateVersionId(
      templateType,
      defaultLangId
    );

    this.templateService
      .getTemplateByVersionId(templateVersionID)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((i) => {
        const template = JSON.parse(i.data).templateVersionInfo.items[0];
        if (template) {
          const templateTags =
            this.templateType === 1
              ? this.emailTemplateTags
              : this.smsTemplateTags;
          if (eventType === 'preview') {
            if (!this.isModalOpen) {
              this.isModalOpen = true;
              const modalRef = this._modalService.open(
                TemplatePreviewComponent,
                {
                  size: 'md',
                  backdrop: 'static',
                  centered: true,
                  keyboard: false,
                  modalDialogClass:
                    this.templateType === 1 ? 'table-centered' : '',
                }
              );
              modalRef.componentInstance.selectedTemplate = { ...template };
              modalRef.componentInstance.templateFormGroup =
                this.templateFormGroup;
              modalRef.componentInstance.templateTags = templateTags;
              modalRef.componentInstance.templateType = this.templateType;
              modalRef.componentInstance.index = this.templateType - 1;
              modalRef.componentInstance.applyTextToHtml();

              modalRef.closed
                .pipe(takeUntil(this.componentDestroyed$))
                .subscribe(() => {
                  this.isModalOpen = false;
                });
            }
          } else if (eventType === 'export') {
            const design =
              templateType === 1
                ? this.productTemplateData?.VoucherDesign
                : this.productTemplateData?.SMSDesign;

            const templateTagValue = design.productTemplateVersion.find(
              (templateVersion: Template) =>
                templateVersion.languageId === design.defaultLanguageId
            ).templateTagValue;

            this.applyTagValueAndExport(
              templateTagValue,
              templateTags,
              template
            );
          }
        } else {
          this.toast.showDanger(
            'Error loading template. Please try again later.'
          );
        }
      });
  }

  getCurrentVersion(templateType: number) {
    const defaultLangId =
      templateType === 1
        ? this.productTemplateData.VoucherDesign?.defaultLanguageId
        : this.productTemplateData.SMSDesign?.defaultLanguageId;
    const templateVersionID = this.getTemplateVersionId(
      templateType,
      defaultLangId
    );
    this.templateService
      .getTemplateByVersionId(templateVersionID)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((i) => {
        const template = JSON.parse(i.data).templateVersionInfo.items[0];
        if (templateType === 1) {
          this.isEmailTemplateNew = template.isCurrentVersion;
        } else {
          this.isSMSTemplateNew = template.isCurrentVersion;
        }
      });
  }

  getContentTags(ProductTemplate: Template, templateType: number): void {
    this.templateService
      .getTemplateTagsByVersionId(ProductTemplate.templateVersionId)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((res) => {
        const templateTags = JSON.parse(res.data).tagsByTemplateVersionId;
        if (templateType === 1) {
          this.emailTemplateTags = templateTags;
          this.getTemplateListFormGroup(0).controls['templateType'].setValue(
            templateType
          );
          this.getTemplateListFormGroup(0).controls['templateTags'].setValue(
            this.emailTemplateTags
          );
        } else {
          this.smsTemplateTags = templateTags;
          this.getTemplateListFormGroup(1).controls['templateType'].setValue(
            templateType
          );
          this.getTemplateListFormGroup(1).controls['templateTags'].setValue(
            this.smsTemplateTags
          );
        }
        for (let templateTag of templateTags) {
          const value = ProductTemplate?.templateTagValue!.find(
            (tagValue: any) => tagValue.tagId === templateTag.tagId
          )?.value;
          if (templateTag.type === 2 && value) {
            this.mediaService
              .getMediaById(Number.parseInt(value))
              .pipe(takeUntil(this.componentDestroyed$))
              .subscribe((res) => {
                const media: Media = JSON.parse(res.data).mediaById[0];
                this.getTemplateListFormGroup(templateType - 1).addControl(
                  templateTag.displayName,
                  new FormControl({
                    value: value,
                    disabled: templateTag.category === 4,
                  })
                );
              });
          } else {
            this.getTemplateListFormGroup(templateType - 1).addControl(
              templateTag.displayName,
              new FormControl({
                value: value,
                disabled: templateTag.category === 4,
              })
            );
          }
        }
      });
  }
  showAllExpiryCount() {
    if (this.showAllExpiryScheme) {
      this.expiryCountEnd = this.selectedExpirySchemes?.length;
    } else {
      this.expiryCountEnd = 10;
    }
    this.showAllExpiryScheme = !this.showAllExpiryScheme;
  }

  ngOnDestroy() {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }

  private setCalculatedPriceValue() {
    if (
      this.selectedType?.key === 2 &&
      this.productPrice &&
      this.merchantSKUData &&
      this.merchantSKUData.faceValueWithTax
    ) {
      this.productPrice.customerFeePrepaidWithTax =
        this._mathService.divideAndToPercentage(
          this.productPrice?.sellingPricePrepaidWithTax,
          this.merchantSKUData.faceValueWithTax,
          4
        ) ?? 0;
    }
  }

  private applyTagValueAndExport(
    templateTagValue: TagValue[],
    templateTags: TemplateTag[],
    template: Template
  ) {
    const getImageTagValues = templateTagValue
      .map((tagValue) => {
        return {
          ...templateTags.find((tag) => tagValue.tagId === tag.tagId),
          value: tagValue.value,
        };
      })
      .filter(
        (tag) =>
          tag.type === TagType.Image && !isNaN(Number.parseInt(tag.value))
      )
      .map((tag) => tag.value);

    const getRadioTagIds = templateTagValue
      .map((tagValue) => {
        return {
          ...templateTags.find((tag) => tagValue.tagId === tag.tagId),
          value: tagValue.value,
        };
      })
      .filter(
        (tag) =>
          tag.type === TagType.RadioGroup && !isNaN(Number.parseInt(tag.value))
      );

    const imageFork = getImageTagValues.map((imageTagValue) => {
      return this.mediaService
        .getMediaById(Number.parseInt(imageTagValue))
        .pipe(
          map((res) => {
            if (res.success) {
              const media: Media = JSON.parse(res.data).mediaById[0];
              templateTagValue.find((tagV) => tagV.value == imageTagValue)!.value =
                media.nodeUrl;
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
    });

    const radioFork = getRadioTagIds.map((tag) => {
      return this.templateService.getTagValuesByTagId(tag.tagId!).pipe(
        map((res) => {
          if (res.success) {
            const radioValues = JSON.parse(res.data).tagValueByTagId;
            const htmlValue = radioValues.find(
              (tv: { applyConditions: { applyConditionId: number }[] }) =>
                tv.applyConditions[0].applyConditionId ===
                Number.parseInt(tag.value)
            ).htmlValue;

            if (!htmlValue) return;

            templateTagValue.find((tagV) => tagV.tagId == tag.tagId)!.value =
              htmlValue;
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      );
    });

    of(templateTagValue)
      .pipe(
        switchMap(() => {
          return imageFork.length ? forkJoin(imageFork) : of({});
        }),
        switchMap(() => {
          return radioFork.length ? forkJoin(radioFork) : of({});
        })
      )
      .subscribe(() => {
        templateTagValue.forEach((tagValue: TagValue) => {
          for (let templateTag of templateTags) {
            if (tagValue.tagId === templateTag.tagId) {
              this.replaceText(templateTag, tagValue.value, template);
            }
          }
        });

        const templateToExport = new Blob([template.content1], {
          type: 'text/html',
        });
        saveAs(templateToExport, `${this.product.productCode}.html`);
      });
  }

  private replaceText(
    templateTag: { tagName: string },
    value: string,
    template: Template
  ) {
    const regex = new RegExp(templateTag.tagName, 'g');
    template.subject1 = template.subject1
      ? template.subject1.replace(regex, value)
      : '';
    template.subject2 = template.subject2
      ? template.subject2.replace(regex, value)
      : '';
    template.subject3 = template.subject3
      ? template.subject3.replace(regex, value)
      : '';
    template.content1 = template.content1
      ? template.content1.replace(regex, value)
      : '';
    template.content2 = template.content2
      ? template.content2.replace(regex, value)
      : '';
    template.content3 = template.content3
      ? template.content3.replace(regex, value)
      : '';
  }
}
