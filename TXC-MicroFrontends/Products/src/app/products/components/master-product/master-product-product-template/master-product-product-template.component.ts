import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Tenant } from '@txc-angular/authorization-library/models/tenant.model';
import { filter, Subject, takeUntil } from 'rxjs';
import { ActionMode, MasterProduct, MasterProductProductTemplateObject } from 'src/app/products/models/master-product/master-product.model';
import { ProductTemplateItem, ProductTemplateUpdateRequest, TemplateTagValueItem } from 'src/app/products/models/product-template-update-request.model';
import { TemplateSubType, TemplateType } from 'src/app/products/models/product-template.model';
import { TenantConfiguration } from 'src/app/products/models/tenant-configuration.model';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { MasterProductService } from 'src/app/products/services/master-product.service';
import { MasterProductTemplateService } from 'src/app/products/services/master-product-template.service';
import { TenantConfigService } from 'src/app/products/services/tenant-config.service';
import { SmsTemplateComponent } from '../../shared/sms-template/sms-template.component';
import { VoucherTemplateComponent } from '../../shared/voucher-template/voucher-template.component';

@Component({
  selector: 'app-master-product-product-template',
  templateUrl: './master-product-product-template.component.html',
  styleUrls: ['./master-product-product-template.component.scss']
})
export class MasterProductProductTemplateComponent implements OnInit {
  @Input() parent!: any;
  @ViewChild('voucherTemplate') voucherTemplate!: VoucherTemplateComponent;
  @ViewChild('smsTemplate') smsTemplate!: SmsTemplateComponent;

  public get templateType(): typeof TemplateType {
    return TemplateType;
  }

  public get templateSubType(): typeof TemplateSubType {
    return TemplateSubType;
  }

  readonly STEP = 4;
  readonly ERROR_UPDATE_PRODUCT_TEMPLATE = "Unable to update product templates. Please try again later.";
  readonly CONFIG_TYPE_MASTER_PRODUCT = "MasterProduct";
  readonly CONFIG_TYPE_DEDAULT_VOUCHER_TEMPLATE_ID = "DefaultVoucherTemplateId";
  readonly CONFIG_TYPE_DEDAULT_VOUCHER_TEMPLATE_TAG_VALUES = "DefaultVoucherTemplateTagValues";
  readonly DEFAULT_TEMPLATE_NOT_FOUND = "Default Voucher Template not found";
  readonly PRODUCT_TEMPLATE_NOT_FOUND_MESSAGE_IN_API = "Product Template Not Found";


  activeTab: TemplateSubType = TemplateSubType.Voucher;
  masterProduct?: MasterProduct;
  tenant!: Tenant;
  voucherTemplates: MasterProductProductTemplateObject[] = [];
  smsTemplates: MasterProductProductTemplateObject[] = [];
  isDataLoaded: boolean = false;
  defaultVoucherTemplateId: number = 0;
  destroy$ = new Subject();

  constructor(
    private readonly masterProductApiService: MasterProductApiService,
    private readonly masterProductService: MasterProductService,
    private readonly tenantConfigService: TenantConfigService,
    private readonly masterProductTemplateService: MasterProductTemplateService
  ) { }

  ngOnInit(): void {

    this.tenant = this.tenantConfigService.getTenant();
    this.masterProductServiceSubscribe();

    // Create
    if (this.parent.actionMode == ActionMode.Create && this.parent.wizardKey) {
      if (this.parent.wizardKey) {
        this.getMasterProductByWizard(this.parent.wizardKey);
      }
    }
    // Edit
    if (this.parent.actionMode == ActionMode.Edit && this.parent.productId) {
      this.getProductTemplateByProductId(this.parent.productId);
    }
  }

