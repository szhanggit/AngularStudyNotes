import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { CloseOrderModalComponent } from './close-order-modal.component';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CloseModalEnum } from 'src/app/order/enums/close-modal.enum';
import { OrderService } from 'src/app/order/services/order.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { OrderStatusEnum } from 'src/app/order/enums/order-status.enum';
import { of } from 'rxjs';

describe('CloseOrderModalComponent', () => {
  const activeModalSvcSpy = jasmine.createSpyObj('NgbActiveModal', ['dismiss']);
  const orderSvcSpy = jasmine.createSpyObj('OrderService', [
    'updateReason',
    'updateOrderStatus',
  ]);

  let component: CloseOrderModalComponent;
  let fixture: ComponentFixture<CloseOrderModalComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CloseOrderModalComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        FormBuilder,
        {
          provide: NgbActiveModal,
          useValue: activeModalSvcSpy,
        },
        {
          provide: OrderService,
          useValue: orderSvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should create', () => {
    it('on action type close', () => {
      // arrange
      const expectedPlaceholder = 'Please specify your close reason (optional)';
      component.actionType = CloseModalEnum.Close;

      // act
      component.ngOnInit();
      const actualPlaceholder =
        component.closeOrderFormModel.fieldsDefinition.find(
          (field) => field.formControlName === 'reason'
        )?.placeholder;

      // assert
      expect(component).toBeTruthy();
      expect(component.closeOrderFormGroup).toBeDefined();
      expect(actualPlaceholder).toBe(expectedPlaceholder);
    });

    it('on action type rejected', () => {
      // arrange
      const expectedPlaceholder =
        'Please specify your reject reason (optional)';
      component.actionType = CloseModalEnum.Reject;

      // act
      component.ngOnInit();
      fixture.detectChanges();
      const actualPlaceholder =
        component.closeOrderFormModel.fieldsDefinition.find(
          (field) => field.formControlName === 'reason'
        )?.placeholder;

      // assert
      expect(component).toBeTruthy();
      expect(component.closeOrderFormGroup).toBeDefined();
      expect(actualPlaceholder).toBe(expectedPlaceholder);
    });
  });

  describe('onButtonClicked', () => {
    it('should dismiss active modal if param is false', () => {
      // act
      component.onButtonClicked();
      orderSvcSpy.updateReason();
      // assert
      expect(orderSvcSpy.updateReason).toHaveBeenCalled();
    });

    describe('should updateReason and dismiss active modal if param is true', () => {
      beforeEach(() => {
        // arrange
        component.orderId = 1;
        orderSvcSpy.updateOrderStatus.and.returnValue(
          of({ success: true, message: '', data: {} })
        );
      });
      it('when status is closed', fakeAsync(() => {
        // arrange
        component.username = 'tester';
        component.actionType = CloseModalEnum.Close;
        // act
        component.onButtonClicked(true);
        tick();
        // assert
        expect(orderSvcSpy.updateOrderStatus).toHaveBeenCalledWith({
          id: component.orderId,
          statusId: OrderStatusEnum.Closed,
          comment: ''
        });
        expect(activeModalSvcSpy.dismiss).toHaveBeenCalled();
      }));

      it('when status is Rejected', fakeAsync(() => {
        // arrange
        component.username = 'tester';
        component.actionType = CloseModalEnum.Reject;
        // act
        component.onButtonClicked(true);
        tick();
        // assert
        expect(orderSvcSpy.updateOrderStatus).toHaveBeenCalledWith({
          id: component.orderId,
          statusId: OrderStatusEnum.Rejected,
          comment: ''
        });
        expect(activeModalSvcSpy.dismiss).toHaveBeenCalled();
      }));
    });
  });
});
