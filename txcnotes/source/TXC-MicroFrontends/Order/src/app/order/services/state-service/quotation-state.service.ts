import { Injectable } from '@angular/core';
import { StateService } from './state.service';
import {
  QuotationPaginationParams,
  INITIAL_QUOTATION_PAGINATED_STATE,
  INITIAL_QUOTATION_STATE,
  QuotationState,
  SelectedOrderMode,
  Quotation,
} from '../../interface/quotation-state.interface';
import { QuotationService } from '../quotation.service';

@Injectable({
  providedIn: 'root',
})
export class QuotationStateService extends StateService<QuotationState> {
  selectedOrderMode$ = this.select((state) => state.selectedOrderMode);
  quotationPaginated$ = this.select((state) => state.quotationPaginated);
  selectedQuotation$ = this.select((state) => state.selectedQuotation);

  constructor(private quotationService: QuotationService) {
    super(INITIAL_QUOTATION_STATE);
  }

  setSelectedOrderModeState(selectedOrderMode: SelectedOrderMode) {
    this.setState({ selectedOrderMode: selectedOrderMode });
  }

  setSelectedQuotationState(quotation: Quotation) {
    this.setState({ selectedQuotation: quotation });
  }

  getQuotationPaginated(params?: QuotationPaginationParams) {
    this.quotationService.getQuotations(params).subscribe((res: any) => {
      this.setState({ quotationPaginated: res.data });
    });
  }

  clearQuotationPaginated() {
    this.setState({
      quotationPaginated: INITIAL_QUOTATION_PAGINATED_STATE,
    });
  }
}
