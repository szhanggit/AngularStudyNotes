import { NgbDate } from "@ng-bootstrap/ng-bootstrap"

export interface ProductRestrictionModel {
    productTimeRestrictionList : any[],
    productDateRestrictionList: any[],
    productId: number
}
export interface productTimeRestrictionModel {
    redemptionDay: number, 
    redemptionFrom: string,
    redemptionTo: string
}
export interface productTimeRestrictionRequestModel {
    dayOfTheWeek: number, 
    hours: string,     
    productRedeemTimeRestrictionId: number,
    productRedeemTimeRestrictionSetId: number 
}
export interface productDateRestrictionModel {
    redemptionExcludeDate : NgbDate
}
export interface restrictionUpdateBodyModel {
    productId: number
    timeRestrictionList : productTimeRestrictionRequestModel[],
    redeemDateBlacklist: string[]
}
