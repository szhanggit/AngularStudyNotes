import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { InventoryListComponent } from './inventory-list.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImportVoucherNumberModalComponent } from './import-voucher-number-modal/import-voucher-number-modal.component';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { BatchListStateService } from '../../services/state/batch-list-state.service';
import { UtilityService } from '../../services/utility.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbdToastGlobal } from '@txc-angular/component-library';

describe('InventoryListComponent', () => {
  let component: InventoryListComponent;
  let fixture: ComponentFixture<InventoryListComponent>;
  let modalServiceSpy: jasmine.SpyObj<NgbModal>;
  let modalRef: jasmine.SpyObj<NgbModalRef>;
  const queryParamsSubject = new BehaviorSubject({ batchNumber: '2' });
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

  const utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
    'transformedSourceValue',
    'filterCommonBatchTable',
    'listenToUploadSuccess',
    'listenToErrorMessage',
    'unsubscribeToastSubscriptions',
  ]);

  const activatedRouteStub = {
    queryParams: queryParamsSubject.asObservable(),
  };

  beforeEach(async () => {
    modalRef = jasmine.createSpyObj('NgbModalRef', ['result']);
    modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
    modalServiceSpy.open.and.returnValue(modalRef);

    await TestBed.configureTestingModule({
      declarations: [InventoryListComponent, NgbdToastGlobal],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: NgbModal, useValue: modalServiceSpy },
        {
          provide: BatchListStateService,
          useValue: batchListStateServiceSpy,
        },
        {
          provide: UtilityService,
          useValue: utilityServiceSpy,
        },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryListComponent);
    component = fixture.componentInstance;
    utilityServiceSpy.transformedSourceValue.and.returnValue(mockBatchListData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedView to empty string on NavigationEnd', () => {
    const navigationEndEvent = new NavigationEnd(
      1,
      'http://localhost:4200/',
      'http://localhost:4200/'
    );
    const router = TestBed.inject(Router);
    spyOn(router.events, 'pipe').and.returnValue(of(navigationEndEvent));
    component.ngOnInit();
    expect(component.selectedView).toEqual('');
  });

  it('should open modal window and handle confirm result', async () => {
    modalRef.result = Promise.resolve('confirm');
    component.actionButtons[0].buttonAction();
    expect(modalServiceSpy.open).toHaveBeenCalledWith(
      ImportVoucherNumberModalComponent,
      {
        size: 'md',
        backdrop: 'static',
        centered: true,
      }
    );
    await fixture.whenStable();
  });

  it('should set selectedView on handleSelectedViewChange', () => {
    component.selectedView = '';
    component.handleSelectedViewChange('Failed');
    expect(component.selectedView).toEqual('Failed');
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
