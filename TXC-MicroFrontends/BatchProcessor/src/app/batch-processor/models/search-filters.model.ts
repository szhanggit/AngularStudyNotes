import { SearchByEnum } from '../enums/search-by.enum';
import { BatchListItem } from './batch-list-state.model';

export interface SearchFilters {
  searchInput?: string;
  searchBy?: SearchByEnum | null;
  batchStatus?: string;
  errorReason?: any;
  source?: string;
  client?: string | null;
  createdOn?: DateRange;
  inProgress?: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface SearchEvent {
  filters: SearchFilters;
  data: BatchListItem[];
}
