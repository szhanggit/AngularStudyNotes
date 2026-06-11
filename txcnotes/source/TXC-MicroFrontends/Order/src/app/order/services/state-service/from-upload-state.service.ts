import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import {
  FromUpload,
  FromUploadState,
  INIT_DEL_DET_FROM_UPLOAD_STATE,
} from '../../interface/delivery-details-from-upload-state.interface';

@Injectable({
  providedIn: 'root',
})
export class FromUploadStateService extends StateService<FromUploadState> {
  fromUploadList: FromUpload[] = [];
  fromUpload$ = this.select((state) => state);
  constructor() {
    super(INIT_DEL_DET_FROM_UPLOAD_STATE);
  }

  /**
   * sets productId and deliveryDetailsFromUpload global state
   * @param DeliveryDetailsFromUpload
   */
  setDeliveryDetailsFromUpload(
    productId: number,
    deliveryDetailsFromUpload: boolean
  ) {
    const index = this.fromUploadList.findIndex(
      (deliveryDetailsFromUpload) =>
        deliveryDetailsFromUpload.productId === productId
    );
    if (index < 0) {
      this.fromUploadList.push({
        productId,
        deliveryDetailsFromUpload,
      });
    } else {
      this.fromUploadList.splice(index, 1, {
        productId,
        deliveryDetailsFromUpload,
      });
    }
    this.setState({
      fromUploadState: this.fromUploadList,
    });
  }
}
