import { Tenant } from "@txc-angular/authorization-library/models/tenant.model";
import { TemplateSubType, TemplateType } from "../product-template.model";
import { Template } from "../template.model";

export class MasterProduct {
  tenant?: Tenant;
  wizardKey?: string;
  masterProductProductDetails: MasterProductProductDetails | null;
  masterProductProductCombo: MasterProductProductCombo;
  masterProductPricingAndExpiry: MasterProductPricingAndExpiry;
  masterProductProductTemplate: MasterProductProductTemplate;
  masterProductAdvanceSettings: MasterProductAdvanceSettings;
  masterProductReviewAndConfirm: MasterProductReviewAndConfirm;

  constructor(tenant?: Tenant) {
    this.tenant = tenant;
    this.masterProductProductDetails = null;
    this.masterProductProductCombo = [] as MasterProductProductCombo;
    this.masterProductPricingAndExpiry = [] as MasterProductPricingAndExpiry;
    this.masterProductProductTemplate = [] as MasterProductProductTemplate;
    this.masterProductAdvanceSettings = {
      productExternalPropertyList: []
    } as MasterProductAdvanceSettings;
    this.masterProductReviewAndConfirm = [] as MasterProductReviewAndConfirm;
  }
}

export class MasterProductStepperValidator {

  verifiedProductDetails: boolean;
  verifiedProductCombo: boolean;
  verifiedPricingAndExpiry: boolean;
  verifiedProductTemplate: boolean;
  verifiedAdvanceSettings: boolean;

  constructor() {
    this.verifiedProductDetails = false;
    this.verifiedProductCombo = false;
    this.verifiedPricingAndExpiry = false;
    this.verifiedProductTemplate = false;
    this.verifiedAdvanceSettings = false;
  }
}

export interface MasterProductProductDetails {
  productId?: number;
  programId?: number;
  productType?: number;
  productName: string;
  productDescription?: string;
  description: string;
  productCode: string;
  externalProductCode?: string;
  productIssuer: number;
  voucherIssuerId?: number;
  productTag: number;
  brandId?: number;
  skuId?: number;
  acceptanceLoopId?: number;
  isDeferredChild?: boolean;
  isCartVersion?: boolean;
  productCategory: number;
  operationNote?: string;
  salesNote?: string;
  customerServiceNote?: string;
  canTopup?: boolean;
  validFrom?: string;
  validTo?: string;
  canIssue?: boolean;
  stopIssueTime?: string;
  multipleSelectionType?: number;
  pinCodeType?: number;
  pinCodeLength?: number;
  canExtend: boolean;
  extensionSchemeId?: number;
  maxExtendTimes?: number;
  extensionEndDate?: string;
  sameAsValidEndDateOnContract: boolean;
  issueMerchant?: number;
  contractSKU?: any;
  merchantAcquirer?: string;
  superVoucherType?: string;
}

export interface MasterProductProductCombo {
  productComboList?: MasterProductProductComboObject[];
}

export interface MasterProductProductComboObject {
  productComboId?: number;
  productId?: number;
  childProductId?: number;
  childProductVersionId?: number;
  sequence?: number;
  status?: number;
}

export interface MasterProductPricingAndExpiry {
  sellingPricePrepaid?: number;
  sellingPricePrepaidWithTax?: number;
  sellingPricePostpaid?: number;
  sellingPricePostpaidWithTax?: number;
  customerFeePrepaid?: number;
  customerFeePrepaidWithTax?: number;
  customerFeePostpaid?: number;
  customerFeePostpaidWithTax?: number;
  faceValue?: number;
  cost?: number;
  multiplier?: number;
  expiryPolicyIdList?: number[];
  fixExpiryDate?: string;
  isFixedExpiryPolicy?: boolean;
}

export interface MasterProductProductTemplate {
  productTemplateList?: MasterProductProductTemplateObject[];
  addToWallet?: boolean;
  walletStatus?: number;
  walletImage?: string;
  walletDescription?: string;
  hexColor?: string;
  fontSize?: number;
  pointX?: number;
  pointY?: number;
}

export interface MasterProductProductTemplateObject {
  templateType?: TemplateType;
  templateSubType?: TemplateSubType;
  templateVersionId?: number;
  templateId?: number;
  templateName?: string;
  languageId?: number;
  tagValueList?: TagValueObject[];
  // customize
  defaultLanguageId?: boolean;
  template?: Template;
  isCurrentVersion?:boolean;
}

export interface TagValueObject {
  contentTagId?: number;
  tagName?: string;
  value?: string;
  textValue?: string;
  // customize for UI
  replaceValue?: string;
}

export interface MasterProductAdvanceSettings {
  productConditionDto?: ProductConditionDto;
  productExternalPropertyList?: ProductExternalPropertyObject[];
}

export interface ProductConditionDto {
  reminderId?: number;
  reversalLimitId?: number;
  preAuthorizationExpiryInterval?: number;
  preAuthorizationExpiryUnit?: number;
  minRedeemQuantity?: number;
  maxIssuingQuantity?: number;
  useTimeControl?: number;
  useTimeControlInterval?: number;
}

