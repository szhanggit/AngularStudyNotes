import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderProductSelectionModalComponent } from 'src/app/shared/core/order-product-selection/order-product-selection-modal/order-product-selection-modal.component';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { ProductReferenceModel } from 'src/app/shared/models/product-reference.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // mock data until API is ready
  private productReference: ProductReferenceModel[] = [
    {
      id: 100,
      productType: ProductTypeEnum.ProductBased,
      productName: 'ValidationErrorProduct',
      productCode: 'ValidationErrorProduct001',
      remainingQuantity: 10,
      faceValue: 10,
      sellingPrice: 10,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: 'STUDIO A-國泰',
        trustAccountFee: '0.1%',
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'NoExpireDate',
        trustExpiryDate: null,
      },
    },
    {
      id: 101,
      productType: ProductTypeEnum.ProductBased,
      productName: 'StevenLu_PB_1684461360',
      productCode: 'PB_1684461360',
      remainingQuantity: 10,
      faceValue: 10,
      sellingPrice: 10,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: '饗賓-陽信',
        trustAccountFee: '0.2%',
        trustAccountOption: 'Default',
        trustAmount: '100',
        trustExpiryScheme: 'Within30DaysExpiredAfterActivation',
        trustExpiryDate: null,
      },
    },
    {
      id: 102,
      productType: ProductTypeEnum.ProductBased,
      productName: 'Steven_VB_1684234680',
      productCode: '1684234680',
      remainingQuantity: 10,
      faceValue: 10,
      sellingPrice: 10,
      trustAccount: {
        isTrustAccountNeeded: false,
      },
    },
    {
      id: 103,
      productType: ProductTypeEnum.ProductBased,
      productName: 'RUBPB_V0100505',
      productCode: 'RUBPBCode_V0100505',
      remainingQuantity: 10,
      faceValue: 10,
      sellingPrice: 10,
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: '宜睿-星展',
        trustAccountFee: '0.1%',
        trustAccountOption: 'Custom',
        trustAmount: '',
        trustExpiryScheme: 'FixEndOfDay',
        trustExpiryDate: '2023/06/30 23:59:59',
      },
    },
    {
      id: 104,
      productType: ProductTypeEnum.ProductBased,
      productName: 'naomiedemo',
      productCode: 'TEST0421',
      remainingQuantity: 10,
      faceValue: 10,
      sellingPrice: 10,
      trustAccount: {
        isTrustAccountNeeded: false,
      },
    },
    {
      productName: 'DFV{FV}_05041546 - 1',
      productCode: 'DFV0428001',
      id: 455,
      productType: ProductTypeEnum.DynamicFaceValue,
      remainingQuantity: 10,
      faceValue: 10,
      sellingPrice: 10,
      faceValueRange: '200 to 2000',
      trustAccount: {
        isTrustAccountNeeded: true,
        trustAccount: '宜睿-國泰世華',
        trustAccountFee: '0.3%',
        trustAccountOption: 'Custom',
        trustAmount: '',
        trustExpiryScheme: 'Within20DaysExpiredAfterActivation',
        trustExpiryDate: null,
      },
    },
    {
      productName: 'DFV{FV}_05041546 - 2',
      productCode: 'DFV0428002',
      id: 456,
      productType: ProductTypeEnum.DynamicFaceValue,
      remainingQuantity: 10,
      faceValue: 10,
      sellingPrice: 10,
      faceValueRange: '1 to 10',
      trustAccount: {
        isTrustAccountNeeded: false,
      },
    },
  ];
  // mock data until API is ready
  private expirySchemeData = [
    {
      label: 'NoExpireDate',
      value: 'NoExpireDate',
    },
    {
      label: 'Within30DaysExpiredAfterActivation',
      value: 'Within30DaysExpiredAfterActivation',
    },
    {
      label: 'Within20DaysExpiredAfterActivation',
      value: 'Within20DaysExpiredAfterActivation',
    },
    {
      label: 'Within2MonthsExpiredAfterActivation',
      value: 'Within2MonthsExpiredAfterActivation',
    },
    {
      label: 'Within1MonthsExpiredAfterActivation',
      value: 'Within1MonthsExpiredAfterActivation',
    },
    {
      label: 'FixEndOfDay',
      value: 'FixEndOfDay',
    },
    {
      label: 'FixNotEndOfDay',
      value: 'FixNotEndOfDay',
    },
    {
      label: 'ThirdParty FixEndOfDay',
      value: 'ThirdParty FixEndOfDay',
    },
  ];

  private trustAccountList = [
    {
      label: '饗賓-陽信',
      value: '饗賓-陽信',
    },
    {
      label: '宜睿-星展',
      value: '宜睿-星展',
    },
    {
      label: 'STUDIO A-國泰',
      value: 'STUDIO A-國泰',
    },
    {
      label: '宜睿-國泰世華',
      value: '宜睿-國泰世華',
    },
    {
      label: '雲朗-陽信',
      value: '雲朗-陽信',
    },
    {
      label: '王品-陽信',
      value: '王品-陽信',
    },
    {
      label: '六角-國泰世華',
      value: '六角-國泰世華',
    },
  ];

  private emailTemplateList = [
    {
      label: 'Original',
      value: 'Original',
    },
    {
      label: 'TestTemplate',
      value: 'TestTemplate',
    },
    {
      label: 'SmartVoucher',
      value: 'SmartVoucher',
    },
    {
      label: 'SmartVoucherWithQRCode',
      value: 'SmartVoucherWithQRCode',
    },
    {
      label: 'SmartVoucherNoPic',
      value: 'SmartVoucherNoPic',
    },
  ];

  constructor(private modalService: NgbModal) {}

  private splitByCapitalLetter(value: string | undefined): string {
    const arr = value!.match(/([A-Z]?[a-z]+|[A-Z]|[0-9]+)/g) ?? [];
    return !value ? '' : arr.join(' ');
  }

  getProductsListByQuotationId(id: number) {
    return {
      data: this.productReference,
    };
  }

  getTrustAccountList() {
    return {
      data: JSON.stringify(this.trustAccountList),
    };
  }

  getExpirySchemeData() {
    return {
      data: JSON.stringify(
        this.expirySchemeData.map((element) => {
          return {
            ...element,
            label: this.splitByCapitalLetter(element.label),
          };
        })
      ),
    };
  }

  getEmailTemplateListData() {
    return {
      data: JSON.stringify(
        this.emailTemplateList.map((element) => {
          if (element.label === 'Original') {
            return { ...element, label: 'Same as voucher page' };
          } else {
            return {
              ...element,
              label: this.splitByCapitalLetter(element.label),
            };
          }
        })
      ),
    };
  }

  openProductSelectionModal(calledFrom: 'orderDetails' | 'createOrder') {
    const modal = this.modalService.open(OrderProductSelectionModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });

    modal.componentInstance.calledFrom = calledFrom;
    return modal;
  }
}
