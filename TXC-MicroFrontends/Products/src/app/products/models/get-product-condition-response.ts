import { ProductCondition } from "./product-wizard-dto.model";

export interface getProductConditionResponse {
    data : ProductCondition,
    message: string,
    success: boolean
}
