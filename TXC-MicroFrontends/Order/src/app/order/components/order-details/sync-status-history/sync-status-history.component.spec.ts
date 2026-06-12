import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { SyncStatusHistoryComponent } from './sync-status-history.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DeliveryStatusService } from 'src/app/order/services/delivery-status.service';
import { TemplateTypeEnum } from 'src/app/shared/enums/template.enum';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SyncStatusHistoryComponent', () => {
  const deliveryStatusSvcSpy = jasmine.createSpyObj('DeliveryStatusService', [
    'getOrderDistributionStatusHistory',
    'SyncOrderDistributionStatus',
  ]);
  const toastSpy = jasmine.createSpyObj('NgbdToastGlobal', [
    'showSuccess',
    'showDanger',
  ]);
  let component: SyncStatusHistoryComponent;
  let fixture: ComponentFixture<SyncStatusHistoryComponent>;

  const mockDistributionStatusHistory = [
    {
      actionTime: '2023/01/09 09:17 AM',
      actionType: 'SyncEmail',
      actionResult: 'Success',
      operator: 'Miller',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyncStatusHistoryComponent, NgbdToastGlobal],
      imports: [HttpClientTestingModule],
      providers: [
        NgbActiveModal,
        DatePipe,
        {
          provide: DeliveryStatusService,
          useValue: deliveryStatusSvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    deliveryStatusSvcSpy.getOrderDistributionStatusHistory.and.returnValue(
      of(mockDistributionStatusHistory)
    );
    deliveryStatusSvcSpy.SyncOrderDistributionStatus.and.returnValue(
      of({ success: true, message: '', data: {} })
    );

    fixture = TestBed.createComponent(SyncStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // assert
    expect(component).toBeTruthy();
    expect(
      deliveryStatusSvcSpy.getOrderDistributionStatusHistory
    ).toHaveBeenCalledWith(component.orderId, component.templateType);
  });

  // code coverage
  describe('eventType', () => {
    it('should return SMS when template type is sms', () => {
      // arrange
      component.templateType = TemplateTypeEnum.SMS;
      const expectedEventType = 'SMS';

      // act
      const result = component.eventType;

      // assert
      expect(result).toBe(expectedEventType);
    });

    it('should return Email when template type is email', () => {
      // arrange
      component.templateType = TemplateTypeEnum.Email;
      const expectedEventType = 'Email';

      // act
      const result = component.eventType;

      // assert
      expect(result).toBe(expectedEventType);
    });
  });

  describe('fetchSyncStatusHistory()', () => {
    beforeEach(() => {
      // arrange
      component.orderId = 1;
    });
    it('should call getOrderDistributionStatusHistory and return success', fakeAsync(() => {
      // arrange
      const assignDataToTableRows = spyOn(component, 'assignDataToTableRows');

      // act
      component.ngOnInit();
      component.fetchOrderStatusHistory();
      tick();

      // assert
      expect(
        deliveryStatusSvcSpy.getOrderDistributionStatusHistory
      ).toHaveBeenCalled();
      expect(assignDataToTableRows).toHaveBeenCalled();
    }));

    it('should call getOrderDistributionStatusHistory and return error', fakeAsync(() => {
      // arrange
      deliveryStatusSvcSpy.getOrderDistributionStatusHistory.and.returnValue(
        of(throwError('error'))
      );
      // act
      component.fetchOrderStatusHistory();
      tick();
      // assert
      expect(toastSpy.showDanger).toBeDefined();
    }));
  });

  describe('syncStatus()', () => {
    it('call SyncOrderDistributionStatus and return success', fakeAsync(() => {
      // act
      component.syncStatus();
      tick();

      // assert
      expect(
        deliveryStatusSvcSpy.SyncOrderDistributionStatus
      ).toHaveBeenCalled();
    }));

    it('call SyncOrderDistributionStatus and return failed', fakeAsync(() => {
      // arrange
      deliveryStatusSvcSpy.SyncOrderDistributionStatus.and.returnValue(
        of(throwError('error'))
      );
      // act
      component.syncStatus();
      tick();
      // assert
      expect(toastSpy.showDanger).toBeDefined();
    }));
  });
});
