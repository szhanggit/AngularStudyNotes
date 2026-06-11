import { Merchant } from "./merchant.model";
import { VoucherNumberRule } from "./voucher-number-rule.model";

export interface SKU {
    id: number;
    skuName: string;
    skuNumber: string;
    faceValueWithTax: number;
    createdBy: string;
    skuType: SKUType;
    multiplier: number;
    merchantGroupId?: number;
    voucherNumberRule: VoucherNumberRule;
    contractSKUCosts: ContractSKUCosts[];
}

export interface SKUType {
    id: number;
    value: string;
}

export interface ContractSKUCosts { 
    costWithTax: number;
    costWithoutTax: number;
    validStartDate: string;
    validEndDate: string;
    createdBy: string;
    createdDateTime: string;
    skuCostContract: SKUCostContract;
    contractSkuStatus: ContractSkuStatus; 
} 

export interface SKUCostContract { 
    contractId: number;
    contractName: string;
    contractNumber: string;
    creator: string;
    merchantId?: number;
    merchant?: Merchant;
    costSchemeId?: number;
}

export interface ContractSkuStatus {
    id: number;
    value: string;
}