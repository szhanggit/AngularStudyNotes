import { TestBed } from '@angular/core/testing';

import { INITIAL_TEMPLATE, ProductTemplateStateService } from './product-template-state.service';

describe('ProductTemplateStateService', () => {
  let service: ProductTemplateStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductTemplateStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('state should be defined', () => {
    // assert
    service.productTemplates$.subscribe((actualProductTemplates) => {
      expect(actualProductTemplates).toBeDefined();
    });
  });

  describe('setProductTemplatesByProductId()', () => {
    it('should add to productTempalteList', () => {
      // arrange
      service.productTemplateList = [];

      // act
      service.setProductTemplatesByProductVersionId(
        1,
        undefined,
        undefined,
        undefined,
        undefined
      );

      // assert
      expect(service.productTemplateList.length).toBe(1);
    });

    it('should not replace to productTempalteList', () => {
      // arrange
      service.productTemplateList = [
        {
          productVersionId: 1,
          voucherTemplate: null,
          tempVoucherTemplate: null,
          smsTemplate: null,
          tempSmsTemplate: null,
        },
      ];

      // act
      service.setProductTemplatesByProductVersionId(
        1,
        undefined,
        undefined,
        undefined,
        undefined
      );

      // assert
      expect(service.productTemplateList.length).toBe(1);
    });

    it('should replace to productTempalteList when reset true', () => {
      // arrange
      const expectedTemplate = {
        productVersionId: 1,
        voucherTemplate: {},
        tempVoucherTemplate: {},
        smsTemplate: {},
        tempSmsTemplate: {},
        emailTemplateVersionId: undefined,
        smsTemplateVersionId: undefined
      };

      service.productTemplateList = [
        {
          productVersionId: 1,
          voucherTemplate: null,
          tempVoucherTemplate: null,
          smsTemplate: null,
          tempSmsTemplate: null,
        },
      ];

      // act
      service.setProductTemplatesByProductVersionId(
        1,
        1,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
        true
      );

      // assert
      expect(service.productTemplateList[0]).toEqual(expectedTemplate as any);
    });

    it('should replace to productTempalteList when reset true and set undefineds to null', () => {
      // arrange
      const expectedTemplate = {
        productVersionId: 1,
        voucherTemplate: INITIAL_TEMPLATE,
        tempVoucherTemplate: INITIAL_TEMPLATE,
        smsTemplate: INITIAL_TEMPLATE,
        tempSmsTemplate: INITIAL_TEMPLATE,
        emailTemplateVersionId: undefined,
        smsTemplateVersionId: undefined
      };

      service.productTemplateList = [
        {
          productVersionId: 1,
          voucherTemplate: {} as any,
          tempVoucherTemplate: {} as any,
          smsTemplate: {} as any,
          tempSmsTemplate: {} as any,
        },
      ];

      // act
      service.setProductTemplatesByProductVersionId(
        1,
        1,
        undefined,
        undefined,
        undefined,
        undefined,
        true
      );

      // assert
      expect(service.productTemplateList[0]).toEqual(expectedTemplate as any);
    });
  });
});