export interface ProductExternalPropertyObject {
  propertyName?: string;
  propertyValue?: string;
  description?: string;
}

export interface MasterProductReviewAndConfirm {

}

// Product wizard

export class MasterProductWizardRequest {
  wizardKey: string;
  wizardStep: number;
  productWizardDto: MasterProductWizardDto;

  constructor(wizardKey: string, step: number, values: any) {
      this.wizardKey = wizardKey;
      this.wizardStep = step;
      this.productWizardDto = new MasterProductWizardDto(wizardKey, step, values);
  }
}

export class MasterProductWizardDto {
  wizardKey: string;
  productWizardStepOne?: MasterProductWizardStepOne;
  productWizardStepTwo?: MasterProductWizardStepTwo;
  productWizardStepThree?: MasterProductWizardStepThree;
  productWizardStepFour?: MasterProductWizardStepFour;
  productWizardStepFive?: MasterProductWizardStepFive;

  constructor(key: string, step: number, values: any) {
      this.wizardKey = key;
      if (step === 1) {
          this.productWizardStepOne = new MasterProductWizardStepOne(values);
      }

      if (step === 2) {
          this.productWizardStepTwo = new MasterProductWizardStepTwo(values);
      }

      if (step === 3) {
          this.productWizardStepThree = new MasterProductWizardStepThree(values);
      }

      if (step === 4) {
          this.productWizardStepFour = new MasterProductWizardStepFour(values);
      }

      if (step === 5) {
          this.productWizardStepFive = new MasterProductWizardStepFive(values);
      }
  }
}

export class MasterProductWizardStepOne {
  programId?: number;
  productType?: number;
  productName?: string;
  productDescription?: string;
  productCode?: string;
  externalProductCode?: string;
  productIssuer?: number;
  voucherIssuerId?: number;
  productTag?: number;
  brandId?: number;
  skuId?: number;
  acceptanceLoopId?: number;
  isDeferredChild?: boolean;
  isCartVersion?: boolean;
  productCategory?: number;
  operationNote?: string;
  salesNote?: string;
  customerServiceNote?: string;
  canTopup?: boolean;
  validFrom?: string;
  validTo?: string;
  canIssue?: boolean;
  stopIssueTime?: string;
  multipleSelectionType?: number;
  pinCodeType?: number;
  pinCodeLength?: number;
  canExtend?: boolean;
  extensionSchemeId?: number;
  maxExtendTimes?: number;
  extensionEndDate?: string;
  sameAsValidEndDateOnContract?: boolean;
  issueMerchant?: number;

  constructor(value: any) {
      this.programId = value?.programId;
      this.productType = value?.productType;
      this.productName = value?.productName;
      this.productDescription = value?.productDescription;
      this.productCode = value?.productCode;
      this.externalProductCode = value?.externalProductCode;
      this.productIssuer = value?.productIssuer;
      this.voucherIssuerId = value?.voucherIssuerId;
      this.productTag = value?.productTag;
      this.brandId = value?.brandId;
      this.skuId = value?.skuId;
      this.acceptanceLoopId = value?.acceptanceLoopId;
      this.isDeferredChild = value?.isDeferredChild;
      this.isCartVersion = value?.isCartVersion;
      this.productCategory = value?.productCategory;
      this.operationNote = value?.operationNote;
      this.salesNote = value?.salesNote;
      this.customerServiceNote = value?.customerServiceNote;
      this.canTopup = value?.canTopup;
      this.validFrom = value?.validFrom;
      this.validTo = value?.validTo;
      this.canIssue = value?.canIssue;
      this.stopIssueTime = value?.stopIssueTime;
      this.multipleSelectionType = value?.multipleSelectionType;
      this.pinCodeType = value?.pinCodeType;
      this.pinCodeLength = value?.pinCodeLength;
      this.canExtend = value?.canExtend;
      this.extensionSchemeId = value?.extensionSchemeId;
      this.maxExtendTimes = value?.maxExtendTimes;
      this.extensionEndDate = value?.extensionEndDate;
      this.sameAsValidEndDateOnContract = value?.sameAsValidEndDateOnContract;
      this.issueMerchant = value?.issueMerchant;
  }
}

export class MasterProductWizardStepTwo {
  productComboList: MasterProductCombo[];

  constructor(value: any) {
    this.productComboList = [];
    for (let productCombo of value?.productComboList) {
      this.productComboList.push(new MasterProductCombo(productCombo));
    }
  }
}

export class MasterProductCombo {
  productComboId?: number;
  productId?: number;
  childProductId?: number;
  childProductVersionId?: number;
  sequence?: number;
  status?: number;

  constructor(value: any) {
    this.productComboId = value?.productComboId;
    this.productId = value?.productid;
    this.childProductId = value?.childProductId;
    this.childProductVersionId = value?.childProductVersionId;
    this.sequence = value?.sequence;
    this.status = value?.status;
  }
}

