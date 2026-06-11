import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Select2Option } from 'ng-select2-component';
import { Order } from '../../models/order.model';
import { ORDER_CONSTANTS } from '../../constants/order-constants';
import { DateOutputValues } from '../../models/date-output-values.model';
import { DatePickerType } from '../../enums/date-picker-type.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ExportOrder } from '../../models/export-order.model';
import { Subject, takeUntil } from 'rxjs';
import { OrderModeEnum } from '../../enums/order-mode.enum';

@Component({
  selector: 'app-export-delivery',
  templateUrl: './export-delivery.component.html',
  styleUrls: ['./export-delivery.component.scss'],
})
export class ExportDeliveryComponent implements OnInit, OnDestroy {
  exportForm!: FormGroup;
  isDatePickerDisabled!: boolean;
  order!: Order;
  tab!: number;
  eventType: number = 0;
  orderMode = OrderModeEnum.IndirectNonAPI;
  orderModes = OrderModeEnum;
  deliveryTypes: Array<Select2Option> = ORDER_CONSTANTS.DELIVERY_TYPES;
  rangeDatePicker = DatePickerType.RANGE;
  destroyed$ = new Subject<boolean>();

  get deliveryType() {
    return this.exportForm.get('deliveryType');
  }

  get dateFrom() {
    return this.exportForm.get('dateFrom');
  }

  get dateTo() {
    return this.exportForm.get('dateTo');
  }

  get isAllDate() {
    return this.exportForm.get('isAllDate');
  }

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private orderSvc: OrderService
  ) {}

  ngOnInit(): void {
    this.initializeExportForm();
    this.initializeExportModalContent();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  initializeExportModalContent() {
    this.toggleDatePickerControl(true);
    if (this.tab === 1) {
      this.isAllDate?.setValue(null);
    } else {
      this.isAllDate?.setValue(true);
    }
  }

  initializeExportForm() {
    const eventType = this.eventType === 0 ? '' : this.eventType;
    this.exportForm = this.fb.group({
      deliveryType: [eventType, Validators.required],
      dateFrom: [''],
      dateTo: [''],
      isAllDate: [true],
    });
  }

  onCancelClicked() {
    this.modalService.dismissAll();
  }

  onExportClicked() {
    this.orderSvc
      .exportOrder(this.getOrderToExport())
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        const aTag = document.createElement('a');
        aTag.target = '_blank';
        aTag.rel = 'noopener noreferrer';
        aTag.href = (window as any).URL.createObjectURL(res);
        aTag.download = `${this.getDeliveryType()}_${
          this.order.orderNumber
        }.xlsx`;
        aTag.click();
        this.modalService.dismissAll();
      });
  }

  getDeliveryType() {
    return this.deliveryTypes.find(
      (type) => type.value === this.deliveryType?.value
    )?.label;
  }

  getOrderToExport() {
    const exportOrder: ExportOrder = this.exportForm.getRawValue();
    exportOrder.id = this.order.id;
    exportOrder.isApiOrder = this.tab !== 1;

    return exportOrder;
  }

  datePickerValues(value: DateOutputValues) {
    if (value) {
      this.dateTo?.setValue(value.toDate);
      this.dateFrom?.setValue(value.fromDate);
    } else {
      this.dateTo?.setValue(null);
      this.dateFrom?.setValue(null);
    }
  }

  toggleAllAvailableDates(event: any) {
    this.isDatePickerDisabled = event.target.checked;
    this.orderSvc.isClearDatePicker = this.isDatePickerDisabled;

    this.toggleDatePickerControl(this.isDatePickerDisabled);
  }

  toggleDatePickerControl(isRemoved: boolean) {
    if (isRemoved) {
      this.dateTo?.setValue(null);
      this.dateFrom?.setValue(null);
      this.dateTo?.clearValidators();
      this.dateFrom?.clearValidators();
    } else {
      this.dateTo?.setValidators([Validators.required]);
      this.dateFrom?.setValidators([Validators.required]);
    }

    this.isDatePickerDisabled = isRemoved;

    this.dateTo?.updateValueAndValidity();
    this.dateFrom?.updateValueAndValidity();
  }
}
