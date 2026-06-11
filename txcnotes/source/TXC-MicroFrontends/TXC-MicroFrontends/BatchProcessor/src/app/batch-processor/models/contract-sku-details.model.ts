export interface Merchant {
  program: Program;
}

export interface Program {
  id: number;
  isEdenred: boolean;
  name: string;
}

export interface SkuCostContract {
  merchant: Merchant;
}

export interface ContractSkuCost {
  skuCostContract: SkuCostContract;
}

export interface Item {
  skuNumber: string;
  contractSKUCosts: ContractSkuCost[];
}

export interface ContractSkuDetails {
  items: Item[];
}

export interface ContractSku {
  contractSKUDetails: ContractSkuDetails;
}
