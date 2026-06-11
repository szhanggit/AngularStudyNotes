import { GeneralService } from './../../../services/general.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductComboBrand } from 'src/app/products/models/master-product/child-product.model';
import {
  ActionMode,
  MasterProduct,
  MasterProductAdvanceSettings,
  MasterProductPricingAndExpiry,
  MasterProductProductCombo,
  MasterProductProductDetails,
  MasterProductProductTemplate,
  MasterProductProductTemplateObject,
  TagValueObject,
} from 'src/app/products/models/master-product/master-product.model';
import { Product } from 'src/app/products/models/product.model';
import { IProgram } from 'src/app/products/models/program.model';
import { VoucherNumberRule } from 'src/app/products/models/voucher-number-rule.model';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { MasterProductService } from 'src/app/products/services/master-product.service';
import { ProgramService } from 'src/app/products/services/program.service';
import {
  MasterProductProductTemplatePreviewComponent
} from '../../shared/master-product-product-template-preview/master-product-product-template-preview.component';
import { ExpirationPolicyTypeEnum } from 'src/app/products/enums/expiration-policy-type.enum';
import { ExpirationPolicy } from 'src/app/products/models/expiry-scheme.model';
import { Template } from 'src/app/products/models/template.model';
import { TagCategory, TagType, TemplateType } from 'src/app/products/models/product-template.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, takeUntil, merge } from 'rxjs';
import { TemplateTypeEnum } from 'src/app/products/enums/template-type.enum';
import { Tenant } from '@txc-angular/authorization-library/models/tenant.model';
import { TenantConfigService } from 'src/app/products/services/tenant-config.service';
import { ProductTypeEnum } from 'src/app/products/enums/product-type.enum';
import { TenantConfiguration } from 'src/app/products/models/tenant-configuration.model';
import { VoucherNumberTypeEnum } from 'src/app/products/enums/voucher-number-type.enum';
import { ProductType } from 'src/app/products/models/product-type.model';
import { PRODUCT_CONSTANTS } from 'src/app/products/constants/product-constants';
import { MediaService } from 'src/app/products/services/media.service';
import { ProductVoucherGeneratorEnum } from 'src/app/products/enums/voucher-generator.enum';
import { ProductVoucherGeneratorService } from 'src/app/products/services/product-voucher-generator.service';
import { TxcDateTimeService } from '@txc-angular/component-library';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-master-product-review-and-confirm',
  templateUrl: './master-product-review-and-confirm.component.html',
  styleUrls: ['./master-product-review-and-confirm.component.scss'],
})
export class MasterProductReviewAndConfirmComponent implements OnInit, OnDestroy {
  @Input() parent!: any;

  readonly SUPER_VOUCHER_TYPE = PRODUCT_CONSTANTS.SUPER_VOUCHER_TYPE;
  readonly PRODUCT_LIST_DEFAULT_SIZE: number = 5;
  readonly PRODUCT_SORTED_LIST_DEFAULT_SIZE: number = 5;
  readonly BRAND_SORTED_LIST_DEFAULT_SIZE: number = 5;
  readonly TEMPLATE_SUBTYPE_VOUCHER: number = 1;
  readonly TEMPLATE_SUBTYPE_SMS: number = 2;
  readonly Y = "Y";
  readonly N = "N";
  readonly DECIMAL_PLACES_FOUR = 4;
  // required data names
  readonly REQUIRED_DATA_TENANT_CONFIG = "tenant config";
  readonly REQUIRED_DATA_TENANT_CONFIG_MERCHANT_ID = "tenant config merchantId";
  readonly REQUIRED_DATA_TENANT_CONFIG_VNR_ID = "tenant config voucherNumberRuleId";
  readonly REQUIRED_DATA_TENANT_CONFIG_CONTRACT_ID = "tenant config contractId";
  readonly REQUIRED_DATA_MERCHANT = "merchant";
  readonly REQUIRED_DATA_PROGRAM = "program";
  readonly REQUIRED_DATA_VNR = "voucher number rule";
  // tenant config
  readonly CONFIG_TYPE_MASTER_PRODUCT = "MasterProduct";
  readonly CONFIG_NAME_MERCHANT_ID = "MerchantId";
  readonly CONFIG_NAME_SCV_VNR_ID = "SmartChoiceVoucherVoucherNumberRuleId";
  readonly CONFIG_NAME_SV_VNR_ID = "SuperVoucherVoucherNumberRuleId";
  // tenant names
  readonly TENANT_NAME_TW = "TW";
  readonly TENANT_NAME_IN = "IN";
  readonly TENANT_NAME_GL = "GL";
  // error message
  readonly ERROR_REQUIRED_DATA = "Missing required data:";
  readonly ERROR_SHOWING_VNR = `${this.ERROR_REQUIRED_DATA} ${this.REQUIRED_DATA_VNR}`;

  ProductTypeEnum = ProductTypeEnum;
  productDetail?: MasterProductProductDetails;
  productCombo?: MasterProductProductCombo;
  productPricingAndExpiry?: MasterProductPricingAndExpiry;
  productTemplate?: MasterProductProductTemplate;
  productAdvanceSettings?: MasterProductAdvanceSettings;

