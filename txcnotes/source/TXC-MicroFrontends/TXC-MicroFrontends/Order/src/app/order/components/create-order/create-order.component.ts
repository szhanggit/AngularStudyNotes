import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  NgbDate,
  NgbDateParserFormatter,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { CreateOrderScreenEnum } from '../../enums/create-order-screen.enum';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { OrderLine, Product } from 'src/app/shared/models/product.model';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { SelectOrderTypeComponent } from './select-order-type/select-order-type.component';
import { QuotationStateService } from '../../services/state-service/quotation-state.service';
import { MsgEncodingType } from 'src/app/shared/enums/msg-encoding-type.enum';
import {
  INITIAL_SELECTED_QUOTATION_STATE,
  Quotation,
  QuotationPaginationParams,
} from '../../interface/quotation-state.interface';
import {
  FourStepWizardEnum,
  ThreeStepWizardEnum,
} from '../../enums/order-steps.enum';
import { OrderModeEnum } from '../../enums/order-mode.enum';
import { LanguageStateService } from '../../services/state-service/language-state.service';
import { EmailTemplateStateService } from '../../services/state-service/email-template-state.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  selectedTenant: string = '';

  validAt: string = '';
  searchTerm: string = '';
  selectedQuotation!: Quotation | null;
  selectedDate: string = '';

  loading$!: Observable<boolean>;
  quotations$: BehaviorSubject<Quotation[]> = new BehaviorSubject([
    INITIAL_SELECTED_QUOTATION_STATE,
  ]);
  total$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  modalRef!: NgbModalRef;
  isDateInvalid: boolean = false;

  isAPI = false;
  isIndirect = false;
  isPaperVoucher = false;

  currentScreen = CreateOrderScreenEnum.SelectQuotation;

  // quotation paginated list properties
  total: number = 0;
  pageCount: number = 0;
  itemStart: number = 0;
  itemEnd: number = 0;
  page: number = 0;
  pageSize: number = 0;
  quotationPaginationParams!: QuotationPaginationParams;
  isSearchInProgress: boolean = false;
  isLoading: boolean = false;

  loadEmailTemplates = [OrderModeEnum.DirectNonAPI, OrderModeEnum.API];

  get createOrderScreen(): typeof CreateOrderScreenEnum {
    return CreateOrderScreenEnum;
  }

  basicPropertiesFormGroup!: FormGroup;
  deliveryDetailsFormGroup!: FormGroup;
  step = 1;
  stepsReached: number[] = [1];
  stepsWithIssue: number[] = [];

  productList: Product[] = [];
  orderLines: OrderLine[] = [];

  fromUpload = false;
  editMode = false;
  product!: Product | undefined;
  isProductSelectionDirty = false;

  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private modalSvc: NgbModal,
    public formatter: NgbDateParserFormatter,
    private formBuilder: FormBuilder,
    private quotationStateService: QuotationStateService,
    private languageStateService: LanguageStateService,
    private emailTemplateStateService: EmailTemplateStateService
  ) {}

  ngOnInit(): void {
    this.languageStateService.setLanguageList();
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }
    this.initializeQuotationList();
    this.initializeBasicPropertiesForm();
    this.initializeDeliveryDetailsForm();
  }

  ngOnDestroy() {
    this.quotationStateService.clearQuotationPaginated();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  initializeQuotationList() {
    this.quotationStateService.quotationPaginated$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((quotationPaginated) => {
        this.total$.next(quotationPaginated.totalCount);
        this.total = quotationPaginated.totalCount;
        this.pageSize = quotationPaginated.itemPerPage;
        this.page = quotationPaginated.currentPage;
        this.quotations$.next(quotationPaginated.quotationItemList);

        // auto select first option
        if (quotationPaginated.quotationItemList?.length) {
          this.selectedQuotation = quotationPaginated.quotationItemList[0];
        }
        this.isLoading = false;
      });
  }

  onPageChange(pageIndex: number) {
    this.quotationPaginationParams.pageIndex = pageIndex;
    this.quotationPaginationParams.pageSize = this.pageSize;
    this.quotationStateService.getQuotationPaginated(
      this.quotationPaginationParams
    );
  }

  initializeBasicPropertiesForm() {
    this.basicPropertiesFormGroup = this.formBuilder.group({
      basicInfoFormGroup: this.formBuilder.group({
        orderName: new FormControl({ value: null, disabled: false }, [
          Validators.required,
          Validators.maxLength(100),
        ]),
        publishDate: new FormControl({ value: null, disabled: false }, [
          Validators.required,
        ]),
        hasNoTargetPublishDate: new FormControl({
          value: false,
          disabled: false,
        }),
        activationType: new FormControl({ value: -1, disabled: false }, [
          Validators.required,
        ]),
        activationDate: new FormControl({ value: null, disabled: true }, [
          Validators.required,
        ]),
        afterPublished: new FormControl({ value: null, disabled: true }, [
          Validators.required,
          Validators.min(1),
          Validators.pattern(/^[1-9]\d*$/),
        ]),
      }),
      settingsFormGroup: this.formBuilder.group({
        excelFormat: new FormControl({ value: 1, disabled: false }, [
          Validators.required,
        ]),
        excelShortUrl: new FormControl({ value: 1, disabled: false }, [
          Validators.required,
        ]),
        barcodeInfo: new FormControl({ value: 1, disabled: false }, [
          Validators.required,
        ]),
        emailAttachment: new FormControl({ value: 1, disabled: false }, [
          Validators.required,
        ]),
        shortUrlAuthCodeGenerationWay: new FormControl(
          { value: 1, disabled: false },
          [Validators.required]
        ),
        generateSequenceNumber: new FormControl({
          value: false,
          disabled: false,
        }),
        channelId: new FormControl({ value: null, disabled: false }),
      }),
      memoFormGroup: this.formBuilder.group({
        memo: new FormControl({ value: null, disabled: false }),
      }),
      attachmentFormGroup: this.formBuilder.group({
        attachments: new FormControl({ value: null, disabled: false }),
      }),
    });
  }

  initializeDeliveryDetailsForm() {
    // mock template data until API integration is applied
    const template = this.selectedTenant !== 'IN' ? null : 'Original';
    this.deliveryDetailsFormGroup = this.formBuilder.group({
      emailTemplate: [
        { value: template, disabled: this.selectedTenant === 'IN' },
        Validators.required,
      ],
      emailSubject: [null, [Validators.required, Validators.maxLength(500)]],
      emailGreeting: [null, Validators.maxLength(500)],
      msgEncoding: [
        {
          value: MsgEncodingType.Big5,
          disabled: false,
        },
        Validators.required,
      ],
      smsGreeting: [null],
    });
  }

  onSearch() {
    this.isSearchInProgress = true;
    this.isLoading = true;
    this.searchTerm = this.searchTerm.trim();
    const validOn = this.validAt ? new Date(this.validAt).toUTCString() : '';
    this.quotationPaginationParams = {
      keyword: this.searchTerm,
      validOn: validOn,
    };
    this.quotationStateService.getQuotationPaginated(
      this.quotationPaginationParams
    );
  }

  onReset(d: any) {
    this.isSearchInProgress = false;
    this.searchTerm = '';
    this.validAt = '';
    this.selectedQuotation = null;

    d.writeValue(null);
    this.quotationPaginationParams = {};
    this.quotationStateService.clearQuotationPaginated();
    if (this.isDateInvalid) this.isDateInvalid = false;
  }

  resetSearch() {
    this.searchTerm = '';
  }

  onConfirm() {
    this.modalRef = this.modalSvc.open(SelectOrderTypeComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });

    this.modalRef.result.then((selectedOrderType) => {
      this.quotationStateService.setSelectedOrderModeState(selectedOrderType);
      if (this.loadEmailTemplates.includes(selectedOrderType.key)) {
        this.emailTemplateStateService
          .setEmailTemplates()
          .pipe(takeUntil(this.destroyed$))
          .subscribe();
      }
      this.currentScreen = CreateOrderScreenEnum.OrderWizard;
    });

    this.modalRef.componentInstance.selectedQuotation = this.selectedQuotation;
  }

  onDateSelection(date: NgbDate) {
    this.selectedDate = this.getDateString(date);
    this.validAt = this.getDateString(date);
    if (this.isDateInvalid) this.isDateInvalid = false;
  }

  getDateString(date: NgbDate, delimiter: string = '/') {
    return `${date?.year}${delimiter}${(date?.month || '')
      .toString()
      .padStart(2, '0')}${delimiter}${(date?.day || '')
      .toString()
      .padStart(2, '0')}`;
  }

  onSearchKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 13 && !this.isDateInvalid) {
      this.onSearch();
    }
  }

  onDatePickerInputChange(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (value && !regex.test(value)) {
      this.selectedDate = '';
      this.isDateInvalid = true;
      return;
    } else {
      this.isDateInvalid = false;
      this.selectedDate = value;
      this.validAt = this.selectedDate;
    }
  }

  onManualProductSelectionClicked($event: number) {
    if ($event > 0) {
      this.editMode = true;
      this.product = this.productList.find((p) => p.id === $event);
    } else {
      this.editMode = false;
    }

    this.currentScreen = CreateOrderScreenEnum.ManualSelectProduct;
  }

  onEditDeliveryDetailsClicked() {
    this.currentScreen = CreateOrderScreenEnum.EditDeliveryContent;
  }

  private goBackToProductSelectionStep() {
    this.step = ThreeStepWizardEnum.ProductSelection;
    this.stepsReached = [
      ThreeStepWizardEnum.BasicProperties,
      ThreeStepWizardEnum.ProductSelection,
    ];
    this.currentScreen = CreateOrderScreenEnum.OrderWizard;
  }

  onManualSelectProductCancelled() {
    this.goBackToProductSelectionStep();
  }

  onManualSelectProductConfirmed($event: Product) {
    if (this.editMode) {
      const index = this.productList.findIndex(
        (product) => product.id === $event.id
      );
      this.productList.splice(index, 1, $event);
    } else {
      const index = this.productList.findIndex(
        (product) => product.id === $event.id
      );
      if (index > -1) {
        this.productList.splice(index, 1);
      }
      this.productList = [$event, ...this.productList];
    }

    this.isProductSelectionDirty = true;
    this.goBackToProductSelectionStep();
  }

  onProductListChanged($event: {
    productList: Product[];
    orderLines: OrderLine[];
  }) {
    this.productList = [...$event.productList];
    this.orderLines = [...$event.orderLines];
  }

  onFileUploaded($event: boolean) {
    this.fromUpload = $event;
  }

  onGoBackToOrderWizard() {
    this.step = FourStepWizardEnum.DeliveryDetails;
    this.stepsReached = [
      FourStepWizardEnum.BasicProperties,
      FourStepWizardEnum.ProductSelection,
      FourStepWizardEnum.DeliveryDetails,
    ];
    this.currentScreen = CreateOrderScreenEnum.OrderWizard;
  }
}
