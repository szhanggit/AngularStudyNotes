export interface SelectedOrderMode {
  key: number;
  value: string;
}

export interface Quotation {
  businessModelName: string;
  clientId: number;
  clientName: string;
  creator: string;
  id: number;
  productQuantity: 1;
  projectName: string;
  quotationNumber: string;
  quotationType: number;
  validFrom: string;
  validTo: string;
  advanceBilling: boolean;
}

export interface QuotationPaginated {
  quotationItemList: Quotation[];
  currentPage: number;
  itemPerPage: number;
  totalCount: number;
}

export interface QuotationState {
  selectedOrderMode: SelectedOrderMode;
  selectedQuotation: Quotation;
  quotationPaginated: QuotationPaginated;
}

export interface QuotationPaginationParams {
  keyword?: string;
  status?: number;
  clientCode?: string;
  validOn?: string;
  pageSize?: number;
  pageIndex?: number;
  orderBy?: string;
}

export const INITIAL_SELECTED_ORDER_TYPE_STATE: SelectedOrderMode = {
  key: 0,
  value: '',
};

export const INITIAL_SELECTED_QUOTATION_STATE: Quotation = {
  businessModelName: '',
  clientId: 0,
  clientName: '',
  creator: '',
  id: 0,
  productQuantity: 1,
  projectName: '',
  quotationNumber: '',
  quotationType: 0,
  validFrom: '',
  validTo: '',
  advanceBilling: false
};

export const INITIAL_QUOTATION_PAGINATED_STATE: QuotationPaginated = {
  quotationItemList: [],
  currentPage: 0,
  itemPerPage: 0,
  totalCount: 0,
};

export const INITIAL_QUOTATION_STATE: QuotationState = {
  selectedOrderMode: INITIAL_SELECTED_ORDER_TYPE_STATE,
  selectedQuotation: INITIAL_SELECTED_QUOTATION_STATE,
  quotationPaginated: INITIAL_QUOTATION_PAGINATED_STATE,
};
