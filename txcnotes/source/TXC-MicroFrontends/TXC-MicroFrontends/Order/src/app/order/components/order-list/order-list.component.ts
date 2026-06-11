import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NgbDateParserFormatter,
  NgbNav,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Observable, ReplaySubject, map } from 'rxjs';
import { ORDER_CONSTANTS } from '../../constants/order-constants';
import { ExportDeliveryComponent } from '../export-delivery/export-delivery.component';
import { DateOutputValues } from '../../models/date-output-values.model';
import { DatePickerType } from '../../enums/date-picker-type.enum';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { WizardService } from '../../services/wizard.service';
import { OrderOperationsEnum } from '../../enums/order-operations.enum.';
import { OrderStatusEnum } from '../../enums/order-status.enum';
import { ProductTemplateStateService } from '../../services/state-service/product-template-state.service';
import { OrderModeEnum } from '../../enums/order-mode.enum';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  orderStatusData = ORDER_CONSTANTS.ORDER_STATUS_DATA;
  deliveryStatusData = ORDER_CONSTANTS.DELIVERY_STATUS_DATA;
  pageSizes = ORDER_CONSTANTS.PAGE_SIZES;
  rangeDatePicker = DatePickerType.RANGE;

  loading$!: Observable<boolean>;
  orders$!: Observable<Order[]>;
  total$!: Observable<number>;
  isOrderCreator = false;
  canExportDeliveryStatus = false;
  orderStatusEnum = OrderStatusEnum;
  orderModeEnum = OrderModeEnum;

  inputErrorPosition = 'input-error';

  constructor(
    private modalService: NgbModal,
    public formatter: NgbDateParserFormatter,
    public orderSvc: OrderService,
    private authLib: AuthorizationLibraryService,
    private wizardService: WizardService,
    private productTemplateStateService: ProductTemplateStateService
  ) {}

  ngOnInit(): void {
    this.orders$ = this.orderSvc.orders$.pipe(
      map((orders) =>
        orders.sort((a, b) => {
          const dateA = new Date(a.createdDateTime);
          const dateB = new Date(b.createdDateTime);
          return dateB.getTime() - dateA.getTime();
        })
      )
    );
    this.loading$ = this.orderSvc.loading$;
    this.total$ = this.orderSvc.total$;
    this.isOrderCreator = this.authLib.getElementOperationFlag([
      OrderOperationsEnum.CreateOrder,
    ]);
    this.canExportDeliveryStatus = this.authLib.getElementOperationFlag([
      OrderOperationsEnum.ExportDeliveryStatus,
    ]);
    this.wizardService.resetWizardPropertiesState();

    // reset product template state
    this.productTemplateStateService.resetProductTemplateState();
  }

  onNavChange(nav: NgbNav) {
    if (nav.activeId === '1') {
      this.orderSvc.currentTab = 2;
    } else {
      this.orderSvc.currentTab = 1;
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  getOrderStatus(status: number): string {
    const statusObj = this.orderStatusData.find((s) => s.value === status);
    return statusObj ? statusObj?.label : status.toString();
  }

  getCssClassForOrder(status: number): string {
    switch (status) {
      case 1:
        return 'under-review';
      case 4:
        return 'rejected';
      case 8:
        return 'approved';
      case 16:
        return 'approved-ft';
      case 64:
        return 'published';
      case 512:
        return 'failed';
      default:
        return '';
    }
  }

  onExport(order: Order, tab: number): void {
    const modalRef = this.modalService.open(ExportDeliveryComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.tab = tab;
    modalRef.componentInstance.order = order;
  }

  datePickerValues(values: DateOutputValues) {
    if (values) {
      this.orderSvc.createdFrom = values.fromDate!;
      this.orderSvc.createdTo = values.toDate!;
    }
  }

  handleDatePickerValuesDelete() {
    if (
      this.orderSvc.createdFrom !== this.orderSvc.fromDate &&
      this.orderSvc.createdTo !== this.orderSvc.toDate
    ) {
      this.orderSvc.createdFrom = this.orderSvc.fromDate;
      this.orderSvc.createdTo = this.orderSvc.toDate;
    }
  }
}
