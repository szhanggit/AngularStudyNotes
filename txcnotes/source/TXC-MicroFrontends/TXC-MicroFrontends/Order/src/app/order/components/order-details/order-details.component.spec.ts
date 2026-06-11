import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';

import { OrderDetailsComponent } from './order-details.component';
import { StringSplitByCapitalLetterPipe } from '../../pipes/string-split-by-capital-letter.pipe';
import { OrderModeTypePipe } from '../../pipes/order-mode-type.pipe';
import { OrderService } from '../../services/order.service';
import { OrderRequest } from '../../models/order-request.model';
import { EditOrderDetailsEnum } from '../../enums/edit-order-details.enum';
import { FormEmitterService } from 'src/app/shared/dumb/form/form-emitter.service';
import { Product, OrderLine } from 'src/app/shared/models/product.model';
import { SyncStatusHistoryComponent } from './sync-status-history/sync-status-history.component';
import { ExportDeliveryComponent } from '../export-delivery/export-delivery.component';
import { Router } from '@angular/router';
import { OrderStatusEnum } from '../../enums/order-status.enum';
import { CloseOrderModalComponent } from './close-order-modal/close-order-modal.component';
import { CloseModalEnum } from '../../enums/close-modal.enum';
import { SendFileComponent } from './send-file/send-file.component';
import { ConfirmationModalComponent } from '@txc-angular/component-library';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { DownloadExcelFileComponent } from './download-excel-file/download-excel-file.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { TemplateTypeEnum } from 'src/app/shared/enums/template.enum';
import { ProductSelectionTableDefinition } from 'src/app/shared/models/table-definition/product-selection-table-definition.model';
import { OrderOperationsEnum } from '../../enums/order-operations.enum.';
import { ProductService } from '../../services/product.service';
import { QuotationService } from '../../services/quotation.service';
import { ExpiryPolicyService } from '../../services/expiry-policy.service';
import { InventoryService } from '../../services/inventory.service';
import { DictionaryService } from '../../services/dictionary.service';
import { AttachmentService } from '../../services/attachment.service';
import { OrderModeEnum } from '../../enums/order-mode.enum';
import { CustomFile, FileEvent } from 'src/app/shared/models/custom-file.model';
import * as saveAs from 'file-saver';
import { FileEventTypeEnum } from 'src/app/shared/enums/file-event-type.enum';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Order, OrderLineDetails } from '../../models/order.model';

