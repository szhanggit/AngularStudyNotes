import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ORDER_CONSTANTS } from 'src/app/order/constants/quotation-constants';
import { Quotation } from 'src/app/order/interface/quotation-state.interface';
import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';

@Component({
  selector: 'app-select-order-type',
  templateUrl: './select-order-type.component.html',
  styleUrls: ['./select-order-type.component.scss'],
})
export class SelectOrderTypeComponent implements OnInit {
  selectedQuotation!: Quotation;
  selectedMode!: OrderMode;
  selectOrderModes: OrderMode[] =
    ORDER_CONSTANTS.SELECT_ORDER_MODE;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private quotationStateService: QuotationStateService
  ) {}

  ngOnInit(): void {
    this.quotationStateService.setSelectedQuotationState(
      this.selectedQuotation
    );
  }

  onModalCancel() {
    this.modalService.dismissAll();
  }

  onModalCreate() {
    this.activeModal.close(this.selectedMode);
  }

  selectMode(orderMode: OrderMode) {
    this.selectedMode = orderMode;
    if (orderMode.key === this.selectedMode.key) {
      return;
    }
  }
}
