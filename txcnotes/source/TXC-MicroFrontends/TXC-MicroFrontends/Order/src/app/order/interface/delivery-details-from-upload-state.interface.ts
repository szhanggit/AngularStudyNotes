export interface FromUpload {
  productId: number;
  deliveryDetailsFromUpload: boolean;
}

export interface FromUploadState {
  fromUploadState: FromUpload[];
}

export const INIT_DEL_DET_FROM_UPLOAD_STATE: FromUploadState = {
  fromUploadState: [],
};
