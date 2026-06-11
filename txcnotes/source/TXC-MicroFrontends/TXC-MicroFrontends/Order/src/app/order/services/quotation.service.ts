import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { QuotationPaginationParams } from '../interface/quotation-state.interface';
import { BaseResponse } from '../models/base-response.model';
import { Observable, map } from 'rxjs';
import { ChildProductDetails, ChildProductQuotation, Product } from 'src/app/shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  constructor(private http: HttpClient) {}

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  getQuotations(params?: QuotationPaginationParams) {
    const url = `${this.getURL()}api/Quotation/SignedQuotations`;
    const queryParams: string[] = [];

    if (params?.keyword) queryParams.push(`Keyword=${params.keyword}`);
    if (params?.status !== undefined)
      queryParams.push(`Status=${params.status}`);
    if (params?.clientCode) queryParams.push(`ClientCode=${params.clientCode}`);
    if (params?.validOn) queryParams.push(`ValidOn=${params.validOn}`);
    if (params?.pageSize !== undefined)
      queryParams.push(`pageSize=${params.pageSize}`);
    if (params?.pageIndex !== undefined)
      queryParams.push(`pageIndex=${params.pageIndex}`);

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    return this.http.get(url + queryString);
  }

  getQuotationById(quotationId: number) {
    const url = `${this.getURL()}api/Quotation/SignedQuotations?quotationId=${quotationId}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }

  childProductInQuotation(quotationId: number, MasterProductCode: string[]) {
    const convertedMasterProductCode = MasterProductCode?.map(
      (productCode) => 'MasterProductCode=' + productCode
    )?.join('&');
    const url = `${this.getURL()}api/Quotation/ChildProductInQuotation?QuotationId=${quotationId}&${convertedMasterProductCode}`;
    return this.http.get(url) as Observable<BaseResponse>;
  }

  getQuotationProduct(quotationNumber: string, orderId: number) {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `query  {
            orders(where: { id: { eq: ${orderId} } }) {
            items {
                orderLines {
                    id
                    productVersion {
                        productVersionId
                        product {
                            quotationProduct(quotationNumber: "${quotationNumber}") {
                                id
                                clientQuotationProductSoldPrice {
                                    soldPrice
                                    soldPriceWithTax
                                }
                            }
                        }
                        contractSKU {
                            faceValueWithTax
                            faceValueWithoutTax
                        }
                    }
                }
            }
        }
    }`,
    };
    return (this.http.post(url, body) as Observable<BaseResponse>).pipe(
      map((response: BaseResponse) => {
        if (response.success) {
          return JSON.parse(response.data)?.orders?.items[0];
        }
      })
    );
  }

  convertChildProductQuotation(
    childProducts: ChildProductQuotation[],
    productList: Product[]
  ) {
    const finalChildProductList: Product[] = productList;
    childProducts?.forEach((productData: ChildProductQuotation) => {
      if (productData.childProductDetail?.length > 0) {
        productData.childProductDetail.forEach(
          (childData: ChildProductDetails) => {
            childData.parentCode = productData.masterProductCode;
            childData.isChildProduct = true;
            const insertPosition = productList.findIndex(
              (list) => list.productCode === childData.parentCode
            );
            finalChildProductList.splice(
              insertPosition + 1,
              0,
              childData as Product
            );
          }
        );
      }
    });
    return finalChildProductList;
  }
}