  private getMasterProductByWizard(wizardKey: string) {
    this.isDataLoaded = false;
    this.masterProductApiService.getProductWizard(wizardKey).subscribe({
      next: (res) => {
        if (res.success) {
          this.masterProduct = this.masterProductService.wizardDataToMasterProduct(wizardKey, res.data);

          if (this.masterProduct?.masterProductProductTemplate?.productTemplateList) {
            this.voucherTemplates = this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType === TemplateType.HTML);
            this.smsTemplates = this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType === TemplateType.Text);
          }
          this.updateMasterProduct();
          this.getDefaultVoucherTemplateData();
        }
        else {
          this.parent.toastDanger('Error getting data from wizard');
        }
      },
      error: () => {
        this.parent.toastDanger('Error getting data from wizard');
      }
    });
  }

  private getProductTemplateByProductId(productId: number) {
    if (this.masterProduct == null) {
      this.masterProduct = new MasterProduct(this.tenant);
      this.masterProduct.masterProductProductTemplate = {};
      this.masterProduct.masterProductProductTemplate.productTemplateList = [];
    }
    this.masterProductApiService.getTemplateByProductId(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success || res.message === this.PRODUCT_TEMPLATE_NOT_FOUND_MESSAGE_IN_API) {
            const templateList = res.data?.productTemplate;
            let templateModelList: any[] = [];

            templateList?.forEach((template: any) => {
              template.productTemplateVersion?.forEach((version: any) => {
                let tags: any[] = [];
                version.templateTagValue?.forEach((tag: any) => {
                  const productTag = {
                    contentTagId: tag.tagId,
                    tagName: tag.tagName,
                    value: tag.value,
                    textValue: tag.textValue
                  };
                  tags.push(productTag);
                })
                const productTemplate = {
                  templateId: template.templateId,
                  templateType: template.templateType,
                  templateSubType: template.templateSubType,
                  templateVersionId: version.templateVersionId,
                  templateName: template.templateName,
                  defaultLanguageId: template.defaultLanguageId,
                  languageId: version.languageId,
                  tagValueList: tags
                };
                templateModelList.push(productTemplate);
              })
            });

            const voucherTemplates = templateModelList
              .filter((e: any) => e.templateType === TemplateType.HTML);
            this.voucherTemplates = voucherTemplates;
            const smsTemplates = templateModelList
              .filter((e: any) => e.templateType === TemplateType.Text);
            this.smsTemplates = smsTemplates;
            if (this.masterProduct != null) {
              this.masterProduct.masterProductProductTemplate.productTemplateList = templateModelList;
              this.updateMasterProduct();
              this.getDefaultVoucherTemplateData();
            }
          }
        },
        error: (err) => {
          this.parent.toastDanger(err?.error?.Message);
        }
      });
  }

  private getDefaultVoucherTemplateData() {
    this.tenantConfigService.getTenantConfigurations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const defaultVoucherTemplate = res?.find(x =>
            x.configType === this.CONFIG_TYPE_MASTER_PRODUCT &&
            x.configName === this.CONFIG_TYPE_DEDAULT_VOUCHER_TEMPLATE_ID);
          const defaultVoucherTemplateTagValues = res?.find(x =>
            x.configType === this.CONFIG_TYPE_MASTER_PRODUCT &&
            x.configName === this.CONFIG_TYPE_DEDAULT_VOUCHER_TEMPLATE_TAG_VALUES);
          this.setDefaultTemplateByTenantConfig(defaultVoucherTemplate, defaultVoucherTemplateTagValues);
          return;
        },
        error: (err) => {
          this.parent.toastDanger(err?.error?.Message);
        }
      });
  }

  private setDefaultTemplateByTenantConfig(defaultVoucherTemplateIdConfig: TenantConfiguration | undefined, defaultVoucherTemplateTagValuesConfig: any): void {
    const defaultVoucherTemplateId = defaultVoucherTemplateIdConfig?.value;
    const defaultVoucherTemplateTagValues = JSON.parse(defaultVoucherTemplateTagValuesConfig?.value);
    let tagValue;
    if (defaultVoucherTemplateId && !isNaN(Number.parseInt(defaultVoucherTemplateId))) {
      this.defaultVoucherTemplateId = Number.parseInt(defaultVoucherTemplateId);
      if (defaultVoucherTemplateTagValues.length > 0) {
        tagValue = defaultVoucherTemplateTagValues[0].Value;
      }
    }
    this.getDefaultVoucherTemplateDataById(this.defaultVoucherTemplateId, defaultVoucherTemplateTagValues);
    return;
  }

  private getDefaultVoucherTemplateDataById(templateId: number, tagValues?: any) {
    if (templateId > 0) {
      this.masterProductTemplateService
        .getTemplateDetailsCurrentVersion(TemplateType.HTML, templateId)
        .subscribe({
          next: (response: any) => {
            const data = JSON.parse(response.data).templateVersionInfo;

            if (data.items.length <= 0) {
              this.parent.toastDanger(this.DEFAULT_TEMPLATE_NOT_FOUND);
            }

            let defaultVoucherTemplateVersions: any[] = [];
            let defaultVoucherTemplateVersionId: number = 0;

            data.items.forEach((element: any) => {
              let productTemplate = {
                templateId: element.templateId,
                templateType: TemplateType.HTML,
                templateSubType: TemplateSubType.Voucher,
                templateVersionId: element.templateVersionId,
                templateName: element.templateName,
                defaultLanguageId: element.defaultLanguage,
                languageId: element.languageId,
              };

              if (element.isCurrentVersion && element.defaultLanguage === element.languageId) {
                defaultVoucherTemplateVersionId = element.templateVersionId;
                this.masterProductApiService.getTagsByTemplateVersionId(defaultVoucherTemplateVersionId).subscribe({
                  next: (res: any) => {
                    if (res.success) {
                      const tagsData = JSON.parse(res.data).tagsByTemplateVersionId;
                      let tagValueList: {
                        tagValueList: {
                          contentTagId: any;
                          tagName: any;
                          value: any;
                        }[];
                      } = { tagValueList: [] };
                      tagsData.forEach((tag: any) => {
                        if (tagValues[0].Value && tagValues[0].ContentTagId === tag.tagId) {
                          tagValueList.tagValueList.push({
                            contentTagId: tag.tagId,
                            tagName: tag.tagName,
                            value: tagValues[0].Value,
                          });
                        }
                        else if (tag.category === 2 || tag.category === 3) {
                          tagValueList.tagValueList.push({
                            contentTagId: tag.tagId,
                            tagName: tag.tagName,
                            value: '',
                          });
                        }
                      });
                      productTemplate = { ...productTemplate, ...tagValueList }
                      defaultVoucherTemplateVersions.push(productTemplate);
                    }
                    else {
                      if (this.masterProduct?.masterProductProductTemplate?.productTemplateList)
                        this.masterProduct.masterProductProductTemplate.productTemplateList = [];
                      this.voucherTemplates = [];                    
                      this.parent.toastDanger(res.message);
                    }
                  },
                  error: (err) => {
                    if (this.masterProduct?.masterProductProductTemplate?.productTemplateList)
                      this.masterProduct.masterProductProductTemplate.productTemplateList = [];
                    this.voucherTemplates = [];
                    this.parent.toastDanger(err.message ?? err.error.message);
                  },
                  complete: () => {
                    this.setupDefaultVoucherTemplate(defaultVoucherTemplateVersions);
                  }
                });

              }
            });
          },
          error: (err) => {
            this.parent.toastDanger(err.message ?? err.error.message);
          }
        })
    }
    else if (templateId === 0) {
      this.isDataLoaded = true;
      this.activeTab = TemplateSubType.Voucher;
      this.parent.verify((this.voucherTemplates?.length ?? 0) > 0);
    }
  }

  private setupDefaultVoucherTemplate(defaultVoucherTemplateVersions: any) {
    if (this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType === TemplateType.HTML).length == 0) {
      this.masterProduct?.masterProductProductTemplate?.productTemplateList?.push(...defaultVoucherTemplateVersions);
      this.voucherTemplates = this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType === TemplateType.HTML);
    }
    else if (this.masterProduct?.masterProductProductTemplate?.productTemplateList == null) {
      if (this.masterProduct == null) {
        return;
      }
      this.masterProduct.masterProductProductTemplate.productTemplateList = defaultVoucherTemplateVersions;
      this.voucherTemplates = this.masterProduct.masterProductProductTemplate.productTemplateList!.filter((x) => x.templateType === TemplateType.HTML);
    }
    else if (this.parent.actionMode == ActionMode.Create) {
      if (this.masterProduct == null) {
        return;
      }
      this.masterProduct.masterProductProductTemplate.productTemplateList = this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType !== TemplateType.HTML);
      this.masterProduct?.masterProductProductTemplate?.productTemplateList?.push(...defaultVoucherTemplateVersions ?? []);
      this.voucherTemplates = this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType === TemplateType.HTML);
    }
    this.isDataLoaded = true;
    this.activeTab = TemplateSubType.SMS;
    this.parent.verify((this.voucherTemplates?.length ?? 0) > 0);
  }

  private masterProductServiceSubscribe() {
    this.masterProductService.nextStep$
      .pipe(
        filter(step => step !== this.STEP),
        takeUntil(this.destroy$)
      ).subscribe(_ => {
        this.onStepChange();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  public showErrorMessage(errorMessage: string) {
    this.parent.toastDanger(errorMessage);
  }

  public updateMasterProduct() {
    this.refreshMasterProduct(this.parent.wizardKey);
    this.parent.verify((this.voucherTemplates?.length ?? 0) > 0);
  }

  public onNavChange() {
    this.refreshMasterProduct(this.parent.wizardKey);
  }

  private onStepChange() {
    // Create
    if (this.parent.actionMode == ActionMode.Create && this.parent.wizardKey) {
      if (this.parent.wizardKey) {
        this.onPushDataToModel(this.parent.wizardKey);
      }
    }
    // Edit
    if (this.parent.actionMode == ActionMode.Edit && this.parent.productId) {
      this.refreshMasterProduct(this.parent.wizardKey)
      this.uploadProductTemplate();
    }
  }

  private refreshMasterProduct(wizardKey: string) {
    if (this.masterProduct == null) {
      return;
    }

    if (!this.masterProduct.masterProductProductTemplate) {
      this.masterProduct.masterProductProductTemplate = {}
    }

    if (this.voucherTemplate) {
      let voucherTemplateList = this.voucherTemplate.updateProductTemplateList();
      if (this.masterProduct.masterProductProductTemplate.productTemplateList) {
        this.masterProduct.masterProductProductTemplate.productTemplateList = this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType === TemplateType.Text);
        this.masterProduct.masterProductProductTemplate.productTemplateList.push(...voucherTemplateList ?? []);
      }
      else {
        this.masterProduct.masterProductProductTemplate.productTemplateList = voucherTemplateList;
      }
      this.voucherTemplates = this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType === TemplateType.HTML);
    }

    if (this.smsTemplate) {
      let smsTemplateList = this.smsTemplate.updateProductTemplateList();
      if (this.masterProduct.masterProductProductTemplate.productTemplateList) {
        this.masterProduct.masterProductProductTemplate.productTemplateList = this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType === TemplateType.HTML);
        this.masterProduct.masterProductProductTemplate.productTemplateList.push(...smsTemplateList ?? []);
      }
      else {
        this.masterProduct.masterProductProductTemplate.productTemplateList = smsTemplateList;
      }
      this.smsTemplates = this.masterProduct?.masterProductProductTemplate?.productTemplateList?.filter((x) => x.templateType === TemplateType.Text);
    }
    this.masterProduct.wizardKey = wizardKey;
  }

  private onPushDataToModel(wizardKey: string) {
    if (this.masterProduct == null) {
      throw new Error('Did not get initial product data from master product service.');
    }
    this.refreshMasterProduct(wizardKey)
    this.masterProductService.pushMasterProduct(this.masterProduct, this.STEP);
  }

  private uploadProductTemplate() {

    let productTemplateList: ProductTemplateItem[] = [];

    this.masterProduct?.masterProductProductTemplate?.productTemplateList?.forEach((template: any) => {
      let tags: TemplateTagValueItem[] = [];
      template.tagValueList?.forEach((tag: any) => {
        const productTag: TemplateTagValueItem = {
          tagId: tag.contentTagId,
          value: tag.value,
          textValue: tag.textValue
        };
        tags.push(productTag);
      })

      const productTemplate: ProductTemplateItem = {
        templateType: template.templateType,
        templateSubType: template.templateSubType,
        templateVersionId: template.templateVersionId,
        templateTagValue: tags
      };
      productTemplateList.push(productTemplate);
    });

    let data: ProductTemplateUpdateRequest = {
      productId: this.parent.productId,
      product_template_item: productTemplateList
    };

    this.masterProductApiService.updateProductTemplate(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.parent.notifyUpdateSuccess();
            return;
          }
          this.parent.toastDanger(this.ERROR_UPDATE_PRODUCT_TEMPLATE);
        },
        error: () => {
          this.parent.toastDanger(this.ERROR_UPDATE_PRODUCT_TEMPLATE);
        }
      });
  }
}
