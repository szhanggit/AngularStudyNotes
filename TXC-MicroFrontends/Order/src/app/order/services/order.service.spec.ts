import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { OrderService } from './order.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrderBasicInfoFieldsDefinition } from 'src/app/shared/models/fields-definition/order-basic-info-fields-definition.model';
import { OrderSettingsFieldsDefinition } from 'src/app/shared/models/fields-definition/order-settings-fields-definition.model';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { of } from 'rxjs';
import { OrderLine } from 'src/app/shared/models/product.model';
import { OrderModeEnum } from '../enums/order-mode.enum';
import { MsgEncodingType } from 'src/app/shared/enums/msg-encoding-type.enum';
import { ProductTemplateStateService } from './state-service/product-template-state.service';

describe('OrderService', () => {
  let httpPostSpy: jasmine.Spy;
  let httpPutSpy: jasmine.Spy;
  let httpPatchSpy: jasmine.Spy;
  let httpGetSpy: jasmine.Spy;
  const authLibrarySpy = jasmine.createSpyObj('AuthLibrary', ['getAMMHeaders']);
  const productTemplateStateServiceSpy = jasmine.createSpyObj(
    'ProductTemplateStateService',
    [],
    {
      productTemplateList: [
        {
          productVersionId: 1,
          voucherTemplate: {
            productTemplateVersion: [
              {
                templateVersionId: 1,
                templateTagValue: [
                  {
                    tagId: 1,
                    value: 'test',
                  },
                ],
              },
            ],
            type: 1,
            subType: 1,
          },
          smsTemplate: {
            productTemplateVersion: [
              {
                templateVersionId: 1,
                templateTagValue: [
                  {
                    tagId: 1,
                    value: 'test',
                  },
                ],
              },
            ],
            type: 1,
            subType: 1,
          },
        },
      ],
    }
  );
  let basicInfoFormGroup: FormGroup;
  let settingsFormGroup: FormGroup;

  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrderService,
        FormBuilder,
        {
          provide: AuthorizationLibraryService,
          useValue: authLibrarySpy,
        },
        {
          provide: ProductTemplateStateService,
          useValue: productTemplateStateServiceSpy,
        },
      ],
      teardown: { destroyAfterEach: false },
    });

    authLibrarySpy.getAMMHeaders.and.returnValue({
      delete: () => {
        return;
      },
    });
    service = TestBed.inject(OrderService);
    httpPostSpy = spyOn(TestBed.inject(HttpClient), 'post');
    httpPutSpy = spyOn(TestBed.inject(HttpClient), 'put');
    httpPatchSpy = spyOn(TestBed.inject(HttpClient), 'patch');
    httpGetSpy = spyOn(TestBed.inject(HttpClient), 'get');
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    basicInfoFormGroup = fb.group({
      orderName: '',
      publishDate: '',
      hasNoTargetPublishDate: '',
      activationType: '',
      activationDate: '',
      afterPublished: '',
    });

    settingsFormGroup = fb.group({
      excelFormat: '',
      excelShortUrl: '',
      barcodeInfo: '',
      emailAttachment: '',
      shortUrlAuthCodeGenerationWay: '',
      generateSequenceNumber: '',
      channelId: '',
    });
  }));

  it('should create', () => {
    // assert
    expect(service).toBeTruthy();
  });

  describe('createOrder()', () => {
    it('should call http post', () => {
      // arrange
      httpPostSpy.and.returnValue(of({}));
      const selectedQuotation = { quotationNumber: '123' } as any;
      const orderMode = { key: OrderModeEnum.DirectNonAPI } as any;
      const basicInfoFormModel = {
        formGroup: basicInfoFormGroup,
        fieldsDefinition: new OrderBasicInfoFieldsDefinition().define(),
      };
      const settingsFormModel = {
        formGroup: settingsFormGroup,
        fieldsDefinition: new OrderSettingsFieldsDefinition().define(),
      };
      const orderLines: OrderLine[] = [
        {
          productVersionId: 1,
          expirationPolicyId: 1,
          expiryDate: '2023-08-23',
          totalQuantity: 10,
          voucherReservationCode: 'ABCD',
          clientOrderNo: '1234',
          needShortUrl: false,
          dfvProductDetails: [
            {
              faceValueWithTax: 10,
              voucherQuantity: 1,
            },
          ],
          needTrustAccount: false,
          emailQuantity: 0,
          smsQuantity: 0,
          orderLineDetails: [
            {
              beneficiaryName: 'test',
              email: 'test@ge',
              mobile: '09',
              faceValue: 12,
              voucherQuantity: 10,
              edOrderNo: '12345',
              postCode: '1111',
              address: 'test st.',
              language: 'es',
              activeDate: '12/12/2025',
              expiryDate: '12/12/2024',
              expirySchemeId: 1,
              memo: '',
            },
          ],
          trustAccount: {
            trustAccountId: 121,
            trustAccountFee: 10,
            trustAccountBatchNumber: '',
            trustAccountOptionId: 111,
            trustAmount: 100,
            trustExpirySchemeId: 10010,
            trustExpiryDate: '',
            trustExpiryDateType: 2,
          },
        },
      ];
      const deliveryDetails = {
        emailTemplate: 1,
        emailSubject: 'Hello',
        emailGreeting: 'Hello World',
        smsGreeting: 'Hi',
        msgEncoding: MsgEncodingType.Big5,
      } as any;

      // act
      service.createOrder(
        selectedQuotation,
        orderMode,
        basicInfoFormModel,
        { attachments: [] },
        settingsFormModel,
        { memo: '' },
        orderLines,
        deliveryDetails
      );

      //
      expect(httpPostSpy).toHaveBeenCalled();
    });
  });

  it('getOrderById should call http post', () => {
    // arrange
    const mockOrders = {
      orders: {
        items: [
          {
            id: 1,
            orderName: 'Test',
          },
        ],
      },
    };
    httpPostSpy.and.returnValue(
      of({
        data: JSON.stringify(mockOrders),
        success: true,
      })
    );

    // act
    service.getOrderById(1).subscribe((actualOrder) => {
      // assert
      expect(actualOrder).toEqual(mockOrders.orders.items[0]);
    });

    // assert
    expect(httpPostSpy).toHaveBeenCalled();
  });

  it('getOrderRemainingQuantity should call http post', () => {
    // arrange
    const mockOrderQuotationServedQuantities = {
      orderQuotationServedQuantities: {
        items: [
          {
            productVersionId: 1,
            remainingQuantity: 268,
          },
        ],
      },
    };
    httpPostSpy.and.returnValue(
      of({
        data: JSON.stringify(mockOrderQuotationServedQuantities),
        success: true,
      })
    );

    // act
    service
      .getOrderRemainingQuantity(1)
      .subscribe((actualOrderServedQuantities) => {
        // assert
        expect(actualOrderServedQuantities).toEqual(
          mockOrderQuotationServedQuantities.orderQuotationServedQuantities
            .items
        );
      });

    // assert
    expect(httpPostSpy).toHaveBeenCalled();
  });

  describe('updateDefDelContent()', () => {
    it('should http put', () => {
      // arrange
      const orderId = 1;
      const deliveryDetails = {
        emailTemplate: 'testing',
        emailSubject: 'testing',
        emailGreeting: 'testing',
        msgEncoding: '1',
        smsGreeting: 'testing',
      };

      // act
      service.updateDefDelContent(orderId, deliveryDetails);

      // assert
      expect(httpPutSpy).toHaveBeenCalled();
    });
  });

  describe('updateOrderLineTemplate()', () => {
    it('should call http put', () => {
      // arrange
      productTemplateStateServiceSpy.productTemplateList = [
        {
          productVersionId: 1,
          voucherTemplate: {
            type: 1,
            subType: 1,
            productTemplateVersion: [
              {
                templateVersionId: 1,
                templateTagValue: [
                  {
                    tagId: 1,
                    tagValue: 'test',
                  },
                ],
              },
            ],
          },
          smsTemplate: {
            type: 2,
            subType: 2,
            productTemplateVersion: [
              {
                templateVersionId: 2,
                templateTagValue: [
                  {
                    tagId: 2,
                    tagValue: 'test',
                  },
                ],
              },
            ],
          },
        },
      ];

      // act
      service.updateOrderLineTemplate(1, 1);

      // assert
      expect(httpPutSpy).toHaveBeenCalled();
    });
  });

  describe('order details api', () => {
    it('getOrderLineDetail should call httpGet ', () => {
      // act
      service.getOrderLineDetail(1, 1);

      // assert
      expect(httpGetSpy).toHaveBeenCalled();
    });

    it('updateOrderStatus should call httpPatch ', () => {
      // act
      service.updateOrderStatus({ id: 1, statusId: 2 });

      // assert
      expect(httpPatchSpy).toHaveBeenCalled();
    });

    it('updateOrderLineStatus should call httpPut ', () => {
      // act
      service.updateOrderLineStatus(1, [1], 1);

      // assert
      expect(httpPutSpy).toHaveBeenCalled();
    });

    it('updateOrderBasicInfo should call httpPut ', () => {
      // act
      service.updateOrderBasicInfo(1, 'test');

      // assert
      expect(httpPutSpy).toHaveBeenCalled();
    });

    it('batchUpdateOrderLine should call httpPut ', () => {
      // arrange
      const orderLine = [
        {
          productVersionId: 1,
          expirationPolicyId: 1,
          expiryDate: 1,
          totalQuantity: 10,
          voucherReservationCode: '',
          clientOrderNo: '',
          needShortUrl: true,
          needTrustAccount: false,
          orderLineDetails: [
            {
              voucherQuantity: 10,
              faceValue: 10,
              expirySchemeId: 1,
            },
          ],
          dfvProductDetails: [
            {
              faceValueWithTax: 10,
              voucherQuantity: 10
            }
          ]
        },
      ] as unknown as OrderLine[];

      // act
      service.batchUpdateOrderLine(1, orderLine, false);

      // assert
      expect(httpPutSpy).toHaveBeenCalled();
    });
  });
});
