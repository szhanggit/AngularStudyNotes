import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { ConfirmationModalComponent, NgbdToastGlobal } from '@txc-angular/component-library';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ErrorMessage } from 'src/app/shared/models/dumb-models/error-message.model';
import { OrderLine, Product } from 'src/app/shared/models/product.model';
import { ButtonType } from '../../enums/button-type.enum';
import { Subject, takeUntil } from 'rxjs';
import { WizardService } from '../../services/wizard.service';
import { OrderMode } from '../../models/quotation-type.model';
import { OrderModeEnum } from '../../enums/order-mode.enum';
import { QuotationStateService } from '../../services/state-service/quotation-state.service';
import { DeliveryDetails } from 'src/app/shared/models/delivery-details.model';
import { VoucherTemplate } from 'src/app/shared/models/voucher-template.model';
import {
  FourStepWizardEnum,
  ThreeStepWizardEnum,
} from '../../enums/order-steps.enum';
import { ORDER_CONSTANTS } from '../../constants/order-constants';
import { environment } from 'src/environments/environment';
import { OrderService } from '../../services/order.service';
import { Quotation } from '../../interface/quotation-state.interface';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { OrderBasicInfoFieldsDefinition } from 'src/app/shared/models/fields-definition/order-basic-info-fields-definition.model';
import { OrderSettingsFieldsDefinition } from 'src/app/shared/models/fields-definition/order-settings-fields-definition.model';
import { BaseErrorResponse } from '../../models/base-response.model';
import { DatePipe } from '@angular/common';
import { ActivationTypeEnum } from 'src/app/shared/enums/activation-type.enum';
import { FieldValue } from 'src/app/shared/models/dumb-models/field-value.model';
import { ProductTemplateStateService } from '../../services/state-service/product-template-state.service';

@Component({
  selector: 'app-order-wizard',
  templateUrl: './order-wizard.component.html',
  styleUrls: ['./order-wizard.component.scss'],
})
export class OrderWizardComponent implements OnInit, OnDestroy {
  @Input() basicPropertiesFormGroup!: FormGroup;
  @Input() deliveryDetailsFormGroup!: FormGroup;
  @Input() step = 1;
  @Input() stepsReached: number[] = [1];
  @Input() stepsWithIssue: number[] = [];
  @Input() productList: Product[] = [];
  @Input() orderLines: OrderLine[] = [];
  @Input() fromUpload = false;
  @Input() isProductSelectionDirty = false;
  @Input() toast!: NgbdToastGlobal;
  @Output() manualSelectProductClicked: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() productListChanged: EventEmitter<{
    productList: Product[];
    orderLines: OrderLine[];
  }> = new EventEmitter<{
    productList: Product[];
    orderLines: OrderLine[];
  }>();
  @Output() fileUploaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() editDeliveryDetailsClicked: EventEmitter<number> =
    new EventEmitter<number>();

  MOCK_ORDER_MODE = [OrderModeEnum.PaperVoucher];

  selectedOrderMode!: OrderMode;
  selectedQuotation!: Quotation;
  fourStepWizard = FourStepWizardEnum;
  threeStepWizard = ThreeStepWizardEnum;
  wizardSteps = ORDER_CONSTANTS.WIZARD_STEPS;
  originalValues!: { fieldName: string; value: any }[];

  errorMessages: ErrorMessage[] = [];
  activationDate: string | null = '';
  originalActivationDate: string | null = '';

  // TODO: delete when API integration is implemented
  mockVoucherTemplateData: VoucherTemplate = {
    emailSubject: 'Test email subject',
    emailGreeting: 'Test email greeting',
    smsGreeting: 'Test SMS greeting',
  };

  get buttonTypeEnum(): typeof ButtonType {
    return ButtonType;
  }

  get getButtonType(): ButtonType {
    if (
      (this.isPaperVoucher &&
        this.step === this.threeStepWizard.ReviewAndConfirm) ||
      (!this.isPaperVoucher &&
        this.step === this.fourStepWizard.ReviewAndConfirm)
    ) {
      return this.buttonTypeEnum.Others;
    } else {
      return this.buttonTypeEnum.Next;
    }
  }

  get isPaperVoucher() {
    return this.selectedOrderMode.key === OrderModeEnum.PaperVoucher;
  }

  // headers
  TITLE = 'Create Order';
  // to be replaced by type of order
  get SUBTITLE(): string {
    return this.selectedOrderMode.value!;
  }

