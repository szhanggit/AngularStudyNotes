import { ProductTypeEnum } from "../../enums/product-type.enum"

export interface ChildProduct {
  productType: ProductTypeEnum,
  productName: string,
  productCode: string,
  faceValueWithTax?: number,
  defaultSellingPricePrepaidWithTax?: number,
  defaultSellingPricePostpaidWithTax?: number,
  defaultSellingPricePrepaidPercentage?: number,
  productCostWithTax?: number,
  productCostPercentage?: number
}

export interface ProductComboBrand {
  brandName: string,
  quantity: number,
  dfvIncluded: boolean
}
