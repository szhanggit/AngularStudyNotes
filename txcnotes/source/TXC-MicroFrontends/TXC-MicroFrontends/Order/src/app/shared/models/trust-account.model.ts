export interface orderLineTrustAccount {
  amount: number;
  createdDateTime: string;
  expiryDate: string;
  expiryPolicyId: number;
  id: number;
  orderLineId: number;
  trustAccountBatchNo: string;
  trustAccountId: number;
  trustAccountOption: number;
  validFrom: string;
  validTo: string;
  isTrustAccountNeeded?: boolean;
  Fee?: string;
  trustExpiryScheme?: string;
}