const mockOrder: OrderRequest = {
  basicInfoFormGroup: {
    orderName: 'Demo Order Name',
    publishDate: new Date(),
    activationType: 1,
    activationDate: new Date(),
  },
  settingsFormGroup: {
    excelFormat: 1,
    excelShortUrl: 1,
    barcodeInfo: 1,
    emailAttachment: 1,
    shortUrlAuthCodeGenerationWay: 1,
    generateSequenceNumber: true,
    channelId: 1,
  },
  memoFormGroup: {
    memo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  attachmentFormGroup: {
    attachments: [
      {
        name: 'Quotation 20221222.pdf',
        lastModified: 12,
        webkitRelativePath: 'asdasd',
        size: 12,
        type: 'pdf',
      },
    ],
  },
  deliveryDetailsFormGroup: {
    emailTemplate: 'Original',
    emailSubject: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    emailGreeting:
      'Tellus aliquam et ullamcorper enim consequat augue facilisis platea. Et odio pellentesque lacus, gravida pharetra.',
    msgEncoding: 1,
    smsGreeting:
      'Tellus aliquam et ullamcorper enim consequat augue facilisis platea. Et odio pellentesque lacus, gravida pharetra.',
  },
};

const mockProductList: Product[] = [
  {
    id: 1,
    productVersionId: 1,
    productCode: 'test',
    productName: 'test',
    productType: 1,
    expiryScheme: 1,
    expirySchemeText: 'test',
    isChildProduct: false,
    isActive: false,
  },
  {
    id: 2,
    productVersionId: 2,
    productCode: 'test',
    productName: 'test',
    productType: 1,
    expiryScheme: 1,
    expirySchemeText: 'test',
    isChildProduct: false,
    isActive: false,
  },
];

describe('OrderDetailsComponent', () => {
  // mock local storage
  let store: any = {};
  const mockLocalStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  const mockOrderById = {
    id: 1,
    clientQuotationId: 1,
    mode: 1,
    orderLines: [
      {
        productVersionId: 1,
        expirationPolicyId: 1,
        voucherReservationCodeId: 1,
        productVersion: [
          {
            skuId: 1,
            product: {
              productName: 'TestProduct',
              productCode: 'TestProductCode',
              productType: ProductTypeEnum.ProductBased,
            },
          },
        ],
        orderLineDetails: [
          {
            voucherQuantity: 1,
            faceValue: 1,
            soldPrice: 1,
          },
        ],
      },
    ],
  };

  const mockOrderQuotationServedQuantities = [
    {
      productVersionId: 1,
      remainingQuantity: 268,
    },
  ];

  const mockExpirationPolicies = [
    {
      id: 1,
      name: 'FixEndOfDay',
    },
  ];

  const mockReservations = [
    {
      skuId: 1,
      inventoryBatch: [
        {
          id: 1,
          reservationCode: 'ABCD',
        },
      ],
    },
  ];

  const orderSvcSpy = jasmine.createSpyObj('OrderService', [
    'getOrderById',
    'getMockedProductList',
    'updateOrder',
    'getReason',
    'updateOrderStatus',
    'getMockOrderById',
    'getOrderById',
    'getOrderRemainingQuantity',
    'updateOrderBasicInfo',
    'batchUpdateOrderLine',
    'updateDefDelContent',
    'getOrderLineDetail',
    'updateOrderLineStatus',
  ]);

  const attachmentSvcSpy = jasmine.createSpyObj('AttachmentService', [
    'getOrderAttachments',
    'editFileAttachment',
    'deleteFileAttachment',
    'downloadOrderAttachment',
  ]);

  const quotationSvcSpy = jasmine.createSpyObj('QuotationService', [
    'getQuotationById',
    'getQuotationProduct',
    'childProductInQuotation',
    'convertChildProductQuotation',
  ]);

  const expirationPolicySvcSpy = jasmine.createSpyObj('QuotationService', [
    'getExpirationPolicies',
  ]);

  const inventorySvcSpy = jasmine.createSpyObj('InventoryService', [
    'getReservationCode',
  ]);

  const dictionarySvcSpy = jasmine.createSpyObj('DictionaryService', [
    'getChannels',
    'getLanguages',
  ]);

  const authSvcSpy = jasmine.createSpyObj('AuthorizationLibraryService', [
    'getElementOperationFlag',
  ]);

  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);

  const toastSpy = jasmine.createSpyObj('NgbdToastGlobal', [
    'showSuccess',
    'showDanger',
  ]);

  const formEmitterSvcSpy = jasmine.createSpyObj('FormEmitterService', [], {
    emitEvent: { next: jasmine.createSpy },
  });

  const productSvcSpy = jasmine.createSpyObj('ProductService', [
    'openProductSelectionModal',
  ]);

  let router: Router;
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderDetailsComponent, OrderModeTypePipe, NgbdToastGlobal],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        StringSplitByCapitalLetterPipe,
        DatePipe,
        {
          provide: OrderService,
          useValue: orderSvcSpy,
        },
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
        {
          provide: FormEmitterService,
          useValue: formEmitterSvcSpy,
        },
        {
          provide: ProductService,
          useValue: productSvcSpy,
        },
        {
          provide: AttachmentService,
          useValue: attachmentSvcSpy,
        },
        {
          provide: QuotationService,
          useValue: quotationSvcSpy,
        },
        {
          provide: ExpiryPolicyService,
          useValue: expirationPolicySvcSpy,
        },
        {
          provide: InventoryService,
          useValue: inventorySvcSpy,
        },
        {
          provide: DictionaryService,
          useValue: dictionarySvcSpy,
        },
        {
          provide: AuthorizationLibraryService,
          useValue: authSvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

    const tenant = {
      tenantId: 7,
      name: 'TW',
    };
    localStorage.setItem('tenant', JSON.stringify(tenant));

    orderSvcSpy.getMockedProductList.and.returnValue([]);
    orderSvcSpy.getOrderById.and.returnValue(of(mockOrderById));
    attachmentSvcSpy.getOrderAttachments.and.returnValue(of([]));
    attachmentSvcSpy.editFileAttachment.and.returnValue(
      of({ data: {}, message: '', success: true })
    );
    attachmentSvcSpy.deleteFileAttachment.and.returnValue(
      of({ data: {}, message: '', success: true })
    );
    attachmentSvcSpy.downloadOrderAttachment.and.returnValue(of(new Blob()));
    orderSvcSpy.getOrderRemainingQuantity.and.returnValue(
      of(mockOrderQuotationServedQuantities)
    );
    orderSvcSpy.updateOrderLineStatus.and.returnValue(
      of({ data: {}, message: '', success: true })
    );
    expirationPolicySvcSpy.getExpirationPolicies.and.returnValue(
      of(mockExpirationPolicies)
    );
    inventorySvcSpy.getReservationCode.and.returnValue(of(mockReservations));
    dictionarySvcSpy.getChannels.and.returnValue(
      of({
        data: JSON.stringify({
          dictionaries: [{ displayName: 'Test', dictionaryId: 1 }],
        }),
      })
    );
    dictionarySvcSpy.getLanguages.and.returnValue(
      of([{ displayName: 'Test', dictionaryId: 1 }])
    );
    authSvcSpy.getElementOperationFlag.and.returnValue(false);
    quotationSvcSpy.childProductInQuotation.and.returnValue(
      of({ success: true, message: '', data: { } })
    );

    fixture = TestBed.createComponent(OrderDetailsComponent);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(
      new Promise((resolve) => resolve(true))
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // assert
    expect(component).toBeTruthy();
    expect(component.selectedTenant).toBe('TW');
    expect(orderSvcSpy.getOrderById).toHaveBeenCalled();
  });

  it('should call checkAdvanceBilling and mapOrderLines', fakeAsync(() => {
    // arrange
    quotationSvcSpy.getQuotationById.and.returnValue(
      of({
        success: true,
        message: '',
        data: { quotationItemList: [{ advanceBilling: true }] },
      })
    );
    quotationSvcSpy.getQuotationProduct.and.returnValue(
      of({
        orderLines: [
          {
            id: 1,
            productVersion: [
              {
                productVersionId: 1,
                product: {
                  quotationProduct: {
                    clientQuotationProductSoldPrice: [
                      {
                        soldPriceWithTax: 10,
                      },
                    ],
                  },
                  contractSKU: [
                    {
                      faceValueWithTax: 10,
                    },
                  ],
                },
              },
            ],
          },
        ],
      })
    );
    // act
    component.getReference(1, {
      orderLines: [
        {
          id: 1,
          productVersion: [
            {
              productVersionId: 1,
              product: {
                productType: ProductTypeEnum.ProductBased,
              },
            },
          ],
          orderLineDetails: [] as unknown,
        },
      ],
    } as Order);
    tick();

    // assert
    expect(quotationSvcSpy.getQuotationById).toHaveBeenCalled();
    expect(component.isAdvanceBilling).toBeDefined();
    expect(component.isAdvanceBilling).toBeTrue();
  }));

  it('should call checkAdvanceBilling and mapOrderLines with DFV', fakeAsync(() => {
    // arrange
    quotationSvcSpy.getQuotationById.and.returnValue(
      of({
        success: true,
        message: '',
        data: { quotationItemList: [{ advanceBilling: true }] },
      })
    );
    quotationSvcSpy.getQuotationProduct.and.returnValue(
      of({
        orderLines: [
          {
            id: 1,
            productVersion: [
              {
                productVersionId: 1,
                product: {
                  quotationProduct: {
                    clientQuotationProductSoldPrice: [
                      {
                        soldPriceWithTax: 10,
                      },
                    ],
                  },
                  contractSKU: [
                    {
                      faceValueWithTax: 10,
                    },
                  ],
                },
              },
            ],
          },
        ],
      })
    );
    orderSvcSpy.getOrderLineDetail.and.returnValue(
      of({
        success: true,
        data: {
          orderLineDetails: [
            {
              faceValue: 10,
              soldPrice: 10,
            },
          ],
        },
      })
    );
    // act
    component.getReference(1, {
      orderLines: [
        {
          id: 1,
          productVersion: [
            {
              productVersionId: 1,
              product: {
                productType: ProductTypeEnum.DynamicFaceValue,
              },
            },
          ],
          orderLineDetails: [] as unknown,
        },
      ],
    } as Order);
    tick();

    // assert
    expect(quotationSvcSpy.getQuotationById).toHaveBeenCalled();
    expect(component.isAdvanceBilling).toBeDefined();
    expect(component.isAdvanceBilling).toBeTrue();
  }));

  it('onExport should open export delivery modal', () => {
    // arrange
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve({}),
      componentInstance: {},
    });

    // act
    component.onExport(1, {} as any);

    // assert
    expect(modalSvcSpy.open).toHaveBeenCalledWith(ExportDeliveryComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
  });

  describe('onOrderStateChange', () => {
    describe('should return on view order details from basic info', () => {
      beforeEach(() => {
        // arrange
        quotationSvcSpy.getQuotationById.and.returnValue(
          of({
            success: true,
            message: '',
            data: { quotationItemList: [{ advanceBilling: true }] },
          })
        );
        component.orderDetailsState = EditOrderDetailsEnum.BasicInfo;

        component.deletedAttachments = [
          {
            customFiles: [new File([], 'test.xls')],
            eventType: FileEventTypeEnum.DELETE,
            index: 0,
          },
        ];
      });
      it('and save is true', () => {
        // arraange
        const deleteAttachmentsSpy = spyOn(component, 'deleteAttachments');
        const uploadAttachmentSpy = spyOn(component, 'uploadAttachment');
        component.attachments?.setValue([
          new File([], 'test.xls'),
          new File([], 'test2.xls'),
        ]);
        component.attachments?.value.forEach((attachment: CustomFile) => {
          attachment.isRecentlyUploaded = true;
        });
        orderSvcSpy.updateOrderBasicInfo.and.returnValue(
          of({ success: true, message: '', data: {} })
        );

        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          true
        );

        // assert
        expect(orderSvcSpy.updateOrderBasicInfo).toHaveBeenCalled();
        expect(toastSpy.showDanger).toBeDefined();
        expect(component.orderDetailsState).toBe(
          EditOrderDetailsEnum.ViewDetails
        );
        expect(deleteAttachmentsSpy).toHaveBeenCalled();
        expect(uploadAttachmentSpy).toHaveBeenCalled();
      });
      it('and save is false', () => {
        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          false
        );

        // assert
        expect(orderSvcSpy.updateOrder).toHaveBeenCalledWith(
          component.originalOrderValues
        );
        expect(component.orderDetailsState).toBe(
          EditOrderDetailsEnum.ViewDetails
        );
      });
    });
    describe('should return on view order details from selected product list', () => {
      beforeEach(() => {
        // arrange
        component.orderDetailsState = EditOrderDetailsEnum.SelectedProductList;
        component.productList = [
          {
            id: 1,
            isChildProduct: false,
            voucherQuantity: 10,
            emailQuantity: 10,
            smsQuantity: 10,
          } as Product,
          { id: 2, isChildProduct: true, voucherQuantity: 10 } as Product,
          { id: 3, isChildProduct: false, voucherQuantity: 10 } as Product,
          { id: 4, isChildProduct: false, voucherQuantity: 10 } as Product,
          {
            id: 4,
            isChildProduct: false,
            voucherQuantity: 10,
            productType: ProductTypeEnum.DynamicFaceValue,
            dfvPercentage: 10,
            dfvQuantity: [
              {
                voucherQuantity: 10,
                faceValue: 10,
              },
            ],
          } as Product,
        ];
      });
      it('should call selectProductOnPublishedApi', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.Published;
        component.selectedOrderMode.key = OrderModeEnum.API;
        const selectProductOnPublishedApiSpy = spyOn(
          component,
          'selectProductOnPublishedApi'
        );

        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.SelectedProductList
        );

        // assert
        expect(selectProductOnPublishedApiSpy).toHaveBeenCalled();
      });
      it('and save is true and batch update api return success true', fakeAsync(() => {
        // arrange
        orderSvcSpy.batchUpdateOrderLine.and.returnValue(
          of({ success: true, message: '', data: {} })
        );
        const fetchOrderDetails = spyOn(component, 'fetchOrderDetails');

        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          true
        );
        tick();

        // expect
        expect(orderSvcSpy.batchUpdateOrderLine).toHaveBeenCalled();
        expect(fetchOrderDetails).toHaveBeenCalled();
        expect(component.orderDetailsState).toBe(
          EditOrderDetailsEnum.ViewDetails
        );
      }));
      it('and save is true and batch update api return success false', fakeAsync(() => {
        // arrange
        orderSvcSpy.batchUpdateOrderLine.and.returnValue(
          of({ success: false, message: '', data: {} })
        );

        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          true
        );
        tick();

        // assert
        expect(orderSvcSpy.batchUpdateOrderLine).toHaveBeenCalled();
        expect(toastSpy.showDanger).toBeDefined();
      }));
      it('and save is true and batch update api error failed', fakeAsync(() => {
        // arrange
        orderSvcSpy.batchUpdateOrderLine.and.returnValue(
          of(throwError('error'))
        );

        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          true
        );
        tick();

        // assert
        expect(orderSvcSpy.batchUpdateOrderLine).toHaveBeenCalled();
        expect(toastSpy.showDanger).toBeDefined();
      }));
      it('and save is false', () => {
        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          false
        );

        // assert
        expect(component.orderDetailsState).toBe(
          EditOrderDetailsEnum.ViewDetails
        );
      });
    });
    describe('should return on view order details from default delivery content', () => {
      beforeEach(() => {
        // arrange
        component.orderDetailsState =
          EditOrderDetailsEnum.DefaultDeliveryContent;

        orderSvcSpy.updateDefDelContent.and.returnValue(
          of({
            success: true,
          })
        );
      });
      it('and save is true', () => {
        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          true
        );

        // assert
        expect(component.orderDetailsState).toBe(
          EditOrderDetailsEnum.ViewDetails
        );
      });
      it('and save is false', () => {
        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          false
        );

        // assert
        expect(component.orderDetailsState).toBe(
          EditOrderDetailsEnum.ViewDetails
        );
      });
    });
    describe('should return on view order details from default select product manually', () => {
      beforeEach(() => {
        // arrange
        component.orderDetailsState =
          EditOrderDetailsEnum.SelectProductManually;
      });
      it('and save is true', () => {
        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          true
        );

        // assert
        expect(component.orderDetailsState).toBe(
          EditOrderDetailsEnum.ViewDetails
        );
      });
      it('and save is false', () => {
        // act
        component.onOrderDetailsStateChange(
          EditOrderDetailsEnum.ViewDetails,
          false
        );

        // assert
        expect(component.orderDetailsState).toBe(
          EditOrderDetailsEnum.ViewDetails
        );
      });
    });
    it('should navigate to basic info', () => {
      // act
      component.onOrderDetailsStateChange(EditOrderDetailsEnum.BasicInfo);

      // assert
      expect(component.basicInfoFormGroup.pristine).toBeTrue();
      expect(component.orderDetailsState).toBe(EditOrderDetailsEnum.BasicInfo);
    });
    it('should navigate to attachment', () => {
      // act
      component.onOrderDetailsStateChange(EditOrderDetailsEnum.Attachment);

      // assert
      expect(component.orderDetailsState).toBe(
        EditOrderDetailsEnum.ViewDetails
      );
    });
    it('should navigate to selected product list', () => {
      // act
      component.onOrderDetailsStateChange(
        EditOrderDetailsEnum.SelectedProductList
      );

      // assert
      expect(component.isProductListDirty).toBeFalse();
      expect(component.orderDetailsState).toBe(
        EditOrderDetailsEnum.SelectedProductList
      );
    });
    it('should navigate to default delivery content', () => {
      // act
      component.onOrderDetailsStateChange(
        EditOrderDetailsEnum.DefaultDeliveryContent
      );

      // assert
      expect(component.deliveryDetailsFormGroup.pristine).toBeTrue();
      expect(component.orderDetailsState).toBe(
        EditOrderDetailsEnum.DefaultDeliveryContent
      );
    });
    it('should navigate to view direct delivery details', () => {
      // act
      component.onOrderDetailsStateChange(
        EditOrderDetailsEnum.ViewDirectDeliveryDetails
      );

      // assert
      expect(component.orderDetailsState).toBe(
        EditOrderDetailsEnum.ViewDirectDeliveryDetails
      );
    });
  });

  it('onShowChildProduct should toggle showChildProduct', () => {
    // act
    component.onShowChildProduct(true);
    // assert
    expect(component.showChildProduct).toBeTrue();
  });

  it('onProductSelectionChanged should update productList', () => {
    // arrange
    const expectedProductList = [
      { id: 1 } as Product,
      { id: 2 } as Product,
      { id: 3 } as Product,
      { id: 4 } as Product,
    ];
    component.productList = [
      { id: 1 } as Product,
      { id: 2 } as Product,
      { id: 3 } as Product,
    ];
    const expectedOrderLines = [
      { productVersionId: 1 } as OrderLine,
      { productVersionId: 2 } as OrderLine,
      { productVersionId: 3 } as OrderLine,
      { productVersionId: 4 } as OrderLine,
    ];
    component.orderLines = [
      { productVersionId: 1 } as OrderLine,
      { productVersionId: 2 } as OrderLine,
      { productVersionId: 3 } as OrderLine,
    ];
    // act
    component.onProductSelectionChanged({
      estimatedTotal: 4,
      disableProductSelectionNext: false,
      productSelectionErrorMessages: [],
      productList: expectedProductList,
      orderLines: expectedOrderLines,
    });

    // assert
    expect(component.productList.length).toEqual(expectedProductList.length);
  });

  describe('ManualProductSelectionClicked', () => {
    it('should change state and set current product for edit', () => {
      // arrange
      const expectedProduct = { id: 1 } as any;
      component.productList = [expectedProduct];
      // act
      component.onManualProductSelectionClicked(1);

      // assert
      expect(component.selectProductEditMode).toBeTrue();
      expect(component.currentProduct).toBe(expectedProduct);
      expect(component.orderDetailsState).toBe(
        EditOrderDetailsEnum.SelectProductManually
      );
    });

    it('should change state', () => {
      // act
      component.onManualProductSelectionClicked(0);

      // assert
      expect(component.selectProductEditMode).toBeFalse();
      expect(component.orderDetailsState).toBe(
        EditOrderDetailsEnum.SelectProductManually
      );
    });
  });

  it('onManualSelectProductCancelled should return to selected product list screen', () => {
    // act
    component.onManualSelectProductCancelled();

    // assert
    expect(component.orderDetailsState).toBe(
      EditOrderDetailsEnum.SelectedProductList
    );
  });

  describe('onManualSelectProductConfirmed', () => {
    beforeEach(() => {
      component.productList = [
        { id: 2, name: 'Product2' } as any,
        { id: 3, name: 'Product3' } as any,
      ];
    });

    it('should replace the product on product list', () => {
      // arrange
      component.selectProductEditMode = true;
      const expectedProductList = [
        {
          id: 2,
          name: 'NewProduct',
        } as any,
        {
          id: 3,
          name: 'Product3' as any,
        },
      ];

      // act
      component.onManualSelectProductConfirmed({
        id: 2,
        name: 'NewProduct',
      } as any);

      // assert
      expect(component.productList).toEqual(expectedProductList);
      expect(component.isProductListDirty).toBeTrue();
      expect(component.orderDetailsState).toBe(
        EditOrderDetailsEnum.SelectedProductList
      );
    });

    it('and replace the product on product list if it has the same id', () => {
      // arrange
      component.selectProductEditMode = false;
      const expectedProductList = [
        {
          id: 2,
          name: 'NewProduct',
        } as any,
        {
          id: 3,
          name: 'Product3' as any,
        },
      ];

      // act
      component.onManualSelectProductConfirmed({
        id: 2,
        name: 'NewProduct',
      } as any);

      // assert
      expect(component.productList).toEqual(expectedProductList);
      expect(component.isProductListDirty).toBeTrue();
      expect(component.orderDetailsState).toBe(
        EditOrderDetailsEnum.SelectedProductList
      );
    });
  });

  it('onDirectDeliveryDetailsClicked', () => {
    // arrange
    const expectedProduct = {
      id: 2,
      name: 'NewProduct',
    } as any;
    // act
    component.onDirectDeliveryDetailsClicked(expectedProduct);

    // assert
    expect(component.selectedProduct).toBe(expectedProduct);
    expect(component.orderDetailsState).toBe(
      EditOrderDetailsEnum.ViewDirectDeliveryDetails
    );
  });

  it('onSyncClicked should open SyncStatusHistoryComponent modal', () => {
    // arrange
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve({}),
      componentInstance: {},
    });

    // act
    component.onSyncClicked(1);

    // assert
    expect(modalSvcSpy.open).toHaveBeenCalledWith(SyncStatusHistoryComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
  });

  describe('submitOrder', () => {
    beforeEach(() => {
      // arrange
      component.orderId = 1;
      orderSvcSpy.updateOrderStatus.and.returnValue(
        of({ status: true, message: '', data: {} })
      );
    });
    it('should navigate to publishing when order status is failed', () => {
      // act
      component.submitOrder(OrderStatusEnum.Failed);
      // assert
      expect(orderSvcSpy.updateOrderStatus).toHaveBeenCalledWith({
        id: component.orderId,
        statusId: OrderStatusEnum.Publishing,
      });
    });
    it('should navigate to approved when order status is under review', () => {
      // act
      component.submitOrder(OrderStatusEnum.UnderReview);
      // assert
      expect(orderSvcSpy.updateOrderStatus).toHaveBeenCalledWith({
        id: component.orderId,
        statusId: OrderStatusEnum.Approved,
      });
    });
    it('should navigate to approved by ft when order status is approved', () => {
      // act
      component.submitOrder(OrderStatusEnum.Approved);
      // assert
      expect(orderSvcSpy.updateOrderStatus).toHaveBeenCalledWith({
        id: component.orderId,
        statusId: OrderStatusEnum.ApprovedByFT,
      });
    });
    it('should default navigate under review', () => {
      // act
      component.submitOrder(OrderStatusEnum.Created);
      // assert
      expect(orderSvcSpy.updateOrderStatus).toHaveBeenCalledWith({
        id: component.orderId,
        statusId: OrderStatusEnum.UnderReview,
      });
    });
  });

  describe('closeOrder should open close order modal', () => {
    beforeEach(() => {
      // arrange
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve({}),
        componentInstance: {},
        dismissed: of(true),
      });
      orderSvcSpy.getReason.and.returnValue({ reason: '' });
    });

    it('on default will pass close status', fakeAsync(() => {
      // act
      component.closeOrder();
      tick();

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalledWith(CloseOrderModalComponent, {
        size: 'md',
        backdrop: 'static',
        centered: true,
      });
    }));
    it('and on reject status', fakeAsync(() => {
      // arrange
      orderSvcSpy.getReason.and.returnValue({ reason: null });

      // act
      component.closeOrder(CloseModalEnum.Reject);
      tick();

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalledWith(CloseOrderModalComponent, {
        size: 'md',
        backdrop: 'static',
        centered: true,
      });
    }));
  });

  describe('sendFile', () => {
    beforeEach(() => {
      // arrange
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve({}),
        componentInstance: {},
        dismissed: of(true),
      });
    });

    it('should open send file modal', () => {
      // act
      component.sendFile();

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalledWith(SendFileComponent, {
        size: 'md',
        backdrop: 'static',
        centered: true,
      });
    });

    it('should alert no email for send', () => {
      // arrange
      component.qaToolsFormGroup.get('noEmailForSend')?.setValue(true);

      // act
      component.sendFile();

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalledWith(
        ConfirmationModalComponent,
        {
          size: 'md',
          backdrop: 'static',
          centered: true,
          windowClass: 'confirmation-modal',
        }
      );
    });
  });

  it('downloadExcelFile should open download excel file modal', () => {
    // arrange
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve({}),
      componentInstance: {},
      dismissed: of(true),
    });

    // act
    component.downloadExcelFile();

    // assert
    expect(modalSvcSpy.open).toHaveBeenCalledWith(DownloadExcelFileComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
  });

  it('openHistoryModal should open history modal', () => {
    // arrange
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve({}),
      componentInstance: {},
      dismissed: of(true),
    });

    // act
    component.openHistoryModal();

    // assert
    expect(modalSvcSpy.open).toHaveBeenCalledWith(OrderHistoryComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
  });

  it('onEditDeliveryDetailsClicked should navigate to edit delivery content', () => {
    // act
    component.onEditDeliveryDetailsClicked();

    // assert
    expect(component.orderDetailsState).toBe(
      EditOrderDetailsEnum.EditDeliveryContent
    );
  });

  it('onGoBackToOrderDetails should navigate back to dfault delivery content', () => {
    // act
    component.onGoBackToOrderDetails({
      orderTemplateId: 0,
      productVersionId: 0,
    });

    // assert
    expect(component.orderDetailsState).toBe(
      EditOrderDetailsEnum.DefaultDeliveryContent
    );
  });

  // for coverage
  it('dropdownItems when click should call on export', () => {
    // arrange
    const onExportSpy = spyOn(component, 'onExport');
    const templateItem = component.dropdownItems.find(
      (dropdownItem) => dropdownItem.value === TemplateTypeEnum.Email
    );
    const smsItem = component.dropdownItems.find(
      (dropdownItem) => dropdownItem.value === TemplateTypeEnum.SMS
    );

    // act
    templateItem?.action();
    smsItem?.action();

    // assert
    expect(onExportSpy).toHaveBeenCalled();
  });

  it('smsTableModel should return a table model', () => {
    // arrange
    const expectedTableModel = {
      tableHeaders: component.distributionTableHeaders,
      tableRows: component.smsTableRows,
    };

    // act
    const result = component.smsTableModel;

    // assert
    expect(result).toEqual(expectedTableModel);
  });

  it('emailTableModel should return a table model', () => {
    // arrange
    const expectedTableModel = {
      tableHeaders: component.distributionTableHeaders,
      tableRows: component.emailTableRows,
    };

    // act
    const result = component.emailTableModel;

    // assert
    expect(result).toEqual(expectedTableModel);
  });

  it('productSelectionTableModel should return a table model', () => {
    // arrange
    const expectedTableModel = new ProductSelectionTableDefinition(
      component.selectedOrderMode
    ).define();

    // act
    const result = component.productSelectionTableModel;

    // assert
    expect(result).toEqual(expectedTableModel);
  });

  it('userRoleEnum should return UserRoleEnum', () => {
    // act
    const result = component.userRoleEnum;

    // assert
    expect(result).toBe(OrderOperationsEnum);
  });

  it('closeModalEnum should return CloseModalEnum ', () => {
    // act
    const result = component.closeModalEnum;

    // assert
    expect(result).toBe(CloseModalEnum);
  });

  it('memoFormModel should define without takeAllRow', () => {
    // arrange
    component.orderDetailsState = EditOrderDetailsEnum.BasicInfo;

    // act
    const result = component.memoFormModel;

    // assert
    expect(result.fieldsDefinition).toEqual(
      component.memoFieldsDefinition.define()
    );
  });

  describe('getNDaysFromPublishDate', () => {
    it('should return -- if invalid', () => {
      // arrange
      component.basicInfoFormGroup.get('activationType')?.setValue(10);

      // act
      const result = component.getNdaysFromPublishDate();

      // assert
      expect(result).toBe('--');
    });
    it('should return correct form if valid', () => {
      // arrange
      component.basicInfoFormGroup.get('activationType')?.setValue(2);
      component.basicInfoFormGroup.get('afterPublished')?.setValue(2);

      // act
      const result = component.getNdaysFromPublishDate();

      // assert
      expect(result).toBe('2 days from publish date');
    });
  });

  it('getComputedActivatedDate should return correct value', () => {
    // arrange
    const newDate = new Date();
    component.basicInfoFormGroup.get('publishDate')?.setValue({ _d: newDate });
    component.basicInfoFormGroup.get('activationType')?.setValue(2);
    component.basicInfoFormGroup.get('afterPublished')?.setValue(2);

    // act
    const result = component.getComputedActivatedDate();

    // assert
    expect(result).not.toEqual('NA');
  });

  describe('showEditBtn', () => {
    it('should return false for approver, creator and not order creator', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(false);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'else';

      // act
      const result = component.showEditBtn;

      // assert
      expect(result).toBeFalse();
    });

    it('should return true for approver, creator and order creator', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(true);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'else';

      // act
      const result = component.showEditBtn;

      // assert
      expect(result).toBeTrue();
    });
  });

  describe('showCloseOrderBtn', () => {
    it('should return false for approver, creator and not order creator', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(false);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';

      // act
      const result = component.showCloseOrderBtn;

      // assert
      expect(result).toBeFalse();
    });

    describe('should return orderStatus when creator', () => {
      beforeEach(() => {
        // arrange
        authSvcSpy.getElementOperationFlag.and.returnValue(true);
        authSvcSpy.userName = 'me';
        component.order.createdBy = 'me';
      });

      it('when status is Created', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.Created;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('when status is Approved', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.Approved;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('when status is ApprovedByFT ', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.ApprovedByFT;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('when status is Rejected', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.Rejected;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('when status is Failed', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.Failed;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });
    });

    describe('should return orderStatus when order creator', () => {
      beforeEach(() => {
        // arrange
        authSvcSpy.getElementOperationFlag.and.returnValue(true);
        authSvcSpy.userName = 'me';
        component.order.createdBy = 'me';
      });

      it('when status is Created', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.Created;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('when status is Approved', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.Approved;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('when status is ApprovedByFT ', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.ApprovedByFT;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('when status is Rejected', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.Rejected;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('when status is Failed', () => {
        // arrange
        component.orderStatus = OrderStatusEnum.Failed;

        // act
        const result = component.showCloseOrderBtn;

        // assert
        expect(result).toBeTruthy();
      });
    });

    it('should return false when approver and not order creator', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(false);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';

      // act
      const result = component.showCloseOrderBtn;

      // assert
      expect(result).toBeFalse();
    });
  });

  describe('showRejectBtn', () => {
    it('should shown when not order creator, have approver role and order status is under review', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(true);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';
      component.orderStatus = OrderStatusEnum.UnderReview;

      // act
      const result = component.showRejectBtn;

      // assert
      expect(result).toBeTruthy();
    });
    it('should shown when not order creator, have signer role and order status is approved and have advancebilling', fakeAsync(() => {
      // arrange
      quotationSvcSpy.getQuotationById.and.returnValue(
        of({
          success: true,
          message: '',
          data: { quotationItemList: [{ advanceBilling: true }] },
        })
      );
      component.ngOnInit();
      authSvcSpy.getElementOperationFlag.and.returnValue(true);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';
      component.orderStatus = OrderStatusEnum.Approved;
      // act
      const result = component.showRejectBtn;
      // assert
      expect(result).toBeTruthy();
    }));
  });

  describe('showApproveBtn', () => {
    it('should return truthy when have approver role and status UnderReview', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(true);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';
      component.orderStatus = OrderStatusEnum.UnderReview;

      // act
      const result = component.showApproveBtn;

      // assert
      expect(result).toBeTruthy();
    });
    it('should return false when have approver role and status Approved', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(false);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';
      component.orderStatus = OrderStatusEnum.Approved;

      // act
      const result = component.showApproveBtn;

      // assert
      expect(result).toBe(false);
    });
    it('should return truthy when have signer role and status Approved and advance billing is true', fakeAsync(() => {
      // arrange
      quotationSvcSpy.getQuotationById.and.returnValue(
        of({
          success: true,
          message: '',
          data: { quotationItemList: [{ advanceBilling: true }] },
        })
      );
      component.ngOnInit();
      tick();
      authSvcSpy.getElementOperationFlag.and.returnValue(true);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';
      component.orderStatus = OrderStatusEnum.Approved;
      // act
      const result = component.showApproveBtn;
      // assert
      expect(result).toBeTruthy();
    }));
  });

  describe('showSubmitBtn', () => {
    describe('should shown when do not have approver role', () => {
      it('and order status is Created', () => {
        // arrange
        authSvcSpy.getElementOperationFlag.and.returnValue(true);
        authSvcSpy.userName = 'me';
        component.order.createdBy = 'me';
        component.orderStatus = OrderStatusEnum.Created;

        // act
        const result = component.showSubmitBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('and order status is Failed ', () => {
        // arrange
        authSvcSpy.getElementOperationFlag.and.returnValue(true);
        authSvcSpy.userName = 'me';
        component.order.createdBy = 'me';
        component.orderStatus = OrderStatusEnum.Failed;

        // act
        const result = component.showSubmitBtn;

        // assert
        expect(result).toBeTruthy();
      });

      it('and order status is Rejected', () => {
        // arrange
        authSvcSpy.getElementOperationFlag.and.returnValue(true);
        authSvcSpy.userName = 'me';
        component.order.createdBy = 'me';
        component.orderStatus = OrderStatusEnum.Rejected;

        // act
        const result = component.showSubmitBtn;

        // assert
        expect(result).toBeTruthy();
      });
    });
  });

  describe('showPlaceholderBtn', () => {
    it('should return truthy when have approver role and not order creator', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(true);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';
      component.orderStatus = OrderStatusEnum.Approved;

      // act
      const result = component.showPlaceholderBtn;

      // assert
      expect(result).toBeTruthy();
    });
  });

  describe('showTrustAccountActionBtn', () => {
    it('should return true when order status is Created', () => {
      // arrange
      component.orderStatus = component.orderStatuses.Created;

      // act
      const result = component.showTrustAccountActionBtn;

      // assert
      expect(result).toBeTruthy();
    });

    it('should return true when order status is Rejected and user is not an approver and not the order creator', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(false);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';
      component.orderStatus = component.orderStatuses.Rejected;

      // act
      const result = component.showTrustAccountActionBtn;
      // assert
      expect(result).toBeTruthy();
    });

    it('should return false when order status is Rejected and user is an approver and not the order creator', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(true);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'others';
      component.orderStatus = component.orderStatuses.Rejected;

      // act
      const result = component.showTrustAccountActionBtn;

      // assert
      expect(result).toBe(false);
    });

    it('should return true when order status is Rejected and user is the order creator', () => {
      // arrange
      authSvcSpy.getElementOperationFlag.and.returnValue(true);
      authSvcSpy.userName = 'me';
      component.order.createdBy = 'me';
      component.orderStatus = component.orderStatuses.Rejected;

      // act
      const result = component.showTrustAccountActionBtn;

      // assert
      expect(result).toBeTruthy();
    });

    it('should fetch and update product list on modal dismissal', () => {
      // arrange
      productSvcSpy.openProductSelectionModal.and.returnValue({
        result: Promise.resolve(),
        componentInstance: {},
        dismissed: of({ productList: mockProductList }),
      });
      const assignSelectedProductsSummaryValuesSpy = spyOn(
        component,
        'assignSelectedProductsSummaryValues'
      );

      // act
      component.selectProductOnPublishedApi();

      // assert
      expect(assignSelectedProductsSummaryValuesSpy).toHaveBeenCalled();
      expect(component.productList.length).not.toEqual(0);
    });

    it('should set all products to active onActiveAllClicked()', () => {
      // arrange
      component.productList = mockProductList;

      // act
      component.onActiveAllClicked();
      const expected = component.productList.every(
        (product) => product.isActive
      );

      // assert
      expect(expected).toBeTrue();
    });

    it('should call updateOrderLineStatus when status is toggle', () => {
      // arrange
      component.orderId = 1;

      // act
      component.onStatusChanged({ orderLineId: 1, status: 1 });

      // assert
      expect(orderSvcSpy.updateOrderLineStatus).toHaveBeenCalled();
    });

    it('should call updateOrderLineStatus when status is toggle and there is an error', () => {
      // arrange
      orderSvcSpy.updateOrderLineStatus.and.returnValue(
        of({ data: {}, message: '', success: false })
      );
      component.orderId = 1;

      // act
      component.onStatusChanged({ orderLineId: 1, status: 1 });

      // assert
      expect(orderSvcSpy.updateOrderLineStatus).toHaveBeenCalled();
    });
  });

  describe('attachment related', () => {
    describe('fileEvent()', () => {
      const fileEvent: FileEvent = {
        customFiles: [new File([], 'test.xls')],
        eventType: FileEventTypeEnum.UPLOAD,
        index: 0,
      };

      it('should call downloadAttachment on fileEvent', () => {
        // arrange
        fileEvent.eventType = FileEventTypeEnum.DOWNLOAD;
        const spy = spyOn(component, 'downloadAttachment');

        // act
        component.fileEvent(fileEvent);

        // assert
        expect(spy).toHaveBeenCalled();
      });
      it('should call deleteAttachments on fileEvent', () => {
        // arrange
        fileEvent.eventType = FileEventTypeEnum.DELETE;
        const spy = spyOn(component, 'deleteAttachments');

        // act
        component.fileEvent(fileEvent);

        // assert
        expect(spy).toHaveBeenCalled();
      });
      it('should not call deleteAttachments on fileEvent', () => {
        // arrange
        fileEvent.eventType = FileEventTypeEnum.DELETE;
        const spy = spyOn(component, 'deleteAttachments');
        component.deletedAttachments = [];

        // act
        component.fileEvent(fileEvent, true);

        // assert
        expect(spy).not.toHaveBeenCalled();
      });
      it('should not call uploadAttachment on fileEvent', () => {
        // arrange
        fileEvent.eventType = FileEventTypeEnum.UPLOAD;
        const spy = spyOn(component, 'uploadAttachment');

        // act
        component.fileEvent(fileEvent, true);

        // assert
        expect(spy).not.toHaveBeenCalled();
      });
      it('should call uploadAttachment on fileEvent', () => {
        // arrange
        const spy = spyOn(component, 'uploadAttachment');
        fileEvent.eventType = FileEventTypeEnum.UPLOAD;

        // act
        component.fileEvent(fileEvent, false);

        // assert
        expect(spy).toHaveBeenCalled();
      });
      it('should break on default on fileEvent', () => {
        // arrange
        fileEvent.eventType = 'invalid' as FileEventTypeEnum;
        const spy = spyOn(component, 'uploadAttachment');

        // act
        component.fileEvent(fileEvent);

        // assert
        expect(spy).not.toHaveBeenCalled();
      });
    });

    it('should download attachment on downloadAttachment()', () => {
      // arrange
      const saveAsSpy = spyOn(saveAs, 'saveAs');

      // act
      component.downloadAttachment(new File([], 'test.xls'));

      // assert
      expect(saveAsSpy).toHaveBeenCalled();
    });

    it('should call getAttachments on uploadAttachments()', () => {
      // arrange
      const files = [new File([], 'test3.xlsx')];
      const getAttachhmentsSpy = spyOn(component, 'getAttachments');

      // act
      component.uploadAttachment(files);

      // assert
      expect(getAttachhmentsSpy).toHaveBeenCalled();
    });

    it('should delete attachment on deleteAttachments()', () => {
      // arrange
      const fileEvent: FileEvent = {
        customFiles: [new File([], 'test.xls')],
        eventType: FileEventTypeEnum.DELETE,
        index: 0,
      };
      const expected = 1;
      component.attachments?.setValue([
        new File([], 'test.xls'),
        new File([], 'test2.xls'),
      ]);

      // act
      component.deleteAttachments([fileEvent]);

      // assert
      expect(component.attachments?.value.length).toEqual(expected);
    });
  });

  describe('checkForChildProducts() method', () => {
    const event = true;
    const MOCK_CHILD_PRODUCT = [
      {
        masterProductCode: 'RubySCV1000',
        childProductDetail: [
          {
            productCode: 'RubyValueBased_50',
            productName: 'RubyValueBased_50',
            expiryDate: '2025-10-12T23:59:59Z',
            expirySchemeText: 'FixEndOfDay',
          },
        ],
      },
    ];
    beforeEach(() => {
      component.productList = [
        {
          id: 1,
          remainingQuantity: 9,
          voucherQuantity: 10,
          isMaster: true,
          productCode: 'TW_Sync_121',
        } as any,
      ];
    });

    it('should call childProductInQuotation api and response success', fakeAsync(() => {
      // arrange
      quotationSvcSpy.childProductInQuotation.and.returnValue(
        of({
          success: true,
          message: '',
          data: { getChildProductInQuotation: MOCK_CHILD_PRODUCT },
        })
      );
      // act
      component.checkForChildProducts(event);
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
      component.checkForChildProducts(event);
      tick();
      // assert
      expect(toastSpy.showDanger).toBeDefined();
    }));
  });
});
