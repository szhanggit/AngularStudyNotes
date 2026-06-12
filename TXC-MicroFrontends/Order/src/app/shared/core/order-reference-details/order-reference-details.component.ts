import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { Quotation } from 'src/app/order/interface/quotation-state.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-order-reference-details',
  templateUrl: './order-reference-details.component.html',
  styleUrls: ['./order-reference-details.component.scss'],
})
export class OrderReferenceDetailsComponent implements OnInit, OnDestroy {
  @Input() viewMode: boolean = false;
  selectedQuotation!: Quotation;
  destroyed$: Subject<void> = new Subject<void>();
  constructor(private quotationStateService: QuotationStateService) {}

  ngOnInit() {
    this.quotationStateService.selectedQuotation$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        this.selectedQuotation = value;
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