export class MasterProductWizardStepThree {
  sellingPricePrepaid?: number;
  sellingPricePrepaidWithTax?: number;
  sellingPricePostpaid?: number;
  sellingPricePostpaidWithTax?: number;
  customerFeePrepaid?: number;
  customerFeePrepaidWithTax?: number;
  customerFeePostpaid?: number;
  customerFeePostpaidWithTax?: number;
  faceValue?: number;
  cost?: number;
  multiplier?: number;
  expiryPolicyIdList?: number[];
  fixExpiryDate?: string;
  isFixedExpiryPolicy?: boolean;

  constructor(value: any) {
      this.sellingPricePrepaid = value?.sellingPricePrepaid;
      this.sellingPricePrepaidWithTax = value?.sellingPricePrepaidWithTax;
      this.sellingPricePostpaid = value?.sellingPricePostpaid;
      this.sellingPricePostpaidWithTax = value?.sellingPricePostpaidWithTax;
      this.customerFeePrepaid = value?.customerFeePrepaid;
      this.customerFeePrepaidWithTax = value?.customerFeePrepaidWithTax;
      this.customerFeePostpaid = value?.customerFeePostpaid;
      this.customerFeePostpaidWithTax = value?.customerFeePostpaidWithTax;
      this.expiryPolicyIdList = value?.expiryPolicyIdList;
      this.fixExpiryDate = value?.fixExpiryDate;
      this.isFixedExpiryPolicy = value?.isFixedExpiryPolicy;
      this.faceValue = value?.faceValue;
      this.cost = value?.cost;
      this.multiplier = value?.multiplier;
  }
}

export class MasterProductWizardStepFour {
  productTemplateList: MasterProductTemplate[];
  addToWallet?: boolean;
  walletStatus?: number;
  walletImage?: string;
  walletDescription?: string;
  hexColor?: string;
  fontSize?: number;
  pointX?: number;
  pointY?: number;

  constructor (value: any) {
    this.productTemplateList = [];
    if (value?.productTemplateList){
      for (let productTemplate of value?.productTemplateList) {
        this.productTemplateList.push(new MasterProductTemplate(productTemplate));
      }
    }
    this.addToWallet = value?.addToWallet;
    this.walletStatus = value?.walletStatus;
    this.walletImage = value?.walletImage?.nodeUrl;
    this.walletDescription = value?.walletDescription;
    this.hexColor = value?.hexColor;
    this.fontSize = value?.fontSize;
    this.pointX = value?.pointX;
    this.pointY = value?.pointY;
  }
}

export class MasterProductTemplate {
  templateType?: number;
  templateSubType?: number;
  templateVersionId?: number;
  templateId?: number;
  templateName?: string;
  languageId?: number;
  tagValueList: MasterProductTemplateTagValue[];

  constructor(value: any) {
    this.templateType = value?.templateType;
    this.templateSubType = value?.templateSubType;
    this.templateVersionId = value?.templateVersionId;
    this.templateId = value?.templateId;
    this.templateName = value?.templateName;
    this.languageId = value?.languageId;
    this.tagValueList = [];
  
    if (value?.tagValueList){
      for (let tag of value?.tagValueList) {
          this.tagValueList.push(new MasterProductTemplateTagValue(tag));
      }
    }
  }
}

export class MasterProductTemplateTagValue {
  contentTagId?: number;
  tagName?: string;
  value?: string;
  textValue?: string;

  constructor(value: any) {
    this.contentTagId = value?.contentTagId;
    this.tagName = value?.tagName;
    this.value = value?.value;
    this.textValue = value?.textValue;
  }
}

export class MasterProductWizardStepFive {
  productConditionDto: MasterProductCondition;
  productExternalPropertyList: MasterProductExternalProperty[];

  constructor(value: any) {
    this.productConditionDto = new MasterProductCondition(value?.productConditionDto);
    this.productExternalPropertyList = [];
    for (let productExternalProperty of value?.productExternalPropertyList) {
        this.productExternalPropertyList.push(new MasterProductExternalProperty(productExternalProperty));
    }
  }
}

export class MasterProductCondition {
  reminderId?: number;
  reversalLimitId?: number;
  preAuthorizationExpiryInterval?: number;
  preAuthorizationExpiryUnit?: number;
  minRedeemQuantity?: number;
  maxIssuingQuantity?: number;
  useTimeControl?: number;
  useTimeControlInterval?: number;

  constructor(value: any) {
      this.reminderId = value?.reminderId;
      this.reversalLimitId = value?.reversalLimitId;
      this.preAuthorizationExpiryInterval = value?.preAuthorizationExpiryInterval;
      this.preAuthorizationExpiryUnit = value?.preAuthorizationExpiryUnit;
      this.minRedeemQuantity = value?.minRedeemQuantity;
      this.maxIssuingQuantity = value?.maxIssuingQuantity;
      this.useTimeControl = value?.useTimeControl;
      this.useTimeControlInterval = value?.useTimeControlInterval;
  }
}

export class MasterProductExternalProperty {
  propertyName?: string;
  propertyValue?: string;
  description?: string;

  constructor(value: any) {
      this.propertyName = value?.propertyName;
      this.propertyValue = value?.propertyValue;
      this.description = value?.description ?? '';
  }
}

// others

export enum ActionMode {
  Create,
  Edit,
}