  get STEPS(): string[] {
    return this.wizardService.getWizardSteps(this.selectedOrderMode);
  }

  // Flag for disabling stepper for MVP
  get disableStepper() {
    return environment.isMvp;
  }
  // basic props - formGroups
  basicInfoFormGroup!: FormGroup;
  settingsFormGroup!: FormGroup;
  memoFormGroup!: FormGroup;
  attachmentFormGroup!: FormGroup;

  // product selection
  productSelectionErrorMessages: ErrorMessage[] = [];
  productSelectionOnInitialState = true;
  disableProductSelectionNext = true;
  estimatedTotal: number = 0;

  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private wizardService: WizardService,
    private quotationStateService: QuotationStateService,
    private orderService: OrderService,
    private datePipe: DatePipe,
    private productTemplateStateService: ProductTemplateStateService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.setSelectedQuotationType();
    this.setSelectedQuotation();
    this.basicInfoFormGroup = this.basicPropertiesFormGroup.get(
      'basicInfoFormGroup'
    ) as FormGroup;
    this.settingsFormGroup = this.basicPropertiesFormGroup.get(
      'settingsFormGroup'
    ) as FormGroup;
    this.memoFormGroup = this.basicPropertiesFormGroup.get(
      'memoFormGroup'
    ) as FormGroup;
    this.attachmentFormGroup = this.basicPropertiesFormGroup.get(
      'attachmentFormGroup'
    ) as FormGroup;

