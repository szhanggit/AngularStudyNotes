import { MsgEncodingType } from 'src/app/shared/enums/msg-encoding-type.enum';
import { Order } from './order.model';

export class DefaultDeliveryModel {
  emailTemplate: number;
  emailSubject: string;
  emailGreeting: string;
  msgEncoding: number;
  smsGreeting: string;

  constructor(order: Order) {
    this.emailTemplate = order.mwvEmailTemplateId;
    this.emailSubject = order.emailSubject;
    this.emailGreeting = order.emailGreeting;
    this.smsGreeting = order.smsGreeting;
    this.msgEncoding = order.msgEncoding;

    if (this.msgEncoding) return;
    
    this.msgEncoding =
      order.orderLines.map((order) => {
        // default
        if (!order.messageEncoding) {
          return MsgEncodingType.Big5;
        }

        if (order.messageEncoding.toLowerCase() === 'unicode') {
          return MsgEncodingType.Unicode;
        } else {
          return MsgEncodingType.Big5;
        }
      })[0] ?? MsgEncodingType.Big5;
  }
}
