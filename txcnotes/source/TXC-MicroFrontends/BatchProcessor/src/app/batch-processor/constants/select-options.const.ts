import { Select2Data } from 'ng-select2-component';
import { StatusEnum } from '../enums/status.enum';
import { SourceEnum } from '../enums/source.enum';
import { SearchByEnum } from '../enums/search-by.enum';

// TODO: mock values only - to update actual values on API integration
export const BATCH_STATUS_OPTIONS: Select2Data = [
  { value: StatusEnum.All, label: 'All' },
  {
    value: StatusEnum.Initializing,
    label: 'Initializing',
  },
  {
    value: StatusEnum.Queuing,
    label: 'Queuing',
  },
  {
    value: StatusEnum.Processing,
    label: 'Processing',
  },
  {
    value: StatusEnum.Completed,
    label: 'Completed',
  },
  {
    value: StatusEnum.InitialzingError,
    label: 'Initializing error',
  },
  {
    value: StatusEnum.Failed,
    label: 'Failed',
  },
];

export const BATCH_STATUS_ITEM_VIEW_OPTIONS: Select2Data = [
  { value: StatusEnum.All, label: 'All' },
  {
    value: StatusEnum.Queuing,
    label: 'Queuing',
  },
  {
    value: StatusEnum.Processing,
    label: 'Processing',
  },
  {
    value: StatusEnum.Completed,
    label: 'Completed',
  },
  {
    value: StatusEnum.Failed,
    label: 'Failed',
  },
  {
    value: StatusEnum.Canceled,
    label: 'Canceled',
  },
];

export const SOURCE_OPTIONS: Select2Data = [
  {
    value: SourceEnum.All,
    label: 'All',
  },
  {
    value: SourceEnum.Automatic,
    label: 'Automatic',
  },
  {
    value: SourceEnum.Manual,
    label: 'Manual',
  },
];

// TODO: use existing endpoint for list on API integration
export const SOURCE_OPTIONS_TW: Select2Data = [
  {
    value: SourceEnum.All,
    label: 'All',
  },
  {
    value: 'Merchant Test 1',
    label: 'Merchant Test 1',
  },
  {
    value: 'Merchant Test 2',
    label: 'Merchant Test 2',
  },
];

// TODO: use existing endpoint for list on API integration
export const CLIENT_OPTIONS: Select2Data = [
  {
    value: 'All',
    label: 'All',
  },
  {
    value: 'Client A',
    label: 'Client A',
  },
  {
    value: 'Client B',
    label: 'Client B',
  },
  {
    value: 'Client C',
    label: 'Client C',
  }
];

// Mock options only - these values will come from backend
export const ERROR_REASON_OPTIONS: Select2Data = [
  { value: 'All', label: 'All' },
  {
    value: 'Invalid data',
    label: 'Invalid data',
  },
  {
    value: 'System error',
    label: 'System error',
  },
  {
    value: 'Duplicate filename',
    label: 'Duplicate filename',
  },
];

export const SEARCH_BY_OPTIONS: Select2Data = [
  { 
    value: SearchByEnum.SkuCode, 
    label: 'SKU code' 
  },
  {
    value: SearchByEnum.BatchNumber,
    label: 'Batch number',
  },
  {
    value: SearchByEnum.QuotationNumber,
    label: 'Quotation number',
  },
  {
    value: SearchByEnum.ProductName,
    label: 'Product name',
  },
  {
    value: SearchByEnum.ProjectName,
    label: 'Project name',
  },
  {
    value: SearchByEnum.ClientOrderNumber,
    label: 'Client order number',
  },
];

export const ERROR_REASON_OPTIONS_ORDER_LIST: Select2Data = [
  { value: 'All', label: 'All' },
  { value: 'Invalid data', label: 'Invalid data' },
  { value: 'System error', label: 'System error' },
  { value: 'Insufficient stocks', label: 'Insufficient stocks' },
  { value: 'Issuance disabled', label: 'Issuance disabled' },
];

export const ERROR_REASON_OPTIONS_ITEM_VIEW: Select2Data = [
  { value: 'All', label: 'All' },
  { value: 'Insufficient stock', label: 'Insufficient stock' },
  { value: 'Issuance disabled', label: 'Issuance disabled' },
  { value: 'Internal request', label: 'Internal request' },
  { value: 'Client request', label: 'Client request' },
  { value: 'Operation issue', label: 'Operation issue' },
];
