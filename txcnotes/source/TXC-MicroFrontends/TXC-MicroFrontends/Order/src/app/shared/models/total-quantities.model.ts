export interface ITotalQuantities {
  productQuantity: number;
  voucherQuantity: number;
  emailQuantity: number;
  smsQuantity: number;
  issueQuantity: number;
  emailIssueQuantity: number;
  smsIssueQuantity: number;
}

export class TotalQuantities implements ITotalQuantities {
  productQuantity: number = 0;
  voucherQuantity: number = 0;
  emailQuantity: number = 0;
  smsQuantity: number = 0;
  issueQuantity: number = 0;
  emailIssueQuantity: number = 0;
  smsIssueQuantity: number = 0;
}
