import { APP_BASE_HREF } from '@angular/common';
import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { Tenant } from '@txc-angular/authorization-library/models/tenant.model';
import { BehaviorSubject, filter, lastValueFrom, Subject, takeUntil } from 'rxjs';
import { PRODUCT_CONSTANTS } from 'src/app/products/constants/product-constants';
import { MultipleSelectionTypeEnum } from 'src/app/products/enums/multiple-selection-type.enum';
import { ProductCategoryEnum } from 'src/app/products/enums/product-category.enum';
import { ProductIssuerEnum } from 'src/app/products/enums/product-issuer.enum';
import { ProductTagEnum } from 'src/app/products/enums/product-tag.enum';
import { ProductTypeEnum } from 'src/app/products/enums/product-type.enum';
import { VoucherNumberTypeEnum } from 'src/app/products/enums/voucher-number-type.enum';
import { BaseResponse } from 'src/app/products/models/base-response.model';
import { IBUFormGroup, MasterProductBUFormGroupFactory } from 'src/app/products/models/master-product/master-product-form-group.model';
import { ActionMode, MasterProduct, MasterProductProductDetails } from 'src/app/products/models/master-product/master-product.model';
import { ProductType } from 'src/app/products/models/product-type.model';
import { ProductUpdateRequest } from 'src/app/products/models/product-update-request.model';
import { IProgram } from 'src/app/products/models/program.model';
import { TenantConfiguration } from 'src/app/products/models/tenant-configuration.model';
import { VoucherNumberRule } from 'src/app/products/models/voucher-number-rule.model';
import { GeneralService } from 'src/app/products/services/general.service';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { MasterProductService } from 'src/app/products/services/master-product.service';
import { ProgramService } from 'src/app/products/services/program.service';
import { TenantConfigService } from 'src/app/products/services/tenant-config.service';
import { StepEnum } from '../master-product.component';

@Component({
  selector: 'app-master-product-product-details',
  templateUrl: './master-product-product-details.component.html',
  styleUrls: ['./master-product-product-details.component.scss']
})
export class MasterProductProductDetailsComponent implements OnInit, OnDestroy {

  @Input() parent!: any;

  readonly STEP = StepEnum.Details;
  readonly SUPER_VOUCHER_TYPE = PRODUCT_CONSTANTS.SUPER_VOUCHER_TYPE;
  readonly MERCHANT_ACQUIRER_CATEGORY = "VoucherIssuer";
  readonly TIMEOUT_BEFORE_NAVIGATION = 5500;
  readonly DASH = "-";
  readonly Y = "Y";
  readonly N = "N";
  readonly NO = "No";
  readonly NOT_REQUIRED = "Not Required";
  readonly NOT_APPLICABLE = "N/A";
  // tenant names
  readonly TENANT_NAME_TW = "TW";
  readonly TENANT_NAME_IN = "IN";
  readonly TENANT_NAME_GL = "GL";
  // required data names
  readonly REQUIRED_DATA_MERCHANT_ACQUIRER = "merchant acquirer list";
  readonly REQUIRED_DATA_TENANT_CONFIG = "tenant config";
  readonly REQUIRED_DATA_TENANT_CONFIG_MERCHANT_ID = "tenant config merchantId";
  readonly REQUIRED_DATA_TENANT_CONFIG_VNR_ID = "tenant config voucherNumberRuleId";
  readonly REQUIRED_DATA_TENANT_CONFIG_CONTRACT_ID = "tenant config contractId";
  readonly REQUIRED_DATA_MERCHANT = "merchant";
  readonly REQUIRED_DATA_PROGRAM = "program";
  readonly REQUIRED_DATA_VNR = "voucher number rule";
  readonly REQUIRED_DATA_ACCEPTANCE_LOOP = "acceptance loop";
  // tenant config
  readonly CONFIG_TYPE_MASTER_PRODUCT = "MasterProduct";
  readonly CONFIG_NAME_MERCHANT_ID = "MerchantId";
  readonly CONFIG_NAME_SCV_VNR_ID = "SmartChoiceVoucherVoucherNumberRuleId";
  readonly CONFIG_NAME_SV_VNR_ID = "SuperVoucherVoucherNumberRuleId";
  readonly CONFIG_NAME_SCV_CONTRACT_ID = "SmartChoiceVoucherContractId";
  readonly CONFIG_NAME_SV_CONTRACT_ID = "SuperVoucherContractId";
  // routing related
  readonly ROUTING_PATH_CREATE_PRODUCT = "products/product/create";
  readonly ROUTING_PATH_MERCHANTS_MFE = "merchants";
  readonly ROUTING_PATH_MERCHANT_DETAILS = "details";
  readonly QUERY_PARAM_TENANT = "tenantName";
  readonly QUERY_PARAM_MERCHANT_ID = "merchantId";
  // error message
  readonly ERROR_INIT_PRODUCT_WIZARD = "Unable to initiate product wizard. Please try again later.";
  readonly ERROR_GETTING_WIZARD_DATA = "Unable to get data from wizard";
  readonly ERROR_GETTING_PRODUCT_DATA = "Unable to get product information";
  readonly ERROR_CHECKING_PRODUCT_CODE = "Unable to check uniqueness of product code in database. Please try again later.";
  readonly ERROR_REQUIRED_DATA = "Missing required data:";
  readonly ERROR_UPDATE_PRODUCT = "Unable to update product details. Please try again later.";
  readonly ERROR_PRODUCT_TYPE_INCONSISTENT = "Product type is different from the type in details";
  readonly ERROR_SHOWING_VNR = `${this.ERROR_REQUIRED_DATA} ${this.REQUIRED_DATA_VNR}`;
  // form control custom errors
  readonly NOT_UNIQUE = "notUnique";

