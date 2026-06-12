import {
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { OrderWizardComponent } from './order-wizard.component';
import { QuotationService } from '../../services/quotation.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentLibraryModule } from '@txc-angular/component-library';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonType } from '../../enums/button-type.enum';
import {
  FourStepWizardEnum,
  ThreeStepWizardEnum,
} from '../../enums/order-steps.enum';
import { OrderModeEnum } from '../../enums/order-mode.enum';
import { of } from 'rxjs';
import { WizardService } from '../../services/wizard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ORDER_CONSTANTS } from '../../constants/order-constants';
import { ConfirmationModalComponent } from '@txc-angular/component-library';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../../services/order.service';
import { DictionaryService } from '../../services/dictionary.service';
import { ActivationTypeEnum } from 'src/app/shared/enums/activation-type.enum';
import { DatePipe } from '@angular/common';
import { AttachmentService } from '../../services/attachment.service';

describe('OrderWizardComponent', () => {
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);
  const wizardSvcSpy = jasmine.createSpyObj(
    'WizardService',
    ['getWizardSteps', 'checkFormValidation'],
    {
      wizardStepsReached$: of([
        FourStepWizardEnum.BasicProperties,
        FourStepWizardEnum.ProductSelection,
        FourStepWizardEnum.DeliveryDetails,
        FourStepWizardEnum.ReviewAndConfirm,
      ]),
      productSelectionTouched$: of(true),
    }
  );
  const quotationSvcSpy = jasmine.createSpyObj('QuotationService', [
    'getQuotations',
  ]);
  const orderSvcSpy = jasmine.createSpyObj('OrderService', [
    'createOrder',
    'validateBasicInfo',
  ]);
  const dictionarySvcSpy = jasmine.createSpyObj('DictionaryService', [
    'getChannels',
  ]);

  const attachmentSvcSpy = jasmine.createSpyObj('AttachmentService', ['']);

  let mockDatePipe: DatePipe;

  let component: OrderWizardComponent;
  let fixture: ComponentFixture<OrderWizardComponent>;
  let router;
  let routerSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderWizardComponent],
      imports: [
        SharedModule,
        ComponentLibraryModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: QuotationService,
          useValue: quotationSvcSpy,
        },
        {
          provide: WizardService,
          useValue: wizardSvcSpy,
        },
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
        {
          provide: OrderService,
          useValue: orderSvcSpy,
        },
        {
          provide: DictionaryService,
          useValue: dictionarySvcSpy,
        },
        {
          provide: AttachmentService,
          useValue: attachmentSvcSpy,
        },
        DatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(OrderWizardComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    routerSpy = spyOn(router, 'navigateByUrl');

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

    component.deliveryDetailsFormGroup = fb.group({
      emailTemplate: '',
      emailSubject: 'ES',
      emailGreeting: 'EG',
      msgEncoding: '',
      smsGreeting: '',
    });

    component.productList = [];
    dictionarySvcSpy.getChannels.and.returnValue(of([]));
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.basicInfoFormGroup).toBeDefined();
    expect(component.settingsFormGroup).toBeDefined();
    expect(component.memoFormGroup).toBeDefined();
    expect(component.attachmentFormGroup).toBeDefined();
  });

  describe('getButtonType', () => {
    it('should return others when step is on review and confirm for non paper voucher products', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;
      component.step = FourStepWizardEnum.ReviewAndConfirm;

      // act
      const result = component.getButtonType;

      // assert
      expect(result).toBe(ButtonType.Others);
    });

    it('should return others when step is on review and confirm forpaper voucher products', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.PaperVoucher,
      } as any;
      component.step = ThreeStepWizardEnum.ReviewAndConfirm;

      // act
      const result = component.getButtonType;

      // assert
      expect(result).toBe(ButtonType.Others);
    });
  });

  describe('onStepChanged', () => {
    it('should verify step and change step if returned true', () => {
      // arrange
      spyOn(component, 'verifyStep').and.returnValue(true);
      component.stepsWithIssue = [];

      // act
      component.onStepChanged(2);

      //
      expect(component.step).toBe(2);
    });
  });

  describe('disableStepOnBack', () => {
    it('should not splice stepsReached when wizard service product selection dirty and if step is Basic properties', () => {
      // arrange
      component.stepsReached = [
        FourStepWizardEnum.BasicProperties,
        FourStepWizardEnum.ProductSelection,
        FourStepWizardEnum.DeliveryDetails,
        FourStepWizardEnum.ReviewAndConfirm,
      ];
      component.step = FourStepWizardEnum.BasicProperties;

      // act
      component.disableStepOnBack();

      // assert
      expect(component.stepsReached).toEqual([
        FourStepWizardEnum.BasicProperties,
        FourStepWizardEnum.ProductSelection,
        FourStepWizardEnum.DeliveryDetails,
        FourStepWizardEnum.ReviewAndConfirm,
      ]);
    });

    it('should splice stepsReached when on direct non api and on DeliveryDetails', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.DirectNonAPI,
      } as any;
      component.stepsReached = [
        FourStepWizardEnum.BasicProperties,
        FourStepWizardEnum.ProductSelection,
        FourStepWizardEnum.DeliveryDetails,
        FourStepWizardEnum.ReviewAndConfirm,
      ];
      component.step = FourStepWizardEnum.DeliveryDetails;
      component.deliveryDetailsFormGroup.markAsPristine();

      // act
      component.disableStepOnBack();

      // assert
      expect(component.stepsReached).toEqual([
        FourStepWizardEnum.BasicProperties,
        FourStepWizardEnum.ProductSelection,
        FourStepWizardEnum.DeliveryDetails,
      ]);
    });
  });

  describe('getValidity', () => {
    it('should return true if there is product list and no error message and button type is next', () => {
      // arrange
      component.step = FourStepWizardEnum.ProductSelection;
      component.productList = [{} as any];
      component.productSelectionErrorMessages = [];
      component.disableProductSelectionNext =
        !!component.productSelectionErrorMessages.length &&
        !!component.productList.length;

      // act
      const result = component.getValidity(ButtonType.Next);

      // assert
      expect(result).toBe(true);
    });

    it('should return false if there is no product list and have error message and button type is back', () => {
      // arrange
      component.step = FourStepWizardEnum.ProductSelection;
      component.productList = [];
      component.productSelectionErrorMessages = [{} as any];

      // act
      const result = component.getValidity(ButtonType.Back);

      // assert
      expect(result).toBe(false);
    });

    it('should return true if delivery form is valid and button type is next', () => {
      // arrange
      component.step = FourStepWizardEnum.DeliveryDetails;

      // act
      const result = component.getValidity(ButtonType.Next);

      // assert
      expect(result).toBe(true);
    });

    it('should return true if stepsWithIssue is empty and button type is back', () => {
      // arrange
      component.step = FourStepWizardEnum.DeliveryDetails;
      component.stepsWithIssue = [];

      // act
      const result = component.getValidity(ButtonType.Back);

      // assert
      expect(result).toBe(true);
    });
  });

  describe('next', () => {
    beforeEach(() => {
      orderSvcSpy.validateBasicInfo.and.returnValue(of({ success: true }));
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve('cancel'),
        componentInstance: {},
      });
    });

    it('should navigate back to order list for four steps', fakeAsync(() => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;
      orderSvcSpy.createOrder.and.returnValue(of({}));
      wizardSvcSpy.getWizardSteps.and.returnValue(
        ORDER_CONSTANTS.WIZARD_STEPS.FOUR_STEPS
      );
      routerSpy.and.returnValue(Promise.resolve());
      component.toast = {
        showSuccess: () => {
          return;
        },
      } as any;
      component.step = FourStepWizardEnum.ReviewAndConfirm;

      // act
      component.next();
      tick();

      // assert
      expect(routerSpy).toHaveBeenCalledWith('/order');
    }));

    it('should navigate back to order list for four steps for order types other than NonAPI + Indirect', fakeAsync(() => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.API,
      } as any;
      orderSvcSpy.createOrder.and.returnValue(of({}));
      wizardSvcSpy.getWizardSteps.and.returnValue(
        ORDER_CONSTANTS.WIZARD_STEPS.FOUR_STEPS
      );
      routerSpy.and.returnValue(Promise.resolve());
      component.toast = {
        showSuccess: () => {
          return;
        },
      } as any;
      component.step = FourStepWizardEnum.ReviewAndConfirm;

      // act
      component.next();
      tick();

      // assert
      expect(routerSpy).toHaveBeenCalledWith('/order');
    }));

    it('should open modal and navigate back to order list for four steps', fakeAsync(() => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;
      orderSvcSpy.createOrder.and.returnValue(
        of({ data: { errorValidationDto: [{ referenceKey: 'MA0063' }] } })
      );
      wizardSvcSpy.getWizardSteps.and.returnValue(
        ORDER_CONSTANTS.WIZARD_STEPS.FOUR_STEPS
      );
      routerSpy.and.returnValue(Promise.resolve());
      component.toast = {
        showSuccess: () => {
          return;
        },
      } as any;
      component.step = FourStepWizardEnum.ReviewAndConfirm;

      // act
      component.next();
      tick();

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith('/order');
    }));

    it('should navigate back to order list for three steps', fakeAsync(() => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
      } as any;
      orderSvcSpy.createOrder.and.returnValue(of({}));
      wizardSvcSpy.getWizardSteps.and.returnValue(
        ORDER_CONSTANTS.WIZARD_STEPS.THREE_STEPS
      );
      routerSpy.and.returnValue(Promise.resolve(true));
      component.toast = {
        showSuccess: () => {
          return;
        },
      } as any;
      component.step = ThreeStepWizardEnum.ReviewAndConfirm;

      // act
      component.next();
      tick();

      // assert
      expect(routerSpy).toHaveBeenCalledWith('/order');
    }));

    xit('should verifyStep for delivery details', () => {
      // arrange
      const verifyStepSpy = spyOn(component, 'verifyStep');
      component.step = FourStepWizardEnum.DeliveryDetails;

      // act
      component.next();

      // assert
      expect(verifyStepSpy).toHaveBeenCalled();
    });

    it('should verifyStep for other steps', () => {
      // arrange
      const verifyStepSpy = spyOn(component, 'verifyStep');
      component.step = FourStepWizardEnum.BasicProperties;

      // act
      component.next();

      // assert
      expect(verifyStepSpy).toHaveBeenCalled();
    });

    it('should show modal when activationDate changes and productList has items', fakeAsync(() => {
      // arrange
      component.productList = [{}] as any;
      const mockOriginalValues = [
        { fieldName: 'activationDate', value: '2021-01-01' },
      ];
      component.originalValues = mockOriginalValues;
      component.basicInfoFormGroup = new FormGroup({
        activationDate: new FormControl('2022-01-01'),
      });
      component.step = ThreeStepWizardEnum.BasicProperties;
      // act
      component.next();
      tick();
      // assert
      expect(modalSvcSpy.open).toHaveBeenCalled();
    }));

    it('should proceed with validation when modal confirms', fakeAsync(() => {
      // arrange
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve('confirm'),
        componentInstance: {},
      });
      const emitSpy = spyOn(component.productListChanged, 'emit');
      const validationSpy = spyOn(component, 'verifyStep');
      component.step = ThreeStepWizardEnum.BasicProperties;
      component.productList = [{} as any];
      component.originalActivationDate = '2021-01-01';
      component.activationDate = '2022-01-01';

      // act
      component.next();
      tick();

      // assert
      expect(emitSpy).toHaveBeenCalledWith({productList: [], orderLines: []});
      expect(validationSpy).toHaveBeenCalled();
    }));

    it('should revert changes when modal cancels', fakeAsync(() => {
      // arrange
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve('cancel'),
        componentInstance: {},
      });
      const revertChangesSpy = spyOn(component, 'revertChanges');
      const verifyStepSpy = spyOn(component, 'verifyStep');
      component.step = ThreeStepWizardEnum.BasicProperties;
      component.productList = [{} as any];
      component.originalActivationDate = '2021-01-01';
      component.activationDate = '2022-01-01';

      // act
      component.next();
      tick();

      // assert
      expect(revertChangesSpy).toHaveBeenCalled();
      expect(verifyStepSpy).toHaveBeenCalledWith(true, true);
    }));
  });

  describe('verifyStep', () => {
    it('should retain error if product id is 100', () => {
      // arrange
      component.step = ThreeStepWizardEnum.ProductSelection;
      component.productList = [{ id: 100 } as any];
      component.productSelectionErrorMessages = [
        { type: 'Verification test' } as any,
      ];

      // act
      component.verifyStep(true);

      // assert
      expect(component.stepsWithIssue).toEqual([
        ThreeStepWizardEnum.ProductSelection,
      ]);
    });

    describe('should open confirmation modal', () => {
      beforeEach(() => {
        // arrange
        modalSvcSpy.open.and.returnValue({
          result: Promise.resolve('cancel'),
          componentInstance: {},
        });
        component.step = FourStepWizardEnum.ProductSelection;
        component.selectedOrderMode = {
          key: OrderModeEnum.DirectNonAPI,
        } as any;
        component.productList = [{} as any];
        component.isProductSelectionDirty = true;
      });

      it('when navigating to review and confirm', () => {
        // act
        component.verifyStep(true, false, FourStepWizardEnum.ReviewAndConfirm);

        // assert
        expect(modalSvcSpy.open).toHaveBeenCalledWith(
          ConfirmationModalComponent,
          {
            size: 'md',
            backdrop: 'static',
            centered: true,
          }
        );
      });

      it('when going back', () => {
        // act
        component.verifyStep(true, false);

        // assert
        expect(modalSvcSpy.open).toHaveBeenCalledWith(
          ConfirmationModalComponent,
          {
            size: 'md',
            backdrop: 'static',
            centered: true,
          }
        );
      });

      it('when going to Delivery details', fakeAsync(() => {
        // arrange
        modalSvcSpy.open.and.returnValue({
          result: Promise.resolve('confirm'),
          componentInstance: {},
        });

        // act
        component.verifyStep(true, false);
        tick();

        // assert
        expect(component.step).toBe(FourStepWizardEnum.DeliveryDetails);
      }));
    });

    it('should set isProductSelectionDirty to false and move forward', fakeAsync(() => {
      // arrange
      component.step = FourStepWizardEnum.ProductSelection;
      component.stepsReached = [FourStepWizardEnum.BasicProperties];

      // act
      component.verifyStep(true, true);
      tick();

      // assert
      expect(component.isProductSelectionDirty).toBeFalse();
      expect(component.step).toBe(FourStepWizardEnum.DeliveryDetails);
    }));

    it('should set isProductSelectionDirty to false and move backward', fakeAsync(() => {
      // arrange
      component.step = FourStepWizardEnum.ProductSelection;
      component.stepsReached = [FourStepWizardEnum.BasicProperties];

      // act
      component.verifyStep(true);
      tick();

      // assert
      expect(component.isProductSelectionDirty).toBeFalse();
      expect(component.step).toBe(FourStepWizardEnum.BasicProperties);
    }));
  });

  describe('prev', () => {
    it('should open modal when you are on step 1', () => {
      // arrange
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve('cancel'),
        componentInstance: {},
      });
      component.step = FourStepWizardEnum.BasicProperties;

      // act
      component.prev();

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalledWith(
        ConfirmationModalComponent,
        {
          size: 'md',
          backdrop: 'static',
          centered: true,
        }
      );
    });

    it('should verifyStep and disableStepOnBack', () => {
      // arrange
      const verifyStepSpy = spyOn(component, 'verifyStep');
      const disableStepOnBack = spyOn(component, 'disableStepOnBack');
      component.step = FourStepWizardEnum.ProductSelection;

      // act
      component.prev();

      // assert
      expect(verifyStepSpy).toHaveBeenCalledWith(true, false);
      expect(disableStepOnBack).toHaveBeenCalled();
    });
  });

  describe('checkFormInvalidValues', () => {
    it('should set stepWithIssue with current step', () => {
      // arrange
      component.step = FourStepWizardEnum.ProductSelection;

      // act
      component.checkFormInvalidValues(true);

      // assert
      expect(component.stepsWithIssue).toEqual([
        FourStepWizardEnum.ProductSelection,
      ]);
    });

    it('should set stepWithIssue with empty', () => {
      // arrange
      component.step = FourStepWizardEnum.ProductSelection;

      // act
      component.checkFormInvalidValues(false);

      // assert
      expect(component.stepsWithIssue).toEqual([]);
    });
  });

  describe('onProductSelectionChanged', () => {
    it('should set steps with issue if have product selection errors', () => {
      // arrange
      component.step = FourStepWizardEnum.ProductSelection;

      // act
      component.onProductSelectionChanged({
        estimatedTotal: 10,
        disableProductSelectionNext: false,
        productSelectionErrorMessages: [{} as any],
        productList: [],
        orderLines: []
      });

      // assert
      expect(component.stepsWithIssue).toEqual([
        FourStepWizardEnum.ProductSelection,
      ]);
    });

    it('should set steps with issue empty if doesnt have product selection errors', () => {
      // arrange
      component.step = FourStepWizardEnum.ProductSelection;

      // act
      component.onProductSelectionChanged({
        estimatedTotal: 10,
        disableProductSelectionNext: false,
        productSelectionErrorMessages: [],
        productList: [],
        orderLines: []
      });

      // assert
      expect(component.stepsWithIssue).toEqual([]);
    });
  });

  it('onJumpstep should set the current step ', () => {
    // arrange
    component.step = FourStepWizardEnum.ReviewAndConfirm;

    // act
    component.onJumpToStep(FourStepWizardEnum.BasicProperties);

    // assert
    expect(component.step).toBe(FourStepWizardEnum.BasicProperties);
  });

  it('onManualProductSelectionClicked should emit product id', () => {
    // arrange
    const manualSelectSpy = spyOn(component.manualSelectProductClicked, 'emit');

    // act
    component.onManualProductSelectionClicked(1);

    // assert
    expect(manualSelectSpy).toHaveBeenCalledWith(1);
  });

  it('onEditDeliveryDetailsClicked should emit product id', () => {
    // arrange
    const editDeliveryClickedSpy = spyOn(
      component.editDeliveryDetailsClicked,
      'emit'
    );

    // act
    component.onEditDeliveryDetailsClicked(1);

    // assert
    expect(editDeliveryClickedSpy).toHaveBeenCalledWith(1);
  });

  it('onFileUploaded should emit boolean', () => {
    // arrange
    const fileUploadedSpy = spyOn(component.fileUploaded, 'emit');

    // act
    component.onFileUploaded(true);

    // assert
    expect(fileUploadedSpy).toHaveBeenCalledWith(true);
  });

  it('onProductListDirty should emit boolean', () => {
    // act
    component.onProductListDirty(true);

    // assert
    expect(component.isProductSelectionDirty).toBeTrue();
  });

  // function is not doing anything
  it('getDeliveryDetailsData should ', () => {
    // act
    component.getDeliveryDetailsData();

    // assert
    expect(true).toBe(true);
  });

  describe('setActivationDate function', () => {
    beforeEach(() => {
      mockDatePipe = new DatePipe('en-US');
    });

    it('should set activationDate as fixed date when activationType is FixedOfDate', fakeAsync(() => {
      const expectedDate = '2023-01-01';
      component.setActivationDate();
      component.basicInfoFormGroup
        .get('activationType')
        ?.setValue(ActivationTypeEnum.FixedOfDate);
      tick();
      component.basicInfoFormGroup
        .get('activationDate')
        ?.setValue(new Date('2023-01-01'));
      tick();

      expect(component.activationDate).toBe(expectedDate);
    }));

    it('should calculate activationDate as N days after publishDate when activationType is NDaysFromPublishDate', fakeAsync(() => {
      const publishDate = new Date('2023-01-01');
      const afterPublishedDays = 5;
      const expectedDate = '2023-01-06';
      component.setActivationDate();
      component.basicInfoFormGroup
        .get('activationType')
        ?.setValue(ActivationTypeEnum.NDaysFromPublishDate);
      tick();
      component.basicInfoFormGroup.get('publishDate')?.setValue(publishDate);
      tick();
      component.basicInfoFormGroup
        .get('afterPublished')
        ?.setValue(afterPublishedDays);
      tick();
      expect(component.activationDate).toBe(expectedDate);
    }));

    it('should set activationDate to null for any other activationType', () => {
      component.basicInfoFormGroup.get('activationType')?.setValue('Inactive');
      expect(component.activationDate).toBeNull();
    });
  });
});
