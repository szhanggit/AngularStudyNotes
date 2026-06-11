// response of GetGroupSkuByMerchantId
export interface UpdateContractPeriod {
  contractId: number,
  endDate: string,
  skuCosts: ContractPeriodSkuCost[],
}

export interface ContractPeriodSkuCost {
  skuCostId: Number,
}

export interface SkuCostData
{
  skuCostId: number,
  cost: number,
  validStartDate: string,
  validEndDate: string,
  statusId: number
}

export interface SkuData {
  skuId: number,
  skuName: string,
  skuNumber: string,
  skuTypeId: number,
  faceValueWithTax: number,
  voucherNumberRuleId: number,
  multiplier: number,
  skuCost: SkuCostData[]
}

export interface UpdateContractRequest {
  contractId: number,
  contractName: string,
  startDate: string,
  endDate: string,
  paymentTermId: number,
  priceOptionId: number,
  costSchemeId: number,
  costPercentage: number,
  costRoundingRuleId: number,
  costRoundingPlaceId: number,
  sku: SkuData[]
}


