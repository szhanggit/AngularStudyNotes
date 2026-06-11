export enum SkuTypeEnum {
  ProductBased = 1,
  ValueBased = 2,
  SmarBooklet = 3,
  DynamicFaceValue = 4
}

export enum ContractSchemeEnum {
  Percentage = 1,
  Fixed = 2,
}

export enum ContractSkuStatusEnum {
  Approved = 2,
  Deleted = 3,
}

export enum UISkuStatusEnum {
  Expired = 'Expired',
  Approved = 'Approved',
  Deleted = 'Deleted',
  Others = 'Others', // TODO: If shows Others on UI then should check if the implementation is correct
}
