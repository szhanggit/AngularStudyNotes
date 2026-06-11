import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BatchItemViewComponent } from './batch-item-view.component';
import { BatchListStateService } from 'src/app/batch-processor/services/state/batch-list-state.service';
import { UtilityService } from 'src/app/batch-processor/services/utility.service';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('BatchItemViewComponent', () => {
  let component: BatchItemViewComponent;
  let fixture: ComponentFixture<BatchItemViewComponent>;
  const eventStateServiceSpy = jasmine.createSpyObj(['batchListLoading']);
  const mockBatchListData = [
    {
      batchNumber: 2023112900002,
      status: 'Completed',
      errorReason: null,
      createdOn: '2023-07-22 15:44:01',
      startTime: '2023-04-29T07:21:23Z',
      endTime: '2023-10-23T03:28:42Z',
      clientOrderNo: 'HSBC 20230722034521',
      quotationNumber: 123456789,
      projectName: 'sample project',
      skuCode: 'AMZ100',
      productCodeName: 'AMZ1SGC8MM Amazon RS100',
      beneficiaries: 'gezelle.balceda@edenred.com 0912345678',
      qty: 12345,
      action: 'Download',
    },
  ];
  const batchListStateServiceSpy = jasmine.createSpyObj(
    'BatchListStateService',
    ['getBatchItemViewList', 'setPaginatedBatchList', 'setSelectedItem', 'setSearchResultDetails'],
    {
      paginatedBatchList$: of({
        data: mockBatchListData,
        pagination: {
          page: 1,
          pageSize: 20,
          currentPage: 1,
          previousPage: 0,
          nextPage: 2,
          total: 10,
        },
      }),
    }
  );

  const utilityServiceSpy = jasmine.createSpyObj(
    'UtilityService',
    ['transformedSourceValue', 'filterCommonBatchTable'],
    {}
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchItemViewComponent],
      providers: [
        {
          provide: BatchListStateService,
          useValue: batchListStateServiceSpy,
        },
        {
          provide: UtilityService,
          useValue: utilityServiceSpy,
        },
        { provide: EventStateService, useValue: eventStateServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter data and update tableData and total on search', fakeAsync(() => {
    const searchEvent = {
      filters: {},
      data: [],
    };
    const filteredData: any[] = [];
    utilityServiceSpy.filterCommonBatchTable.and.returnValue(filteredData);

    component.onSearchBatch(searchEvent);

    tick(2000);

    expect(component.tableData).toEqual(filteredData);
    expect(component.total).toEqual(filteredData.length);
  }));
});
