import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { StatusEnum } from '../../enums/status.enum';
import { SourceEnum } from '../../enums/source.enum';
import { SearchFilters } from '../../models/search-filters.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AttachmentService, SelectModel } from '@txc-angular/component-library';
import { CommonTableFilterFieldsDefinition } from '../../models/field-definition/common-table-filter-fields-definition.model';
import { DatepickerModel } from '../../models/dumb-models/datepicker.model';
import { DatePipe } from '@angular/common';
import { UtilityService } from '../../services/utility.service';
import { BatchDomainsEnum } from '../../enums/batch-domains.enum';
import { SearchByEnum } from '../../enums/search-by.enum';
import { SEARCH_BY_OPTIONS } from '../../constants/select-options.const';
import { BatchListStateService } from '../../services/state/batch-list-state.service';
import { environment } from 'src/environments/environment';
import { INITIAL_SEARCH_RESULT_DETAILS } from '../../models/batch-list-state.model';

@Component({
  selector: 'app-common-table-filter',
  templateUrl: './common-table-filter.component.html',
  styleUrls: ['./common-table-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonTableFilterComponent implements OnInit {
  @Input() batchDomain!: BatchDomainsEnum;
  // search props
  @Input() searchPlaceholder: string = 'Enter batch number or file name';
  @Input() searchTerm: string = '';
  @Output() searchTermChange = new EventEmitter<string>();

  selectedBatchStatus = StatusEnum.All;

  selectedErrorReason!: number;
  errorReasonPlaceholder = 'Select error reason';
  searchResults: number = 0;

  fieldsDefinition!: CommonTableFilterFieldsDefinition;

  errorReasonEnableStatus: StatusEnum[] = [
    StatusEnum.InitialzingError,
    StatusEnum.Failed,
    StatusEnum.All,
  ];

  exactSearch: SearchByEnum[] = [
    SearchByEnum.SkuCode, 
    SearchByEnum.BatchNumber, 
    SearchByEnum.QuotationNumber, 
    SearchByEnum.ClientOrderNumber
  ];

  get customClass() {
    return this.batchDomain === BatchDomainsEnum.OrderItemView ? 'right-border' : '';
  }

  get selectInputModel() {
    return this.fieldsDefinition.define().slice(2) as SelectModel[];
  }

  get searchByInputModel() {
    return this.fieldsDefinition.define()[1] as SelectModel;
  }

  get datepickerInputModel() {
    return this.fieldsDefinition.define()[0] as DatepickerModel;
  }

  get createdOn() {
    return this.filtersFormGroup.get('createdOn') as FormControl;
  }

  get selectedTenant() {
    return this.utilityService.selectedTenant;
  }

  get batchStatus() {
    return this.filtersFormGroup.get('batchStatus') as FormControl;
  }

  get errorReason() {
    return this.filtersFormGroup.get('errorReason') as FormControl;
  }

  get searchBy() {
    return this.filtersFormGroup.get('searchBy') as FormControl;
  }

  get batchDomainEnum(){
    return BatchDomainsEnum;
  }

  @Output() filtersEvent = new EventEmitter<SearchFilters>();
  filtersFormGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private utilityService: UtilityService,
    private batchListStateService: BatchListStateService,
    private attachmentService: AttachmentService,
  ) {}

  ngOnInit(): void {

    this.initializeFiltersForm();
    this.listenToBatchStatusChange();
    this.initializeFieldsDefinition();
    this.initializeBatchOrderItemViewFilters();
  }

  initializeBatchOrderItemViewFilters() {
    if (this.batchDomain === BatchDomainsEnum.OrderItemView) {
      this.listenToSearchByChange();
      this.setSearchPlaceholder(this.searchBy.value);
      this.batchListStateService.setSearchResultDetails(
        INITIAL_SEARCH_RESULT_DETAILS.total
        );
      this.batchListStateService.searchResults$.subscribe((res) => {
        this.searchResults = res?.total ?? 0;
      });
    }
  }

  initializeFieldsDefinition() {
    this.fieldsDefinition = new CommonTableFilterFieldsDefinition(
      this.selectedTenant,
      this.batchDomain ?? null
    );
  }

  initializeFiltersForm() {
    this.filtersFormGroup = this.formBuilder.group({
      searchBy: this.batchDomain === BatchDomainsEnum.OrderItemView ? 
        SearchByEnum.SkuCode : null,
      searchInput: '',
      createdOn: '',
      batchStatus: StatusEnum.All,
      errorReason: 'All',
      source: SourceEnum.All,
      client: this.batchDomain === BatchDomainsEnum.OrderItemView ? 
        'All' : null,
    });
  }

  listenToBatchStatusChange() {
    this.batchStatus.valueChanges.subscribe((value) => {
      if (this.errorReasonEnableStatus.includes(value)) {
        this.errorReason.enable();
        return;
      }
      this.errorReason.setValue('All');
      this.errorReason.disable();
    });
  }

  listenToSearchByChange() {
    this.searchBy.valueChanges.subscribe((value) => { 
      this.setSearchPlaceholder(value);
    });
  }

  onSearchBatch() {
    this.filtersEvent.emit(this.constructFilters());
  }

  onExport(event: Event){
    // TODO: change to actual file on API integration
    const href = environment.local
      ? '/assets/templates/import-voucher-template.xlsx'
      : '/move/assets/templates/import-voucher-template.xlsx';
    this.attachmentService.downloadSample(event, href);
  }

  setSearchPlaceholder(value: SearchByEnum) {
    const label = SEARCH_BY_OPTIONS.find(item => 'value' in item && item.value === value)!.label;
    if (this.exactSearch.includes(value)) {
      this.searchPlaceholder = `Enter exact ${label.toLocaleLowerCase()} to search`;
      return;
    }
    this.searchPlaceholder = `Enter any text to search`;
  }

  constructFilters() {
    const createdOnDateRange = this.createdOn.value;
    const filters = this.filtersFormGroup.value;
    if (createdOnDateRange) {
      const { fromDate, toDate } = createdOnDateRange;
      filters.createdOn = {
        startDate: this.datePipe.transform(fromDate, 'yyyy/MM/dd'),
        endDate: this.datePipe.transform(toDate, 'yyyy/MM/dd'),
      };
    }
    return filters;
  }

  resetSearch() {
    this.searchTerm = '';
  }
}