  tenant!: Tenant;
  program?: IProgram;
  merchantId?: number;
  merchantName?: string;
  voucherNumberRule?: VoucherNumberRule;
  voucherNumberRuleList: VoucherNumberRule[] = [];
  productInfoList: Product[] = [];
  productInfoListDisplay: Product[] = [];
  productSortedList: Product[] = [];
  productSortedListDisplay: Product[] = [];
  brandSortedList: ProductComboBrand[] = [];
  brandSortedListDisplay: ProductComboBrand[] = [];
  voucherTemplate?: MasterProductProductTemplateObject;
  smsTemplate?: MasterProductProductTemplateObject;
  expirySchemeList: ExpirationPolicy[] = [];
  taxRate: number = 1;
  _faceValueWithoutTax = 0;
  _skuCostWithoutTax = 0;
  _sellingPricePrepaid = 0;
  _productId = 0;
  ExpirationPolicyTypeEnum = ExpirationPolicyTypeEnum;

  productDetailsCollapsed = false;
  productComboCollapsed = false;
  pricingAndExpiryCollapsed = false;
  productTemplateCollapsed = false;
  externalPropertiesCollapsed = false;
  isEdit = false;
  defaultLanguageId: number;

  destroy$ = new Subject();

  get voucherTemplateName(): string {
    if (this.voucherTemplate)
      return this.voucherTemplate.templateName ?? '';
    return 'N/A';
  }

  get smsTemplateName(): string {
    if (this.smsTemplate)
      return this.smsTemplate.templateName ?? '';
    return 'N/A';
  }

  get isSuperVoucher(): boolean {
    return this.parent.productType.key === 8;
  }

  get isSmartChoiceVoucher(): boolean {
    return this.parent.productType.key === 5;
  }

  get faceValueWithoutTax(): string {
    if (this.isEdit && this._faceValueWithoutTax) {
      return this._faceValueWithoutTax.toString();
    } else {
      return this.divide(this.productPricingAndExpiry?.faceValue!, this.taxRate ?? 1)
    }
  }

  get skuCostWithoutTax(): string {
    if (this.isEdit && this._skuCostWithoutTax) {
      return this._skuCostWithoutTax.toString();
    }
    return this.divide(this.productPricingAndExpiry?.cost!, this.taxRate ?? 1);
  }

  get sellingPricePrepaidPercentage(): number | undefined {
    if (this.isEdit && this._sellingPricePrepaid) {
      return this._sellingPricePrepaid;
    } else {
      return this.divideAndToPercentage(this.productPricingAndExpiry?.sellingPricePrepaidWithTax!, this.productPricingAndExpiry?.faceValue!, this.DECIMAL_PLACES_FOUR)
    }
  }

  get productExpiryDate(): Date | undefined {
    if (this.productPricingAndExpiry?.fixExpiryDate) {
      const buLocalDateString = this.txcDateTimeService.getLocalDateTime(this.productPricingAndExpiry?.fixExpiryDate);
      return new Date(buLocalDateString);
    }
    return undefined;
  }
  get isFixedExpiryPolicy(): boolean {
    return this.productPricingAndExpiry?.isFixedExpiryPolicy ?? false;
  }
  get KEYWORD_FIX_END_OF_DAY(): string {
    return this.productVoucherGeneratorService.KEYWORD_FIX_END_OF_DAY;
  }

  get isProductEditor(): boolean {
    return this.authLibService.getElementOperationFlag([environment.product_create_op_id]);
  }

  constructor(
    private readonly authLibService: AuthorizationLibraryService,
    private readonly masterProductService: MasterProductService,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly programService: ProgramService,
    private readonly tenantConfigService: TenantConfigService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly generalService: GeneralService,
    private readonly mediaService: MediaService,
    private readonly productVoucherGeneratorService: ProductVoucherGeneratorService,
    private readonly txcDateTimeService: TxcDateTimeService,
    private readonly router: Router,
    private readonly modalService: NgbModal
  ) {
    this.defaultLanguageId = 66;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.tenant = this.tenantConfigService.getTenant();

    if (this.parent.actionMode === ActionMode.Edit) {
      this.isEdit = true;
      this.productComboCollapsed = true;
      this.pricingAndExpiryCollapsed = true;
      this.productTemplateCollapsed = true;
      this.externalPropertiesCollapsed = true;
      this.activatedRoute.params
        .pipe(takeUntil(this.destroy$))
        .subscribe((params: any) => this._productId = +params.id);
      this.getDataInEditMode(this._productId);
      this.getExternalProperties(this._productId);
    }
    if (this.parent.actionMode === ActionMode.Create) {
      this.getDataInCreateMode();
    }
  }

  jumpStep(step: number) {
    this.parent.active = step;
  }

  navigateToStep(step: number) {
    if (this.isEdit) {
      this.parent.changeUrl(step);
    } else {
      this.parent.active = step;
    }

  }


