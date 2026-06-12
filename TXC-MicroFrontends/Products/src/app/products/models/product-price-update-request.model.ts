export interface ProductPriceUpdateRequest {
    productId: number,
    sellingPricePrepaidWithTax?: number,
    sellingPricePostpaidWithTax?: number,
    customerFeePrepaidWithTax?: number,
    customerFeePostpaidWithTax?: number,
    faceValue?: number,
    cost?: number,
    timeOffsetHour?: number,
    timeOffsetMinute?: number
}