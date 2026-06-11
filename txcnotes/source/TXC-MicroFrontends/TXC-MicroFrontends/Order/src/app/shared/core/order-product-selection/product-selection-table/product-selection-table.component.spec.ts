import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ProductSelectionTableComponent } from './product-selection-table.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { TrustAccountModalComponent } from '../trust-account-modal/trust-account-modal.component';
import { Product } from 'src/app/shared/models/product.model';
import { TemplateService } from 'src/app/order/services/template.service';
import { TemplateTypeEnum } from 'src/app/shared/enums/template.enum';
import { ProductTemplateStateService } from 'src/app/order/services/state-service/product-template-state.service';
import { Template } from 'src/app/shared/models/template.model';
import { FormControl, FormGroup } from '@angular/forms';

describe('ProductSelectionTableComponent', () => {
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);
  const templateSvcSpy = jasmine.createSpyObj('TemplateService', [
    'getTemplateFullDetails',
    'getProductTemplate',
    'templatePreviewWithTabs',
    'getTemplateByVersionIds',
  ]);
  const templateStateSvcSpy = jasmine.createSpyObj(
    'ProductTemplateStateService',
    ['setProductTemplatesByProductVersionId'],
    {
      productTemplates$: of({
        productTemplates: [
          {
            productVersionId: 1,
            voucherTemplate: {
              defaultTemplateVersion: {
                templateId: 1,
                type: 1,
                subType: 1,
                templateTags: [
                  {
                    tagId: 1,
                    displayName: 'emailsubject',
                  },
                  {
                    tagId: 2,
                    displayName: 'greetings',
                  },
                ],
                templateTagValue: [
                  {
                    tagId: 1,
                    value: '',
                  },
                  {
                    tagId: 2,
                    value: '',
                  },
                ],
              },
            },
            smsTemplate: {
              defaultTemplateVersion: {
                templateId: 1,
                type: 1,
                subType: 1,
                templateTags: [
                  {
                    tagId: 1,
                    displayName: 'smsgreetings',
                  },
                ],
                templateTagValue: [
                  {
                    tagId: 1,
                    value: '',
                  },
                ],
              },
            },
          },
        ],
      }),
      productTemplateList: [],
    }
  );

  let component: ProductSelectionTableComponent;
  let fixture: ComponentFixture<ProductSelectionTableComponent>;
  let templateStateSvc: ProductTemplateStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductSelectionTableComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
        {
          provide: TemplateService,
          useValue: templateSvcSpy,
        },
        {
          provide: ProductTemplateStateService,
          useValue: templateStateSvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const tenant = {
      tenantId: 7,
      name: 'TW',
    };
    localStorage.setItem('tenant', JSON.stringify(tenant));

    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve('confirm'),
      dismissed: of(true),
      componentInstance: {},
    });

    templateSvcSpy.getProductTemplate.and.returnValue(
      of({
        data: {
          productTemplate: [
            {
              templateId: 1,
              templateVersionId: 1,
              defaultLanguageId: 1,
              languageId: 1,
            },
          ],
        },
        success: true,
      })
    );
    templateSvcSpy.getTemplateFullDetails.and.returnValue(
      of({
        templateId: 1,
        templateVersionId: 1,
      })
    );
    templateStateSvcSpy.setProductTemplatesByProductVersionId.and.returnValue(
      of({})
    );

    fixture = TestBed.createComponent(ProductSelectionTableComponent);
    component = fixture.componentInstance;
    component.tableModel = {
      tableHeaders: [],
      tableRows: [],
    };
    component.deliveryDetailsFormGroup = new FormGroup({
      emailSubject: new FormControl('test'),
      emailGreeting: new FormControl('test'),
      smsGreeting: new FormControl('test'),
    });
    fixture.detectChanges();
    templateStateSvc = TestBed.inject(ProductTemplateStateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getProductDfvProps()', () => {
    it('should return dfvQuantity', () => {
      // act
      const actualProperty = component.getProductDfvProps({ dfvQuantity: {} });

      // assert
      expect(actualProperty).toEqual({});
    });

    xit('should return directDeliveryDetails', () => {
      // act
      const actualProperty = component.getProductDfvProps(
        { directDeliveryDetails: {} },
        OrderModeEnum.DirectNonAPI
      );

      // assert
      expect(actualProperty).toEqual({});
    });
  });

  describe('onProductEditClicked()', () => {
    it('should call manualSelectProductClicked', () => {
      // arrange
      component.productList = [{ parentCode: 1 } as any];
      const productEditClicked = spyOn(component.productEditClicked, 'emit');

      // act
      component.onProductEditClick(1);

      // assert
      expect(productEditClicked).toHaveBeenCalled();
    });
  });

  describe('onEditDeliveryDetailsClicked()', () => {
    it('should call editDeliveryDetailsClicked', fakeAsync(() => {
      // arrange
      component.productList = [{ parentCode: 1 } as any];
      const editDeliveryDetailsClicked = spyOn(
        component.editDeliveryDetailsClicked,
        'emit'
      );

      // act
      component.onEditDeliveryDetailsClicked(
        { id: 1 } as Product,
        {
          preventDefault: () => {
            return;
          },
        } as any
      );
      tick(5);

      // assert
      expect(editDeliveryDetailsClicked).toHaveBeenCalled();
    }));

    it('should call editDeliveryDetailsClicked with existing product', fakeAsync(() => {
      // arrange
      component.productList = [{ parentCode: 1 } as any];
      const editDeliveryDetailsClicked = spyOn(
        component.editDeliveryDetailsClicked,
        'emit'
      );
      templateStateSvc.productTemplateList = [
        {
          productVersionId: 1,
          voucherTemplate: null,
          tempVoucherTemplate: null,
          smsTemplate: null,
          tempSmsTemplate: null,
        },
      ];

      // act
      component.onEditDeliveryDetailsClicked(
        { id: 1, productVersionId: 1 } as Product,
        {
          preventDefault: () => {
            return;
          },
        } as any
      );
      tick(5);

      // assert
      expect(editDeliveryDetailsClicked).toHaveBeenCalled();
    }));

    it('should call editDeliveryDetailsClicked on edit', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateByVersionIds.and.returnValue(
        of([
          {
            templateId: 1,
            templateVersionId: 1,
          },
        ])
      );
      component.productList = [{ parentCode: 1, isEditMode: true } as any];
      const editDeliveryDetailsClicked = spyOn(
        component.editDeliveryDetailsClicked,
        'emit'
      );

      // act
      component.onEditDeliveryDetailsClicked(
        {
          id: 1,
          isEditMode: true,
          orderLineTemplate: {
            orderLineTemplateId: 1,
            orderLineTemplateSet: [
              {
                templateType: TemplateTypeEnum.Email,
                orderLineTemplateVersion: {
                  templateVersionId: 1,
                  orderLineTemplateTagValue: {
                    orderLineTemplateTagValueSet: [
                      {
                        tagId: 1,
                        value: '',
                      },
                    ],
                  },
                },
              },
              {
                templateType: TemplateTypeEnum.SMS,
                orderLineTemplateVersion: {
                  templateVersionId: 2,
                  orderLineTemplateTagValue: {
                    orderLineTemplateTagValueSet: [
                      {
                        tagId: 1,
                        value: '',
                      },
                    ],
                  },
                },
              },
            ],
          },
        } as Product,
        {
          preventDefault: () => {
            return;
          },
        } as any
      );
      tick(5);

      // assert
      expect(editDeliveryDetailsClicked).toHaveBeenCalled();
    }));
  });

  describe('onProductDelete()', () => {
    it('should call productDeleted', () => {
      // arrange
      const productDeleted = spyOn(component.productDeleted, 'emit');

      // act
      component.onProductDelete(1);

      // assert
      expect(productDeleted).toHaveBeenCalled();
    });
  });

  describe('onOpenTrustAccount()', () => {
    it('should open modal', () => {
      // act
      component.onOpenTrustAccount({} as any);

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalledWith(
        TrustAccountModalComponent,
        {
          size: 'xl',
          backdrop: 'static',
          centered: true,
        }
      );
    });
  });

  describe('onOpenDirectDeliveryDetails()', () => {
    it('should call directDeliveryDetailsClicked', () => {
      // arrange
      const directDeliveryDetailsClicked = spyOn(
        component.directDeliveryDetailsClicked,
        'emit'
      );

      // act
      component.onOpenDirectDeliveryDetails({} as any);

      // assert
      expect(directDeliveryDetailsClicked).toHaveBeenCalled();
    });
  });

  describe('onSearch()', () => {
    beforeEach(() => {
      // arrange
      component.originalProductList = [
        { productCode: 'test', productName: '123' } as any,
        { productCode: '2abcs', productName: '456' } as any,
      ];
    });

    it('should filter by product code', () => {
      // act
      component.onSearch({ target: { value: 'test' } });

      // assert
      expect(component.productList.length).toBe(1);
    });

    it('should filter by product name', () => {
      // act
      component.onSearch({ target: { value: '123' } });

      // assert
      expect(component.productList.length).toBe(1);
    });

    it('should return all if no keyword', () => {
      // act
      component.onSearch({ target: { value: '' } });

      // assert
      expect(component.productList.length).toBe(2);
    });
  });

  describe('showPreview()', () => {
    it('should prevent default ', () => {
      // arrange
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve('confirm'),
        dismissed: of(true),
        componentInstance: {
          applyTagValues: jasmine.createSpy(),
          replaceTags: jasmine.createSpy(),
        },
      });
      const event = {
        preventDefault: jasmine.createSpy(),
      };

      // act
      component.showPreview(1, {} as any, event as any);

      // assert
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should prevent default with existing product', () => {
      // arrange
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve('confirm'),
        dismissed: of(true),
        componentInstance: {
          applyTagValues: jasmine.createSpy(),
          replaceTags: jasmine.createSpy(),
        },
      });
      const voucherTemplate = {
        defaultTemplateVersion: {
          templateId: 1,
          type: 1,
          subType: 1,
          templateTags: [
            {
              tagId: 1,
              displayName: 'emailsubject',
            },
            {
              tagId: 2,
              displayName: 'greetings',
            },
          ],
          templateTagValue: [
            {
              tagId: 1,
              value: '',
            },
            {
              tagId: 2,
              value: '',
            },
          ],
        },
      };

      const smsTemplate = {
        defaultTemplateVersion: {
          templateId: 1,
          type: 1,
          subType: 1,
          templateTags: [
            {
              tagId: 1,
              displayName: 'smsgreetings',
            },
          ],
          templateTagValue: [
            {
              tagId: 1,
              value: '',
            },
          ],
        },
      };
      const event = {
        preventDefault: jasmine.createSpy(),
      };
      templateStateSvc.productTemplateList = [
        {
          productVersionId: 1,
          voucherTemplate: voucherTemplate as unknown as Template,
          tempVoucherTemplate: null,
          smsTemplate: smsTemplate as unknown as Template,
          tempSmsTemplate: null,
        },
      ];

      // act
      component.showPreview(1, { productVersionId: 1 } as any, event as any);

      // assert
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should call prevent default on preview on editMode', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateByVersionIds.and.returnValue(
        of([
          {
            templateId: 1,
            templateVersionId: 1,
          },
        ])
      );
      component.productList = [{ parentCode: 1, isEditMode: true } as any];
      const event = {
        preventDefault: jasmine.createSpy(),
      };

      // act
      component.showPreview(
        TemplateTypeEnum.Email,
        {
          id: 1,
          isEditMode: true,
          orderLineTemplate: {
            orderLineTemplateId: 1,
            orderLineTemplateSet: [
              {
                templateType: TemplateTypeEnum.Email,
                orderLineTemplateVersion: {
                  templateVersionId: 1,
                  orderLineTemplateTagValue: {
                    orderLineTemplateTagValueSet: [
                      {
                        tagId: 1,
                        value: '',
                      },
                    ],
                  },
                },
              },
              {
                templateType: TemplateTypeEnum.SMS,
                orderLineTemplateVersion: {
                  templateVersionId: 2,
                  orderLineTemplateTagValue: {
                    orderLineTemplateTagValueSet: [
                      {
                        tagId: 1,
                        value: '',
                      },
                    ],
                  },
                },
              },
            ],
          },
        } as Product,
        event as any
      );
      tick(5);

      // assert
      expect(event.preventDefault).toHaveBeenCalled();
    }));
  });

  describe('get editLabel', () => {
    it('should display correct edit label for IndirectNonAPI quotation type', () => {
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
        value: '',
      };
      const expected = 'Edit voucher page';

      expect(component.editLabel).toEqual(expected);
    });

    it('should display correct edit label for other quotation types', () => {
      component.selectedOrderMode = {
        key: OrderModeEnum.DirectNonAPI,
        value: '',
      };
      const expected = 'Edit delivery content';

      expect(component.editLabel).toEqual(expected);
    });
  });

  describe('get isWithPreviewVoucherPage', () => {
    it('should return true if quotation type has preview voucher page action', () => {
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
        value: '',
      };

      expect(component.isWithPreviewVoucherPage).toBeTrue();
    });

    it('should return false if quotation type has no preview voucher page action', () => {
      component.selectedOrderMode = {
        key: OrderModeEnum.PaperVoucher,
        value: '',
      };

      expect(component.isWithPreviewVoucherPage).toBeFalse();
    });
  });
});
