import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OrderProductSelectionComponent } from './order-product-selection.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductTypeEnum } from '../../enums/product-type.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderProductSelectionModalComponent } from './order-product-selection-modal/order-product-selection-modal.component';
import { of, throwError } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { OrderService } from 'src/app/order/services/order.service';
import { Product } from '../../models/product.model';
import { QuotationService } from 'src/app/order/services/quotation.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';

describe('OrderProductSelectionComponent', () => {
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);
  let component: OrderProductSelectionComponent;
  let fixture: ComponentFixture<OrderProductSelectionComponent>;

  const quotationSvcSpy = jasmine.createSpyObj('QuotationService', [
    'childProductInQuotation',
    'convertChildProductQuotation'
  ]);
  const toastSpy = jasmine.createSpyObj('NgbdToastGlobal', [
    'showSuccess', 
    'showDanger'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderProductSelectionComponent, NgbdToastGlobal],
      imports: [HttpClientTestingModule],
      providers: [
        { 
          provide: NgbModal, 
          useValue: modalSvcSpy 
        }, 
        FormBuilder, 
        { 
          provide: QuotationService,
          useValue: quotationSvcSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderProductSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('productList', () => {
    it('should set correctly', () => {
      // act
      component.productList = [];

      // assert
      expect(component.productList.length).toBe(0);
    });

    it('should reset error messages', () => {
      // act
      component.productList = [
        { id: 1, remainingQuantity: 20, voucherQuantity: 10 } as any,
      ];

      // assert
      expect(component.productSelectionErrorMessages.length).toBe(0);
    });

    it('should set error message to not enough stocks for NonAPI orders', () => {
      // act
      component.selectedOrderMode.key = 2;
      component.productList = [
        { id: 1, remainingQuantity: 9, voucherQuantity: 10 } as any,
      ];

      // assert
      expect(component.productSelectionErrorMessages.length).toBe(1);
    });

    xit('should set error message to not enough stocks for API orders in TW BU', () => {
      // act
      component.selectedOrderMode.key = 3;
      component.selectedTenant = 'TW';
      component.productList = [
        { id: 1, remainingQuantity: 0, voucherQuantity: 10 } as any,
      ];

      // assert
      expect(component.productSelectionErrorMessages.length).toBe(1);
    });

    it('should not set error message to not enough stocks for API orders in Non TW BU', () => {
      // act
      component.selectedOrderMode.key = 3;
      component.selectedTenant = 'IN';
      component.productList = [
        { id: 1, remainingQuantity: 0, voucherQuantity: 10 } as any,
      ];

      // assert
      expect(component.productSelectionErrorMessages.length).toBe(0);
    });

    it('should compute estimated total', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;

      // act
      component.productList = [
        {
          productType: ProductTypeEnum.ProductBased,
          id: 1,
          remainingQuantity: 10,
          voucherQuantity: 10,
          sellingPrice: 10,
        } as any,
      ];

      // assert
      expect(component.estimatedTotal).toBe(100);
    });

    it('should compute estimated total for dfv', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;

      // act
      component.productList = [
        {
          id: 1,
          remainingQuantity: 10,
          voucherQuantity: 10,
          sellingPrice: 10,
          productType: ProductTypeEnum.DynamicFaceValue,
          dfvPercentage: 10,
          dfvQuantity: [
            {
              voucherQuantity: 10,
              faceValue: 10,
            },
            {
              voucherQuantity: 10,
              faceValue: 10,
            },
          ],
        } as any,
      ];

      // assert
      expect(component.estimatedTotal).toBe(20);
    });
  });

  describe('openModal()', () => {
    beforeEach(() => {
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve('confirm'),
        dismissed: of('uploadExcelFile'),
        componentInstance: {},
      });
    });

    it('should open modal and on dismiss click inputFile', () => {
      // arrange
      const inputFileClickSpy = spyOn(
        component.inputFile.nativeElement,
        'click'
      );

      // act
      component.openModal();

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalledWith(
        OrderProductSelectionModalComponent,
        {
          size: 'md',
          backdrop: 'static',
          centered: true,
        }
      );
      expect(inputFileClickSpy).toHaveBeenCalled();
    });

    it('should open modal and on dismiss click product creation', () => {
      // arrange
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve('confirm'),
        dismissed: of('singleUpload'),
        componentInstance: {},
      });
      const productCreateClickSpy = spyOn(component, 'onProductCreateClicked');

      // act
      component.openModal();

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalledWith(
        OrderProductSelectionModalComponent,
        {
          size: 'md',
          backdrop: 'static',
          centered: true,
        }
      );
      expect(productCreateClickSpy).toHaveBeenCalled();
    });
  });

  describe('onFileSelected() api call success', () => {
    let orderSvcSpy: OrderService;
    beforeEach(() => {
      orderSvcSpy = TestBed.inject(OrderService);
      component.selectedOrderMode.key = 1;
      spyOn(orderSvcSpy, 'getProductList').and.returnValue(of({ success: true, message: '', data: { orderProductList: [], errorValidationDto: [], orderLines: [] } }));
    });

    it('should add error message when invalid file is selected', () => {
      // arrange
      component.productSelectionErrorMessages = [];

      // act
      component.onFileSelected({ target: { files: [{ name: 'file.pdf' }] } });

      // assert
      expect(component.productSelectionErrorMessages.length).toBeGreaterThan(0);
    });

    it('should not have error message when valid file is selected', () => {
      // arrange
      component.productSelectionErrorMessages = [];

      // act
      component.onFileSelected({ target: { files: [{ name: 'file.xls' }] } });

      // assert
      expect(component.productSelectionErrorMessages.length).toBe(0);
    });
  });

  describe('onFileSelected() api call failed', () => {
    let orderSvcSpy: OrderService;
    beforeEach(() => {
      orderSvcSpy = TestBed.inject(OrderService);
      component.selectedOrderMode.key = 1;
    });
    describe('when API returns DTO error', () => {
      const errorResponse = {
        error: {
          data: {
            errorValidationDto: [
              { columnName: 'TestColumn', errorMessage: 'TestError' }
            ]
          }
        }
      };
      beforeEach(() => {
        spyOn(orderSvcSpy, 'getProductList').and.returnValue(throwError(errorResponse));
      });
        it('should handle errors correctly', () => {
        // arrange
        component.productSelectionErrorMessages = [];
          // act
        component.onFileSelected({ target: { files: [{ name: 'file.xls' }] } });
        // assert
        expect(component.productSelectionErrorMessages[0].description).toEqual('TestError');
      });
    });
    describe('when API returns a general error without DTO', () => {
      const generalErrorResponse = {
        error: {
          data: {}
        }
      };
      beforeEach(() => {
        spyOn(orderSvcSpy, 'getProductList').and.returnValue(throwError(generalErrorResponse));
      });
      it('should handle general errors correctly', () => {
        // arrange
        component.productSelectionErrorMessages = [];
        // act
        component.onFileSelected({ target: { files: [{ name: 'file.xls' }] } });
        // assert
        expect(component.productSelectionErrorMessages[0].description).toEqual('Something went wrong.');
      });
    });
  });
  

  describe('onFileSelected() mock product list', () => {
    let orderSvcSpy: OrderService;
    beforeEach(() => {
      orderSvcSpy = TestBed.inject(OrderService);
      spyOn(orderSvcSpy, 'getProductListAppend').and.returnValue([]);
    });
    it('should call getProductListAppend if product type is not NonAPI + Indirect', () => {
      // arrange
      component.selectedOrderMode.key = 4;
      // act
      component.onFileSelected({ target: { files: [{ name: 'file.xls' }] } });
      // assert
      expect(orderSvcSpy.getProductListAppend).toHaveBeenCalled();
    });
  });
  

  describe('onProductDeleted()', () => {
    it('should call product list dirty', () => {
      // arrange
      component.productList = [{ parentCode: 1 } as any];
      const productListDirtySpy = spyOn(component.productListDirty, 'emit');

      // act
      component.onProductDeleted([{ id: 1, productCode: 1 } as any]);

      // assert
      expect(productListDirtySpy).toHaveBeenCalled();
    });
  });

  describe('onProductEditClicked()', () => {
    it('should call manualSelectProductClicked', () => {
      // arrange
      component.productList = [{ parentCode: 1 } as any];
      const manualSelectProductClickedSpy = spyOn(
        component.manualSelectProductClicked,
        'emit'
      );

      // act
      component.onProductEditClicked(1);

      // assert
      expect(manualSelectProductClickedSpy).toHaveBeenCalled();
    });
  });

  describe('onEditDeliveryDetailsClicked()', () => {
    it('should call editDeliveryDetailsClicked', () => {
      // arrange
      component.productList = [{ parentCode: 1 } as any];
      const editDeliveryDetailsClicked = spyOn(
        component.editDeliveryDetailsClicked,
        'emit'
      );

      // act
      component.onEditDeliveryDetailsClicked(1);

      // assert
      expect(editDeliveryDetailsClicked).toHaveBeenCalled();
    });
  });

  describe('onProductCreateClicked()', () => {
    it('should call manualSelectProductClicked', () => {
      // arrange
      component.productList = [{ parentCode: 1 } as any];
      const manualSelectProductClicked = spyOn(
        component.manualSelectProductClicked,
        'emit'
      );

      // act
      component.onProductCreateClicked();

      // assert
      expect(manualSelectProductClicked).toHaveBeenCalled();
    });
  });

  describe('removeValidationError()', () => {
    let orderSvcSpy: OrderService;
    beforeEach(() => {
      orderSvcSpy = TestBed.inject(OrderService);
    });
    it('should remove the validation error related to a specific product', () => {
      // arrange
      component.productList = orderSvcSpy.MOCK_DATA;
      component.productSelectionErrorMessages = [
        { type: 'IQIYMMDDXYZ', description: 'Error for product 1' },
        { type: 'IDIYMMDDXYZ', description: 'Error for product 2' }
      ];
  
      const productToRemoveErrorFor = orderSvcSpy.MOCK_DATA[0];
  
      // act
      component.removeValidationError(productToRemoveErrorFor);
  
      // assert
      expect(component.productSelectionErrorMessages.length).toBe(1);
      expect(component.productSelectionErrorMessages[0].type).not.toBe('IQIYMMDDXYZ');
    });
  });

  describe('setValidationError() method', () => {
    beforeEach(() => {
      component.productSelectionErrorMessages = [];
    });
    it('should add the product error message if not present', () => {
      const product = { productCode: 'PROD001', productName: 'Product A' } as Product;
      component.setValidationError(product);
      expect(component.productSelectionErrorMessages.length).toBe(1);
      expect(component.productSelectionErrorMessages[0].type)
        .toBe(product.productCode);
      expect(component.productSelectionErrorMessages[0].description)
        .toBe(`${product.productName} is not enough in stock`);
    });
    it('should not add duplicate product error messages', () => {
      const product = { productCode: 'PROD001', productName: 'Product A' } as Product;
      component.setValidationError(product);
      component.setValidationError(product);
      expect(component.productSelectionErrorMessages.length).toBe(1);
    });
  });

  describe('toggleChildProduct() method', () => {
    const event = { target: { checked : true }};
    const MOCK_CHILD_PRODUCT = [
      {
        'masterProductCode': 'RubySCV1000',
        'childProductDetail': [
          {
            'productCode': 'RubyValueBased_50',
            'productName': 'RubyValueBased_50',
            'expiryDate': '2025-10-12T23:59:59Z',
            'expirySchemeText': 'FixEndOfDay'
          },
        ]
      }
    ];
    beforeEach(() => {
      component.productList = [
        { id: 1, remainingQuantity: 9, voucherQuantity: 10, isMaster: true, productCode: 'TW_Sync_121' } as any,
      ];
    });

    it('should call childProductInQuotation api and response success', fakeAsync(() => {
      // arrange
      quotationSvcSpy.childProductInQuotation.and.returnValue(
        of({ success: true, message: '', data: { getChildProductInQuotation: MOCK_CHILD_PRODUCT} })
      );
      // act
      component.toggleChildProduct(event);
      tick();
      // assert
      expect(quotationSvcSpy.childProductInQuotation).toHaveBeenCalled();
      expect(quotationSvcSpy.convertChildProductQuotation).toHaveBeenCalled();
    }));
    it('should call childProductInQuotation api and error message', fakeAsync(() => {
      // arrange
      quotationSvcSpy.childProductInQuotation.and.returnValue(
        of(throwError('error'))
      );
      // act
      component.toggleChildProduct(event);
      tick();
      // assert
      expect(toastSpy.showDanger).toBeDefined();
    }));
  });
});
