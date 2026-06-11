export interface UploadInventoryPayload {
  MerchantName?: string;
  SKUCode?: string;
  ExpiryDate?: string;
  StartDateAvailable?: string;
  EndDateAvailable?: string;
  File: File;
}
