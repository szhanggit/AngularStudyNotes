import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherOperationsListComponent } from './voucher-operations-list.component';
import { BatchListStateService } from '../../services/state/batch-list-state.service';
import { UtilityService } from '../../services/utility.service';
import { BehaviorSubject, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AttachmentService } from '@txc-angular/component-library';
import { UploadBatchOperationsModalComponent } from './upload-batch-operations-modal/upload-batch-operations-modal.component';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('VoucherOperationsListComponent', () => {
  let component: VoucherOperationsListComponent;
  let fixture: ComponentFixture<VoucherOperationsListComponent>;
  const queryParamsSubject = new BehaviorSubject({ batchNumber: '2' });
  const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'delete']);
  const batchListStateServiceSpy = jasmine.createSpyObj(
    'BatchListStateService',
    ['getVoucherOperationsList', 'setPaginatedBatchList', 'setSelectedItem'],
    {
      paginatedBatchList$: of(),
    }
  );
  const utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
    'transformedSourceValue',
    'listenToUploadSuccess',
    'filterCommonBatchTable',
    'listenToErrorMessage',
    'unsubscribeToastSubscriptions',
  ]);
  const attachmentServiceSpy = jasmine.createSpyObj('AttachmentService', [
    'downloadSample',
  ]);

  const activatedRouteStub = {
    queryParams: queryParamsSubject.asObservable(),
  };

  const modalRef = jasmine.createSpyObj('NgbModalRef', ['result']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoucherOperationsListComponent],
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
        { provide: HttpClient, useValue: httpSpy },
        { provide: AttachmentService, useValue: attachmentServiceSpy },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VoucherOperationsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call listenToUploadSuccess on ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(utilityServiceSpy.listenToUploadSuccess).toHaveBeenCalled();
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

  it('should set selectedView on handleSelectedViewChange', () => {
    component.selectedView = '';
    component.handleSelectedViewChange('Failed');
    expect(component.selectedView).toEqual('Failed');
  });

  it('should open modal window and handle confirm result', async () => {
    modalServiceSpy.open.and.returnValue(modalRef);
    modalRef.result = Promise.resolve('confirm');
    component.actionButtons[0].buttonAction();
    expect(modalServiceSpy.open).toHaveBeenCalledWith(
      UploadBatchOperationsModalComponent,
      {
        size: 'md',
        backdrop: 'static',
        centered: true,
      }
    );
    await fixture.whenStable();
  });
});
