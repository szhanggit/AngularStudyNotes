import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseBatchListComponent } from './base-batch-list.component';
import { BatchListStateService } from '../../services/state/batch-list-state.service';
import { of } from 'rxjs';
import { EventStateService } from '../../services/event-state.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActionEvent } from '@txc-angular/component-library';
import { TableActionEnum } from '../../enums/table-action.enum';

describe('BaseBatchListComponent', () => {
  let component: BaseBatchListComponent;
  let fixture: ComponentFixture<BaseBatchListComponent>;
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
    ['getInventoryList', 'setPaginatedBatchList', 'setSelectedItem'],
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseBatchListComponent],
      providers: [
        {
          provide: BatchListStateService,
          useValue: batchListStateServiceSpy,
        },
        EventStateService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseBatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  describe('onActionEvent', () => {
    it('should set selectedView as an empty string by default', () => {
      const mockEvent = {
        rowData: {
          status: 'Initializing',
        },
      } as ActionEvent;

      component.onActionEvent(mockEvent);
      component.selectedViewChange.subscribe((value) => {
        expect(value).toEqual('');
      });
    });

    it('should set selectedView as "Failed" when eventName is SelectBatch and status is Failed', () => {
      const mockEvent = {
        eventName: TableActionEnum.SelectBatch,
        rowData: {
          status: 'Failed',
        },
      } as ActionEvent;
      component.onActionEvent(mockEvent);
      component.selectedViewChange.subscribe((value) => {
        expect(value).toEqual('Failed');
      });
    });
    
    it('should set selectedView as an empty string when event has no rowData', () => {
      const mockEvent = {
        eventName: TableActionEnum.SelectBatch,
      } as ActionEvent;
      component.onActionEvent(mockEvent);
      component.selectedViewChange.subscribe((value) => {
        expect(value).toEqual('');
      });
    });
  });
});
