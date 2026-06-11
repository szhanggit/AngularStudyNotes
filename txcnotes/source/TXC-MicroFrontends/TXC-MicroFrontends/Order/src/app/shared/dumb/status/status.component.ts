import { Component, Input } from '@angular/core';
import { OrderStatusEnum } from 'src/app/order/enums/order-status.enum';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
  @Input() orderStatus: number = OrderStatusEnum.Created;

  get orderStatusEnum(): typeof OrderStatusEnum {
    return OrderStatusEnum;
  }
}
