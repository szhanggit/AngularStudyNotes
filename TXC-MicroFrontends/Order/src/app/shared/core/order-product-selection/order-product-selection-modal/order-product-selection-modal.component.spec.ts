import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderProductSelectionModalComponent } from './order-product-selection-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OrderService } from 'src/app/order/services/order.service';
import { of } from 'rxjs';

describe('OrderProductSelectionModalComponent', () => {
  const orderSvcSpy = jasmine.createSpyObj('OrderService', [
    'getProductList',
    'getProductListAppend',
    'getProductTemplateFile'
  ]);
  let component: OrderProductSelectionModalComponent;
  let fixture: ComponentFixture<OrderProductSelectionModalComponent>;
  let ngbActiveModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderProductSelectionModalComponent],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: jasmine.createSpyObj('NgbActiveModal', ['dismiss']),
        },
        {
          provide: OrderService,
          useValue: orderSvcSpy
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProductSelectionModalComponent);
    component = fixture.componentInstance;

    ngbActiveModal = TestBed.inject(
      NgbActiveModal
    ) as jasmine.SpyObj<NgbActiveModal>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onUploadFileClicked()', () => {
    it('should open file input if  calledFrom === "orderDetails"', () => {
      // arrange
      const inputFileClickSpy = spyOn(
        component.inputFile.nativeElement,
        'click'
      );
      component.calledFrom = 'orderDetails';

      // act
      component.onUploadFileClicked();

      // assert
      expect(inputFileClickSpy).toHaveBeenCalled();
    });

    it('should dismiss moodal if !calledFrom', () => {
      // act
      component.onUploadFileClicked();

      // assert
      expect(ngbActiveModal.dismiss).toHaveBeenCalled();
    });
  });

  describe('onFileSelected()', () => {
    const testData = [
      {
        params: 'orderDetails',
        file: 'test.xls',
      },
      { params: 'createOrder', file: 'test.doc' },
    ];

    testData.forEach((data) => {
      it(`should call dismiss with ${data.params} from active modal with parameters`, () => {
        // arrange
        const event = {
          target: { files: [{ name: data.file }] },
        };
        component.calledFrom = data.params as 'orderDetails' | 'createOrder';
        const dismissData = {
          callFrom: data.params,
        };

        // act
        component.onFileSelected(event);

        // assert
        expect(ngbActiveModal.dismiss).toHaveBeenCalled();
        expect(dismissData.callFrom).toEqual(component.calledFrom);
      });
    });
  });

  describe('downloadTemplate()', () => {
    it('should call stopPropagation on local', () => {
      // arrange
      environment.local = true;
      orderSvcSpy.getProductTemplateFile.and.returnValue(of(new Blob()));
      const event = {
        stopPropagation: jasmine.createSpy(),
      };
      component.quotationNumber = '12345';
      component.orderMode = { key: 1, value: 'API + Indirect' };

      // act
      component.downloadTemplate(event as any);

      // assert
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should call stopPropagation on deploy', () => {
      // arrange
      environment.local = false;
      orderSvcSpy.getProductTemplateFile.and.returnValue(of(new Blob()));
      const event = {
        stopPropagation: jasmine.createSpy(),
      };

      component.quotationNumber = '12345';
      component.orderMode = { key: 1, value: 'API + Indirect' };

      // act
      component.downloadTemplate(event as any);

      // assert
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });
});
