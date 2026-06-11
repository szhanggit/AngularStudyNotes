import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent, NgbdToastGlobal } from '@txc-angular/component-library';
import { PRODUCT_CONSTANTS } from '../../constants/product-constants';
import { ProductTypeEnum } from '../../enums/product-type.enum';
import { AcceptanceLoop, GroupAcceptanceLoop } from '../../models/acceptance-loop.model';
import { Brand } from '../../models/brand.model';
import { IDefineFormGroup } from '../../models/define-form-group.model';
import { Dictionary } from '../../models/dictionary.model';
import { ExternalProperty } from '../../models/external-property';
import { GraphqlCollectionSegment } from '../../models/graphql-collection-segment.model';
import { Media } from '../../models/media.model';
import { Merchant } from '../../models/merchant.model';
import { GeneralProductAdvanceSettingsFormGroup, ValueBasedAdvanceSettingsFormGroup } from '../../models/product-form-group/product-advance-settings-form-group.model';
import {
  GlobalProductDetailsFormGroup,
  GlobalRewardsProductDetailsFormGroup,
  IndiaProductDetailsFormGroup,
  SingaporeProductDetailsFormGroup,
  TaiwanProductDetailsFormGroup,
} from '../../models/product-form-group/product-details-form-group.model';

import {
  ProductBasedPricingFormGroup,
  ValueBasedPricingFormGroup,
  DynamicFaceValuePricingFormGroup,
  SmartBookletPricingFormGroup,
  SmartChoiceVoucherPricingFormGroup,
  SuperVoucherPricingFormGroup,
} from '../../models/product-form-group/product-pricing-form-group.model';

import {
  GeneralProductTemplateFormGroup,
  DynamicFaceValueTemplateFormGroup
} from '../../models/product-form-group/product-template-form-group.model';
import { TemplateType } from '../../models/product-template.model';

