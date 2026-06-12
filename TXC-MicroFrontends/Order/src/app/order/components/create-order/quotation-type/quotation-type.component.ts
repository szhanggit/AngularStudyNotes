import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ORDER_CONSTANTS } from 'src/app/order/constants/quotation-constants';
import { OrderMode } from 'src/app/order/models/quotation-type.model';

@Component({
  selector: 'app-quotation-type',
  templateUrl: './quotation-type.component.html',
  styleUrls: ['./quotation-type.component.scss'],
})
export class QuotationTypeComponent implements OnInit {
  @Input() selectedMode!: OrderMode;
  @Output() orderSelectedEvent = new EventEmitter<OrderMode>();
  orderTypes: OrderMode[] = ORDER_CONSTANTS.ORDER_MODE;
  selectOrderModes: OrderMode[] =
    ORDER_CONSTANTS.SELECT_ORDER_MODE;

  constructor() {}

  ngOnInit(): void {
  }

  selectType(orderMode: OrderMode) {
    if (orderMode.key === this.selectedMode.key) {
      return;
    }
    this.selectedMode = orderMode;

    this.orderSelectedEvent.emit(orderMode);
  }
}