  openPreview(subType: number) {
    if (subType === this.TEMPLATE_SUBTYPE_VOUCHER && this.voucherTemplate) {
      this.masterProductApiService.getTemplateDetails(this.voucherTemplate.templateType!, this.voucherTemplate.templateVersionId!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (!res.success) {
              this.noRequiredData('product template');
              return;
            }
            const data = JSON.parse(res.data);
            const templates: Template[] = data.templateVersionInfo.items;

            this.findDefaultVoucherTemplate(templates);

            if (!this.voucherTemplate?.template) {
              this.noRequiredData('product template 1');
              return;
            }

            this.previewHtmlTemplate(this.voucherTemplate)
          },
          error: (msg) => {
            this.noRequiredData('product template2');
          },
          complete: () => { }
        });
    }
    if (subType === this.TEMPLATE_SUBTYPE_SMS && this.smsTemplate) {
      this.masterProductApiService.getTemplateDetails(this.smsTemplate.templateType!, this.smsTemplate.templateVersionId!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (!res.success) {
              this.noRequiredData('product template');
              return;
            }
            const data = JSON.parse(res.data);
            const templates: Template[] = data.templateVersionInfo.items;
            this.findDefaultSmsTemplate(templates);
            if (!this.smsTemplate?.template) {
              this.noRequiredData('product template 3');
              return;
            }
            if (this.smsTemplate.tagValueList) {
              this.smsTemplate.tagValueList.forEach((value) => {
                if (value.tagName && value.value !== null && value.value !== undefined) {
                  const template = this.smsTemplate!.template;
                  if (template?.subject1) template.subject1 = template.subject1.replace(value.tagName, value.value) ?? template.subject1
                  if (template?.subject2) template.subject2 = template.subject2.replace(value.tagName, value.value) ?? template.subject2
                  if (template?.subject3) template.subject3 = template.subject3.replace(value.tagName, value.value) ?? template.subject3
                  if (template?.content1) template.content1 = template.content1.replace(value.tagName, value.value) ?? template.content1
                  if (template?.content2) template.content2 = template.content2.replace(value.tagName, value.value) ?? template.content2
                  if (template?.content3) template.content3 = template.content3.replace(value.tagName, value.value) ?? template.content3
                }
              });
            }

            const modalRef = this.modalService.open(
              MasterProductProductTemplatePreviewComponent,
              { size: 'md', backdrop: 'static', centered: true }
            );
            modalRef.componentInstance.templatePreview = {
              templateType: this.smsTemplate.templateType ?? TemplateTypeEnum.SmsTemplate,
              subject1: this.smsTemplate.template.subject1,
              content1: this.smsTemplate.template.content1,
              subject2: this.smsTemplate.template.subject2,
              content2: this.smsTemplate.template.content2,
              subject3: this.smsTemplate.template.subject3,
              content3: this.smsTemplate.template.content3,
            }
          },
          error: (msg) => {
            this.noRequiredData('product template');
          },
          complete: () => { }
        });

    }
  }

  findDefaultSmsTemplate(templates: Template[]) {
    templates.forEach((template) => {
      if (template.defaultLanguage !== template.languageId) { return };
      if (!this.isEdit) {
        this.smsTemplate = this.productTemplate?.productTemplateList?.find(t => t.templateVersionId === template.templateVersionId);
      }
      if (!this.smsTemplate) {
        this.noRequiredData('product template');
        return;
      }
      this.smsTemplate!.template = template;
    });
  }

  findDefaultVoucherTemplate(templates: Template[]) {
    templates.forEach((template) => {
      if (template.defaultLanguage !== template.languageId) { return };
      if (!this.isEdit) {
        this.voucherTemplate = this.productTemplate?.productTemplateList?.find(t => t.templateVersionId === template.templateVersionId);
      }

      if (!this.voucherTemplate) {
        this.noRequiredData('product template');
        return;
      }
      this.voucherTemplate!.template = template;
    });
  }

  previewHtmlTemplate(template: MasterProductProductTemplateObject) {
    const tagValueList = template.tagValueList;
    if (!tagValueList) { return }
    const tagVersionId: number = template.templateVersionId || 0;

    this.masterProductApiService
      .getTagsByTemplateVersionId(tagVersionId)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const tagsByTemplateVersionId = JSON.parse(response.data).tagsByTemplateVersionId;
            const tagsByTemplateVersionIdInTemplateObject = tagsByTemplateVersionId.filter((x: any) => tagValueList.map(e => e.contentTagId ? e.contentTagId : 0).includes(x.tagId));

            tagValueList.forEach((tag: TagValueObject, i) => {
              const systemSelectedTagInfo = tagsByTemplateVersionId.find((y: any) => tag.contentTagId === y.tagId && y.category == TagCategory.SelectedBySystem);
              if (systemSelectedTagInfo) {
                tagValueList[i].replaceValue = systemSelectedTagInfo.tagName;
              }
            })
            const radioTagIds = tagsByTemplateVersionIdInTemplateObject.filter((tag: any) => tag.type == TagType.RadioGroup).map((element: any) => element.tagId);
            const imageTagIds = tagsByTemplateVersionIdInTemplateObject.filter((tag: any) => tag.type == TagType.Image).map((tagInfo: any) => tagInfo.tagId);
            const imageTagList = tagValueList.filter((tag: any) => imageTagIds.includes(tag.contentTagId));
            const imageMediaIds: number[] = imageTagList?.filter((element: any) => element.value).map((element: any) => element.value);
            this.setRadioAndImageValue(radioTagIds, imageMediaIds, tagValueList);
          }
        }
      });
  }

  setRadioAndImageValue(radioTagIds: any[], imageMediaIds: any[], tagValueList: any[]) {
    if (radioTagIds.length !== 0 && imageMediaIds.length !== 0) {
      merge(this.masterProductApiService.getTagValueByTagIds(radioTagIds), this.mediaService.getMediaByIds(imageMediaIds)).subscribe({
        next: ((response: any) => {
          const tagValueByTagId = JSON.parse(response[0].data).tagValues.items;
          tagValueList.forEach((tag: any) => {
            const tagValue = tagValueByTagId.find((y: any) => tag.contentTagId === y.tagId && tag.value == y.tagValueId.toString());
            if (tagValue) {
              tag.replaceValue = tagValue.htmlValue;
            }
          });

          const allMediaURL = JSON.parse(response[1].data).allMediaURL.items;
          tagValueList?.forEach((tag: any) => {
            const media = allMediaURL?.find((x: any) => tag.value == x.mediaId)
            if (media) {
              tag.replaceValue = media.nodeUrl;
            }
          })

        }),
        complete: () => {
          this.openModalWithReplaceTagValue(tagValueList);
        }
      })
    } else if (radioTagIds.length !== 0 || imageMediaIds.length !== 0) {
      // get value of radio tags and set the replaceValue
      if (radioTagIds.length > 0) {
        this.masterProductApiService.getTagValueByTagIds(radioTagIds).subscribe({
          next: ((response: any) => {
            const tagValueByTagId = JSON.parse(response.data).tagValues.items;
            tagValueList.forEach((tag: any) => {
              const tagValue = tagValueByTagId.find((y: any) => tag.contentTagId === y.tagId && tag.value == y.tagValueId.toString());
              if (tagValue) {
                tag.replaceValue = tagValue.htmlValue;
              }
            });
          }),
          complete: () => {
            this.openModalWithReplaceTagValue(tagValueList);
          }
        });
      }

      // get value of imageMedia tags and set the replaceValue
      if (imageMediaIds.length > 0) {
        this.mediaService.getMediaByIds(imageMediaIds).subscribe({
          next: ((response: any) => {
            const allMediaURL = JSON.parse(response.data).allMediaURL.items;
            tagValueList?.forEach((tag: any) => {
              const media = allMediaURL?.find((x: any) => tag.value == x.mediaId)
              if (media) {
                tag.replaceValue = media.nodeUrl;
              }
            })
          }),
          complete: () => {
            this.openModalWithReplaceTagValue(tagValueList);
          }
        });
      }
    } else {
      this.openModalWithReplaceTagValue(tagValueList);
    }
  }

  openModalWithReplaceTagValue(tagValueList: any[]) {
    tagValueList.forEach((value: any) => {
      let replaceValue = value.value;
      if (value.replaceValue) {
        replaceValue = value.replaceValue;
      }

      if (value.tagName && replaceValue !== null && replaceValue !== undefined) {
        const template = this.voucherTemplate!.template;
        if (template?.subject1) template.subject1 = template.subject1.replace(value.tagName, replaceValue) ?? template.subject1
        if (template?.subject2) template.subject2 = template.subject2.replace(value.tagName, replaceValue) ?? template.subject2
        if (template?.subject3) template.subject3 = template.subject3.replace(value.tagName, replaceValue) ?? template.subject3
        if (template?.content1) template.content1 = template.content1.replace(value.tagName, replaceValue) ?? template.content1
        if (template?.content2) template.content2 = template.content2.replace(value.tagName, replaceValue) ?? template.content2
        if (template?.content3) template.content3 = template.content3.replace(value.tagName, replaceValue) ?? template.content3
      }
    });

    const modalRef = this.modalService.open(
      MasterProductProductTemplatePreviewComponent,
      { size: 'lg', backdrop: 'static', centered: true }
    );
    modalRef.componentInstance.templatePreview = {
      templateType: this.voucherTemplate?.templateType ?? 1,
      subject1: this.voucherTemplate?.template?.subject1,
      content1: this.voucherTemplate?.template?.content1,
      subject2: this.voucherTemplate?.template?.subject2,
      content2: this.voucherTemplate?.template?.content2,
      subject3: this.voucherTemplate?.template?.subject3,
      content3: this.voucherTemplate?.template?.content3,
    }
  }


  private getDataInCreateMode() {
    this.masterProductApiService.getProductWizard(this.parent.wizardKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const masterProduct = this.masterProductService.wizardDataToMasterProduct(this.parent.wizardKey, res.data);
            this.bindMasterProductData(masterProduct);
            this.verifyData(masterProduct);

            if (this.tenant.name === this.TENANT_NAME_GL && masterProduct.masterProductProductDetails?.voucherIssuerId) {
              this.getMerchantAcquirer(masterProduct.masterProductProductDetails.voucherIssuerId);
            }
            if (this.tenant.name === this.TENANT_NAME_IN) {
              this.getSuperVoucherTypeSelectionValue((masterProduct.masterProductProductDetails?.isDeferredChild ?? false), (masterProduct.masterProductProductDetails?.isCartVersion ?? false));
            }
          }
          else this.noRequiredData('product wizard');
        },
        error: () => {
          this.noRequiredData('product wizard');
        }
      });
    this.getDefaultMasterProductData();
    this.getTaxRate();
  }

  private getDataInEditMode(productId: number) {
    this.masterProductApiService.getProductDetails(productId)
      .pipe(
        takeUntil(this.destroy$),
        map(res => JSON.parse(res['data']))
      )
      .subscribe({
        next: (res) => {
          res.products.items[0]['merchantAcquirer'] = res.products.items[0].voucher_Issuer_Id;
          this.productDetail = res.products.items[0];
          const productPricingAndExpiryDetail = res.products.items[0]?.productPrice;
          if (productPricingAndExpiryDetail) {
            productPricingAndExpiryDetail['isFixedExpiryPolicy'] = res.products.items[0]?.isFixedExpiryPolicy;
            productPricingAndExpiryDetail['fixExpiryDate'] = res.products.items[0]?.expiryDate;
            productPricingAndExpiryDetail['faceValue'] = res.products.items[0]?.contractSKU[0]?.faceValueWithTax;
            const skuCost = res.products.items[0]?.contractSKU[0]?.contractSKUCosts.reduce((maxDateObj: any, currentObj: any) => {
              var currentDate = currentObj.validStartDate;
              if (!maxDateObj || currentDate > maxDateObj.validStartDate) {
                return currentObj;
              }
              return maxDateObj;
            }, null);
            productPricingAndExpiryDetail['cost'] = skuCost.costWithTax;
            this.productPricingAndExpiry = productPricingAndExpiryDetail;
            this._faceValueWithoutTax = res.products.items[0].contractSKU[0]?.faceValueWithoutTax;
            this._skuCostWithoutTax = skuCost.costWithoutTax;
            const expirationPolicyIdList = res.products.items[0].productExpirySchemes.map((e: any) => e.expirationPolicyId);
            this.getExpirationPoliciesByIds(expirationPolicyIdList);
          }
          if (this.tenant.name === this.TENANT_NAME_GL) {
            this.getMerchantAcquirer(res.products.items[0].voucher_Issuer_Id);
          }
          if (this.tenant.name === this.TENANT_NAME_IN) {
            this.getSuperVoucherTypeSelectionValue(res.products.items[0].isDeferredChild, res.products.items[0].isCartVersion);
          }
          // get VNR associated to the SKU instead of the tenant config VNR
          // also, get merchant associated to the VNR instead of the tenant config merchat
          const vnrId = res.products.items[0]?.contractSKU[0]?.voucherNumberRuleId ?? 0;
          this.getVoucherNumberRuleById(vnrId, true);
        },
        error: () => { },
        complete: () => {
          // toast message sent by state and clear state afterward.
          // it is used to toast message after update product successfully in other step.
          this.parent.toastMessageInState();
        }
      });
  }

  getMerchantAcquirer(voucherIssuerId: number) {
    this.generalService.getDictionariesByIds([voucherIssuerId], 'VoucherIssuer')
      .pipe(
        takeUntil(this.destroy$),
        map(res => JSON.parse(res['data']))
      )
      .subscribe({
        next: res => {
          if (!this.productDetail) { return };
          this.productDetail['merchantAcquirer'] = res?.dictionaries[0].displayName;
        },
      })
  }

  getSuperVoucherTypeSelectionValue(isDeferredChild: boolean, isCartVersion: boolean) {
    if (!this.productDetail) { return };
    this.productDetail['superVoucherType'] = this.SUPER_VOUCHER_TYPE.find(e => e.key === ((isDeferredChild ? 2 : 0) | (isCartVersion ? 1 : 0)))?.value || '';
  }

  private bindMasterProductData(masterProduct: MasterProduct) {
    if (masterProduct.masterProductProductDetails) {
      this.productDetail = masterProduct.masterProductProductDetails;
    }
    if (masterProduct.masterProductProductCombo) {
      this.productCombo = masterProduct.masterProductProductCombo;
      if (this.productCombo?.productComboList) {
        const ids = this.productCombo.productComboList.map(
          (item) => item.childProductId
        );
        this.getProductInfoByProductId(ids);
      }
    }
    if (masterProduct.masterProductPricingAndExpiry) {
      this.productPricingAndExpiry = masterProduct.masterProductPricingAndExpiry;
      if (this.productPricingAndExpiry?.expiryPolicyIdList) {
        this.getExpirationPoliciesByIds(this.productPricingAndExpiry?.expiryPolicyIdList);
      }
    }
    if (masterProduct.masterProductProductTemplate) {
      this.productTemplate = masterProduct.masterProductProductTemplate;
      if (this.productTemplate?.productTemplateList?.length! > 0) {
        this.productTemplate?.productTemplateList!.forEach((template) => {
          this.masterProductApiService.getTemplateDetails(template?.templateType ?? 0, template?.templateVersionId ?? 0)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                const data = JSON.parse(response.data).templateVersionInfo.items;
                template.isCurrentVersion = data[0]?.isCurrentVersion;
                if (template?.templateType === TemplateType.HTML)
                  this.voucherTemplate = template;
                if (template?.templateType === TemplateType.Text)
                  this.smsTemplate = template;
              },
              error: (err) => {
                this.parent.toastDanger(err?.error?.Message);
              }
            });

        }
        )
      };
    }
    if (masterProduct.masterProductAdvanceSettings) {
      this.productAdvanceSettings = masterProduct.masterProductAdvanceSettings;
    }
  }

  getProductInfoByProductId(ids: (number | undefined)[]) {
    this.masterProductApiService
      .getProductInfoByProductIdList(ids)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            for (let p of data.productInfoMassive.items) {
              this.productInfoList.push({
                productId: p.productId,
                productName: p.productName,
                productCode: p.productCode,
                productType: p.productType,
                currentProductVersionId: p.currentProductVersionId,
                status: p.status,
                brandName:
                  p.brand === null ? undefined : p.brand?.brandName,
                faceValueWithTax:
                  p.contractSKU === null
                    ? undefined
                    : p.contractSKU?.faceValueWithTax,
              } as Product);
            }
            this.setSequenceList();
          }
        },
        error: (msg) => {
          this.noRequiredData('product list');
        },
        complete: () => {
          this.toggleProductInfoList();
          this.toggleProductSortedList();
          this.toggleBrandSortedList();
        },
      });
  }

  setSequenceList() {
    const sortedList = this.productCombo!.productComboList!.sort(
      (a, b) => {
        return (a.sequence ?? 0) - (b.sequence ?? 0);
      }
    );
    if (this.isSmartChoiceVoucher) {
      sortedList.forEach((item) => {
        const sp = this.productInfoList.find(
          (p) => p.productId == item.childProductId
        );
        if (sp) this.productSortedList.push(sp);
      });
    }
    if (this.isSuperVoucher) {
      sortedList.forEach((item) => {
        const sp = this.productInfoList.find(
          (p) => p.productId == item.childProductId
        );
        if (sp) {
          if (
            !this.brandSortedList.find(
              (b) => b.brandName === sp.brandName
            )
          ) {
            this.brandSortedList.push({
              brandName: sp.brandName,
              quantity: 1,
            } as ProductComboBrand);
          } else {
            this.brandSortedList.find(
              (b) => b.brandName === sp.brandName
            )!.quantity++;
          }
        }
      });
    }
  }

  private verifyData(masterProduct: MasterProduct) {
    const validator = this.masterProductService.verifyModel(masterProduct);
    this.parent.isVerified_productDetails = validator.verifiedProductDetails;
    this.parent.isVerified_productCombo = validator.verifiedProductCombo;
    this.parent.isVerified_pricingAndExpiry = validator.verifiedPricingAndExpiry;
    this.parent.isVerified_productTemplate = validator.verifiedProductTemplate;
    this.parent.isVerified_advanceSettings = validator.verifiedAdvanceSettings;
  }

  getExpirationPoliciesByIds(expiryPolicyIdList: number[]) {
    this.masterProductApiService.getExpirationPoliciesByIds(expiryPolicyIdList)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (!res.success) {
            this.noRequiredData('expiry policy');
            return;
          }
          const data = JSON.parse(res.data);
          const expirationPolicies: ExpirationPolicy[] = data.expirationPolicies;
          this.expirySchemeList = expirationPolicies;
          const isExpiryValid = this.productVoucherGeneratorService
            .validate(this.expirySchemeList, true, this.isFixedExpiryPolicy, this.productExpiryDate);
          if (!isExpiryValid) {
            this.parent.toastDanger(this.productVoucherGeneratorService.INVALID_ERROR);
          }
        },
        error: (msg) => {
          this.noRequiredData('expiry policy');
        },
        complete: () => { }
      });
  }

  private getProgramById(programId: number) {
    this.programService.getProgramById(programId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.data) {
            const data = JSON.parse(res.data);
            this.program = data?.programs?.items?.length > 0 ? data.programs.items[0] : null;
            if (this.program != null) {
              return;
            }
          }
          this.noRequiredData(this.REQUIRED_DATA_PROGRAM);
        },
        error: () => {
          this.noRequiredData(this.REQUIRED_DATA_PROGRAM);
        }
      });
  }

  private getDefaultMasterProductData() {
    this.tenantConfigService.getTenantConfigurations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.length > 0 && res.every(x => x.tenantId === this.tenant.id)) {
            // default merchant
            this.setDefaultMerchantByTenantConfig(res.find(x =>
              x.configType === this.CONFIG_TYPE_MASTER_PRODUCT &&
              x.configName === this.CONFIG_NAME_MERCHANT_ID));
            // default voucher number rule
            this.setDefaultVoucherNumverRuleByTenantConfig(res.find(x =>
              x.configType === this.CONFIG_TYPE_MASTER_PRODUCT &&
              x.configName === (this.parent.productType.key === ProductTypeEnum.SmartChoiceVoucher
                ? this.CONFIG_NAME_SCV_VNR_ID
                : this.CONFIG_NAME_SV_VNR_ID)));
            return;
          }
          this.noRequiredData(this.REQUIRED_DATA_TENANT_CONFIG);
        },
        error: () => {
          this.noRequiredData(this.REQUIRED_DATA_TENANT_CONFIG);
        }
      });
  }

  private setDefaultMerchantByTenantConfig(tenantConfiguration: TenantConfiguration | undefined) {
    const merchantId = tenantConfiguration?.value;
    if (merchantId && !isNaN(Number.parseInt(merchantId))) {
      this.getMerchantDataById(Number.parseInt(merchantId));
      return;
    }
    this.noRequiredData(this.REQUIRED_DATA_TENANT_CONFIG_MERCHANT_ID);
  }

  private setDefaultVoucherNumverRuleByTenantConfig(tenantConfiguration: TenantConfiguration | undefined) {
    const vnrId = tenantConfiguration?.value;
    if (vnrId && !isNaN(Number.parseInt(vnrId))) {
      this.getVoucherNumberRuleById(Number.parseInt(vnrId));
      return;
    }
    this.noRequiredData(this.REQUIRED_DATA_TENANT_CONFIG_VNR_ID);
  }

  private getMerchantDataById(merchantId: number) {
    this.masterProductApiService.getMasterProductMerchantById(merchantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            const merchant = data?.merchants?.items?.length > 0 ? data.merchants.items[0] : null;
            if (merchant != null) {
              this.getProgramById(merchant.programId);
              this.merchantId = merchant.merchantId;
              this.merchantName = merchant.name;
              return;
            }
          }
          this.noRequiredData(this.REQUIRED_DATA_MERCHANT);
        },
        error: () => {
          this.noRequiredData(this.REQUIRED_DATA_MERCHANT);
        }
      });
  }

  private getVoucherNumberRuleById(voucherNumberRuleId: number, isGettingMerchantInfo: boolean = false) {
    this.masterProductApiService.getMasterProductVoucherNumberRuleById(voucherNumberRuleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            const voucherNumberRule = data?.voucherNumberRules?.items?.length > 0 ? data.voucherNumberRules.items[0] : null;
            if (voucherNumberRule != null) {
              this.setVoucherNumberRule(voucherNumberRule);
              if (isGettingMerchantInfo) {
                this.getMerchantDataById(voucherNumberRule.merchantId);
              }
              return;
            }
          }
          this.noRequiredData(this.REQUIRED_DATA_VNR);
        },
        error: () => {
          this.noRequiredData(this.REQUIRED_DATA_VNR);
        }
      });
  }

  private setVoucherNumberRule(vnr: any) {
    this.voucherNumberRule = {
      ruleName: vnr.ruleName,
      voucherNumberPrefix: vnr.voucherNumberPrefix,
      voucherNumberType: !isNaN(Number.parseInt(vnr.voucherNumberType))
        ? VoucherNumberTypeEnum[Number.parseInt(vnr.voucherNumberType)] : '',
      voucherNumberLength: vnr.voucherNumberLength,
      barcodeType: vnr.barcodeType?.description,
      distVoucherNumUnderBarcode: vnr.distVoucherNumUnderBarcode ? this.Y : this.N,
      pinType: vnr.pinType?.description,
      createdBy: vnr.createdBy,
      createdDateTime: vnr.createdDateTime,
    } as VoucherNumberRule;
    this.voucherNumberRuleList.push(this.voucherNumberRule);
  }

  private getTaxRate() {
    this.masterProductApiService.getTaxRate()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (!res.success) {
            this.noRequiredData('tax rate');
            return;
          }
          const data = JSON.parse(res.data);
          this.taxRate = data.taxRateByTenantId?.companyTaxRate;
          if (this.taxRate == null || isNaN(this.taxRate!)) {
            this.noRequiredData('tax rate');
          }
        },
        error: (msg) => {
          this.noRequiredData('tax rate');
        },
        complete: () => { }
      });
  }

  getProductById(productId: number) {
    this.masterProductApiService.getProductDetailsById(productId)
      .pipe(
        takeUntil(this.destroy$),
        map(res => JSON.parse(res['data']))
      )
      .subscribe({
        next: (res) => {
          this.productDetail = res.products.items[0];
        },
        error: (err) => {
          this.parent.toastDanger(err?.error?.message);
        }
      })
  }

  getProductCombo(productId: number) {
    this.masterProductApiService.getMasterProductCombo(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.productCombo = {
              productComboList: res.data
            };
            const versionId = res.data.map((e: any) => e.childProductVersionId)
            this.masterProductApiService.getProductVersionsByIdList(versionId)
              .pipe(
                takeUntil(this.destroy$),
                map(res => JSON.parse(res['data']))
              )
              .subscribe({
                next: (res) => {
                  this.productInfoList = this.masterProductService.convertProductVersionsDataToProductList(res, this.productCombo?.productComboList);
                },
                complete: () => {
                  this.setSequenceList();
                  this.toggleProductInfoList();
                  this.toggleProductSortedList();
                  this.toggleBrandSortedList();
                },
              });
          }
        },
        error: (err) => {
          this.parent.toastDanger(err?.error?.message);
        }
      })

  }

  getProductPricingInfo(productId: number) {
    this.masterProductApiService.getProductPricingInfo([productId])
      .pipe(
        takeUntil(this.destroy$),
        map(res => JSON.parse(res['data']))
      )
      .subscribe({
        next: (res) => {
          this.productPricingAndExpiry = res.productInfoByProductCodeList[0].productPrice;
        },
        error: (err) => {
          this.parent.toastDanger(err?.error?.Message);
        }
      })
  }

  getProductTemplate(productId: number) {
    this.masterProductApiService.getTemplateByProductId(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (!res.data) { return };
          const templateList = res.data?.productTemplate;
          this.setTemplateData(templateList);
        },
        error: (err) => {
          this.parent.toastDanger(err?.error?.Message);
        }
      });
  }

  setTemplateData(templateList: any) {
    const typeList = [TemplateType.HTML, TemplateType.Text];
    typeList.forEach(type => {
      const templateData = templateList.find((e: any) => e.templateType === type);
      if (templateData) {
        const templateVersion = templateData.productTemplateVersion.find((template: any) => template.languageId === templateData.defaultLanguageId)
        templateData.tagValueList = templateVersion.templateTagValue;

        templateData.tagValueList?.forEach((tag: any) => {
          if (tag.tagId != undefined && tag.tagId > 0) {
            tag.contentTagId = tag.tagId;
          }
        })

        this.masterProductApiService.getTemplateDetails(type, templateVersion?.templateVersionId ?? 0)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              const data = JSON.parse(response.data).templateVersionInfo.items;
              templateData.isCurrentVersion = data[0]?.isCurrentVersion;
              templateData.templateVersionId = templateVersion?.templateVersionId ?? 0
              if (type === TemplateType.HTML) {
                this.voucherTemplate = templateData;
              }
              if (type === TemplateType.Text) {
                this.smsTemplate = templateData;
              }
            },
            error: (err) => {
              this.parent.toastDanger(err?.error?.Message);
            }
          });
      }
    });
  }

  getExternalProperties(productId: number) {
    this.masterProductApiService.getExternalPropertiesByProductId(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (!res.data) { return };
          this.productAdvanceSettings = {
            'productExternalPropertyList': res.data
          };
        },
        error: (err) => {
          this.parent.toastDanger(err?.error?.Message);
        }
      });
  }

  private noRequiredData(data: string) {
    this.parent.toastDanger(`Error in getting the ${data} for master product.`);
  }

  toggleProductInfoList() {
    if (this.productInfoListDisplay.length !== this.PRODUCT_LIST_DEFAULT_SIZE) {
      this.productInfoListDisplay = this.productInfoList.slice(0, this.PRODUCT_LIST_DEFAULT_SIZE);
    }
    else {
      this.productInfoListDisplay = this.productInfoList;
    }
  }

  toggleProductSortedList() {
    if (this.productSortedListDisplay.length !== this.PRODUCT_SORTED_LIST_DEFAULT_SIZE) {
      this.productSortedListDisplay = this.productSortedList.slice(0, this.PRODUCT_SORTED_LIST_DEFAULT_SIZE);
    }
    else {
      this.productSortedListDisplay = this.productSortedList;
    }
  }

  toggleBrandSortedList() {
    if (this.brandSortedListDisplay.length !== this.BRAND_SORTED_LIST_DEFAULT_SIZE) {
      this.brandSortedListDisplay = this.brandSortedList.slice(0, this.BRAND_SORTED_LIST_DEFAULT_SIZE);
    }
    else {
      this.brandSortedListDisplay = this.brandSortedList;
    }
  }

  toggleContainer(cardName: string) {
    switch (cardName) {
      case 'productDetailsCollapsed': {
        this.productDetailsCollapsed = !this.productDetailsCollapsed;
        break;
      }
      case 'productComboCollapsed': {
        this.productComboCollapsed = !this.productComboCollapsed;
        if (this.productComboCollapsed === false && this.isEdit) {
          this.getProductCombo(this._productId);
        }
        break;
      }
      case 'pricingAndExpiryCollapsed': {
        this.getTaxRate();
        this.pricingAndExpiryCollapsed = !this.pricingAndExpiryCollapsed;
        break;
      }
      case 'productTemplateCollapsed': {
        this.productTemplateCollapsed = !this.productTemplateCollapsed;
        if (this.productTemplateCollapsed === false && this.isEdit) {
          this.getProductTemplate(this._productId);
        }
        break;
      }
      case 'externalPropertiesCollapsed': {
        this.externalPropertiesCollapsed = !this.externalPropertiesCollapsed;
        break;
      }
    }
  }

  private divide(dividend: number, divisor: number, decimalPlaces: number = 4): string {
    return Number(Math.round(parseFloat((dividend / divisor) + 'e' + decimalPlaces)) + 'e-' + decimalPlaces)
      .toFixed(decimalPlaces);
  }

  private divideAndToPercentage(dividend: number, divisor: number, decimalPlaces: number = 2): number {
    return Number(Math.round(parseFloat((dividend / divisor) + 'e' + (decimalPlaces + 2))) + 'e-' + decimalPlaces);
  }


}