import { ProductType } from '../../models/product-type.model';
import { ProductTemplate, ProductWizardDto, ProductWizardStepFive, ProductWizardStepFour, ProductWizardStepOne, ProductWizardStepThree, ProductWizardStepTwo, TagValue } from '../../models/product-wizard-dto.model';
import { IProgram } from '../../models/program.model';
import { SKU } from '../../models/sku.model';
import { VoucherNumberRule } from '../../models/voucher-number-rule.model';
import { AcceptanceLoopService } from '../../services/acceptance-loop.service';
import { BrandService } from '../../services/brand.service';
import { DictionaryService } from '../../services/dictionary.service';
import { MediaService } from '../../services/media.service';
import { MerchantService } from '../../services/merchant.service';
import { ProductWizardService } from '../../services/product-wizard.service';
import { ProductService } from '../../services/product.service';
import { ProgramService } from '../../services/program.service';
import { SkuService } from '../../services/sku.service';
import { TemplateService } from '../../services/template.service';
import { VoucherNumberRuleService } from '../../services/voucher-number-rule.service';
import { ProductTemplateComponent } from './product-template/product-template.component';
import { BehaviorSubject, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { TemplateVersionTemplateTag } from '../../models/product-template/template-version-template-tag.model';
import { BaseResponse } from '../../models/base-response.model';
import { ProductApiService } from '../../services/product-api.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild(ProductTemplateComponent) productTemplate!: ProductTemplateComponent;

  detailFormGroupDefinitions: IDefineFormGroup[] = [
    new TaiwanProductDetailsFormGroup(),
    new GlobalProductDetailsFormGroup(),
    new IndiaProductDetailsFormGroup(),
    new SingaporeProductDetailsFormGroup(),
    new GlobalRewardsProductDetailsFormGroup()
  ];

  pricingFormGroupDefinition: IDefineFormGroup[] = [
    new ProductBasedPricingFormGroup(),
    new ValueBasedPricingFormGroup(),
    new SmartBookletPricingFormGroup(),
    new DynamicFaceValuePricingFormGroup(),
    new SmartChoiceVoucherPricingFormGroup(),
    new SuperVoucherPricingFormGroup(),
  ];

  templateFormGroupDefinitions: IDefineFormGroup[] = [
    new GeneralProductTemplateFormGroup(),
    new DynamicFaceValueTemplateFormGroup()
  ];

  advanceSettingsFormGroupDefinitions: IDefineFormGroup[] = [
    new GeneralProductAdvanceSettingsFormGroup(),
    new ValueBasedAdvanceSettingsFormGroup()
  ]

  selectedType: ProductType;
  step = 0;
  stepTitles = PRODUCT_CONSTANTS.PRODUCT_STEPS;
  selectedTenant!: string;
  selectedTenantUTC!: string;
  isMonoMerchant = true;
  selectedMerchantGroupId!: number;
  stepsReached: number[] = [];
  stepsWithIssue: number[] = [];

  // product wizard
  wizardKey!: string;
  isDraft = false;
  hasMerchant = false;
  merchant!: Merchant;

  private isFixedExpiryPolicySubject = new BehaviorSubject<boolean | null>(null);
  public isFixedExpiryPolicy$ = this.isFixedExpiryPolicySubject.asObservable();

  // duplicate
  productId!: number;

  // form
  detailsFormGroup!: FormGroup;
  brandList: Brand[] = [];
  selectedMerchant: Merchant | undefined = undefined;
  selectedSKU!: SKU;
  skuList: SKU[] = [];
  acceptanceLoopList: AcceptanceLoop[] = [];
  selectedAcceptanceLoop!: AcceptanceLoop;
  acceptanceLoopPage: number = 1;
  merchantProgram!: IProgram;
  voucherNumberRuleList: VoucherNumberRule[] = [];
  vnrErrorMessage!: string;
  shopCount: number = 0;

  merchantAcquirers: Dictionary[] = [];

  pricingFormGroup!: FormGroup;
  expirySchemeList!: number[];

  fixExpiryDate!: string | undefined;
  isFixedExpiryPolicy!: boolean;

  templateFormGroup!: FormGroup;
  emailVersionTemplateTags: TemplateVersionTemplateTag[] = [];
  smsVersionTemplateTags: TemplateVersionTemplateTag[] = [];
  voucherTemplateValues?: TagValue[] = [];
  smsTemplateValues?: TagValue[] = [];
  _productTemplateList: ProductTemplate[] = [];
  get productTemplateList(): ProductTemplate[] {
    return this._productTemplateList;
  }
  set productTemplateList(value: ProductTemplate[]) {
    this._productTemplateList = value;
  }

  advanceSettingsFormGroup!: FormGroup;
  externalProperties!: ExternalProperty[];

  currentExternalProperties: ExternalProperty[] = [];

  get detailsControls(): any {
    return this.detailsFormGroup.controls;
  }

  get masterVoucherKeys() {
    return PRODUCT_CONSTANTS.PRODUCT_TYPE_EXCEPTION;
  }

  // productTemplateListControl
  public getTemplateListFormGroup(index: number): FormGroup {
    const productTemplateList = <FormArray>this.templateFormGroup.controls['productTemplateList'];
    return <FormGroup>productTemplateList.controls[index];
  }

  // product types
  private _productTypes: ProductType[] = PRODUCT_CONSTANTS.PRODUCT_TYPE;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private router: Router,
    private readonly _formBuilder: FormBuilder,
    private readonly _route: ActivatedRoute,
    private readonly _productService: ProductService,
    public productWizardService: ProductWizardService,
    private readonly _skuService: SkuService,
    private readonly _merchantService: MerchantService,
    private readonly _acceptanceLoopService: AcceptanceLoopService,
    private readonly _programService: ProgramService,
    private readonly _voucherNumberRuleService: VoucherNumberRuleService,
    private readonly _brandService: BrandService,
    private readonly _mediaService: MediaService,
    private readonly _templateService: TemplateService,
    private readonly _modalSvc: NgbModal,
    private readonly _dictionaryService: DictionaryService,
    private readonly productApiService: ProductApiService,) {
    this.selectedType = { key: 0, value: '', isChild: false };

    const tenantFromLocalStorage = localStorage.getItem('tenant');

    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
      this.selectedTenantUTC = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    }

    const detailFormDefinition = this.detailFormGroupDefinitions.find(f => f.tenantCode === this.selectedTenant);
    if (detailFormDefinition) {
      this.detailsFormGroup = detailFormDefinition.define(this._formBuilder, false);
    }

    this.productId = Number.parseInt(this._route.snapshot.queryParamMap.get('productId') as string);
    const productTypePassedFromRoute = Number.parseInt(this._route.snapshot.queryParamMap.get('productType') as string);

    if (this.productId) {
      this.step = 5;
      this.selectedType = this._productTypes.find((productType: ProductType) => productType.key === productTypePassedFromRoute) as ProductType;
    }

    const isDraft = this._route.snapshot.queryParamMap.get('isDraft');
    const wizardKey = this._route.snapshot.queryParamMap.get('key');

    if (isDraft === 'true' && wizardKey) {
      this.isDraft = true;
      this.wizardKey = wizardKey;
      this.productWizardService.getProductWizard(wizardKey).pipe(takeUntil(this.destroyed$)).subscribe(
        res => {
          if (res.success) {
            const stepOne = (res.data as ProductWizardDto)?.productWizardStepOne;
            const stepThree: ProductWizardStepThree | undefined = (res.data as ProductWizardDto)?.productWizardStepThree;
            const stepFour: ProductWizardStepFour | undefined = (res.data as ProductWizardDto)?.productWizardStepFour;
            const stepFive: ProductWizardStepFive | undefined = (res.data as ProductWizardDto)?.productWizardStepFive;

            this.fixExpiryDate = stepThree?.fixExpiryDate;
            if(stepThree?.isFixedExpiryPolicy){
              this.isFixedExpiryPolicy = stepThree.isFixedExpiryPolicy;
            }

            if (stepOne) {
              this.hasMerchant = stepOne.skuId !== 0;
              this.detailsFormGroup.patchValue(stepOne);
              // skip step zero
              this.selectedType = this._productTypes.find((productType: ProductType) => productType.key === stepOne?.productType) as ProductType;
              if (!this.selectedType) {
                this.selectedType = {
                  key: 0,
                  value: 'INVALID'
                }
              } else {
                this.next(false, true);

                // skip the following requests if it's master product
                if (this.isMasterProduct(this.selectedType.key)) {
                  return;
                }

                if (stepOne.productIssuer === 2) {
                  this._merchantService.getMerchantById(stepOne.issueMerchant).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                    this.detailsFormGroup.patchValue({ resellerMerchantName: res.data.merchantDetails[0] });
                  });
                }

                this._brandService.getAllBrands().pipe(
                  takeUntil(this.destroyed$)
                ).subscribe(
                  res => {
                    this.brandList = JSON.parse(res.data).brands.items;
                  },
                  () => {
                    this.toast.showDanger('Error in loading brands. Please try again later');
                  }
                );
        
                if (stepOne.brandId) {
                  let selectedBrand: Brand;
                  this._brandService.getBrandsByBrandID(stepOne.brandId).pipe(
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
                
                if (!this.hasMerchant) return;

                this._skuService.getSKUbySKUId(stepOne.skuId).pipe(takeUntil(this.destroyed$)).subscribe(
                  res => {
                    const contractSKUDetails = JSON.parse(res.data).contractSKUDetails.items[0];
                    this.selectedSKU = contractSKUDetails;
                    this.detailsFormGroup.controls['skuName'].setValue(this.selectedSKU);
                    const merchantId = contractSKUDetails?.contractSKUCosts[0].skuCostContract.merchantId;
                    this.detailsFormGroup.controls['merchantId'].setValue(merchantId);
                    if (stepOne?.productType) {
                      this._skuService.getSKUbyMerchantId(merchantId, stepOne?.productType).pipe(takeUntil(this.destroyed$)).subscribe(
                        res => {
                          if (res.success) {
                            this.skuList = JSON.parse(res.data).contractSkuByMerchantId.items ?? [];
                            this.detailsFormGroup.controls['skuId'].enable();

                            if (this.selectedSKU.voucherNumberRule) {
                              this.detailsFormGroup.controls['vnrId'].setValue(this.selectedSKU.voucherNumberRule.voucherNumberRuleId);
                            }
                            if (!this.skuList.length) {
                              this.toast.showDanger('No available sku for this merchant, please go to merchant to create one');
                              this.detailsFormGroup.controls['skuId'].disable();
                            }
                          }
                        },
                        () => {
                          this.toast.showDanger('Error loading available SKUs. Please try again later.');
                        }
                      );
                    }

                    if (this.selectedSKU.merchantGroupId) {
                      this.isMonoMerchant = false;
                      this.selectedMerchantGroupId = this.selectedSKU.merchantGroupId;
                      this._merchantService.getMerchantByGroupId(this.selectedSKU.merchantGroupId).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                        this.selectedMerchant = JSON.parse(res.data).merchants.items[0];
                        this._programService.getProgramById(this.selectedMerchant?.programId as number).pipe(takeUntil(this.destroyed$)).subscribe(
                          res => {
                            this.merchantProgram = JSON.parse(res.data).programs.items[0];
                            if (this.merchantProgram) {
                              this._voucherNumberRuleService
                                .getSpecificVoucherNumberRule(
                                  this.selectedMerchant?.merchantId,
                                  this.selectedSKU?.voucherNumberRule
                                    .voucherNumberRuleId
                                )
                                .pipe(takeUntil(this.destroyed$))
                                .subscribe({
                                  next: (res) => {
                                    this.voucherNumberRuleList = res ?? [];
                                  },
                                  error: () =>
                                    this.toast.showDanger(
                                      'Error loading voucher number rule list. Please try again later.'
                                    ),
                                });
                            } else {
                              this.toast.showDanger('Error loading program details. Please try again later.')
                            }
                          },
                          () => {
                            this.toast.showDanger('Error loading program details. Please try again later.')
                          }
                        );
                        this._acceptanceLoopService.getAcceptanceLoopsAggregationByMerchantGroupId(this.selectedSKU?.merchantGroupId as number).pipe(takeUntil(this.destroyed$)).subscribe(
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
                              this._acceptanceLoopService.getMerchantShop(merchantId).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                                if (res.success) {
                                  this.shopCount = res.data.totalCount;
                                }
                              });
                            }
                          });
                      })
                    } else {
                      this.isMonoMerchant = true;
                      this._merchantService.getMerchantById(merchantId).pipe(takeUntil(this.destroyed$)).subscribe(
                        res => {
                          this.selectedMerchant = res.data.merchantDetails[0];
                          this._acceptanceLoopService.getMonoAcceptanceLoopByMerchantId(merchantId).pipe(takeUntil(this.destroyed$)).subscribe(
                            res => {
                              if (res.success) {
                                this.acceptanceLoopList = JSON.parse(res.data).monoAcceptanceLoopByMerchantId.items;

                                this._acceptanceLoopService.getMerchantShop(merchantId).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                                  if (res.success) {
                                    this.shopCount = res.data.totalCount;
                                  }
                                });

                                if (!this.acceptanceLoopList.length) {
                                  this.toast.showDanger('No available acceptance loop for this merchant, please go to merchant to create one');
                                } else {
                                  const getSelected = this.acceptanceLoopList.find(ac => ac.acceptanceLoopId === stepOne?.acceptanceLoopId);
                                  if (getSelected)
                                    this.selectedAcceptanceLoop = getSelected;
                                }
                              }
                            },
                            () => {
                              this.toast.showDanger('Error loading acceptance loop list. Please try again later.');
                            }
                          );

                          this._programService.getProgramById(this.selectedMerchant.programId).pipe(takeUntil(this.destroyed$)).subscribe(
                            res => {
                              this.merchantProgram = JSON.parse(res.data).programs.items[0];
                              if (this.merchantProgram) {
                                this._voucherNumberRuleService
                                  .getSpecificVoucherNumberRule(
                                    merchantId,
                                    this.selectedSKU?.voucherNumberRule
                                      .voucherNumberRuleId
                                  )
                                  .pipe(takeUntil(this.destroyed$))
                                  .subscribe({
                                    next: (res) => {
                                      this.voucherNumberRuleList = res ?? [];
                                      if (!this.voucherNumberRuleList.length) {
                                        this.toast.showDanger(
                                          'No available voucher number rule for this merchant & sku, please go to merchant to create one'
                                        );
                                        this.vnrErrorMessage = `No available voucher number rule for this merchant & sku, <a href="/merchants/details?merchantId=${this.selectedMerchant?.merchantId}">go to merchant</a> to create one`;
                                      }
                                    },
                                    error: () => {
                                      this.toast.showDanger(
                                        'Error loading voucher number rule list. Please try again later.'
                                      );
                                    },
                                  });
                              } else {
                                this.toast.showDanger('Error loading program details. Please try again later.')
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
                    }
                  },
                  () => {
                    this.toast.showDanger('Error loading merchant & sku details. Please try again later.')
                  },
                  () => {
                  });
              }
            }

            if (stepThree) {
              this.pricingFormGroup.patchValue(stepThree);
              this.expirySchemeList = stepThree.expiryPolicyIdList;
              this.isFixedExpiryPolicy = stepThree.isFixedExpiryPolicy;
              if (this.expirySchemeList.length) {
                this.pricingFormGroup.controls['requiredExpiryList'].setValue(this.expirySchemeList.length);
              }
              if (!this.masterVoucherKeys.includes(this.selectedType.key)) {
                this.stepsReached.push(2);
              }
              this.next(false, true);
            }
            if (stepFour) {
              // this.templateFormGroup.patchValue(stepFour);
              if (stepFour.productTemplateList?.length) {
                this.productTemplateList = stepFour.productTemplateList;

                let voucherDesign = stepFour.productTemplateList.filter(vd => vd.templateType === TemplateType.HTML && vd.defaultlanguageId === vd.languageId);
                if (!voucherDesign.length) {
                  voucherDesign = [{ templateName: '' } as unknown as ProductTemplate];
                }
                const smsDesign = stepFour.productTemplateList.filter(vd => vd.templateType === TemplateType.Text && vd.defaultlanguageId === vd.languageId);
                const templateDesigns = [...voucherDesign, ...smsDesign];
                for (const [index, productTemplate] of templateDesigns.entries()) {
                  if (productTemplate.templateType === 1) {
                    this.voucherTemplateValues = productTemplate.tagValueList;
                  } else {
                    this.smsTemplateValues = productTemplate.tagValueList;
                  }

                  if (productTemplate.templateVersionId) {
                    for (const templateVersion of templateDesigns) {
                      this._templateService.getTemplateTagsByVersionId(templateVersion.templateVersionId).pipe(takeUntil(this.destroyed$)).subscribe(
                        res => {
                          const templateTags = JSON.parse(res.data).tagsByTemplateVersionId;
                          if (productTemplate.templateType === 1) {
                            if (!this.emailVersionTemplateTags.find(evt => evt.template.templateVersionId === templateVersion.templateVersionId)) {
                              this.emailVersionTemplateTags = [...this.emailVersionTemplateTags, { templateTags: templateTags, template: templateVersion }];
                            }
                          } else {
                            if (!this.smsVersionTemplateTags.find(svt => svt.template.templateVersionId === templateVersion.templateVersionId)) {
                              this.smsVersionTemplateTags = [...this.smsVersionTemplateTags, { templateTags: templateTags, template: templateVersion }];
                            }
                          }

                          if (templateVersion.languageId === templateVersion.defaultlanguageId) {
                            for (let templateTag of templateTags) {
                              const value = productTemplate.tagValueList?.find(tagValue => tagValue.contentTagId === templateTag.tagId)?.value;
                              if (templateTag.type === 2 && value) {
                                this._mediaService.getMediaById(Number.parseInt(value)).pipe(takeUntil(this.destroyed$)).subscribe(
                                  res => {
                                    const media: Media = JSON.parse(res.data).mediaById[0];
                                    this.getTemplateListFormGroup(index).addControl(templateTag.displayName, new FormControl({ value: media, disabled: templateTag.category === 4 }))
                                  }
                                )
                              } else {
                                this.getTemplateListFormGroup(index).addControl(templateTag.displayName, new FormControl({ value: value, disabled: templateTag.category === 4 }));
                              }
                            }
                            this.templateFormGroup.patchValue({ productTemplateList: templateDesigns, walletStatus: stepFour.walletStatus, walletDescription: stepFour.walletDescription });
                          }
                        }
                      )
                    }
                  }
                }
              } else {
                this.templateFormGroup.patchValue(stepFour);
              }

              const walletImageValue = stepFour.walletImage;
              if (walletImageValue) {
                this._mediaService.getMediaById(walletImageValue).pipe(takeUntil(this.destroyed$)).subscribe(
                  res => {
                    this.templateFormGroup.controls['walletImage'].setValue(JSON.parse(res.data).mediaById[0]);
                  }
                )
              }
              if (!this.masterVoucherKeys.includes(this.selectedType.key)) {
                this.stepsReached.push(3);
              }
              this.next(false, true);
            }

            if (stepFive) {
              this.advanceSettingsFormGroup.patchValue(stepFive);
              this.advanceSettingsFormGroup.patchValue(stepFive.productConditionDto);
              this.currentExternalProperties = stepFive.productExternalPropertyList;

              if (!this.masterVoucherKeys.includes(this.selectedType.key)) {
                this.stepsReached.push(4);
              }
              this.next(false, true);
              this.next(false, true);
            }

          } else {
            this.toast.showDanger('Error loading product wizard. Please try again later.');
            this.router.navigateByUrl('/products');
          }
        },
        () => {
          this.toast.showDanger('Error loading product wizard details. Please try again later.');
        },
        () => {
          this.productWizardService.loading$.next(false);
        })
    } else {
      this._brandService.getAllBrands().pipe(takeUntil(this.destroyed$)).subscribe(
        res => {
          this.brandList = JSON.parse(res.data).brands.items;
        },
        () => {
          this.toast.showDanger('Error in loading brands. Please try again later');
        }
      );
    }
  }

  ngOnInit(): void {
    this.productWizardService.loading$.next(false);

    this.getProductByWizard();
    if (this.selectedTenant === 'GL') {
      this._dictionaryService.getDictionaryItemsByCategory('VoucherIssuer').pipe(takeUntil(this.destroyed$)).subscribe(
        res => {
          this.merchantAcquirers = JSON.parse(res.data).dictionaries;
        }
      )
    }
    if (this.selectedTenant === 'TW' || this.selectedTenant === 'IN') {
      if (this.detailsFormGroup.controls['brandName'].value === '') {
        this.detailsFormGroup.controls['brandName'].setErrors({ 'required': true });
      } else {
        this.detailsFormGroup.controls['brandName'].setErrors(null);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  addStep(): void {
    this.step++;
    if (!this.stepsReached.includes(this.step)) {
      this.stepsReached.push(this.step);
    }
  }

  removeStep(): void {
    this.step--;
    this.stepsReached.pop();
  }

  updateProductWizard(step: number, body: any, saveProgress: boolean): void {
    const stepName = PRODUCT_CONSTANTS.PRODUCT_STEPS[this.step - 1];

    this.productWizardService.updateProductWizard(this.wizardKey, step, body).pipe(takeUntil(this.destroyed$)).subscribe(
      res => {
        if (!res.success) {
          this.toast.showDanger(`Error in updating product wizard step - ${stepName}. Please try again later.`);
        } else {
          if (!saveProgress) {
            this.addStep();
          }
        }
      },
      () => {
        this.toast.showDanger(`Error in updating product wizard step - ${stepName}. Please try again later.`);
        this.productWizardService.loading$.next(false);
      },
      () => {
        this.productWizardService.loading$.next(false);
      });

  }

  prev(): void {
    if (this.step <= 1) {
      const modalRef = this._modalSvc.open(ConfirmationModalComponent, { size: 'md', backdrop: 'static', centered: true });
      modalRef.componentInstance.title = 'Cancel editing';
      modalRef.componentInstance.description = 'Are you sure you want to leave this page without saving?';
      modalRef.componentInstance.firstButton = {
        buttonText: 'Discard',
        buttonClass: 'btn-secondary'
      };
      modalRef.componentInstance.secondButton = {
        buttonText: 'Keep editing',
        buttonClass: 'btn-primary'
      };
      modalRef.result.then((res: string) => {
        if (res === 'cancel') this.router.navigateByUrl('/products');
      });
    } else {
      this.OnStepChanged(this.step - 1);
    }
  }

  next(saveProgress = false, onInitializeDraft = false): void {
    if (!this.isNextDisabled && this.stepsWithIssue.length > 0) {
      this.OnStepRemoveIssue(this.step);
    }

    if (!onInitializeDraft && this.step !== 5) {
      this.productWizardService.loading$.next(true);
    }

    if (this.step === 0) {

      // create master product page
      if (this.isMasterProduct(this.selectedType.key)) {
        this.navigateToCreateMasterProduct(this.selectedType.key);
        return;
      }

      const pricingFormDefinition = this.pricingFormGroupDefinition.find(f => f.productType === this.selectedType.key);
      if (pricingFormDefinition) {
        this.pricingFormGroup = pricingFormDefinition.define(this._formBuilder, false);
      }

      const templateFormGroupDefinition = this.templateFormGroupDefinitions.find(f => f.productTypes?.includes(this.selectedType.key));
      if (templateFormGroupDefinition) {
        this.templateFormGroup = templateFormGroupDefinition.define(this._formBuilder, false);
      }

      const advanceSettingsDefintion = this.advanceSettingsFormGroupDefinitions.find(f => f.productTypes?.includes(this.selectedType.key));
      if (advanceSettingsDefintion) {
        this.advanceSettingsFormGroup = advanceSettingsDefintion.define(this._formBuilder, false);
      }

      if (!onInitializeDraft) {
        this.productWizardService.initializeProductWizard({ productType: this.selectedType.key, productId: 0 }).pipe(takeUntil(this.destroyed$)).subscribe(
          res => {
            if (res.success) {
              this.wizardKey = res.data;
              this.router.navigate(['products/product/create'],
                {
                  queryParams: {
                    key: this.wizardKey,
                    isDraft: true
                  }
                });
              this.addStep();

              return;
            } else {
              this.toast.showDanger('Error in initiating product wizard. Please try again later.');
              return;
            }
          },
          () => {
            this.toast.showDanger('Error in initiating product wizard. Please try again later.');
            return;
          },
          () => {
            this.productWizardService.loading$.next(false);
          });
      } else {
        this.addStep();
      }
    } else if (this.step === 1) {
      const body = this.detailsFormGroup.getRawValue();
      body.productType = this.selectedType.key;

      if (onInitializeDraft) {
        this.addStep();
      } else {
        this.updateProductWizard(this.step, body, saveProgress);
      }

      return;
    } else if (this.step === 2 && !this.masterVoucherKeys.includes(this.selectedType.key)) {
      if (this.stepsWithIssue.length) {
        this.stepsWithIssue = [];
      }

      const body = this.pricingFormGroup.getRawValue();
      body.expiryPolicyIdList = this.expirySchemeList;
      if (onInitializeDraft) {
        this.addStep();
      } else {
        this.updateProductWizard(3, body, saveProgress);
      }
      return;
    } else if (this.step === 3 && !this.masterVoucherKeys.includes(this.selectedType.key)) {
      if (onInitializeDraft) {
        this.addStep();
        return;
      }

      if (this.productTemplate) {
        this.productTemplate.saveLastData$.next(true);
        this.productTemplate.editDoneWaitingSaveLastData$
        .pipe(takeUntil(this.productTemplate.destroyed$))
        .subscribe(done => {
          if (done) {
            const body = this.templateFormGroup.getRawValue();
            body.updatedProductTemplateList = [...this.productTemplateList];
            this.updateProductWizard(4, body, saveProgress);
          }
          return;
        });
      }
    } else if (this.step === 4 && !this.masterVoucherKeys.includes(this.selectedType.key)) {
      const body = this.advanceSettingsFormGroup.getRawValue();
      body.productExternalPropertyList = this.currentExternalProperties;
      body.maxIssuingQuantity = body.maxIssuingQuantity || null;
      if (onInitializeDraft) {
        this.addStep();
      } else {
        this.updateProductWizard(5, body, saveProgress);
      }
      return;
    } else if (this.step === 5 && !this.masterVoucherKeys.includes(this.selectedType.key)) {
      this.productWizardService.loading$.next(true);
      if (saveProgress) {
        this.productWizardService.createProductWizard(this.wizardKey).pipe(takeUntil(this.destroyed$)).subscribe(
          res => {
            if (res.success) {
              this.router.navigate(['/products'], {
                state: {
                  action: 'productCreated'
                }
              });
            } else {
              this.toast.showDanger(
                `Error in creating a new product. ${res.message + '.' || ''}`
              );
            }
          },
          () => {
            this.toast.showDanger('Error in creating a new product. Please try again later');
          },
          () => {
            this.productWizardService.loading$.next(false);
          }
        );
      } else {
        this.productWizardService.loading$.next(false);
      }
    }
  }

  get isNextDisabled(): boolean {
    switch (this.step) {
      case 0: {
        return !this.selectedType.key;
      }
      case 1: {
        return this.detailsFormGroup.invalid;
      }
      case 2: {
        if (!this.masterVoucherKeys.includes(this.selectedType.key)) {
          return this.pricingFormGroup.invalid;
        } else {
          return true;
        }
      }
      case 3: {
        if (!this.masterVoucherKeys.includes(this.selectedType.key)) {
          return this.templateFormGroup.invalid;
        } else {
          return true;
        }
      }
      case 4: {
        if (!this.masterVoucherKeys.includes(this.selectedType.key)) {
          return this.advanceSettingsFormGroup.invalid;
        } else {
          return true;
        }
      }
      case 5: {
        if (!this.masterVoucherKeys.includes(this.selectedType.key)) {
          let disableSaveButton = false;
          if (this.detailsFormGroup.invalid) {
            disableSaveButton = true;
          } else {
            disableSaveButton = false;
          }

          return this.stepsWithIssue.length ? true : disableSaveButton;
        } else {
          return true;
        }
      }
      default: {
        return false;
      }
    }
  }

  OnMerchantChanged($event: { merchant: Merchant, sku: SKU, skuList: SKU[], acceptanceLoopList: AcceptanceLoop[], vrnList: VoucherNumberRule[], program: IProgram, shopCount: number, programGeneratedByChanged: boolean, isMonoMerchant: boolean }) {
    this.selectedMerchant = $event.merchant;
    this.selectedSKU = $event.sku;
    this.detailsFormGroup.controls['skuName'].setValue($event.sku);
    this.voucherNumberRuleList = $event.vrnList;
    this.acceptanceLoopList = $event.acceptanceLoopList;
    this.merchantProgram = $event.program;
    this.skuList = $event.skuList;
    this.shopCount = $event.shopCount;
    this.isMonoMerchant = $event.isMonoMerchant;

    if ($event.programGeneratedByChanged) {
      this.stepsWithIssue.push(2);
    }
  }

  OnTemplateChanged($event: { emailVersionTemplateTags: TemplateVersionTemplateTag[], smsVersionTemplateTags: TemplateVersionTemplateTag[] }) {
    this.emailVersionTemplateTags = $event.emailVersionTemplateTags;
    this.smsVersionTemplateTags = $event.smsVersionTemplateTags;
  }

  OnExpiryListChanged($event: number[]) {
    this.expirySchemeList = $event;
  }

  OnExpiryPolicyTypeChanged($event: boolean) {
    if(this.isFixedExpiryPolicy !== $event) {
      this.isFixedExpiryPolicy = $event;
      this.isFixedExpiryPolicySubject.next(this.isFixedExpiryPolicy);
    }
  }

  OnProductSelected(event: ProductType) {
    this.selectedType = event;
    this.next();
  }

  OnStepChanged(nextStep: number): void {
    if(this.isFixedExpiryPolicy === undefined) {
      this.getProductByWizard();
    }
    if (this.isNextDisabled) {
      if (this.step === 5) {
        this.step = nextStep;
        return;
      }

      const modalRef = this._modalSvc.open(ConfirmationModalComponent, { size: 'md', backdrop: 'static', centered: true });
      modalRef.componentInstance.title = 'Can\'t change step';
      modalRef.componentInstance.description = 'Please verify that there are no error in the fields and mandatory fields are filled up.';
      modalRef.componentInstance.firstButton = {
        buttonText: 'Cancel',
        buttonClass: 'btn-secondary'
      };
      modalRef.componentInstance.secondButton = {
        buttonText: 'Okay',
        buttonClass: 'btn-primary'
      };
    } else {
      if (this.step === 3) {
        if (this.productTemplate) {
          this.productTemplate.saveLastData$.next(true);
          this.productTemplate.editDoneWaitingSaveLastData$
          .pipe(takeUntil(this.productTemplate.destroyed$))
          .subscribe(done => {
            if (done) {
              const body = this.templateFormGroup.getRawValue();
              body.updatedProductTemplateList = [...this.productTemplateList];
              this.updateProductWizard(4, body, true);
              this.step = nextStep;
            }
          });
        }
      } else {
        if (this.step === 5 && !this.masterVoucherKeys.includes(this.selectedType.key)) {
          this.next(false);
        } else {
          this.next(true);
        }
        this.step = nextStep;
      }
    }
  }

  OnExternalPropertyChanged(externalProperties: ExternalProperty[]) {
    this.currentExternalProperties = externalProperties;
  }

  OnStepHasIssue($event: number) {
    if (!(this.stepsWithIssue.indexOf($event) > -1)) {
      this.stepsWithIssue.push($event);
    };
  }

  OnStepRemoveIssue($event: number) {
    const getStepIndex = this.stepsWithIssue.findIndex(step => step === $event);
    this.stepsWithIssue.splice(getStepIndex, 1);
  }

  private isMasterProduct(productType: number): boolean {
    return productType === ProductTypeEnum.SmartChoiceVoucher
      || productType === ProductTypeEnum.SuperVoucher;
  }

  private navigateToCreateMasterProduct(productType: number) {
    // smart choice voucher
    if (productType === ProductTypeEnum.SmartChoiceVoucher && this.isDraft && this.wizardKey) {
      this.router.navigate(['/products/product/create/smart-choice-voucher'],
        {
          queryParams: {
            wizardKey: this.wizardKey
          },
          replaceUrl: true
        });
      return;
    }
    if (productType === ProductTypeEnum.SmartChoiceVoucher) {
      this.router.navigateByUrl('/products/product/create/smart-choice-voucher');
      return;
    }
    // super voucher
    if (productType === ProductTypeEnum.SuperVoucher && this.isDraft && this.wizardKey) {
      this.router.navigate(['/products/product/create/super-voucher'],
        {
          queryParams: {
            wizardKey: this.wizardKey
          },
          replaceUrl: true
        });
      return;
    }
    if (productType === ProductTypeEnum.SuperVoucher) {
      this.router.navigateByUrl('/products/product/create/super-voucher');
      return;
    }
  }

  //product template multi language
  OnProductTemplateLanguageChanged($event: { productTemplate: ProductTemplate, reset: boolean, type: number }) {
    if ($event.reset) {
      this.productTemplateList = [...this.productTemplateList.filter(ptl => ptl.templateType !== $event.type)];
    } else {
      if (this.productTemplateList.some(ptl => ptl.templateVersionId === $event.productTemplate.templateVersionId)) {
        // make sure there are no duplicate templateVersionIds
        const existingTemplateIndicesWithSameVersionId = this.productTemplateList
          .map((ptl: ProductTemplate, index: number) => ptl.templateVersionId === $event.productTemplate.templateVersionId ? index : -1)
          .filter((index: number) => index !== -1);
        for (let index of existingTemplateIndicesWithSameVersionId) {
          this.productTemplateList.splice(index, 1);
        }
        this.productTemplateList.push($event.productTemplate);
      } else {
        if ($event.productTemplate.templateVersionId) {
          this.productTemplateList.push($event.productTemplate);
        }
      }
    }
  }

  OnProductTemplateLanguageRemoved($event: number) {
    const ptlIndex = this.productTemplateList.findIndex(ptl => ptl.templateVersionId === $event);
    this.productTemplateList.splice(ptlIndex, 1);
  }

  OnAcceptanceLoopPaginationChanged($event: number) {
    this.acceptanceLoopPage = $event;
  }

  private getProductByWizard() {
    if(this.wizardKey) {
      this.productApiService.getProductWizard(this.wizardKey).subscribe(
        res => {
          this.isFixedExpiryPolicy = res.data?.productWizardStepThree?.isFixedExpiryPolicy;
          this.isFixedExpiryPolicySubject.next(this.isFixedExpiryPolicy)
        }
      )
    }
  }
}
