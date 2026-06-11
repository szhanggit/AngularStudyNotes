import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BatchListStateService } from './batch-list-state.service';
import { BatchListService } from '../data/batch-list.service';
import { BatchListItem, PaginatedBatchList } from '../../models/batch-list-state.model';
import { of } from 'rxjs';

describe('BatchListStateService', () => {
  let service: BatchListStateService;
  const mockItem = {
    batchNumber: 1,
    fileName: '',
    status: '',
    createdOn: '2023-05-11 02:46:12',
    startTime: '2023-06-02T18:23:07Z',
    endTime: '2023-01-24T10:41:39Z',
    failNumber: 404,
    successNumber: 2780,
    totalNumber: 3184,
    source: 'Automatic',
    operator: 'Phip',
    action: ['Cancel'],
  } as BatchListItem;
  
  const mockBatchListData = [
    mockItem
  ];
  
  const mockPaginatedBatchList = {
    data: mockBatchListData,
    pagination: {
      page: 1,
      pageSize: 20,
      currentPage: 1,
      previousPage: 0,
      nextPage: 2,
      total: 10,
    },
  } as PaginatedBatchList;
  
  
  const batchListServiceSpy = jasmine.createSpyObj('BatchListService', [
    'getInventoryList', 'getVoucherOperationsList', 'getBatchViewList', 'getBatchItemViewList',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: BatchListService, useValue: batchListServiceSpy }],
    });
    service = TestBed.inject(BatchListStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set paginated batch list', () => {
    service.setPaginatedBatchList(mockPaginatedBatchList);
    service.paginatedBatchList$.subscribe(data => {
      expect(data).toEqual(mockPaginatedBatchList);
    });
  });
  
  it('should get inventory list and update state', fakeAsync(() => {
    batchListServiceSpy.getInventoryList.and.returnValue(of(mockPaginatedBatchList));
    service.getInventoryList();
    tick(3000); // Simulate the timeout
    service.paginatedBatchList$.subscribe(data => {
      expect(batchListServiceSpy.getInventoryList).toHaveBeenCalled();
      expect(data).toEqual(mockPaginatedBatchList);
    });
  }));
  
  it('should get voucher operations list and update state', fakeAsync(() => {
    batchListServiceSpy.getVoucherOperationsList
        .and.returnValue(of(mockPaginatedBatchList));
    service.getVoucherOperationsList();
    tick(3000); // Simulate the timeout
    service.paginatedBatchList$.subscribe(data => {
      expect(batchListServiceSpy.getVoucherOperationsList).toHaveBeenCalled();
      expect(data).toEqual(mockPaginatedBatchList);
    });
  }));

  it('should get batch view list and update state', fakeAsync(() => {
    batchListServiceSpy.getBatchViewList
        .and.returnValue(of(mockPaginatedBatchList));
    service.getBatchViewList();
    tick(3000); // Simulate the timeout
    service.paginatedBatchList$.subscribe(data => {
      expect(batchListServiceSpy.getBatchViewList).toHaveBeenCalled();
      expect(data).toEqual(mockPaginatedBatchList);
    });
  }));

  it('should get batch view item list and update state', fakeAsync(() => {
    batchListServiceSpy.getBatchItemViewList
        .and.returnValue(of(mockPaginatedBatchList));
    service.getBatchItemViewList();
    tick(3000); // Simulate the timeout
    service.paginatedBatchList$.subscribe(data => {
      expect(batchListServiceSpy.getBatchItemViewList).toHaveBeenCalled();
      expect(data).toEqual(mockPaginatedBatchList);
    });
  }));
  
  it('should set selected item', () => {
    service.setSelectedItem(mockItem);
    service.selectedItem$.subscribe(item => {
      expect(item).toEqual(mockItem);
    });
  });
  
});
