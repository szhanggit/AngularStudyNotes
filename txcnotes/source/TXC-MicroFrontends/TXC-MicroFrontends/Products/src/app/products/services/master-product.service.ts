import { Injectable, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PRODUCT_CONSTANTS } from '../constants/product-constants';
import { ProductTypeEnum } from '../enums/product-type.enum';
import { MasterProductBUFormGroupFactory } from '../models/master-product/master-product-form-group.model';
import { MasterProduct, MasterProductStepperValidator, MasterProductWizardDto } from '../models/master-product/master-product.model';
import { TemplateType } from '../models/product-template.model';
import { Product, ProductComboProperty } from '../models/product.model';
import { MasterProductApiService } from './master-product-api.service';
import { TenantConfigService } from './tenant-config.service';

@Injectable()
export class MasterProductService implements OnDestroy {

  nextStep$ = new Subject<number>();
  event$ = new Subject<[string, string]>();
  destroy$ = new Subject();

  step: number = 1;

  constructor(
    private readonly tenantConfigService: TenantConfigService,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly formBuilder: FormBuilder,) {
    this.nextStep$.asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(x => {
        this.step = x;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.nextStep$.complete();
  }

  pushMasterProduct(masterProduct: MasterProduct, step: number, canNextStep: boolean = true) {
    if (masterProduct.wizardKey == null) {
      throw new Error("Product wizard key is required.");
    }
    // put data to backend
    const stepName = PRODUCT_CONSTANTS.MASTER_PRODUCT_STEPS[step - 1];
    let body: any;
    switch (step) {
      case 1:
        body = masterProduct.masterProductProductDetails;
        break;
      case 2:
        body = masterProduct.masterProductProductCombo;
        break;
      case 3:
        body = masterProduct.masterProductPricingAndExpiry;
        break;
      case 4:
        body = masterProduct.masterProductProductTemplate;
        break;
      case 5:
        body = masterProduct.masterProductAdvanceSettings;
        break;
    }
    this.masterProductApiService.updateProductWizard(masterProduct.wizardKey!, step, body).subscribe({
      next: res => {
        if (!res.success) {
          this.event$.next(['toastDanger', `Error in updating product wizard step - ${stepName}. Please try again later.`]);
        } else {
          if (canNextStep) this.event$.next(['success', 'updateProductWizard']);
        }
      },
      error: err => {
        this.event$.next(['toastDanger', `Error in updating product wizard step - ${stepName}. Please try again later.`]);
      }
    });
  }

  wizardDataToMasterProduct(wizardKey: string, data: any): MasterProduct {
    const stepOne: any = (data as MasterProductWizardDto)?.productWizardStepOne;
    const stepTwo: any = (data as MasterProductWizardDto)?.productWizardStepTwo;
    const stepThree: any = (data as MasterProductWizardDto)?.productWizardStepThree;
    const stepFour: any = (data as MasterProductWizardDto)?.productWizardStepFour;
    const stepFive: any = (data as MasterProductWizardDto)?.productWizardStepFive;

    let masterProduct = new MasterProduct(this.tenantConfigService.getTenant());
    masterProduct.wizardKey = wizardKey;
    masterProduct.masterProductProductDetails = stepOne;
    masterProduct.masterProductProductCombo = stepTwo;
    masterProduct.masterProductPricingAndExpiry = stepThree;
    masterProduct.masterProductProductTemplate = stepFour;
    masterProduct.masterProductAdvanceSettings = stepFive;

    return masterProduct;
  }

  convertProductComboDataToMasterProduct(data: any): MasterProduct {
    let masterProduct = new MasterProduct(this.tenantConfigService.getTenant());
    masterProduct.masterProductProductCombo.productComboList = data;
    return masterProduct;
  }

  convertProductInfoDataToProductList(data: any): Product[] {
    const productInfoList: Product[] = [];
    for (let p of data.productInfoMassive.items) {
      let faceValue = p.contractSKU?.faceValueWithTax ?? undefined;
      if (p.productType === ProductTypeEnum.SmartBooklet && faceValue && p.contractSKU.multiplier)
        faceValue = faceValue * p.contractSKU.multiplier;

      productInfoList.push({
        productId: p.productId,
        productName: p.productName,
        productCode: p.productCode,
        productDescription: p.productDescription,
        productType: p.productType,
        stopIssueTime: p.stopIssueTime,
        productVersionId: p.productVersionId,
        currentProductVersionId: p.currentProductVersionId,
        status: p.status ? 1 : 0,
        brandName: p.brand?.brandName,
        faceValueWithTax: faceValue,
        contractSku: p.contractSKU,
        multipleSelectionType: p.multipleSelectionType,
      } as Product);
    }
    return productInfoList;
  }

  convertProductVersionsDataToProductList(data: any, combo: any): Product[] {
    const productInfoList: Product[] = [];
    for (let p of data.productVersionInfoMassive.items) {
      let faceValue = p.contractSKU === null ? undefined : p.contractSKU.faceValueWithTax;
      const comboItem = combo.find((item: ProductComboProperty) => item.childProductVersionId === p.productVersionId);
      let productCombo: ProductComboProperty = {
        productComboId: comboItem.productComboId,
        productId: comboItem.productId,
        childProductId: comboItem.childProductId,
        childProductVersionId: comboItem.childProductVersionId,
        sequence: comboItem.sequence,
        status: comboItem.status,
      };
      if (p.productType === ProductTypeEnum.SmartBooklet && faceValue && p.contractSKU.multiplier)
        faceValue = faceValue * p.contractSKU?.multiplier;
      productInfoList.push({
        productId: p.productId,
        productName: p.productName,
        productCode: p.productCode,
        productType: p.productType,
        productVersionId: p.productVersionId,
        brandName: (p.product.brand === null || p.product.brand[0] === null) ? undefined : p.product.brand[0].brandName,
        faceValueWithTax: faceValue,
        productCombo: productCombo
      } as Product);
    }
    return productInfoList;
  }

  verifyModel(masterProduct: MasterProduct): MasterProductStepperValidator {
    let validation = new MasterProductStepperValidator;
    validation.verifiedProductDetails = this.productDetailsValidator(masterProduct, this.formBuilder);
    validation.verifiedProductCombo = this.productComboValidator(masterProduct);
    validation.verifiedPricingAndExpiry = this.pricingAndExpiryValidator(masterProduct);
    validation.verifiedProductTemplate = this.productTemplateValidator(masterProduct);
    validation.verifiedAdvanceSettings = this.advanceSettingsValidator(masterProduct)
    return validation;
  }

  productDetailsValidator(masterProduct: MasterProduct, formBuidler: FormBuilder): boolean {
    if (masterProduct.tenant == null) {
      throw new Error('Tenant is required.');
    }

    // only accept "Smart Chice Voucher" and "Super Voucher" type
    const typeId = masterProduct.masterProductProductDetails?.productType;
    if (typeId && (typeId == ProductTypeEnum.SmartChoiceVoucher || typeId == ProductTypeEnum.SuperVoucher)) {
      const productType = PRODUCT_CONSTANTS.PRODUCT_TYPE.filter(x => x.key == typeId)?.pop();
      if (productType) {
        let buFormGroupFactory = new MasterProductBUFormGroupFactory(formBuidler);
        let buFormGroup = buFormGroupFactory.getBUFormGroup(masterProduct.tenant.name, productType);
        buFormGroup.setValues(masterProduct.masterProductProductDetails);
        return buFormGroup.validate();
      }
    }
    // otherwise, validation always returns invalid
    return false;
  }

  productComboValidator(masterProduct: MasterProduct): boolean {
    if (masterProduct.masterProductProductCombo &&
      masterProduct.masterProductProductCombo.productComboList &&
      masterProduct.masterProductProductCombo.productComboList.length > 0) {
      return true;
    }

    return false;
  }

  pricingAndExpiryValidator(masterProduct: MasterProduct): boolean {
    const typeId = masterProduct.masterProductProductDetails?.productType;
    const pricingExpiry = masterProduct.masterProductPricingAndExpiry;
    if (pricingExpiry == null
      || (typeId !== ProductTypeEnum.SmartChoiceVoucher && typeId !== ProductTypeEnum.SuperVoucher)
    ) {
      return false;
    }
    if (pricingExpiry.faceValue == null || (pricingExpiry.faceValue != null && pricingExpiry.faceValue <= 0)
      || pricingExpiry.cost == null
      || pricingExpiry.sellingPricePrepaid == null
      || pricingExpiry.sellingPricePrepaidWithTax == null
      || (typeId === ProductTypeEnum.SmartChoiceVoucher && pricingExpiry.sellingPricePostpaid == null)
      || (typeId === ProductTypeEnum.SmartChoiceVoucher && pricingExpiry.sellingPricePostpaidWithTax == null)
    ) {
      return false;
    }
    if (pricingExpiry.expiryPolicyIdList == null || pricingExpiry.expiryPolicyIdList?.length === 0) {
      return false;
    }
    return true;
  }

  productTemplateValidator(masterProduct: MasterProduct): boolean {
    const htmlTemplate = masterProduct?.masterProductProductTemplate?.productTemplateList?.filter(x => x.templateType == TemplateType.HTML);
    const textTemplate = masterProduct?.masterProductProductTemplate?.productTemplateList?.filter(x => x.templateType == TemplateType.Text);
    if (htmlTemplate?.length ?? 0) {
      return true;
    }
    return false;
  }

  advanceSettingsValidator(masterProduct: MasterProduct): boolean {
    if (masterProduct?.masterProductAdvanceSettings?.productExternalPropertyList
      && masterProduct.masterProductAdvanceSettings.productExternalPropertyList.length > 0) {
      const invalidItems = masterProduct.masterProductAdvanceSettings.productExternalPropertyList.filter(x => x.propertyName == null || x.propertyValue == null);
      return invalidItems.length === 0;
    }
    return true;
  }
}
