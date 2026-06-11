import {
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CreateOrderComponent } from './create-order.component';
import { QuotationStateService } from '../../services/state-service/quotation-state.service';
import { LanguageStateService } from '../../services/state-service/language-state.service';
import { CreateOrderScreenEnum } from '../../enums/create-order-screen.enum';
import {
  FourStepWizardEnum,
  ThreeStepWizardEnum,
} from '../../enums/order-steps.enum';
import { EmailTemplateStateService } from '../../services/state-service/email-template-state.service';

describe('CreateOrderComponent', () => {
  let store: any = {};
  const quotationStateSvcSpy = jasmine.createSpyObj(
    'QuotationStateService',
    [
      'getQuotations',
      'getQuotationPaginated',
      'clearQuotationPaginated',
      'setSelectedOrderModeState',
    ],
    {
      quotationPaginated$: of({
        quotationPaginated: {
          totalCount: 1,
          itemPerPage: 20,
          currentPage: 1,
          quotationItemList: [],
        },
      }),
    }
  );

  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);
  const languageStateServiceSpy = jasmine.createSpyObj(
    'HttpClient',
    ['setLanguageList'],
    {
      selectedLanguageList$: of([
        {
          dictionaryId: 66,
          displayName: 'Chinese',
        },
      ]),
    }
  );
  const emailTemplateStateServiceSpy = jasmine.createSpyObj(
    'EmailTemplateStateService',
    ['setEmailTemplates']
  );

  // mock local storage
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

  let component: CreateOrderComponent;
  let fixture: ComponentFixture<CreateOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateOrderComponent],
      imports: [SharedModule, RouterTestingModule],
      providers: [
        FormBuilder,
        {
          provide: QuotationStateService,
          useValue: quotationStateSvcSpy,
        },
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
        {
          provide: LanguageStateService,
          useValue: languageStateServiceSpy,
        },
        {
          provide: EmailTemplateStateService,
          useValue: emailTemplateStateServiceSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
    quotationStateSvcSpy.getQuotations.and.returnValue(
      of({
        data: {
          totalCount: 1,
          itemPerPage: 20,
          currentPage: 1,
          quotationItemList: [],
        },
      })
    );
    quotationStateSvcSpy.getQuotationPaginated.and.returnValue(
      of({
        quotationPaginated: {
          totalCount: 1,
          itemPerPage: 20,
          currentPage: 1,
          quotationItemList: [],
        },
      })
    );
    const tenant = {
      tenantId: 7,
      name: 'TW',
    };
    localStorage.setItem('tenant', JSON.stringify(tenant));
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(CreateOrderComponent);
    component = fixture.componentInstance;

    /* This is where we can simulate / test our component
       and pass in a value for formGroup where it would've otherwise
       required it from the parent
    */
    component.basicPropertiesFormGroup = fb.group({
      basicInfoFormGroup: fb.group({
        orderName: '',
        publishDate: '',
        hasNoTargetPublishDate: '',
        activationType: '',
        activationDate: '',
        afterPublished: '',
      }),
      settingsFormGroup: fb.group({
        excelFormat: '',
        excelShortUrl: '',
        barcodeInfo: '',
        emailAttachment: '',
        shortUrlAuthCodeGenerationWay: '',
        generateSequenceNumber: '',
        channelId: '',
      }),
      memoFormGroup: fb.group({
        memo: '',
      }),
      attachmentFormGroup: fb.group({
        attachments: '',
      }),
    });
    fixture.detectChanges();
  }));

  describe('should create', () => {
    it('on TW', () => {
      expect(component).toBeTruthy();
      expect(component.selectedTenant).toBeDefined();
      expect(component.basicPropertiesFormGroup).toBeDefined();
      expect(component.deliveryDetailsFormGroup).toBeDefined();
    });

    it('on IN', () => {
      const tenant = {
        tenantId: 2,
        name: 'IN',
      };
      localStorage.setItem('tenant', JSON.stringify(tenant));
      component.ngOnInit();
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.selectedTenant).toBeDefined();
      expect(component.basicPropertiesFormGroup).toBeDefined();
      expect(component.deliveryDetailsFormGroup).toBeDefined();
    });
  });

  it('onPageChange should update paginated quotations', () => {
    // arrange
    component.pageSize = 20;
    component.quotationPaginationParams = {
      keyword: '',
      validOn: '',
    };

    // act
    component.onPageChange(1);

    // assert
    expect(component.quotationPaginationParams.pageIndex).toEqual(1);
    expect(component.quotationPaginationParams.pageSize).toEqual(
      component.pageSize
    );
    expect(quotationStateSvcSpy.getQuotationPaginated).toHaveBeenCalled();
  });

  describe('onSearch should work properly', () => {
    it('without validOn', () => {
      // arrange
      const expectedSearchTerm = 'search';
      const expectedParams = {
        keyword: expectedSearchTerm,
        validOn: '',
      };
      component.searchTerm = '   search    ';

      // act
      component.onSearch();

      // assert
      expect(component.isSearchInProgress).toBeTrue();
      expect(component.isLoading).toBeTrue();
      expect(component.searchTerm).toEqual(expectedSearchTerm);
      expect(component.quotationPaginationParams).toEqual(expectedParams);
      expect(quotationStateSvcSpy.getQuotationPaginated).toHaveBeenCalledWith(
        expectedParams
      );
    });

    it('with validOn', () => {
      // arrange
      const expectedSearchTerm = 'search';
      const expectedParams = {
        keyword: expectedSearchTerm,
        validOn: new Date('2023/12/12').toUTCString(),
      };
      component.searchTerm = '   search    ';
      component.validAt = '2023/12/12';

      // act
      component.onSearch();

      // assert
      expect(component.isSearchInProgress).toBeTrue();
      expect(component.isLoading).toBeTrue();
      expect(component.searchTerm).toEqual(expectedSearchTerm);
      expect(component.quotationPaginationParams).toEqual(expectedParams);
      expect(quotationStateSvcSpy.getQuotationPaginated).toHaveBeenCalledWith(
        expectedParams
      );
    });
  });

  it('onReset should reset search params', () => {
    // arrange
    component.isDateInvalid = true;

    // act
    component.onReset({
      writeValue: () => {
        return;
      },
    });

    // assert
    expect(component.isSearchInProgress).toBeFalsy();
    expect(component.searchTerm).toBeFalsy();
    expect(component.validAt).toBeFalsy();
    expect(component.selectedQuotation).toBeFalsy();
    expect(component.quotationPaginationParams).toEqual({});
    expect(component.isDateInvalid).toBeFalsy();
  });

  it('resetSearch should reset searchTerm', () => {
    // act
    component.resetSearch();

    // assert
    expect(component.searchTerm).toBeFalsy();
  });

  it('onConfirm should display confirmation modal', fakeAsync(() => {
    // arrange
    const expectedSelectionType = 1;
    modalSvcSpy.open.and.returnValue({
      result: Promise.resolve(expectedSelectionType),
      componentInstance: { selectedQuotation: {} },
    });

    // act
    component.onConfirm();
    tick(1);

    // assert
    expect(modalSvcSpy.open).toHaveBeenCalled();
    expect(quotationStateSvcSpy.setSelectedOrderModeState).toHaveBeenCalledWith(
      expectedSelectionType
    );
    expect(component.currentScreen).toBe(CreateOrderScreenEnum.OrderWizard);
  }));

  describe('onDateSelection should work', () => {
    beforeEach(() => {
      component.isDateInvalid = true;
    });

    it('with full date', () => {
      // arrange
      const inputDate = new NgbDate(2023, 8, 8);
      const expectedDate = component.getDateString(inputDate);

      // act
      component.onDateSelection(inputDate);

      // assert
      expect(component.selectedDate).toBe(expectedDate);
      expect(component.validAt).toBe(expectedDate);
      expect(component.isDateInvalid).toBeFalse();
    });

    it('without month and day', () => {
      // arrange
      const inputDate = new NgbDate(2023, 0, 0);
      const expectedDate = component.getDateString(inputDate);

      // act
      component.onDateSelection(inputDate);

      // assert
      expect(component.selectedDate).toBe(expectedDate);
      expect(component.validAt).toBe(expectedDate);
      expect(component.isDateInvalid).toBeFalse();
    });
  });

  describe('onSearchKeyDown should', () => {
    beforeEach(() => {
      // arrange
      spyOn(component, 'onSearch');
    });

    it('call onSearch with valid date', () => {
      // act
      component.onSearchKeyDown({ keyCode: 13 } as any);

      // assert
      expect(component.onSearch).toHaveBeenCalled();
    });

    it('not call onSearch with invalid date', () => {
      // arrange
      component.isDateInvalid = true;

      // act
      component.onSearchKeyDown({ keyCode: 13 } as any);

      // assert
      expect(component.onSearch).not.toHaveBeenCalled();
    });
  });

  describe('onDatePickerChange should handle', () => {
    it('invalid date input', () => {
      // act
      component.onDatePickerInputChange({ target: { value: '2023/08/0823' } });

      // assert
      expect(component.selectedDate).toBeFalsy();
      expect(component.isDateInvalid).toBeTrue();
    });

    it('valid date input', () => {
      // arrange
      const expectedValue = '2023/08/08';

      // act
      component.onDatePickerInputChange({ target: { value: expectedValue } });

      // assert
      expect(component.selectedDate).toBe(expectedValue);
      expect(component.validAt).toBe(expectedValue);
      expect(component.isDateInvalid).toBeFalse();
    });
  });

  describe('ManualProductSelectionClicked should work', () => {
    it('on event emitted is for edit', () => {
      // arrange
      const expectedProduct = { id: 1 } as any;
      component.productList = [expectedProduct];
      // act
      component.onManualProductSelectionClicked(1);

      // assert
      expect(component.editMode).toBeTrue();
      expect(component.product).toBe(expectedProduct);
      expect(component.currentScreen).toBe(
        CreateOrderScreenEnum.ManualSelectProduct
      );
    });

    it('on event emitted is for create', () => {
      // act
      component.onManualProductSelectionClicked(0);

      // assert
      expect(component.editMode).toBeFalse();
      expect(component.currentScreen).toBe(
        CreateOrderScreenEnum.ManualSelectProduct
      );
    });
  });

  it('onEditDeliveryDetailsClicked should update the screen to EditDeliveryContent', () => {
    // act
    component.onEditDeliveryDetailsClicked();

    // assert
    expect(component.currentScreen).toBe(
      CreateOrderScreenEnum.EditDeliveryContent
    );
  });

  it('onManualSelectProductCancelled should navigate back to order wizard', () => {
    // act
    component.onManualSelectProductCancelled();

    // assert
    expect(component.step).toBe(ThreeStepWizardEnum.ProductSelection);
    expect(component.stepsReached).toEqual([
      ThreeStepWizardEnum.BasicProperties,
      ThreeStepWizardEnum.ProductSelection,
    ]);
    expect(component.currentScreen).toBe(CreateOrderScreenEnum.OrderWizard);
  });

  describe('onManualSelectProductConfirmed should work', () => {
    beforeEach(() => {
      component.productList = [
        { id: 2, name: 'Product2' } as any,
        { id: 3, name: 'Product3' } as any,
      ];
    });

    it('and replace the product on product list if edit mode', () => {
      // arrange
      component.editMode = true;
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
      expect(component.isProductSelectionDirty).toBeTrue();
      expect(component.step).toBe(ThreeStepWizardEnum.ProductSelection);
      expect(component.stepsReached).toEqual([
        ThreeStepWizardEnum.BasicProperties,
        ThreeStepWizardEnum.ProductSelection,
      ]);
      expect(component.currentScreen).toBe(CreateOrderScreenEnum.OrderWizard);
    });

    it('and replace the product on product list if not on edit mode but if it has the same id', () => {
      // arrange
      component.editMode = false;
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
      expect(component.isProductSelectionDirty).toBeTrue();
      expect(component.step).toBe(ThreeStepWizardEnum.ProductSelection);
      expect(component.stepsReached).toEqual([
        ThreeStepWizardEnum.BasicProperties,
        ThreeStepWizardEnum.ProductSelection,
      ]);
      expect(component.currentScreen).toBe(CreateOrderScreenEnum.OrderWizard);
    });
  });

  it('onProductListChanged should update product list', () => {
    // arrange
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
    component.productList = [
      { id: 2, name: 'Product2' } as any,
      { id: 3, name: 'Product3' } as any,
    ];

    // act
    component.onProductListChanged({
      productList: expectedProductList,
      orderLines: [],
    });

    // assert
    expect(component.productList).toEqual(expectedProductList);
  });

  it('onFileUploaded should update from upload', () => {
    // act
    component.onFileUploaded(true);

    // assert
    expect(component.fromUpload).toBeTrue();
  });

  it('onGoBackToOrderWizard should navigate back to order wizard', () => {
    // act
    component.onGoBackToOrderWizard();

    // assert
    expect(component.step).toBe(FourStepWizardEnum.DeliveryDetails);
    expect(component.stepsReached).toEqual([
      FourStepWizardEnum.BasicProperties,
      FourStepWizardEnum.ProductSelection,
      FourStepWizardEnum.DeliveryDetails,
    ]);
    expect(component.currentScreen).toBe(CreateOrderScreenEnum.OrderWizard);
  });
});
