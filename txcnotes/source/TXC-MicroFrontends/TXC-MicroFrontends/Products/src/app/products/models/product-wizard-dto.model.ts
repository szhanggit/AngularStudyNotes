import { TextEditorService } from "../services/text-editor.service";
import { TagType } from "./product-template.model";
import { TemplateTag } from "./template-tag.model";
import { decode } from 'html-entities';

export class ProductWizardRequest {
    wizardKey: string;
    wizardStep: number;
    productWizardDto: ProductWizardDto;

    constructor(key: string, step: number, values: any, textEditorService: TextEditorService) {
        this.wizardKey = key;
        this.wizardStep = step;
        this.productWizardDto = new ProductWizardDto(key, step, values, textEditorService);
    }
}

export class ProductWizardDto {
    wizardKey: string;
    productWizardStepOne?: ProductWizardStepOne;
    productWizardStepTwo?: ProductWizardStepTwo;
    productWizardStepThree?: ProductWizardStepThree;
    productWizardStepFour?: ProductWizardStepFour;
    productWizardStepFive?: ProductWizardStepFive;

    constructor(key: string, step: number, values: any, textEditorService: TextEditorService) {
        this.wizardKey = key;
        if (step === 1) {
            this.productWizardStepOne = new ProductWizardStepOne(values);
        }

        if (step === 2) {
            this.productWizardStepTwo = new ProductWizardStepTwo(values);
        }

        if (step === 3) {
            this.productWizardStepThree = new ProductWizardStepThree(values);
        }

        if (step === 4) {
            this.productWizardStepFour = new ProductWizardStepFour(values, textEditorService);
        }

        if (step === 5) {
            this.productWizardStepFive = new ProductWizardStepFive(values);
        }
    }
}

// product details
export class ProductWizardStepOne {
    programId: number;
    productType: number;
    productName: string;
    productDescription: string;
    productCode: string;
    externalProductCode: string;
    productIssuer: number;
    isIssueMerchantGroup: boolean;
    issueMerchant: number;
    issueMerchantGroupId: number;
    voucherIssuerId: number;
    productTag: number;
    brandId: number | null;
    skuId: number;
    isMerchantGroup: boolean;
    merchantId: number;
    merchantGroupId: number;
    acceptanceLoopId: number;
    isDeferredChild: boolean;
    isCartVersion: boolean;
    productCategory: number;
    operationNote: string;
    salesNote: string;
    customerServiceNote: string;
    canTopup: boolean;
    minRedeemQuantity: number;
    maxIssuingQuantity: number;
    validFrom: string;
    validTo: string;
    redeemDateBlacklistId: number;
    redeemTimeRestrictionId: number;
    useTimeControl: number;
    useTimeControlInterval: number;
    maxTotalRedeemAmountControl: number;
    maxTotalRedeemAmountControlInterval: number;
    canIssue: boolean;
    stopIssueTime: string;
    multipleSelectionType: number;
    pinCodeType: number;
    pinCodeLength: number;
    canExtend: boolean;
    extensionSchemeId: number;
    maxExtendTimes: number;
    extensionEndDate: string;
    sameAsValidEndDateOnContract = true;

