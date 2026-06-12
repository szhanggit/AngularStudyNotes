import { BaseResponse } from 'src/app/order/models/base-response.model';

export interface ProductDTOResponse extends BaseResponse {
  data: {
      orderProductList: ProductDTO[];
      errorValidationDto: ErrorValidationDto[];
  };
}
export interface ProductDTO {
    productId: number;
    productVersionId: number;
    productType: number;
    productCode: string;
    productName: string;
    remainingQty?: number;
    voucherQty?: number;
    faceValue?: number;
    soldPrice?: number;
    reservationCode?: string;
    exchangeTime?: string;
    expiryDateSchemeId: number;
    expiryDateScheme?: string;
    expiryDate?: string;
    expiryTime?: string;
    clientOrderNo?: string;
    emailQty?: number,
    smsQty?: number,
    faceValueList?: DFVFaceValue[],
    needTrustAccount?: boolean;
    trustAccountId?: string;
    trustAccountFee?: string;
    trustAccountBatchNumber?: number;
    trustAccountOption?: string;
    trustAmount?: string;
    trustExpiryScheme?: string;
    trustExpiryDate?: string;
    trustExpiryDateType?: string;
    isMaster?: boolean;
  }

  export interface ErrorValidationDto {
    columnName: string,
    errorMessage: string,
    referenceKey: string,
    rowNumber: number
  }

  export interface DFVFaceValue {
    faceValue: number,
    quantity: number,
    sellingPrice?: number
  }