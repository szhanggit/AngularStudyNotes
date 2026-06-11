import { DirectDeliveryDetails } from 'src/app/order/models/direct-delivery-details.model';
import { DFVQuantityStatus, TrustAccountStatus } from './product.model';

export interface ProductReferenceModel {
    productName: string;
    productCode: string;
    productType: number;
    id: number;
    remainingQuantity?: number;
    sellingPrice?: number;
    faceValue?: number;
    dfvQuantity?: DFVQuantityStatus[];
    dfvPercentage?: number;
    faceValueRange?: string;
    trustAccount?: TrustAccountStatus;
    directDeliveryDetails?: DirectDeliveryDetails[];
}