import { TableHeader } from '@txc-angular/component-library';
import { TableActionEnum } from '../enums/table-action.enum';
import { SearchFilters } from '../models/search-filters.model';
import { SearchByEnum } from '../enums/search-by.enum';

export const BATCH_LIST_HEADERS: TableHeader[] = [
  {
    headerName: 'Batch Number',
    headerId: 'batchNumber',
    clickable: true,
  },
  {
    headerName: 'File Name',
    headerId: 'fileName',
  },
  {
    headerName: 'Status',
    headerId: 'status',
    status: true,
    style: 'min-width: 140px;'
  },
  {
    headerName: 'Error Reason',
    headerId: 'errorSummary',
    spanStyle: 'white-space: pre-line',
    style: 'min-width: 160px;'
  },
  {
    headerName: 'Created On',
    headerId: 'createdOn',
    tooltip: true,
  },
  {
    headerName: 'Total Number',
    headerId: 'totalNumber',
  },
  {
    headerName: 'Success Number',
    headerId: 'successNumber',
  },
  {
    headerName: 'Fail Number',
    headerId: 'failNumber',
  },
  {
    headerName: 'Source',
    headerId: 'source',
  },
  {
    headerName: 'Operator',
    headerId: 'operator',
  },
  {
    headerName: 'Action',
    headerId: 'action',
    actionConfig: [
      {
        id: TableActionEnum.Download,
        buttonType: 'icon',
        iconName: 'uil-down-arrow',
        eventName: 'download',
        tooltipLabel: 'Download',
      },
      {
        id: TableActionEnum.Cancel,
        buttonType: 'icon',
        iconName: 'uil-multiply',
        eventName: 'cancel',
        tooltipLabel: 'Cancel',
      },
    ],
    tooltip: true,
  },
];

export const BATCH_ITEM_VIEW_LIST_HEADERS: TableHeader[] = [
  {
    headerName: 'Batch Number',
    headerId: 'batchNumber',
    clickable: true,
  },
  {
    headerName: 'Status',
    headerId: 'status',
    status: true,
    style: 'min-width: 140px;'
  },
  {
    headerName: 'Reason',
    headerId: 'errorSummary',
    spanStyle: 'white-space: pre-line',
    style: 'min-width: 160px;'
  },
  {
    headerName: 'Created On',
    headerId: 'createdOn',
    tooltip: true,
  },
  {
    headerName: 'Client / Client Order No.',
    headerId: 'clientOrderNumber',
  },
  {
    headerName: 'Quotation Number',
    headerId: 'quotationNumber',
  },
  {
    headerName: 'Project Name',
    headerId: 'projectName',
  },
  {
    headerName: 'SKU Code',
    headerId: 'skuCode',
  },
  {
    headerName: 'Product Code / Product Name',
    headerId: 'productCode',
    fieldConfig: ['productCode', 'productName'],
  },
  {
    headerName: 'Beneficiaries',
    headerId: 'beneficiariesEmail',
    fieldConfig: ['beneficiariesEmail', 'beneficiariesContact'],
  },
  {
    headerName: 'Qty',
    headerId: 'quantity',
  },
  {
    headerName: 'Action',
    headerId: 'action',
    actionConfig: [
      {
        id: TableActionEnum.Pause,
        buttonType: 'icon',
        iconName: 'mdi mdi-pause',
        eventName: 'pause',
        tooltipLabel: 'Pause',
      },
      {
        id: TableActionEnum.Resume,
        buttonType: 'icon',
        iconName: 'mdi mdi-play',
        eventName: 'Resume',
        tooltipLabel: 'Resume',
      },
      {
        id: TableActionEnum.Cancel,
        buttonType: 'icon',
        iconName: 'uil-multiply',
        eventName: 'cancel',
        tooltipLabel: 'Cancel',
      },
    ],
    tooltip: true,
  },
];

export const EMPTY_COMMON_FILTER: SearchFilters = {
  searchBy: null,
  searchInput: '',
  createdOn: { startDate: '', endDate: '' },
  batchStatus: '',
  errorReason: 'All',
  source: '',
  client: null,
};

export const EMPTY_ITEM_VIEW_FILTER: SearchFilters = {
  searchBy: SearchByEnum.SkuCode,
  searchInput: '',
  createdOn: { startDate: '', endDate: '' },
  batchStatus: '',
  errorReason: 'All',
  source: '',
  client: 'All',
};

export const PAGE_SIZES = [
  {
    value: 20,
    label: '20',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 100,
    label: '100',
  },
];

export const NO_RESULTS_MESSAGE =
  'No results found. Please try a different keyword or filters.';
