import { ProductRestrictionModel } from "./product-restriction.model";

export interface getProductRestrictionResponse {
    data : ProductRestrictionModel,
    message: string,
    status: boolean
}