    constructor(values: any) {
        this.programId = values.programId ?? '';
        this.productType = values.productType ?? 0;
        this.productName = values.productName ?? '';
        this.productDescription = values.productDescription ?? '';
        this.productCode = values.productCode ?? '';
        this.externalProductCode = values.externalProductCode ?? '';
        this.productIssuer = values.productIssuer ?? 0;
        this.issueMerchant = values.issueMerchant ?? 0;
        this.voucherIssuerId = values.voucherIssuerId ?? null;
        this.productTag = values.productTag ?? 0;
        this.brandId = values.brandId ?? null;
        this.merchantId = values.merchantId ?? 0;
        this.skuId = values.skuId ?? 0;
        this.acceptanceLoopId = values.acceptanceLoopId ?? 0;
        this.isDeferredChild = values.isDeferredChild ?? false;
        this.isCartVersion = values.isCartVersion ?? false;
        this.productCategory = values.productCategory ?? 0;
        this.operationNote = values.operationNote ?? '';
        this.salesNote = values.salesNote ?? '';
        this.customerServiceNote = values.customerServiceNote ?? '';
        this.canTopup = values.canTopup ?? false;
        this.minRedeemQuantity = values.minRedeemQuantity ?? 0;
        this.maxIssuingQuantity = values.maxIssuingQuantity ?? 0;
        this.validFrom = values.validFrom ?? null;
        this.validTo = values.validTo ?? null;
        this.redeemDateBlacklistId = values.redeemDateBlacklistId ?? 0;
        this.redeemTimeRestrictionId = values.redeemTimeRestrictionId ?? 0;
        this.useTimeControl = values.useTimeControl ?? 0;
        this.useTimeControlInterval = values.useTimeControlInterval ?? 0;
        this.maxTotalRedeemAmountControl = values.maxTotalRedeemAmountControl ?? 0;
        this.maxTotalRedeemAmountControlInterval = values.maxTotalRedeemAmountControlInterval ?? 0;
        this.canIssue = values.canIssue ?? false;
        this.stopIssueTime = values.stopIssueTime ?? null;
        this.multipleSelectionType = values.multipleSelectionType ?? 0;
        this.pinCodeType = values.pinCodeType ?? 0;
        this.pinCodeLength = values.pinCodeLength ?? 0;
        this.canExtend = values.canExtend ?? false;
        this.extensionSchemeId = values.extensionSchemeId ?? 0;
        this.maxExtendTimes = values.maxExtendTimes ?? 0;
        this.extensionEndDate = values.extensionEndDate ?? null;
        this.sameAsValidEndDateOnContract = values.sameAsValidEndDateOnContract ?? false;

        // merchant group enhancement
        this.isIssueMerchantGroup = values.isIssueMerchantGroup;
        this.issueMerchantGroupId = values.issueMerchantGroupId;

        this.isMerchantGroup = values.isMerchantGroup;
        this.merchantGroupId = values.merchantGroupId;
    }
}

// TODO super voucher/ smart voucher
export class ProductWizardStepTwo {

    productComboList: ProductCombo[];

    constructor(values: any) {
      this.productComboList = [];
      values.productComboList.forEach((value: any) => {
        this.productComboList.push(new ProductCombo(value));
      });
    }
}

export class ProductCombo {
    productComboId: number;
    productId: number;
    childProductId: number;
    childProductVersionId: number;
    sequence: number;
    status: number;

    constructor(value: any) {
      this.productComboId = value.productComboId ?? 0;
      this.productId = value.productid ?? 0;
      this.childProductId = value.childProductId ?? 0;
      this.childProductVersionId = value.childProductVersionId ?? 0;
      this.sequence = value.sequence ?? 0;
      this.status = value.status ? 1 : 0;
    }
}

export class ProductWizardStepThree {
    sellingPricePrepaid: number;
    sellingPricePrepaidWithTax: number;
    sellingPricePostpaid: number;
    sellingPricePostpaidWithTax: number;
    customerFeePrepaid: number;
    customerFeePrepaidWithTax: number;
    customerFeePostpaid: number;
    customerFeePostpaidWithTax: number;

    expiryPolicyIdList = [];
    fixExpiryDate: string;
    isFixedExpiryPolicy: boolean;

    constructor(values: any) {
        this.sellingPricePrepaid = parseFloat(values.sellingPricePrepaid) ?? null;
        this.sellingPricePrepaidWithTax = parseFloat(values.sellingPricePrepaidWithTax) ?? null;
        this.sellingPricePostpaid = parseFloat(values.sellingPricePostpaid) ?? null;
        this.sellingPricePostpaidWithTax = parseFloat(values.sellingPricePostpaidWithTax) ?? null;
        this.customerFeePrepaid = parseFloat(values.customerFeePrepaid) ?? null;
        this.customerFeePrepaidWithTax = parseFloat(values.customerFeePrepaidWithTax) ?? null;
        this.customerFeePostpaid = parseFloat(values.customerFeePostpaid) ?? null;
        this.customerFeePostpaidWithTax = parseFloat(values.customerFeePostpaidWithTax) ?? null;

        this.expiryPolicyIdList = values.expiryPolicyIdList ?? [];
        this.fixExpiryDate = values.fixExpiryDate ?? null;
        this.isFixedExpiryPolicy = values.isFixedExpiryPolicy ?? null;
    }
}

export class ProductWizardStepFour {
    productTemplateList: ProductTemplate[] | null= [];
    addToWallet = true;
    walletStatus: number;
    walletImage: number;
    walletDescription: string;
    hexColor: string;
    fontSize: number;
    pointX: number;
    pointY: number;

