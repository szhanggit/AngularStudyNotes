import { Injectable } from '@angular/core';
import {
  BATCH_ITEM_VIEW_LIST_MOCK_DATA,
  BATCH_LIST_MOCK_DATA,
  BATCH_LIST_MOCK_DATA_TW,
  BATCH_ORDER_LIST_MOCK_DATA,
} from '../../constants/test-data.const';
import { Observable, map, of } from 'rxjs';
import { UtilityService } from '../utility.service';
import { BusinessUnitEnum } from '../../enums/tenant.enum';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../../models/dumb-models/base-response.model';
import { ContractSku, Merchant } from '../../models/contract-sku-details.model';
import { UploadInventoryPayload } from '../../models/upload-inventory-payload.model';

@Injectable({
  providedIn: 'root',
})
export class BatchListService {
  get batchListMockData() {
    return this.utilityService.selectedTenant === BusinessUnitEnum.Taiwan
      ? BATCH_LIST_MOCK_DATA_TW
      : BATCH_LIST_MOCK_DATA;
  }

  get batchItemViewListMockData() {
    return BATCH_ITEM_VIEW_LIST_MOCK_DATA;
  }

  constructor(
    private utilityService: UtilityService,
    private http: HttpClient
  ) {}

  private getURL(): string {
    const splited = window.location.toString().split('/');
    return splited[0] + '//' + environment.apiUrl;
  }

  getInventoryList() {
    return of(this.batchListMockData).pipe(
      map((paginatedList) => {
        const data = this.utilityService.transformedTableData(
          paginatedList.data
        );
        return { ...paginatedList, data: data };
      })
    );
  }

  getVoucherOperationsList() {
    return of(this.batchListMockData).pipe(
      map((paginatedList) => {
        const data = this.utilityService.transformedTableData(
          paginatedList.data
        );
        return { ...paginatedList, data };
      })
    );
  }

  getBatchViewList() {
    return of(BATCH_ORDER_LIST_MOCK_DATA).pipe(
      map((paginatedList) => {
        const data = this.utilityService.transformedTableData(
          paginatedList.data
        );
        return { ...paginatedList, data };
      })
    );
  }

  getBatchItemViewList() {
    return of(this.batchItemViewListMockData).pipe(
      map((paginatedList) => {
        const data = this.utilityService.transformedTableData(
          paginatedList.data,
          true
        );
        return { ...paginatedList, data };
      })
    );
  }

  getMerchantBySkuCode(skuCode: string): Observable<BaseResponse<Merchant>> {
    const url = `${this.getURL()}api/GraphQL/Query`;
    const body = {
      query: `{
        contractSKUDetails(take: 100, where: { skuNumber: { eq: "${skuCode}" } }) {
          items {
            skuNumber
            contractSKUCosts {
              skuCostContract {
                merchant {
                  program {
                    id
                    isEdenred
                    name
                  }
                }
              }
            }
          }
        }
      }
      `,
    };

    return this.http.post(url, body).pipe(
      map((res: any) => {
        const parsedData: ContractSku = JSON.parse(res.data);
        const merchant: Merchant =
          parsedData?.contractSKUDetails?.items[0]?.contractSKUCosts[0]
            ?.skuCostContract?.merchant;

        return { ...res, data: merchant };
      })
    );
  }

  uploadInventoryVoucherNumber(payload: UploadInventoryPayload) {
    const formData = new FormData();
    payload.SKUCode && formData.append('SKUCode', payload.SKUCode);
    payload.MerchantName &&
      formData.append('MerchantName', payload.MerchantName);
    payload.ExpiryDate && formData.append('ExpiryDate', payload.ExpiryDate);
    payload.StartDateAvailable &&
      formData.append('StartDateAvailable', payload.StartDateAvailable);
    payload.EndDateAvailable &&
      formData.append('EndDateAvailable', payload.EndDateAvailable);
    formData.append('File', payload.File);

    return this.http.put(
      `${this.getURL()}/api/BatchProccessor/upload/inventory`,
      formData
    );
  }

  // Mock only
  mockUpload(payload: File) {
    if (payload.name.includes('MockError')) {
      return of({
        status: 400,
        message: 'Invalid file',
      });
    }

    return of({
      status: 200,
      message: 'Success',
    });
  }
}
