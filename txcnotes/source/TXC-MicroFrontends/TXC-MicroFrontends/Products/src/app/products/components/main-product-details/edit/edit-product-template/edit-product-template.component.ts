import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/products/services/product.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Product } from 'src/app/products/models/product.model';
import { PRODUCT_CONSTANTS } from 'src/app/products/constants/product-constants';
import { ProductType } from 'src/app/products/models/product-type.model';
import { IDefineFormGroup } from 'src/app/products/models/define-form-group.model';
import { DynamicFaceValueTemplateFormGroup, GeneralProductTemplateFormGroup } from 'src/app/products/models/product-form-group/product-template-form-group.model';
import { TemplateTag } from 'src/app/products/models/template-tag.model';
import { TemplateService } from 'src/app/products/services/template.service';
import { VoucherNumberRule } from 'src/app/products/models/voucher-number-rule.model';
import { MediaService } from 'src/app/products/services/media.service';
import { BehaviorSubject, forkJoin, ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { ProductTemplate, ProductWizardStepFour, TagValue } from 'src/app/products/models/product-wizard-dto.model';
import { Media } from 'src/app/products/models/media.model';
import { ProductTypeEnum } from 'src/app/products/enums/product-type.enum';
import { ProductTemplateComponent } from '../../../create-product/product-template/product-template.component';
import { TemplateSubType, TemplateType } from 'src/app/products/models/product-template.model';
import { TextEditorService } from 'src/app/products/services/text-editor.service';
import { TemplateVersionTemplateTag } from 'src/app/products/models/product-template/template-version-template-tag.model';
import { Template } from 'src/app/products/models/template.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-product-template',
  templateUrl: './edit-product-template.component.html',
  styleUrls: ['./edit-product-template.component.scss']
})
export class EditProductTemplateComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild(ProductTemplateComponent) productTemplate!: ProductTemplateComponent;

  PRODUCT_TEMPLATE_PANEL = 'productTemplate';
  PRODUCT_UPDATED_ACTION = 'productUpdated';

  ProductType = ProductTypeEnum;

  product!: Product;
  selectedTenant: string = 'TW';
  selectedType!: ProductType;
  templateFormGroup!: FormGroup;
  emailVersionTemplateTags: TemplateVersionTemplateTag[] = [];
  smsVersionTemplateTags: TemplateVersionTemplateTag[] = [];
  voucherNumberRuleList: VoucherNumberRule[] = [];

  hideWalletImageSettings = false;

  templateFormGroupDefinitions: IDefineFormGroup[] = [
    new GeneralProductTemplateFormGroup(),
    new DynamicFaceValueTemplateFormGroup()
  ];

  templateFormGroupDefinition!: IDefineFormGroup | undefined;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  loading$ = new BehaviorSubject<boolean>(true);
  actionLoading$ = new BehaviorSubject<boolean>(false);
  editDoneWaitingSaveLastDataFlag = false;

  voucherTemplateValues: TagValue[] = [];
  smsTemplateValues: TagValue[] = [];
  _productTemplateList: ProductTemplate[] = [];
  get productTemplateList(): ProductTemplate[] {
    return this._productTemplateList;
  }
  set productTemplateList(value: ProductTemplate[]) {
    for (let existingProductTemplate of value) {
      if (existingProductTemplate.templateTagValue?.length) {
        existingProductTemplate.tagValueList = existingProductTemplate.templateTagValue;
      }
    }
    this._productTemplateList = value;
  }

  get showApplyTemplate() {
    return this.authLibraryService.getElementOperationFlag([65]) && environment.applyTemplateFeature;
  }

  // form
  get f(): any {
    return this.templateFormGroup.controls;
  }

  // productTemplateListControl
  public getTemplateListFormGroup(index: number): FormGroup {
    const productTemplateList = <FormArray>this.templateFormGroup.controls['productTemplateList'];
    return <FormGroup>productTemplateList.controls[index];
  }

  constructor(
    private _productService: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _formBuilder: FormBuilder,
    private readonly _templateService: TemplateService,
    private readonly _mediaService: MediaService,
    private readonly _textEditorService: TextEditorService,
    private readonly authLibraryService: AuthorizationLibraryService) {
  }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params: any) => {
      this._productService.selectedProduct$.subscribe(product => {
        if (!product) {
          this._productService.getProduct(parseInt(params.id));
          return;
        }
        this.product = product;
        this.selectedType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find((productType: ProductType) => productType.key === this.product.productType) as ProductType;

        this.templateFormGroupDefinition = this.templateFormGroupDefinitions.find(f => f.productTypes?.includes(this.selectedType.key)) ?? undefined;
        if (this.templateFormGroupDefinition) {
          this.templateFormGroup = this.templateFormGroupDefinition.define(this._formBuilder, false);

          //Product Template API Fetch For Voucher
          forkJoin(
            this._productService.getProductTemplate(params.id, 1),
            this._productService.getProductTemplate(params.id, 2),
            this._productService.getProductWalletSetting(params.id).
              pipe(
                takeUntil(this.destroyed$))
          ).subscribe(([voucherTemplateResponse, smsTemplateResponse, productWalletSettingResponse]) => {
            const voucherDesignData = voucherTemplateResponse.data?.productTemplate[0] ?? null;
            const smsDesignData = smsTemplateResponse.data?.productTemplate[0] ?? null;

            if (!voucherDesignData && !smsDesignData) {
              this.loading$.next(false);
            }

            if (voucherDesignData) {
              const defaultLanguageVersion = voucherDesignData.productTemplateVersion.find((vdd: { languageId: number }) => vdd.languageId === voucherDesignData.defaultLanguageId);
              voucherDesignData.templateVersionId = defaultLanguageVersion.templateVersionId;
              this.voucherTemplateValues = voucherDesignData.tagValueList = defaultLanguageVersion.templateTagValue;
              if (defaultLanguageVersion.templateVersionId) {
                this.getTemplateListFormGroup(0).patchValue({
                  templateVersionId: defaultLanguageVersion.templateVersionId,
                  templateId: voucherDesignData.templateId,
                  templateName: voucherDesignData.templateName,
                  templateSubType: voucherDesignData.templateSubType,
                  templateType: voucherDesignData.templateType
                });
                for (let template of voucherDesignData.productTemplateVersion) {
                  this._templateService.getTemplateTagsByVersionId(template.templateVersionId)
                    .pipe(
                      takeUntil(this.destroyed$),
                    ).subscribe(
                      voucherDesignTemplateResponse => {
                        let mediaTagCount = 0;
                        let mediaTagFetchCount = 0;
                        const templateTags = JSON.parse(voucherDesignTemplateResponse.data).tagsByTemplateVersionId;

                        if (!(this.emailVersionTemplateTags.findIndex(evt => evt.template.templateVersionId === template.templateVersionId) > -1)) {
                          template.templateId = voucherDesignData.templateId;
                          this.emailVersionTemplateTags.push({ template: template as Template, templateTags } as unknown as TemplateVersionTemplateTag);
                        }

                        for (let existingProductTemplate of voucherDesignData.productTemplateVersion) {
                          existingProductTemplate.tagValueList = existingProductTemplate.templateTagValue;
                          existingProductTemplate.templateType = TemplateType.HTML;
                          existingProductTemplate.type = TemplateType.HTML;
                          existingProductTemplate.templateSubType = TemplateSubType.Voucher;
                          existingProductTemplate.templateName = voucherDesignData.templateName;
                          existingProductTemplate.defaultlanguageId = voucherDesignData.defaultLanguageId;
                          existingProductTemplate.templateId = voucherDesignData.templateId;
                          this.OnProductTemplateLanguageChanged({ productTemplate: existingProductTemplate, reset: false, type: TemplateType.HTML })
                        }

                        if (defaultLanguageVersion.templateVersionId === template.templateVersionId) {
                          this.getTemplateListFormGroup(0).patchValue({ languageId: defaultLanguageVersion.languageId })
                          if (!templateTags.some((tag: TemplateTag) => tag.type == 2)) {
                            this.loading$.next(false);
                            this._loadInitialSMSData(smsDesignData);
                          } else {
                            mediaTagCount = templateTags.filter((tag: TemplateTag) => tag.type === 2 && tag.category === 4).length + 1;
                          }

                          for (let templateTag of templateTags) {
                            const value = voucherDesignData.tagValueList.find((tagValue: TagValue) => tagValue.tagId === templateTag.tagId)?.value;

                            if (templateTag.type === 2 && value) {
                              this._mediaService.getMediaById(Number.parseInt(value))
                                .pipe(
                                  takeUntil(this.destroyed$))
                                .subscribe(
                                  voucherDesignMediaResponse => {
                                    const media: Media = JSON.parse(voucherDesignMediaResponse.data).mediaById[0];
                                    this.getTemplateListFormGroup(0).addControl(templateTag.displayName, new FormControl({ value: media, disabled: templateTag.category === 4 }));
                                    mediaTagFetchCount++;
                                  },
                                  () => {
                                  },
                                  () => {
                                    if (mediaTagCount === mediaTagFetchCount) {
                                      this.loading$.next(false);
                                      this.getTemplateListFormGroup(0).patchValue(voucherDesignData);
                                      this._loadInitialSMSData(smsDesignData);
                                    }
                                  }
                                )
                            } else if (templateTag.type === 2 && !value) {
                              this.getTemplateListFormGroup(0).addControl(templateTag.displayName, new FormControl({ value: null, disabled: templateTag.category === 4 }));
                              mediaTagFetchCount++;
                              if (mediaTagCount === mediaTagFetchCount) {
                                this.loading$.next(false);
                                this.getTemplateListFormGroup(0).patchValue(voucherDesignData);
                                this._loadInitialSMSData(smsDesignData);
                              }
                            } else {
                              this.getTemplateListFormGroup(0).addControl(templateTag.displayName, new FormControl({ value: value, disabled: templateTag.category === 4 }));
                            }
                          }
                        }
                      },
                      () => {
                        // this.toast.showDanger('Error loading voucher design tags. Please try again later.');
                      });
                }
              }
            } else {
              this.loading$.next(false);
              this._loadInitialSMSData(smsDesignData);
            }

            if (!productWalletSettingResponse.success) return;

            const walletImageData = productWalletSettingResponse.data
            this.templateFormGroup.patchValue(walletImageData);
            this.hideWalletImageSettings = !walletImageData.addToWallet;
            if (walletImageData.walletImage) {
              this._mediaService.getMediaById(walletImageData.walletImage).subscribe(res => {
                const media = JSON.parse(res.data)?.mediaById[0];
                this.f.walletImage.setValue(media);
              })
            }
          },
            () => {
              this.toast.showDanger('Error loading voucher and sms template and/or wallet settings. Please try again later.');
            }, () => {
            });

          if (this.product.productType === ProductTypeEnum.DynamicFaceValue) {
            this._productService.getBannerImageSetting(this.product.productId)
              .pipe(takeUntil(this.destroyed$))
              .subscribe(res => {
                if (!res.success) return;

                if (!res.data) return;

                this.templateFormGroup.patchValue(res.data);
              },
                () => {
                  this.toast.showDanger('Error loading banner settings. Please try again later.');
                });
          }
        }
      });
    });
  }

  private _loadInitialSMSData(smsDesignData: any) {
    if (smsDesignData) {
      const defaultLanguageVersion = smsDesignData.productTemplateVersion.find((vdd: { languageId: number }) => vdd.languageId === smsDesignData.defaultLanguageId);
      smsDesignData.templateVersionId = defaultLanguageVersion.templateVersionId;
      this.smsTemplateValues = smsDesignData.tagValueList = defaultLanguageVersion.templateTagValue;
      if (defaultLanguageVersion.templateVersionId) {
        this.getTemplateListFormGroup(1).patchValue({
          templateVersionId: defaultLanguageVersion.templateVersionId,
          templateId: smsDesignData.templateId,
          templateName: smsDesignData.templateName,
          templateSubType: smsDesignData.templateSubType,
          templateType: smsDesignData.templateType
        });
        for (let template of smsDesignData.productTemplateVersion) {
          this._templateService.getTemplateTagsByVersionId(template.templateVersionId)
            .pipe(
              takeUntil(this.destroyed$)
            ).subscribe(
              smsTemplateResponse => {
                const templateTags = JSON.parse(smsTemplateResponse.data).tagsByTemplateVersionId;

                if (!(this.smsVersionTemplateTags.findIndex(svt => svt.template.templateVersionId === template.templateVersionId) > -1)) {
                  template.templateId = smsDesignData.templateId;
                  this.smsVersionTemplateTags.push({ template: template, templateTags: templateTags } as unknown as TemplateVersionTemplateTag);
                }

                for (let existingProductTemplate of smsDesignData.productTemplateVersion) {
                  existingProductTemplate.tagValueList = existingProductTemplate.templateTagValue;
                  existingProductTemplate.templateType = TemplateType.Text;
                  existingProductTemplate.templateSubType = TemplateSubType.SMS;
                  existingProductTemplate.templateName = smsDesignData.templateName;
                  existingProductTemplate.defaultlanguageId = smsDesignData.defaultLanguageId;
                  this.OnProductTemplateLanguageChanged({ productTemplate: existingProductTemplate, reset: false, type: TemplateType.Text })
                }

                if (defaultLanguageVersion.templateVersionId === template.templateVersionId) {
                  for (let templateTag of templateTags) {
                    const value = smsDesignData.tagValueList.find((tagValue: TagValue) => tagValue.tagId === templateTag.tagId)?.value;
                    this.getTemplateListFormGroup(1).addControl(templateTag.displayName, new FormControl({ value: value, disabled: templateTag.category === 4 }));
                  }
                  this.getTemplateListFormGroup(1).patchValue(smsDesignData);
                }
              },

              () => {
                // this.toast.showDanger('Error loading sms template tags. Please try again later.');
              },
              () => {
                this.loading$.next(false);
              }
            )
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
    this._templateService.type = 1;
  }

  OnSubmit() {
    if (this.productTemplate) {
      this.productTemplate.saveLastData$.next(true);
    }

    if (this.editDoneWaitingSaveLastDataFlag) {
      return;
    }

    this.editDoneWaitingSaveLastDataFlag = true;
    
    this.productTemplate.editDoneWaitingSaveLastData$.subscribe((done: boolean) => {
      if (done && this.editDoneWaitingSaveLastDataFlag) {
        const stepFour: ProductWizardStepFour = new ProductWizardStepFour(this.templateFormGroup.getRawValue(), this._textEditorService);

        let dirtyControls = 0;
        if (stepFour) {
          this.actionLoading$.next(true);

          // wallet settings
          if (this.f.walletStatus.dirty || this.f.walletImage.dirty || this.f.walletDescription.dirty) {
            dirtyControls++;

            const walletSettingsRequest = {
              productId: this.product.productId,
              addToWallet: stepFour.addToWallet,
              walletDescription: stepFour.walletDescription,
              walletStatus: stepFour.walletStatus,
              walletImage: stepFour.walletImage,
            };

            this._productService.updateProductWalletSetting(walletSettingsRequest).pipe(
              takeUntil(this.destroyed$)
            ).subscribe(res => {
              if (res.success) {
                dirtyControls--;
                this.templateFormGroup.markAsPristine();

                if (!dirtyControls) {
                  this.navigateToProductDetailsWithToast();
                }
              } else {
                this.toast.showDanger('Error updating wallet settings. Please try again later.');
              }

              this.actionLoading$.next(false);
            }, () => {
              this.toast.showDanger('Error updating wallet settings. Please try again later.');
              this.actionLoading$.next(false);
            })
          }

          // banner settings
          if (this.product.productType === ProductTypeEnum.DynamicFaceValue && (this.f.hexColor.dirty || this.f.pointX.dirty || this.f.pointY.dirty || this.f.fontSize.dirty)) {
            dirtyControls++;

            const bannerSettingRequest = {
              productId: this.product.productId,
              hexColor: stepFour.hexColor,
              fontSize: stepFour.fontSize,
              pointX: stepFour.pointX,
              pointY: stepFour.pointY,
            };

            this._productService.updateBannerImageSettings(bannerSettingRequest)
              .pipe(takeUntil(this.destroyed$))
              .subscribe(res => {
                if (res.success) {
                  dirtyControls--;
                  this.templateFormGroup.markAsPristine();

                  if (!dirtyControls) {
                    this.navigateToProductDetailsWithToast();
                  }
                } else {
                  this.toast.showDanger('Error updating banner settings. Please try again later.');
                }

                this.actionLoading$.next(false);
              }, () => {
                this.toast.showDanger('Error updating banner settings. Please try again later.');
                this.actionLoading$.next(false);
              })
          }

          // product template
          if (stepFour.productTemplateList) {
            dirtyControls++;
            for (const productTemplate of stepFour.productTemplateList) {
              if (productTemplate.tagValueList?.some((tagValue: TagValue) => tagValue.tagId === 0)) {
                productTemplate.tagValueList = productTemplate.templateType === 1 ? this.voucherTemplateValues : this.smsTemplateValues;
                break;
              }
            }

            const productTemplateRequest = {
              productId: this.product.productId,
              product_template_item: this.productTemplateList.map(template => {
                return {
                  templateType: template.templateType,
                  templateSubType: template.templateSubType,
                  templateVersionId: template.templateVersionId,
                  templateTagValue: template.tagValueList?.map((e: any) => {
                    
                    if(e.tagName === '{FOOTNOTE}') {
                      e.value = e.value.trim().replace(/&#10;/g, '').replaceAll('</li>', '</li>\r\n');
                      return e;
                    } else {
                      return e;
                    }
                  })
                }
              })
            };

            this._productService.updateProductTemplate(productTemplateRequest)
              .pipe(takeUntil(this.destroyed$))
              .subscribe(res => {
                if (res.success) {
                  dirtyControls--;
                  this.templateFormGroup.markAsPristine();
                  this.actionLoading$.next(false);

                  if (!dirtyControls) {
                    this.navigateToProductDetailsWithToast();
                  }
                } else {
                  this.toast.showDanger('Error updating product template. Please try again later.');
                }
                this.actionLoading$.next(false);
              },
                () => {
                  this.toast.showDanger('Error updating product template. Please try again later.');
                  this.actionLoading$.next(false);
                },
                () => {
                  this.productTemplate.templateService.loading = false;
                  this.editDoneWaitingSaveLastDataFlag = false;
                });
          } else {
            if (!dirtyControls) {
              this.navigateToProductDetailsWithToast();
            }
            this.templateFormGroup.markAsUntouched();
            this.actionLoading$.next(false);
          }
        }
      }
    });
  }

  navigateBackToProductDetails() {
    this._router.navigateByUrl(`products/${this.product.productId}`);
  }

  navigateToProductDetailsWithToast() {
    this._router.navigate([`/products/${this.product.productId}`], {
      state: {
        action: this.PRODUCT_UPDATED_ACTION,
        panel: this.PRODUCT_TEMPLATE_PANEL,
        message: `${this.product.productName} product template updated successfully.`
      }
    });
  }

  //product template multi language
  OnProductTemplateLanguageChanged($event: { productTemplate: ProductTemplate, reset: boolean, type: number }) {
    if ($event.reset) {
      this.productTemplateList = [...this.productTemplateList.filter(ptl => ptl.templateType !== $event.type)];
    } else {
      if (this.productTemplateList.some(ptl => ptl.templateVersionId === $event.productTemplate.templateVersionId)) {
        // make sure there are no duplicate templateVersionIds
        const existingTemplateIndicesWithSameVersionId = this.productTemplateList
          .map((ptl: ProductTemplate, index: number) => (ptl.templateVersionId === $event.productTemplate.templateVersionId) ? index : -1)
          .filter((index: number) => index !== -1);
        for (let index of existingTemplateIndicesWithSameVersionId) {
          this.productTemplateList.splice(index, 1);
        }
      }

      if ($event.productTemplate.templateVersionId) {
        this.productTemplateList.push($event.productTemplate);
      }
    }
  }

  OnProductTemplateLanguageRemoved($event: number) {
    const ptlIndex = this.productTemplateList.findIndex(ptl => ptl.templateVersionId === $event);
    this.productTemplateList.splice(ptlIndex, 1);
  }
}
