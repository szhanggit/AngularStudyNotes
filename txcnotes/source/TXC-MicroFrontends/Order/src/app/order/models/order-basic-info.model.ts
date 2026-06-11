import { ActivationTypeEnum } from 'src/app/shared/enums/activation-type.enum';
import { Order } from './order.model';

export class OrderBasicInfoModel {
  orderName: string;
  publishDate: string | null;
  hasNoTargetPublishDate = false;
  activationType: number;
  activationDate: string | null;
  afterPublished: number;

  constructor(order: Order) {
    this.orderName = order.orderName;
    this.publishDate = order.publishDateTime;
    this.activationType = order.orderActivateMode;
    this.afterPublished = order.afterPublished;

    switch (order.orderActivateMode) {
      case ActivationTypeEnum.SameAsPublishDate: {
        this.activationDate = order.publishDateTime;
        break;
      }
      case ActivationTypeEnum.Inactive: {
        this.activationDate = null;
        break;
      }
      // NDays and FixedDate
      default: {
        this.activationDate = order.fixedDate;
        break;
      }
    }

    if (!order.publishDateTime) {
      this.hasNoTargetPublishDate = true;
      this.activationDate = null;
    }
  }
}
