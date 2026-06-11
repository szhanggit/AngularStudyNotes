import { DirectDeliveryDetails } from 'src/app/order/models/direct-delivery-details.model';
import { OrderLineTemplate } from 'src/app/order/models/order.model';

export interface Product {
  id: number;
  productVersionId: number;
  productCode: string;
  productName: string;
  productType: number;
  remainingQuantity?: number;
  voucherQuantity?: number;
  emailQuantity?: number;
  smsQuantity?: number;
  slmsQuantity?: number;
  issuedQuantity?: number;
  emailIssuedQuantity?: number;
  smsIssuedQuantity?: number;
  faceValue?: number;
  sellingPrice?: number;
  reservationCode?: string;
  exchangeTime?: string;
  expiryScheme: number;
  expirySchemeText?: string;
  expiryDate?: string;
  clientOrderNumber?: string;
  dfvQuantity?: DFVQuantityStatus[];
  dfvPercentage?: number;
  isChildProduct: boolean;
  parentCode?: string;
  isShortUrlNeeded?: number;
  faceValueRange?: string;
  trustAccount?: TrustAccountStatus;
  directDeliveryDetails?: DirectDeliveryDetails[];
  isActive?: boolean;
  needTrustAccount?: boolean;
  isEditMode?: boolean;
  orderLineTemplateId?: number;
  orderLineTemplate?: OrderLineTemplate;
  isMaster?: boolean;
  quotationProduct?: QuotationProduct;
  contractSKU?: ContractSKU[];
  orderLineId?: number;
}

export interface OrderLine {
  productVersionId: number;
  expirationPolicyId: number;
  expiryDate: string;
  totalQuantity: number;
  voucherReservationCode: string;
  clientOrderNo: string;
  needShortUrl: boolean;
  needTrustAccount: boolean;
  emailQuantity: number;
  smsQuantity: number;
  slmsQuantity?: number;
  dfvProductDetails: DfvProductDetails[];
  orderLineDetails: OrderLineDetail[];
  trustAccount: TrustAccountDetail;
  isMaster?: boolean;
}

interface DfvProductDetails {
  faceValueWithTax: number;
  voucherQuantity: number;
}

interface OrderLineDetail {
  beneficiaryName: string;
  email: string;
  mobile: string;
  faceValue: number;
  voucherQuantity: number;
  edOrderNo: string;
  postCode: string;
  address: string;
  language: string;
  activeDate: string;
  expirySchemeId: number;
  expiryDate: string;
  memo: string;
}

export interface DFVQuantityStatus {
  voucherQuantity: number;
  faceValue: number;
  sellingPrice: number;
  emailQty?: number;
  smsQty?: number;
}

export interface TrustAccountStatus {
  isTrustAccountNeeded?: boolean;
  trustAccount?: string;
  trustAccountBank?: string;
  trustAccountFee?: string;
  trustAccountBatchNumber?: number;
  trustAccountOption?: string;
  trustAmount?: string;
  trustExpiryScheme?: string;
  trustExpiryDate?: string | null;
  validPeriod?: string[];
  trustExpiryDateType?: string;
}

interface TrustAccountDetail {
  trustAccountId: number;
  trustAccountFee: number;
  trustAccountBatchNumber: string;
  trustAccountOptionId: number;
  trustAmount: number;
  trustExpirySchemeId: number;
  trustExpiryDate: string;
  trustExpiryDateType: number;
}

export interface ChildProductQuotation {
  masterProductCode: string;
  childProductDetail: ChildProductDetails[];
}

export interface ChildProductDetails {
  productCode: string;
  productName: string;
  expirySchemeText: string;
  expiryDate: string;
  isChildProduct?: boolean;
  parentCode?: string;
}

export interface QuotationProduct {
  id: number;
  clientQuotationProductSoldPrice: QuotationProductSoldPrice[];
}

export interface QuotationProductSoldPrice {
  soldPrice: number;
  soldPriceWithTax: number;
}

export interface ContractSKU {
  faceValueWithoutTax: number;
  faceValueWithTax: number;
}