    constructor (values: any, textEditorService: TextEditorService) {
        this.hexColor = values.hexColor ?? '';
        this.fontSize = values.fontSize ?? 0;
        this.pointX = values.pointX ?? 0;
        this.pointY = values.pointY ?? 0;
        this.addToWallet = values.addToWallet ?? false;
        this.walletStatus = values.walletStatus ? 1 : 0 ?? 0;
        this.walletImage = values.walletImage ? values.walletImage.mediaId ?? null : null;
        this.walletDescription = values.walletDescription ?? '';
        for (let productTemplate of values.productTemplateList) {
            if (productTemplate.templateVersionId && (productTemplate.templateName || productTemplate.templateName.templateName) && productTemplate.applyLanguage) {
                this.productTemplateList?.push(new ProductTemplate(productTemplate, textEditorService));
            }
        }

        if (!this.productTemplateList?.length) {
            this.productTemplateList = null;
        }
    }
}

export class ProductTemplate {
    templateType: number;
    templateSubType: number;
    templateVersionId: number;
    templateId?: number;
    templateName?: string;
    tagValueList?: TagValue[] = [];
    languageId?: number;
    defaultlanguageId?: number;
    templateTagValue?: TagValue[] = [];

    constructor(values: any, textEditorService: TextEditorService) {
        this.templateType = values.templateType ?? 0;
        this.templateSubType = values.templateSubType ?? values.templateType ?? 0;
        this.templateVersionId = values.templateVersionId ?? 0;
        this.templateId = values.templateId ?? 0;
        this.templateName = values.templateName.templateName ?? values.templateName ?? '';
        this.languageId = values.languageId ?? 0;
        this.defaultlanguageId = values.defaultlanguageId ?? 0;

        if (!values.templateTags || !values.templateTags.length) {
            this.tagValueList = [];
        } else {
            for (const templateTag of values.templateTags) {
                this.tagValueList?.push(new TagValue(values, templateTag, textEditorService));
            }
        }
    }
}

export class TagValue {
    contentTagId: number;
    tagName: string;
    value: string;
    textValue?: string | null;
    tagId?: number;

    constructor(values: any, templateTag: TemplateTag | null, textEditorService: TextEditorService) {
        if (templateTag === null) {
            this.contentTagId = 0;
            this.tagId = 0;
            this.tagName = '';
            this.value = '';
            this.textValue = '';
        } else {
            this.contentTagId = templateTag.tagId ?? 0;
            this.tagId = templateTag.tagId ?? 0;
            this.tagName = templateTag.tagName ?? '';
            this.value = values[templateTag.displayName]?.mediaId?.toString() ?? values[templateTag.displayName]?.tagValueId?.toString() ?? values[templateTag.displayName] ?? '';
            if (templateTag.type === TagType.RichText) {
                this.textValue = textEditorService.convertHtmlToPlainText(decode(this.value));
            } else {
                this.textValue = null;
            }
        }
    }
}

export class ProductWizardStepFive {
    productConditionDto: ProductCondition;
    productExternalPropertyList: ProductExternalProperty[] = [];

    constructor(values: any) {
        this.productConditionDto = new ProductCondition(values);
        this.productExternalPropertyList = values?.productExternalPropertyList?.map((x: ProductExternalProperty) => new ProductExternalProperty(x));
    }
}

export class ProductCondition {
    reminderId: number;
    reversalLimitId: number;
    preAuthorizationExpiryInterval: number;
    preAuthorizationExpiryUnit: number;
    minRedeemQuantity?: number;
    maxIssuingQuantity?: number;
    useTimeControl?: number;
    useTimeControlInterval?: number;
    reverseLimitId?: number;
    ProductId?: number;

    constructor(values: any) {
        this.reminderId = values.reminderId ?? null;
        this.reversalLimitId = values.reversalLimitId ?? null;
        this.preAuthorizationExpiryInterval = values.preAuthorizationExpiryInterval ?? 0;
        this.preAuthorizationExpiryUnit = values.preAuthorizationExpiryUnit ?? 0;
        this.minRedeemQuantity = values.minRedeemQuantity ?? null;
        this.maxIssuingQuantity = values.maxIssuingQuantity ?? null;
        this.useTimeControl = values.useTimeControl ?? 0;
        this.useTimeControlInterval = values.useTimeControlInterval ?? 0;
        this.ProductId = values.ProductId ?? 0;
    }
}

export class ProductExternalProperty {
    propertyName: string;
    propertyValue: string;
    description: string;

    constructor(values: ProductExternalProperty) {
        this.propertyName = values.propertyName ?? '';
        this.propertyValue = values.propertyValue ?? '';
        this.description = values.description ?? '';
    }
}
