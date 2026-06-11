export interface OrderRequest {
  basicInfoFormGroup: BasicInfo;
  settingsFormGroup: Settings;
  memoFormGroup: Memo;
  attachmentFormGroup: Attachments;
  deliveryDetailsFormGroup: DefaultContent;
}

interface BasicInfo {
  activationDate: Date;
  afterPublished?: string;
  activationType: number;
  hasNoTargetPublishDate?: boolean;
  orderName: string;
  publishDate: Date;
}

interface Settings {
  barcodeInfo: number;
  channelId: number;
  emailAttachment: number;
  excelFormat: number;
  excelShortUrl: number;
  generateSequenceNumber: boolean;
  shortUrlAuthCodeGenerationWay: number;
}

interface Memo {
  memo: string;
}

interface Attachments {
  attachments: File[] | any[];
}

interface DefaultContent {
  emailTemplate: string,
  emailSubject: string,
  emailGreeting: string,
  msgEncoding: number,
  smsGreeting: string,
}

export interface UpdateOrderStatusRequest {
  id: number;
  statusId: number;
}

export interface ErrorValidationDto {
  columnName: string;
  errorMessage: string;
  referenceKey: string;
}