    this.checkStepsState();
    this.setActivationDate();
  }

  setSelectedQuotationType() {
    this.quotationStateService.selectedOrderMode$.subscribe(
      (orderMode) => (this.selectedOrderMode = orderMode)
    );
  }

  setSelectedQuotation() {
    this.quotationStateService.selectedQuotation$.subscribe(
      (quotation) => (this.selectedQuotation = quotation)
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  checkStepsState() {
    this.wizardService.wizardStepsReached$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((steps) => {
        if (steps.includes(3)) {
          this.stepsReached = steps;
        }
      });

    this.wizardService.productSelectionTouched$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((productListNotEmpty) => {
        if (productListNotEmpty) {
          this.wizardService.productSelectionDirty = productListNotEmpty;
        }

        if (
          this.wizardService.productSelectionDirty &&
          this.productList.length <= 0
        ) {
          this.stepsWithIssue = [this.step];
        }
      });
  }

  onStepChanged(nextStep: number): void {
    // verifyStep will always return true,
    // except if QuotationType is Direct, user reached review and confirm,
    // and you are moving out from Product Selection step,
    // which user needs to answer the prompt before proceeding to next/previous/stepChange
    if (
      this.verifyStep(false, false, nextStep) &&
      !this.stepsWithIssue.length
    ) {
      this.step = nextStep;
    }

    this.disableStepOnBack(nextStep);
  }

  disableStepOnBack(step: number = this.step) {
    const index = this.stepsReached.findIndex((i) => i === step + 1);
    let isDirty;
    if (step === ThreeStepWizardEnum.BasicProperties) {
      isDirty = this.wizardService.productSelectionDirty;
    } else if (
      this.selectedOrderMode.key === OrderModeEnum.DirectNonAPI &&
      (step === FourStepWizardEnum.ProductSelection ||
        step === FourStepWizardEnum.DeliveryDetails)
    ) {
      isDirty = this.deliveryDetailsFormGroup.dirty;
    } else {
      isDirty = true;
    }
    if (!isDirty && index !== -1) {
      this.stepsReached.splice(index, 1);
    }
  }

  getValidity(buttonType: ButtonType): boolean {
    switch (this.step) {
      case this.fourStepWizard.ProductSelection: {
        if (buttonType === ButtonType.Next) {
          return !this.disableProductSelectionNext;
        } else {
          return !this.stepsWithIssue.length || 
                 !this.disableProductSelectionNext;
        }
      }
      case this.fourStepWizard.DeliveryDetails: {
        if (buttonType === ButtonType.Next) {
          return (
            this.selectedOrderMode.key === OrderModeEnum.IndirectNonAPI ||
            this.deliveryDetailsFormGroup.valid
          );
        } else {
          return !this.stepsWithIssue.length;
        }
      }
      default: {
        if (buttonType === ButtonType.Next) {
          return (
            this.basicPropertiesFormGroup.valid &&
            this.basicPropertiesFormGroup.dirty
          );
        } else {
          return true;
        }
      }
    }
  }

  private getFormModels(): {
    basicInfo: FormModel;
    settings: FormModel;
  } {
    const formModels = {
      basicInfo: {
        formGroup: this.basicInfoFormGroup,
        fieldsDefinition: new OrderBasicInfoFieldsDefinition(
          this.selectedOrderMode
        ).define(),
      },
      settings: {
        formGroup: this.settingsFormGroup,
        fieldsDefinition: new OrderSettingsFieldsDefinition(
          this.selectedOrderMode
        ).define(),
      },
    };

    if (
      formModels.basicInfo.formGroup.get('activationType')?.value ===
      ActivationTypeEnum.NDaysFromPublishDate
    ) {
      formModels.basicInfo.fieldsDefinition.find(
        (field) => field.formControlName === 'afterPublished'
      )!.hidden = false;
    }

    return formModels;
  }

  next(): void {
    this.errorMessages = [];

    if (
      (this.STEPS === ORDER_CONSTANTS.WIZARD_STEPS.FOUR_STEPS &&
        this.step === FourStepWizardEnum.ReviewAndConfirm) ||
      (this.STEPS === ORDER_CONSTANTS.WIZARD_STEPS.THREE_STEPS &&
        this.step === ThreeStepWizardEnum.ReviewAndConfirm)
    ) {
      if (this.MOCK_ORDER_MODE.includes(this.selectedOrderMode.key)) {
        this.router.navigateByUrl('/order').then(() => {
          this.toast.showSuccess('You have successfully created a new order!');
        });
      } else {
        this.proceedWithCreateOrder();
      }
    } else if (this.step === FourStepWizardEnum.DeliveryDetails) {
      this.verifyStep(true, true);
    } else if (this.step === ThreeStepWizardEnum.BasicProperties) {
      if (this.productList.length > 0) {
        if (this.originalActivationDate !== this.activationDate) {
          this.showActivationDateChangeModal();
          return;
        }
      }
      this.verifyStep(true, true);
    } else {
      this.verifyStep(true, true);
    }
  }

  proceedWithCreateOrder() {
    const { basicInfo: basicInfoFormModel, settings: settingsFormModel } =
      this.getFormModels();
    this.orderService
      .createOrder(
        this.selectedQuotation,
        this.selectedOrderMode,
        basicInfoFormModel,
        this.attachmentFormGroup.getRawValue(),
        settingsFormModel,
        this.memoFormGroup.getRawValue(),
        this.orderLines,
        this.deliveryDetailsFormGroup.getRawValue()
      )
      .subscribe({
        next: (res) => {
          if (
            basicInfoFormModel.formGroup
              .get('orderName')
              ?.value.includes('MA0063') ||
            (res.data &&
              res.data.errorValidationDto.length &&
              res.data.errorValidationDto[0].referenceKey === 'MA0063')
          ) {
            const modalRef = this.modalService.open(
              ConfirmationModalComponent,
              {
                size: 'md',
                backdrop: 'static',
                centered: true,
              }
            );
            modalRef.componentInstance.title = 'Insufficient credit limit';
            modalRef.componentInstance.description =
              'The order can still be created, but you need to add a credit limit for this client.';
            modalRef.componentInstance.firstButton = {
              buttonText: 'OK',
              buttonClass: 'btn-primary',
            };
            modalRef.result.then((res: string) => {
              if (res === 'cancel') this.navigateToOrderList();
            });
          } else {
            this.navigateToOrderList();
          }
        },
        error: (error: BaseErrorResponse) => {
          if (!error.error.data) {
            this.errorMessages = [
              { type: 'General', description: 'Something went wrong.' },
            ];
          } else {
            this.errorMessages = error.error.data.errorValidationDto.map(
              (error) => {
                return {
                  type: error.columnName,
                  description: error.errorMessage,
                };
              }
            );
          }

          window.scroll(0, 0);
        },
      });
  }

  verifyStep(adjustStep: boolean, next?: boolean, nextStep?: number): boolean {
    // to demo verification error
    if (
      this.step === ThreeStepWizardEnum.ProductSelection &&
      this.productList.find((p) => p.id === 100)
    ) {
      const verificationError = {
        type: 'Verification status',
        description: 'Verification failed.',
      };

      if (
        !this.productSelectionErrorMessages.some(
          (error) => error.type === verificationError.type
        )
      ) {
        this.productSelectionErrorMessages.push(verificationError);
        this.stepsWithIssue = [this.step];
      }
      return true;
    } else {
      if (
        this.step === FourStepWizardEnum.ProductSelection &&
        this.selectedOrderMode.key === OrderModeEnum.DirectNonAPI &&
        this.stepsReached.includes(FourStepWizardEnum.ReviewAndConfirm) &&
        (nextStep || !next) &&
        nextStep !== FourStepWizardEnum.DeliveryDetails &&
        this.productList.length &&
        this.isProductSelectionDirty
      ) {
        const modalRef = this.modalService.open(ConfirmationModalComponent, {
          size: 'md',
          backdrop: 'static',
          centered: true,
        });

        modalRef.componentInstance.title = 'Edit Delivery Details';
        modalRef.componentInstance.description =
          'Do you want to edit the delivery details as well? Some items may need to be modified based on the updated product details.';
        modalRef.componentInstance.firstButton = {
          buttonText: 'Skip',
          buttonClass: 'btn-secondary',
        };
        modalRef.componentInstance.secondButton = {
          buttonText: 'Edit',
          buttonClass: 'btn-primary',
        };
        modalRef.componentInstance.centered = false;
        modalRef.result.then((res: string) => {
          if (res === 'cancel') {
            // if nextstep is defined - it means that this function is called from onStepperChanged
            // if not defined - it is called from next/prev
            if (nextStep) {
              this.step = nextStep;
            } else {
              this.step = next ? ++this.step : --this.step;
            }
          } else {
            this.step = FourStepWizardEnum.DeliveryDetails;
          }
          this.isProductSelectionDirty = false;
        });
        return false;
      } else {
        if (this.step === ThreeStepWizardEnum.ProductSelection) {
          this.isProductSelectionDirty = false;
        }

        if (adjustStep) {
          this.step = next ? ++this.step : --this.step;
        }
        if (!this.stepsReached.includes(this.step)) {
          this.stepsReached.push(this.step);
          this.wizardService.wizardStepsReached = this.stepsReached;
        }
        return true;
      }
    }
  }

  prev(): void {
    if (this.step === ThreeStepWizardEnum.ProductSelection) {
      this.originalActivationDate = this.activationDate;
      this.originalValues = this.getOriginalValues();
    }
    if (this.step === ThreeStepWizardEnum.BasicProperties) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        size: 'md',
        backdrop: 'static',
        centered: true,
      });
      modalRef.componentInstance.title = 'Discard Order';
      modalRef.componentInstance.description =
        'The data you created in the order cannot be retrieved once you discard.';
      modalRef.componentInstance.firstButton = {
        buttonText: 'Discard',
        buttonClass: 'btn-secondary',
      };
      modalRef.componentInstance.secondButton = {
        buttonText: 'Continue Editing',
        buttonClass: 'btn-primary',
      };
      modalRef.result.then((res: string) => {
        if (res === 'cancel') this.router.navigateByUrl('/order');
      });
      return;
    }
    this.verifyStep(true, false);
    this.wizardService.wizardStepsReached = this.stepsReached;
    // this.step--;
    this.disableStepOnBack();
  }

  checkFormInvalidValues(formInvalid: boolean) {
    this.stepsWithIssue = formInvalid ? [this.step] : [];
  }

  onProductSelectionChanged($event: {
    estimatedTotal: number;
    disableProductSelectionNext: boolean;
    productSelectionErrorMessages: ErrorMessage[];
    productList: Product[];
    orderLines: OrderLine[];
  }) {
    this.disableProductSelectionNext = $event.disableProductSelectionNext;
    this.productSelectionErrorMessages = $event.productSelectionErrorMessages;
    this.productSelectionOnInitialState = false;
    this.productList = [...$event.productList];

    if (this.productSelectionErrorMessages.length) {
      this.stepsWithIssue = [this.step];
    } else {
      this.stepsWithIssue = [];
    }
    this.estimatedTotal = $event.estimatedTotal;
    this.productListChanged.emit({
      productList: [...$event.productList],
      orderLines: $event.orderLines.length
        ? [...$event.orderLines]
        : [...this.orderLines],
    });
    this.wizardService.productSelectionTouched = $event.productList.length > 0;
  }

  onJumpToStep(step: number) {
    this.step = step;
    if (step === ThreeStepWizardEnum.BasicProperties) {
      this.originalActivationDate = this.activationDate;
      this.originalValues = this.getOriginalValues();
    }
  }

  onManualProductSelectionClicked(event: number) {
    this.manualSelectProductClicked.emit(event);
  }

  onEditDeliveryDetailsClicked($event: number) {
    this.editDeliveryDetailsClicked.emit($event);
  }

  onFileUploaded($event: boolean) {
    this.fileUploaded.emit($event);
  }

  onProductListDirty($event: boolean) {
    this.isProductSelectionDirty = $event;
  }

  // it handles logic of what to do with delivery details
  // when there is data coming from voucher page
  // to use to send data to Review&Confirm page
  getDeliveryDetailsData(): void {
    const voucher = this.mockVoucherTemplateData;
    const defaultContent = this.deliveryDetailsFormGroup.getRawValue();
    const emailGreeting = voucher.emailGreeting ?? defaultContent.emailGreeting;
    const smsGreeting = voucher.smsGreeting ?? defaultContent.smsGreeting;

    const deliveryDetailsData: DeliveryDetails = {
      emailTemplate: defaultContent.emailTemplate,
      emailSubject: defaultContent.emailSubject,
      emailGreeting: emailGreeting,
      msgEncoding: defaultContent.msgEncoding,
      smsGreeting: smsGreeting,
    };
  }

  setActivationDate() {
    const activationType = this.basicInfoFormGroup.get('activationType');
    const afterPublished = this.basicInfoFormGroup.get('afterPublished');
    const activationDate = this.basicInfoFormGroup.get('activationDate');
    activationType?.valueChanges.subscribe((type: ActivationTypeEnum) => {
      if (
        type === ActivationTypeEnum.SameAsPublishDate ||
        type === ActivationTypeEnum.FixedOfDate
      ) {
        activationDate?.valueChanges.subscribe(
          (item: string | number | Date) => {
            this.activationDate = this.datePipe.transform(
              new Date(item),
              'yyyy-MM-dd'
            );
          }
        );
      } else if (type === ActivationTypeEnum.NDaysFromPublishDate) {
        afterPublished?.valueChanges.subscribe((item: any) => {
          const newDate = this.getActivationDateFromNDays(item);
          this.activationDate = this.datePipe.transform(newDate, 'yyyy-MM-dd');
        });
      } else {
        this.activationDate = null;
      }
    });
  }

  private getActivationDateFromNDays(item: any) {
    const publishDate = this.basicInfoFormGroup.get('publishDate');
    const parsedValue = parseInt(item);
    if (!parsedValue) {
      item = 0;
      return;
    }
    const date = new Date(publishDate?.value);
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + parsedValue
    );
  }

  private showActivationDateChangeModal() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });

    modalRef.componentInstance.title = 'Confirm Activation date change';
    modalRef.componentInstance.description =
      'Are you sure you want to change the activation date? Your uploaded products will be cleared, and you will need to re-upload it again.';
    modalRef.componentInstance.firstButton = {
      buttonText: 'Use previous date',
      buttonClass: 'btn-secondary',
    };
    modalRef.componentInstance.secondButton = {
      buttonText: 'Change date',
      buttonClass: 'btn-primary',
    };

    modalRef.result.then((res: string) => {
      if (res === 'confirm') {
        this.productListChanged.emit({
          productList: [],
          orderLines: [],
        });
        this.productSelectionOnInitialState = true;
        this.disableProductSelectionNext = true;
        this.verifyStep(true, true);
      }
      if (res === 'cancel') {
        this.revertChanges();
        this.verifyStep(true, true);
      }
    });
  }

  private getOriginalValues(): FieldValue[] {
    const fields = ['publishDate', 'activationType', 'hasNoTargetPublishDate'];
    const originalValues = fields
      .map((fieldName) => ({
        fieldName,
        value: this.basicInfoFormGroup.value[fieldName],
      }))
      .filter((field) => field.value !== undefined);
    originalValues.push({
      fieldName: 'activationDate',
      value: this.basicInfoFormGroup.get('activationDate')?.value,
    });
    originalValues.push({
      fieldName: 'afterPublished',
      value: this.basicInfoFormGroup.get('afterPublished')?.value,
    });
    return originalValues;
  }

  revertChanges() {
    this.originalValues.forEach((obj: FieldValue) => {
      const originalControl = this.basicInfoFormGroup.get(obj.fieldName);
      if (originalControl) {
        originalControl.setValue(obj.value, { emitEvent: false });
      }
    });
  }

  private navigateToOrderList() {
    this.router.navigateByUrl('/order').then(() => {
      this.toast.showSuccess('You have successfully created a new order!');
      this.productTemplateStateService.resetProductTemplateState();
    });
  }
}