  masterProduct?: MasterProduct;
  detailsFormGroup!: FormGroup;
  buFormGroup!: IBUFormGroup;

  program?: IProgram;
  merchantId?: number;
  merchantName?: string;
  skuName$ = new BehaviorSubject<string|null>('');
  skuNumber$ = new BehaviorSubject<string|null>('');
  voucherNumberRule?: VoucherNumberRule;
  voucherNumberRuleList: VoucherNumberRule[] = [];
  acceptanceLoopId?: number;
  merchantAcquirers?: KeyValueType[];

  userName: string = "";
  tenant!: Tenant;
  productType!: ProductType;
  ProductTypeEnum = ProductTypeEnum;
  missingRequiredData: string[] = [];
  isProductTypeError = false;

  destroy$ = new Subject();

  // form
  get f(): any {
    return this.detailsFormGroup.controls;
  }

  constructor(
    @Inject(APP_BASE_HREF) private readonly appBaseHref: string,
    private readonly authorizationLibraryService: AuthorizationLibraryService,
    private readonly tenantConfigService: TenantConfigService,
    private readonly masterProductService: MasterProductService,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly programService: ProgramService,
    private readonly generalService: GeneralService,
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
  ) {

  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.tenant = this.tenantConfigService.getTenant();
    this.productType = this.parent.productType as ProductType;

    this.setFormGroup();

    this.subscribeProductService();
    this.subscribeFormGroupValueChange();

    if (this.parent.actionMode == ActionMode.Create) {
      this.getDefaultMasterProductData();
    }
    if (this.tenant.name === this.TENANT_NAME_GL) {
      this.getMerchantAcquirers();
    }

    this.bindProductNameAndSkuName();
    if (this.parent.actionMode == ActionMode.Create) {
      this.bindProductCodeAndSkuNumber();
    }

    // Create
    if (this.parent.actionMode == ActionMode.Create && this.parent.wizardKey) {
      this.getMasterProductByWizard(this.parent.wizardKey);
      return;
    }
    // Edit
    if (this.parent.actionMode == ActionMode.Edit && this.parent.productId) {
      this.getProductDetailsByProductId(this.parent.productId);
      this.buFormGroup.disableFieldsForEditMode();

      this.authorizationLibraryService.userAuthClaim
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.userName = data.user.userName ? data.user.userName : "";
        });
    }
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (formControl.valid) return;

    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  navigateToMerchantDetails() {
    let url = this.router.serializeUrl(this.router.createUrlTree([
      this.appBaseHref,
      this.ROUTING_PATH_MERCHANTS_MFE,
      this.ROUTING_PATH_MERCHANT_DETAILS]));
    url += `?${this.QUERY_PARAM_TENANT}=${this.tenant.name}&${this.QUERY_PARAM_MERCHANT_ID}=${this.merchantId}`;
    window.open(url, '_blank');
  }

  private getMerchantAcquirers() {
    this.generalService.getDictionariesByCategory(this.MERCHANT_ACQUIRER_CATEGORY)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            const dictionaries = data?.dictionaries;
            if (dictionaries != null) {
              this.merchantAcquirers = (dictionaries as any[]).map(x => {
                return {
                  key: x.dictionaryId,
                  value: x.displayName,
                } as KeyValueType
              });
              return;
            }
          }
          this.noRequiredData(this.REQUIRED_DATA_MERCHANT_ACQUIRER);
        },
        error: () => {
          this.noRequiredData(this.REQUIRED_DATA_MERCHANT_ACQUIRER);
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
            x.configName === (this.productType.key === ProductTypeEnum.SmartChoiceVoucher 
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
              if (this.parent.actionMode == ActionMode.Create) {
                this.getDefaultAcceptanceLoopByMerchantId(merchant.merchantId);
              }
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

  private getDefaultAcceptanceLoopByMerchantId(merchantId: number) {
    this.masterProductApiService.getDefaultAcceptanceLoopByMerchantId(merchantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.data) {
            const data = JSON.parse(res.data);
            this.acceptanceLoopId = data?.monoAcceptanceLoopByMerchantId?.items?.length > 0 
              ? data.monoAcceptanceLoopByMerchantId.items[0]?.acceptanceLoopId : null;
            if (this.acceptanceLoopId != null && this.acceptanceLoopId > 0) {
              return;
            }
          }
          this.noRequiredData(this.REQUIRED_DATA_ACCEPTANCE_LOOP);
        },
        error: () => {
          this.noRequiredData(this.REQUIRED_DATA_ACCEPTANCE_LOOP);
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

  private noRequiredData(data: string, isNextStepAllowed: boolean = false) {
    this.parent.toastDanger(`Error in getting the ${data} for master product. Please try again later.`);
    if (!isNextStepAllowed) {
      this.missingRequiredData.push(data);
    }
  }

  private navigateToCreateProductTypeSelection() {
    this.router.navigate([this.ROUTING_PATH_CREATE_PRODUCT]);
  }

  // set up form group by tenant
  private setFormGroup() {
    let buFormGroupFactory = new MasterProductBUFormGroupFactory(this.formBuilder);
    this.buFormGroup = buFormGroupFactory.getBUFormGroup(this.tenant.name, this.productType);
    this.detailsFormGroup = this.buFormGroup.formGroup;
  }

  private getMasterProductByWizard(wizardKey: string) {
    this.masterProductApiService.getProductWizard(wizardKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.masterProduct = this.masterProductService.wizardDataToMasterProduct(wizardKey, res.data);

            let details = this.masterProduct!.masterProductProductDetails;
            if (details) {
              this.buFormGroup.setValues(details);
              this.markAllAsDirty();
              this.skuName$.next(this.detailsFormGroup.get("productName")?.value);
              this.skuNumber$.next(this.detailsFormGroup.get("productCode")?.value);
              return;
            }
          }

          this.parent.toastDanger(this.ERROR_GETTING_WIZARD_DATA);
        },
        error: () => {
          this.parent.toastDanger(this.ERROR_GETTING_WIZARD_DATA);
        }
      });
  }

  private getProductDetailsByProductId(productId: number) {
    if (this.masterProduct == null) {
      this.masterProduct = new MasterProduct(this.tenant);
    }
    this.masterProductApiService.getProductDetailsById(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            const product = data.products?.items != null && data.products?.items.length > 0 ? data.products?.items[0] : null;
            if (product) {
              const sku = product.contractSKU != null && product.contractSKU.length > 0 ? product.contractSKU[0] : null;
              this.skuName$.next(sku?.skuName);
              this.skuNumber$.next(sku?.skuNumber);
              // get VNR associated to the SKU instead of the tenant config VNR
              // also, get merchant associated to the VNR instead of the tenant config merchat
              this.getVoucherNumberRuleById(sku?.voucherNumberRuleId, true);  

              this.masterProduct!.masterProductProductDetails = this.getMasterProductProductDetailsByResponseData(product);
              let details = this.masterProduct!.masterProductProductDetails;
              if (details) {
                this.checkProductTypeConsistency(details);
                this.buFormGroup.setValues(details);
                this.markAllAsDirty();
                return;
              }
            }
          }
          this.parent.toastDanger(this.ERROR_GETTING_PRODUCT_DATA);
        },
        error: () => {
          this.parent.toastDanger(this.ERROR_GETTING_PRODUCT_DATA);
        }
      });
  }

  private checkProductTypeConsistency(details: MasterProductProductDetails) {
    if (details.productType !== this.productType.key) {
      this.parent.toastDanger(this.ERROR_PRODUCT_TYPE_INCONSISTENT);
      this.isProductTypeError = true;
    }
  }

  private subscribeProductService() {
    // stepper notification
    this.masterProductService.nextStep$
      .pipe(
        filter(step => step !== this.STEP),
        takeUntil(this.destroy$)
      ).subscribe(x => {
        this.onStepChange();
      });
  }

  private subscribeFormGroupValueChange() {
    this.detailsFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        this.parent.verify(this.detailsFormGroup.valid);

        if (this.parent.actionMode === ActionMode.Edit) {
          this.parent.editSaveButtonDisableFlag$.next(this.detailsFormGroup.invalid || this.detailsFormGroup.pristine);
        }
      });
  }

  private bindProductNameAndSkuName() {
    this.detailsFormGroup.get("productName")?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        // to show the real sku name, do not change skuName if user have not touched product name
        if (this.detailsFormGroup.get("productName")?.pristine) return;

        const trimmedVal = val.trim();
        if (trimmedVal) {
          this.skuName$.next(val);
          return;
        }
        this.skuName$.next(null);
      });
  }

  private bindProductCodeAndSkuNumber() {
    this.detailsFormGroup.get("productCode")?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        const trimmedVal = val.trim();
        if (trimmedVal) {
          this.skuNumber$.next(val);
          return;
        }
        this.skuNumber$.next(null);
      });
  }

  private removeCustomErrors(control: AbstractControl, errors: string[]) {
    errors.forEach(error => {
      if (control.hasError(error)) {
        delete control.errors![error];
        control.updateValueAndValidity();
      }
    });
  }

  // manual trigger async validation
  private async checkIfProductCodeUnique(productCode: string): Promise<boolean> {
    let isErrorThrow = false;
    this.removeCustomErrors(this.detailsFormGroup.controls['productCode'], [this.NOT_UNIQUE]);

    await lastValueFrom(this.masterProductApiService
      .getProductCountByProductCode(productCode)
      .pipe(takeUntil(this.destroy$))
    )
      .catch(_ => {
        this.parent.toastDanger(this.ERROR_CHECKING_PRODUCT_CODE);
        isErrorThrow = true;
        return  { success: false } as BaseResponse;
      })
      .then(res => {
        if (res.success) {
          const isExistedInProduct: boolean = (JSON.parse(res.data)?.products?.totalCount ?? 0) > 0;
          // set validation error
          if (isExistedInProduct) {
            this.detailsFormGroup.controls['productCode'].setErrors({
              notUnique: true
            });
            this.detailsFormGroup.updateValueAndValidity({ emitEvent: true });
          }
        } else {
          isErrorThrow = true;
        }
      });

    return isErrorThrow;
  }

  private async validateStep(): Promise<boolean> {
    if (this.parent.actionMode == ActionMode.Edit) {
      this.markAllAsDirty();
      return this.detailsFormGroup.valid && !this.isProductTypeError;
    }

    // block user to next step if missing required data
    if (this.missingRequiredData.length > 0) {
      const missingData = this.missingRequiredData.join(', ');
      this.parent.toastDanger(`${this.ERROR_REQUIRED_DATA} ${missingData}`);
      return false;
    }

    // form value validation
    this.trimProductNameAndCode();
    const isErrorThrow = await this.checkIfProductCodeUnique(this.f.productCode.value);
    this.markAllAsDirty();
    if (isErrorThrow || this.detailsFormGroup.invalid) {
      return false;
    }

    return true;
  }

  private trimProductNameAndCode() {
    const trimmedName = this.f.productName.value.trim();
    this.detailsFormGroup.get("productName")?.setValue(trimmedName);
    const trimmedCode = this.f.productCode.value.trim();
    this.detailsFormGroup.get("productCode")?.setValue(trimmedCode);
  }

  private async onStepChange() {
    const isStepValidAndAllowToLeave = await this.validateStep();
    if (!isStepValidAndAllowToLeave) return;
    // Create
    if (this.parent.actionMode == ActionMode.Create && this.parent.wizardKey) {
      this.onPushDataToModel(this.parent.wizardKey);
      return;
    }
    if (this.parent.actionMode == ActionMode.Create) {
      this.initializeWizardAndPushData();
    }
    // Edit
    if (this.parent.actionMode == ActionMode.Edit) {
      this.updateProduct();
    }
  }

  private updateProduct() {
    const value = this.masterProduct?.masterProductProductDetails;
    if (value) {
      let data: ProductUpdateRequest = {
        // common fields in UI
        productCode: value.productCode,
        productName: this.f.productName.value,
        operationNote: this.f.operationNote.value,
        salesNote: this.f.salesNote.value,
        customerServiceNote: this.f.customerServiceNote.value,
        description: this.f.productDescription.value,

        // GL fields in UI
        voucherIssuerId: value.voucherIssuerId,

        // IN fields in UI
        isDeferredChild: value.isDeferredChild,
        isCartVersion: value.isCartVersion,

        // fields not in UI but used for update
        productId: value.productId,
        externalProductCode: value.externalProductCode ?? '',
        skuId: value.skuId,
        brandId: value.brandId,
        acceptanceLoopId: value.acceptanceLoopId,
        productCategory: value.productCategory,
        productTag: value.productTag,
        productIssuer: value.productIssuer,
        pinCodeType: value.pinCodeType,
        pinCodeLength: value.pinCodeLength,
        canExtend: value.canExtend,
        extensionSchemeId: value.extensionSchemeId,
        maxExtendTimes: value.maxExtendTimes,
        extensionEndDate: value.extensionEndDate,
        sameAsContractEndDate: value.sameAsValidEndDateOnContract,
        issueMerchant: value.issueMerchant,
        lastUpdatedBy: this.userName,
        multipleSelectionType: MultipleSelectionTypeEnum.Master,
      };

      this.masterProductApiService.updateProductBasicInfo(data)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.parent.notifyUpdateSuccess();
              return;
            }
            this.parent.toastDanger(this.ERROR_UPDATE_PRODUCT);
          },
          error: () => {
            this.parent.toastDanger(this.ERROR_UPDATE_PRODUCT);
          }
        });
    }
  }

  private getMasterProductProductDetailsByResponseData(value: any): MasterProductProductDetails {
    let data = {
      // common fields in UI
      programId: Number.parseInt(value.programId),
      productType: Number.parseInt(value.productType),
      productCode: value.productCode,
      productName: value.productName,
      productDescription: value.description,
      operationNote: value.operationNote,
      salesNote: value.salesNote,
      customerServiceNote: value.customerServiceNote,

      // GL fields in UI
      voucherIssuerId: this.parseIntOrUndefined(value.voucher_Issuer_Id),

      // IN fields in UI
      isDeferredChild: value.isDeferredChild,
      isCartVersion: value.isCartVersion,

      // fields not in UI but used for update
      productId: Number.parseInt(value.productId),
      externalProductCode: value.externalProductCode,
      skuId: Number.parseInt(value.skuId),
      acceptanceLoopId: Number.parseInt(value.acceptanceLoopId),
      brandId: this.parseIntOrUndefined(value.brandId),
      productCategory: Number.parseInt(value.productCategory),
      productTag: Number.parseInt(value.productTag),
      productIssuer: Number.parseInt(value.productIssuer),
      pinCodeType: this.parseIntOrUndefined(value.pinCodeType),
      pinCodeLength: this.parseIntOrUndefined(value.pinCodeLength),
      canExtend: value.canExtend,
      extensionSchemeId: this.parseIntOrUndefined(value.extensionSchemeId),
      maxExtendTimes: this.parseIntOrUndefined(value.maxExtendTimes),
      extensionEndDate: value.extensionEndDate,
      sameAsValidEndDateOnContract: value.sameAsContractEndDate,
      issueMerchant: this.parseIntOrUndefined(value.issue_Merchant)
    } as MasterProductProductDetails;
    return data;
  }

  private onPushDataToModel(wizardKey: string) {
    let data = {
      // common fields in UI
      programId: this.program?.id,
      productType: (this.parent.productType as ProductType).key,
      productCode: this.f.productCode.value,
      productName: this.f.productName.value,
      productDescription: this.f.productDescription.value,
      operationNote: this.f.operationNote.value,
      salesNote: this.f.salesNote.value,
      customerServiceNote: this.f.customerServiceNote.value,

      // fields not in UI but required
      externalProductCode: '',
      productCategory:
        this.tenant.name === this.TENANT_NAME_IN ? ProductCategoryEnum.Actual : ProductCategoryEnum.None,
      productTag:
        this.tenant.name === this.TENANT_NAME_TW ? ProductTagEnum.Digital : ProductTagEnum.None,
      productIssuer: ProductIssuerEnum.IssuerModel,
      multipleSelectionType: MultipleSelectionTypeEnum.Master,
      canExtend: false,
      acceptanceLoopId: this.acceptanceLoopId,
      brandId: undefined,
    } as MasterProductProductDetails;

    if (this.masterProduct == null) {
      this.masterProduct = new MasterProduct(this.tenant);
    }

    this.masterProduct.tenant = this.tenant;
    this.masterProduct.wizardKey = wizardKey;
    this.masterProduct.masterProductProductDetails = this.setTenantBasedUIFields(data);

    this.masterProductService.pushMasterProduct(this.masterProduct, this.STEP);
  }

  private setTenantBasedUIFields(data: MasterProductProductDetails): MasterProductProductDetails {
    if (this.tenant.name === this.TENANT_NAME_GL) {
      data.voucherIssuerId = Number.parseInt(this.f.voucherIssuerId.value);
      return data;
    }

    if (this.tenant.name === this.TENANT_NAME_IN && this.productType.key == ProductTypeEnum.SuperVoucher) {
      let selectedSuperVoucherType = Number.parseInt(this.f.superVoucherType.value);
      data.isDeferredChild = selectedSuperVoucherType >> 1 === 1;
      data.isCartVersion = selectedSuperVoucherType % 2 === 1;
      return data;
    }

    return data;
  }

  private initializeWizardAndPushData() {
    const productType = this.parent.productType as ProductType;
    this.masterProductApiService.initializeProductWizard(productType.key).subscribe({
      next: (res) => {
        if (res.success) {
          this.parent.wizardKey = res.data;
          this.onPushDataToModel(this.parent.wizardKey);
        }
        else {
          this.parent.toastDanger(this.ERROR_INIT_PRODUCT_WIZARD);
        }
      },
      error: (err) => {
        this.parent.toastDanger(this.ERROR_INIT_PRODUCT_WIZARD);
      }
    })
  }

  private markAllAsDirty() {
    this.detailsFormGroup.markAsDirty();
    Object.keys(this.detailsFormGroup.controls).forEach(key => {
      this.detailsFormGroup.controls[key].markAsDirty();
    });
  }

  private parseIntOrUndefined(value: string | undefined): number | undefined {
    return value != null ? Number.parseInt(value) : undefined;
  }
}

export interface KeyValueType {
  key: number,
  value: string,
}