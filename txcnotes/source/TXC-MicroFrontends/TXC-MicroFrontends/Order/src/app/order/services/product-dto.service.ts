import { Injectable } from '@angular/core';
import { ProductDTO } from 'src/app/shared/models/product-dto.model';
import { Product } from 'src/app/shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductDtoService {
  constructor() {}

  fromDtoToModel(dtoModels: ProductDTO[]): Product[] {
    return dtoModels.map((dto) => ({
      id: dto.productId,
      productVersionId: dto.productVersionId,
      productType: dto.productType,
      productCode: dto.productCode,
      productName: dto.productName,
      remainingQuantity: dto.remainingQty,
      voucherQuantity: dto.voucherQty,
      faceValue: dto.faceValue,
      dfvPercentage: dto.remainingQty
        ? ((dto.voucherQty ?? 0) / dto.remainingQty) * 100
        : 0,
      sellingPrice: dto.soldPrice,
      reservationCode: dto.reservationCode,
      exchangeTime: dto.exchangeTime,
      expiryScheme: dto.expiryDateSchemeId,
      expirySchemeText: dto.expiryDateScheme,
      expiryDate: dto.expiryDate,
      clientOrderNumber: dto.clientOrderNo,
      isChildProduct: false,
      isMaster: dto.isMaster,
      emailQuantity: dto.emailQty,
      smsQuantity: dto.smsQty,
      dfvQuantity: dto.faceValueList?.map((item) => ({
        voucherQuantity: item.quantity,
        faceValue: item.faceValue,
        sellingPrice: item.faceValue * dto.soldPrice!,
      })),
      needTrustAccount: dto.needTrustAccount,
      trustAccount: {
        isTrustAccountNeeded: dto.needTrustAccount,
        trustAccount: dto.trustAccountId,
        trustAccountFee: dto.trustAccountFee,
        trustAccountBatchNumber: dto.trustAccountBatchNumber,
        trustAccountOption: dto.trustAccountOption ?? 'Default',
        trustAmount: dto.trustAmount,
        trustExpiryDate: dto.trustExpiryDate,
        trustExpiryDateType: dto.trustExpiryDateType,
        trustExpiryScheme: dto.trustExpiryScheme ?? dto.trustExpiryDateType,
      },
    }));
  }

  fromModelToDto(models: Product[]): ProductDTO[] {
    return models.map((model) => ({
      productId: model.id,
      productVersionId: model.productVersionId,
      productType: model.productType,
      productCode: model.productCode,
      productName: model.productName,
      remainingQty: model.remainingQuantity,
      voucherQty: model.voucherQuantity,
      faceValue: model.faceValue,
      soldPrice: model.sellingPrice,
      reservationCode: model.reservationCode,
      exchangeTime: model.exchangeTime,
      expiryDateSchemeId: model.expiryScheme,
      expiryDateScheme: model.expirySchemeText,
      expiryDate: model.expiryDate,
      clientOrderNo: model.clientOrderNumber,
      emailQty: model.emailQuantity,
      smsQty: model.smsQuantity,
      faceValueList: model.dfvQuantity?.map((item) => ({
        faceValue: item.faceValue,
        quantity: item.voucherQuantity,
      })),
    }));
  }
}
