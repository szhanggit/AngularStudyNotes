// response of GetGroupSkuByMerchantId
export interface SkuDetail {
  createdBy?: string,
  createdDateTime?: string,
  faceValueWithTax?: number,
  faceValueWithoutTax?: number,
  id: number,
  merchantGroupId?: number,
  skuName?: string,
  skuNumber?: string
  contractSKUCosts?: ContractSKUCost[],
  skuType?: SkuType,
  voucherNumberRule?: VoucherNumberRule,
  skuStatus?: string,
  multiplier?: number,
}

export interface SkuType {
  id: number,
  value: string,
}

export interface VoucherNumberRule {
  ruleName: string,
  voucherNumberRuleId: number,
}

export interface ContractSKUCost {
  contractSkuStatus: ContractSkuStatus,
  totalCount: number,
  id?: number,
  costWithTax?: number,
  costWithoutTax?: number,
  createdBy?: string,
  createdDateTime? : string,
  validStartDate?: string,
  validEndDate? : string,
  skuCostContract?: SkuCostContract
  contractId: number,
}

export interface ContractSkuStatus {
  id: number,
  value: string,
}

export interface SkuCostContract {
  contractCostScheme: ContractCostScheme,
  contractId: number,
  contractName: string,
  merchant: Merchant,
}
export interface ContractCostScheme {
  id: number,
  value: string
}



// pagination
export interface PageDetails {
  currentPage: number,
  pageCount: number,
  pageSize: number,
  itemStart: number,
  itemEnd: number,
  total: number,
}


export interface VnrListResponse {
  voucherNumberRuleId: number,
  ruleName: string,
}

export interface MerchantGroupMerchantMapsContract {
  merchant: Merchant,
}

export interface Merchant {
  name: string,
  contracts: Contracts[],
  status: number,
  merchantId: number,
}

export interface Contracts {
  contractId: number,
  contractName: string,
  costPercentage: number,
  costSchemeId: number,
  endDate: string,
  startDate: string,
  statusId: number,
}

// interface for merchant group management page
export interface MerchantListUI {
  merchantId: number,
  name: string,
  contractList: ResponseContract[],
  shopAmount: number,
  contractId: number,
  cost: number,
  validStartDate: string,
  validEndDate: string,
}

// interface for merchant group sku detail page
export interface SkuMerchantGroupListUI {
  merchantId: number,
  merchantName: string,
  contractName: string,
  contractId: number,
  contractNumber: number | null,
  shopAmount: number,
  costWithTax: number,
  costWithoutTax: number,
  validStartDate: string,
  validEndDate: string,
  status: number,
  createdBy: string,
  createdDateTime: string,
}

export interface ResponseShopCountByMerchantIds {
  shopCountByMerchantIds: ResponseShopCountByMerchantId[];
}

export interface ResponseShopCountByMerchantId {
  count: number,
  id: number,
}

export interface ResponseContract {
  contractId: number,
  contractName: string,
  costPercentage: number,
  costSchemeId: number,
  endDate: string,
  startDate: string,
  statusId: number,
}