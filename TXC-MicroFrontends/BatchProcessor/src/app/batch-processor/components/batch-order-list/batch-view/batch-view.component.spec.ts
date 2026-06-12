import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { BatchViewComponent } from './batch-view.component';
import { of } from 'rxjs';
import { BatchListStateService } from 'src/app/batch-processor/services/state/batch-list-state.service';
import { UtilityService } from 'src/app/batch-processor/services/utility.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventStateService } from 'src/app/batch-processor/services/event-state.service';

describe('BatchViewComponent', () => {
  let component: BatchViewComponent;
  let fixture: ComponentFixture<BatchViewComponent>;
  const eventStateServiceSpy = jasmine.createSpyObj(['batchListLoading']);
  const mockBatchListData = [
    {
      batchNumber: '1',
      fileName: '',
      status: 0,
      createdOn: '2023-05-11 02:46:12',
      startTime: '2023-06-02T18:23:07Z',
      endTime: '2023-01-24T10:41:39Z',
      failNumber: 404,
      successNumber: 2780,
      totalNumber: 3184,
      source: 'Automatic',
      operator: 'Phip',
      action: 'Cancel',
    },
  ];
  const batchListStateServiceSpy = jasmine.createSpyObj(
    'BatchListStateService',
    ['getBatchViewList', 'setPaginatedBatchList', 'setSelectedItem'],
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
      declarations: [BatchViewComponent],
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

    fixture = TestBed.createComponent(BatchViewComponent);
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

  it('should set selectedView on handleSelectedViewChange', () => {
    component.handleSelectedViewChange('Failed');
    component.selectedViewChange.subscribe((value) => {
      expect(value).toEqual('Failed');
    });
  });
});
