import { Merchant } from './contract-sku-details.model';
import { BaseResponse } from './dumb-models/base-response.model';

export interface BatchListItem {
  batchNumber: number;
  fileName?: string;
  status: string;
  errorReason?: ErrorReason | null;
  errorSummary?: string[];
  startTime: string;
  endTime: string;
  createdOn: string;
  failNumber?: number;
  successNumber?: number;
  totalNumber?: number;
  source?: string;
  operator?: string;
  action?: string[];
  tooltipLabel?: string;
  clientOrderNumber?: string;
  quotationNumber?: number;
  projectName?: string;
  skuCode?: string;
  productCode?: string;
  productName?: string;
  beneficiariesEmail?: string;
  beneficiariesContact?: number;
  quantity?: number;
}

export interface ErrorReason {
  summary: string[];
  details: ErrorDetails[];
}

export interface ErrorDetails {
  errorMessage: string;
  rowNumber: number[];
}

export interface ErrorDto {
  success: boolean;
  message: string;
}

export interface SearchResultDetails {
  total: number;
}

export interface PaginationDetails {
  page: number;
  pageSize: number;
  currentPage: number;
  previousPage: number;
  nextPage: number;
  total: number;
}

export interface PaginatedBatchList {
  data: BatchListItem[];
  errorDTO?: ErrorDto;
  pagination: PaginationDetails;
}

export interface BatchListState {
  paginatedBatchList: PaginatedBatchList;
  selectedItem: BatchListItem;
  searchResultDetails?: SearchResultDetails;
  merchantBySkuCode?: BaseResponse<Merchant>;
}

export const INITIAL_SEARCH_RESULT_DETAILS: SearchResultDetails = {
  total: 0,
};

export const INITIAL_PAGINATED_BATCH_LIST_STATE: PaginatedBatchList = {
  data: [],
  errorDTO: {
    success: false,
    message: '',
  },
  pagination: {
    page: 0,
    pageSize: 0,
    currentPage: 0,
    previousPage: 0,
    nextPage: 0,
    total: 0,
  },
};

export const INITIAL_SELECTED_ITEM_STATE: BatchListItem = {
  batchNumber: 0,
  fileName: '',
  status: '',
  errorReason: null,
  errorSummary: [],
  startTime: '',
  endTime: '',
  createdOn: '',
  failNumber: 0,
  successNumber: 0,
  totalNumber: 0,
  source: '',
  operator: '',
  action: [],
  tooltipLabel: '',
};

export const BATCH_LIST_STATE: BatchListState = {
  paginatedBatchList: INITIAL_PAGINATED_BATCH_LIST_STATE,
  selectedItem: INITIAL_SELECTED_ITEM_STATE,
};
