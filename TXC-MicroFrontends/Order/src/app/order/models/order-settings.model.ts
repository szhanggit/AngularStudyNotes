import { Order } from './order.model';

export class OrderSettingsModel {
  excelFormat: number;
  excelShortUrl: number;
  barcodeInfo: number;
  emailAttachment: number;
  shortUrlAuthCodeGenerationWay: number;
  generateSequenceNumber: boolean;
  channelId: number;

  constructor(order: Order) {
    this.excelFormat = order.indirectFileFormat;
    this.excelShortUrl = order.urlType;
    this.barcodeInfo = order.exportBarcodeInfo;
    this.emailAttachment = order.emailAttachShortUrlImageId;
    this.shortUrlAuthCodeGenerationWay = order.shortUrlAuthCodeGenerationWay;
    this.generateSequenceNumber = order.generateSequenceNumber;
    this.channelId = order.orderChannelId;
  }
}
