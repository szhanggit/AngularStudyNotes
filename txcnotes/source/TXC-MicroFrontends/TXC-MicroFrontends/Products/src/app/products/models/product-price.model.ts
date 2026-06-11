export interface ProductPrice {
    productPriceId: number;
    faceValue: number;
    faceValueWithTax: number;
    sellingPricePrepaid: number;
    sellingPricePrepaidWithTax: number;
    sellingPricePostpaid: number;
    sellingPricePostpaidWithTax: number;
    cost: number;
    costWithTax: number;
    balance: number;
    customerFeePrepaid: number;
    customerFeePrepaidWithTax: number;
    customerFeePostpaid: number;
    customerFeePostpaidWithTax: number;
    merchantFee: number;
    merchantFeeWithTax: number;
    defaultSellingPrice: number;
    defaultProductCost: number
}