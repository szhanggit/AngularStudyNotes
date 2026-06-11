import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { OrderStatusEnum } from 'src/app/order/enums/order-status.enum';
import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { TotalQuantities } from 'src/app/shared/models/total-quantities.model';

@Component({
  selector: 'app-product-list-summary',
  templateUrl: './product-list-summary.component.html',
  styleUrls: ['./product-list-summary.component.scss'],
})
export class ProductListSummaryComponent implements OnInit, OnDestroy {
  @Input() totalQuantities: TotalQuantities = new TotalQuantities();
  @Input() estimatedTotal: number = 0;
  @Input() orderStatus!: OrderStatusEnum;

  get orderStatusEnum() {
    return OrderStatusEnum;
  }

  get showEmailSmsQuantity() {
    return this.withEmailSmsQuantity.includes(this.selectedOrderMode.key);
  }

  orderModes = OrderModeEnum;
  selectedOrderMode!: OrderMode;
  withEmailSmsQuantity = [
    OrderModeEnum.DirectNonAPI
  ];
  destroyed$ = new Subject<void>();

  constructor(private quotationStateService: QuotationStateService) {}

  ngOnInit(): void {
    this.quotationStateService.selectedOrderMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((orderMode) => (this.selectedOrderMode = orderMode));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
