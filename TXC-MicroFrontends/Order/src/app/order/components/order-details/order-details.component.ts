import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { OrderStatusEnum } from '../../enums/order-status.enum';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { OrderBasicInfoFieldsDefinition } from 'src/app/shared/models/fields-definition/order-basic-info-fields-definition.model';
import { OrderSettingsFieldsDefinition } from 'src/app/shared/models/fields-definition/order-settings-fields-definition.model';
import { OrderMemoFieldsDefinition } from 'src/app/shared/models/fields-definition/order-memo-fields-definition.model';
import { OrderAttachmentFieldsDefinition } from 'src/app/shared/models/fields-definition/order-attachment-fields-definition.model';
import { ProductSelectionTableDefinition } from 'src/app/shared/models/table-definition/product-selection-table-definition.model';
import { DatePipe } from '@angular/common';
import {
  Product,
  OrderLine as OrderLineProduct,
} from 'src/app/shared/models/product.model';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { OrderService } from '../../services/order.service';
import { FormEmitterService } from 'src/app/shared/dumb/form/form-emitter.service';
import { EditOrderDetailsEnum } from '../../enums/edit-order-details.enum';
import {
  ErrorValidationDto,
  OrderRequest,
} from '../../models/order-request.model';
import {
  ErrorMessage,
  StatusMessage,
} from 'src/app/shared/models/dumb-models/error-message.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CloseOrderModalComponent } from './close-order-modal/close-order-modal.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrderOperationsEnum } from '../../enums/order-operations.enum.';
import { QAToolsOrderDetailsFieldsDefinition } from 'src/app/shared/models/fields-definition/qa-tools-order-details-fields-definition.model';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DownloadExcelFileComponent } from './download-excel-file/download-excel-file.component';
import { ConfirmationModalComponent } from '@txc-angular/component-library';
import { SendFileComponent } from './send-file/send-file.component';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { CloseModalEnum } from '../../enums/close-modal.enum';
import { OrderMode } from '../../models/quotation-type.model';
import { OrderModeEnum } from '../../enums/order-mode.enum';
import { ORDER_CONSTANTS } from '../../constants/quotation-constants';
import { DeliveryDetailsFieldsDefinition } from 'src/app/shared/models/fields-definition/delivery-details-fields-definition.model';
import { MsgEncodingType } from 'src/app/shared/enums/msg-encoding-type.enum';
import { QuotationStateService } from '../../services/state-service/quotation-state.service';
import {
  TableHeader,
  TableModel,
  TableRow,
} from 'src/app/shared/models/dumb-models/table.model';
import { SyncStatusHistoryComponent } from './sync-status-history/sync-status-history.component';
import {
  ExpirationPolicy,
  Order,
  OrderLine,
  OrderLineDetails,
  ProductVersion,
  ServedQuantity,
} from '../../models/order.model';
import { ExportDeliveryComponent } from '../export-delivery/export-delivery.component';
import { DropdownItem } from 'src/app/shared/models/dropdown-item.model';
import { DeliveryStatusService } from '../../services/delivery-status.service';
import { TemplateTypeEnum } from 'src/app/shared/enums/template.enum';
import { FourStepWizardEnum } from '../../enums/order-steps.enum';
import { TotalQuantities } from 'src/app/shared/models/total-quantities.model';
import { ProductService } from '../../services/product.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { OrderBasicInfoModel } from '../../models/order-basic-info.model';
import { OrderSettingsModel } from '../../models/order-settings.model';
import { BusinessUnitEnum } from 'src/app/shared/enums/tenant.enum';
import { Quotation } from '../../interface/quotation-state.interface';
import { AttachmentService } from '../../services/attachment.service';
import { CustomFile, FileEvent } from 'src/app/shared/models/custom-file.model';
import { saveAs } from 'file-saver';
import { switchMap, map, Subject, takeUntil, of, forkJoin } from 'rxjs';
import { ExpiryPolicyService } from '../../services/expiry-policy.service';
import { DictionaryService } from '../../services/dictionary.service';
import { Dictionary } from '../../models/dictionary.model';
import { DefaultDeliveryModel } from '../../models/default-delivery.model';
import { QuotationService } from '../../services/quotation.service';
import { FileEventTypeEnum } from 'src/app/shared/enums/file-event-type.enum';
import { BaseResponse } from '../../models/base-response.model';
import { EmailTemplateStateService } from '../../services/state-service/email-template-state.service';
import { EmailTemplateOption } from '../../interface/product-state.interface';
import { LanguageStateService } from '../../services/state-service/language-state.service';
import { OrderHistoryService } from '../../services/order-history.service';
import { OrderActionHistory } from '../../models/order-history.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  order!: Order;
  orderId!: number;
  orderCreatedDateTime!: string;
  isAPI = false;
  isIndirect = true;
  isPaperVoucher = false;
  orderStatus = OrderStatusEnum.Created;
  orderDetailsState: number = EditOrderDetailsEnum.ViewDetails;

  destroyed$: Subject<boolean> = new Subject<boolean>();

  loadEmailTemplates = [OrderModeEnum.DirectNonAPI, OrderModeEnum.API];

  // accordions
  orderReferenceCollapsed = false;
  basicPropertiesCollapsed = false;
  attachmentCollapsed = false;
  productSelectionCollapsed = false;

  // basic props
  takeAllRow = true;
  basicPropertiesFormGroup!: FormGroup;
  basicInfoFormGroup!: FormGroup;
  settingsFormGroup!: FormGroup;
  memoFormGroup!: FormGroup;
  attachmentFormGroup!: FormGroup;
  deliveryDetailsFormGroup!: FormGroup;
  computedActivatedDate!: string;
  nDaysFromPublishDate!: string;

  // selected product list
  showChildProduct = false;
  productList: Product[] = [];
  estimatedTotal!: number;
  isProductListDirty = false;
  totalQuantities!: TotalQuantities;
  productSelectionErrorMessages: ErrorMessage[] = [];
  selectedProduct!: Product;
  // failed order
  failedErrorMessages: ErrorMessage[] = [];

  _statusMessages: StatusMessage[] = [];

  public get statusMessages(): StatusMessage[] {
    if (this._statusMessages.length) {
      return this._statusMessages;
    }

    this._statusMessages = [
      {
        header:
          this.order?.status === OrderStatusEnum.Closed
            ? 'Closed reason'
            : 'Rejected reason',
        description: this.order?.comment,
      },
      {
        header: 'Operator / Time',
        approver: this.order?.operator,
        approvalTime: this.order?.createdDateTime,
      },
    ];

    return this._statusMessages;
  }
  public set statusMessages(v: StatusMessage[]) {
    this._statusMessages = [...v];
  }

  // select product manually
  selectedQuotation!: Quotation;
  selectProductEditMode = false;
  currentProduct!: Product | undefined;

  // edit original values
  originalOrderValues?: OrderRequest;
  originalProductList: Product[] = [];

  selectedOrderMode!: OrderMode;
  // qa tools - TO BE REMOVED when doing API Integration
  hideQATools = true;
  qaToolsCollapsed = true;
  qaToolsFormGroup!: FormGroup;
  qaToolsFieldsDefinition: QAToolsOrderDetailsFieldsDefinition =
    new QAToolsOrderDetailsFieldsDefinition();
  selectedTenant: string = '';
  isViewOnlyTrustAccount = true;
  // initialize options for distribution section export dropdown
  dropdownItems: DropdownItem[] = [
    {
      text: 'Email message status',
      value: TemplateTypeEnum.Email,
      action: (val: number) => this.onExport(val, this.order),
    },
    {
      text: 'SMS message status',
      value: TemplateTypeEnum.SMS,
      action: (val: number) => this.onExport(val, this.order),
    },
  ];
  // distribution section tables
  distributionTableHeaders: TableHeader[] = [
    {
      headerId: 'deliveryStatus',
      headerName: 'Delivery status',
    },
    {
      headerId: 'quantity',
      headerName: 'Quantity',
    },
  ];

  syncTableHeaders: TableHeader[] = [
    {
      headerId: 'deliveryStatus',
      headerName: 'Delivery status',
    },
    {
      headerId: 'quantity',
      headerName: 'Quantity',
    },
  ];

  smsTableRows: TableRow[] = [];
  emailTableRows: TableRow[] = [];
  deliveryContentStep = FourStepWizardEnum.DeliveryDetails;
  orderModes = OrderModeEnum;
  orderStatuses = OrderStatusEnum;
  businessUnits = BusinessUnitEnum;
  isAdvanceBilling: boolean = false;
  deletedAttachments: FileEvent[] = [];
  orderLines: OrderLineProduct[] = [];
  quotationId!: number;
  disableChildToggle: boolean = false;
  orderVoucherIds: string[] = [];

  get isActiveAllDisabled() {
    return this.productList.every((product) => product.isActive);
  }

  get smsTableModel(): TableModel {
    return {
      tableHeaders: this.distributionTableHeaders,
      tableRows: this.smsTableRows,
    };
  }

  get emailTableModel(): TableModel {
    return {
      tableHeaders: this.distributionTableHeaders,
      tableRows: this.emailTableRows,
    };
  }

  get qaToolsFormModel(): FormModel {
    return {
      title: 'QA Tools',
      formGroup: this.qaToolsFormGroup,
      fieldsDefinition: this.qaToolsFieldsDefinition.define(),
    };
  }

  get showActiveAllProductList() {
    return (
      this.orderStatus === this.orderStatuses.Published &&
      this.selectedOrderMode?.key === this.orderModes.API &&
      this.isOrderEditor
    );
  }

  orderBasicInfoFieldsDefinition: OrderBasicInfoFieldsDefinition =
    new OrderBasicInfoFieldsDefinition();

  settingsFieldsDefinition: OrderSettingsFieldsDefinition =
    new OrderSettingsFieldsDefinition(this.selectedOrderMode);

  memoFieldsDefinitionTakeAllRow: OrderMemoFieldsDefinition =
    new OrderMemoFieldsDefinition(this.takeAllRow);

  memoFieldsDefinition: OrderMemoFieldsDefinition =
    new OrderMemoFieldsDefinition();

  attachmentFieldsDefinition: OrderAttachmentFieldsDefinition =
    new OrderAttachmentFieldsDefinition(false);

  deliveryDetailsFieldsDefinition = new DeliveryDetailsFieldsDefinition();

  get productSelectionTableModel() {
    return new ProductSelectionTableDefinition(
      this.selectedOrderMode,
      undefined,
      this.orderStatus,
      this.orderStatus === OrderStatusEnum.Published
    ).define();
  }

  get orderMode(): number {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.order?.mode;
    }

    return this.qaToolsFormGroup.get('orderMode')!.value;
  }

  get editOrderDetailsType(): typeof EditOrderDetailsEnum {
    return EditOrderDetailsEnum;
  }

  get userRoleEnum(): typeof OrderOperationsEnum {
    return OrderOperationsEnum;
  }

  get closeModalEnum(): typeof CloseModalEnum {
    return CloseModalEnum;
  }

  get basicInfoFormModel(): FormModel {
    return {
      title: 'Basic Info',
      formGroup: this.basicInfoFormGroup,
      fieldsDefinition: this.orderBasicInfoFieldsDefinition.define(),
    };
  }

  get settingsFormModel(): FormModel {
    return {
      title: 'Settings',
      formGroup: this.settingsFormGroup,
      fieldsDefinition: this.settingsFieldsDefinition.define(),
    };
  }

  get memoFormModel(): FormModel {
    return {
      title: 'Memo',
      formGroup: this.memoFormGroup,
      fieldsDefinition:
        this.orderDetailsState === EditOrderDetailsEnum.ViewDetails
          ? this.memoFieldsDefinitionTakeAllRow.define()
          : this.memoFieldsDefinition.define(),
    };
  }

  get attachmentFormModel(): FormModel {
    return {
      title: 'Attachment',
      formGroup: this.attachmentFormGroup,
      fieldsDefinition: this.attachmentFieldsDefinition.define(),
      actionButtons: [
        {
          text: 'Upload file',
          formControlName: 'attachments',
        },
      ],
    };
  }

  get deliveryDetailsFormModel(): FormModel {
    return {
      formGroup: this.deliveryDetailsFormGroup,
      fieldsDefinition: this.deliveryDetailsFieldsDefinition.define(),
    };
  }

  get attachments() {
    return this.attachmentFormGroup.get('attachments');
  }

  getComputedActivatedDate() {
    const date = new Date(
      this.basicInfoFormGroup.get('publishDate')?.value?._d
    );

    const n = Number(this.basicInfoFormGroup.get('afterPublished')?.value);
    if (date && !isNaN(date.getTime()) && n) {
      return this.datePipe.transform(
        new Date(date.setDate(date.getDate() + n)),
        'YYYY/MM/dd hh:mm a'
      );
    }

    return 'NA';
  }

  getNdaysFromPublishDate() {
    const options = this.basicInfoFormModel.fieldsDefinition.find(
      (f) => f.formControlName === 'activationType'
    )?.select2Data;

    const n = Number(this.basicInfoFormGroup.get('afterPublished')?.value);
    const optionLabel = options?.find(
      (data: any) =>
        data?.value === this.basicInfoFormGroup.get('activationType')?.value
    )?.label;
    if (optionLabel === 'n days from publish date') {
      const n = this.basicInfoFormGroup.get('afterPublished')?.value;
      return optionLabel.replace('n', n);
    }
    return optionLabel || '--';
  }

  private isOrderModeMock(mode: number): boolean {
    return [OrderModeEnum.PaperVoucher].includes(mode);
  }

  // show edit when you have creator role
  // doesnt check isOrderCreator
  get showEditBtn(): boolean {
    return this.isOrderEditor;
  }

  get showTrustAccountActionBtn(): boolean {
    return (
      this.orderStatus === this.orderStatuses.Created ||
      (this.orderStatus === this.orderStatuses.Rejected &&
        !(
          this.canApprove &&
          !this.isOrderCreator &&
          this.orderStatus === this.orderStatuses.Rejected
        ))
    );
  }

  get isThreeButtons(): boolean {
    // can have three buttons on Approved
    // if can finance approve and we show close order
    if (this.orderStatus === OrderStatusEnum.Approved) {
      return this.canFinanceApprove && this.showCloseOrderBtn;
    }
    return false;
  }

  get showCloseOrderBtn(): boolean {
    if (
      [
        this.orderStatuses.Created,
        this.orderStatuses.Approved,
        this.orderStatuses.ApprovedByFT,
        this.orderStatuses.Rejected,
        this.orderStatuses.Failed,
      ].includes(this.orderStatus) ||
      (this.orderStatus === this.orderStatuses.Published &&
        this.orderMode === this.orderModes.API)
    ) {
      return this.canCloseOrder;
    }

    return false;
  }

  get showRejectBtn(): boolean {
    if (!this.isOrderCreator) {
      return (
        // Under Review && can reject order
        (this.canRejectOrder &&
          this.orderStatus === this.orderStatuses.UnderReview) ||
        // Approved && can reject order should be with
        // advance billing to determine if need next step
        // else hide them and wait for publishing
        (this.canRejectOrder &&
          this.orderStatus === this.orderStatuses.Approved &&
          this.isAdvanceBilling)
      );
    } else {
      return false;
    }
  }

  get showApproveBtn(): boolean {
    if (!this.isOrderCreator) {
      return (
        // Under Review && can approve
        (this.canApprove &&
          this.orderStatus === this.orderStatuses.UnderReview) ||
        // Approved and can finance approve should be with
        // advance billing to determine if need next step
        // else hide and wait for publishing
        (this.canFinanceApprove &&
          this.orderStatus === this.orderStatuses.Approved &&
          this.isAdvanceBilling)
      );
    } else {
      return false;
    }
  }

  get showSubmitBtn(): boolean {
    if (this.orderStatus === this.orderStatuses.Failed) {
      return this.canRepublishOrder;
    }
    return (
      this.canSubmitOrder &&
      (this.orderStatus === this.orderStatuses.Created ||
        this.orderStatus === this.orderStatuses.Rejected)
    );
  }

  get showPlaceholderBtn(): boolean {
    switch (this.orderStatus) {
      // can have single button on UnderReview if cant approve
      case OrderStatusEnum.UnderReview:
        return !this.canApprove;
      // add placeholder when Approved and you have 3 buttons
      // or cant reject
      // or order owner
      case OrderStatusEnum.Approved:
        return (
          (this.showCloseOrderBtn &&
            this.canRejectOrder &&
            this.canFinanceApprove) ||
          !this.canRejectOrder ||
          this.isOrderCreator
        );
      // add placeholder when ApprovedByFT
      case OrderStatusEnum.ApprovedByFT:
        return this.showCloseOrderBtn;
      // add placeholder when cant republish order on Failed
      case OrderStatusEnum.Failed:
        return this.showCloseOrderBtn && !this.canRepublishOrder;
      // add placeholder when Published and mode is API
      case OrderStatusEnum.Published:
        return this.orderMode === OrderModeEnum.API;
      // can have single button if you can close order but cant submit
      default:
        return this.showCloseOrderBtn && !this.canSubmitOrder;
    }
  }

  get isOrderEditor(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.EditOrder,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.EditOrder);
  }

  get isOrderCreator(): boolean {
    // TO BE REMOVED on API integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return (
        this.order.createdBy?.toLowerCase() ===
        this.authLibraryService.userName?.toLowerCase()
      );
    }
    return this.qaToolsFormGroup.get('isOrderCreator')!.value;
  }

  get canApprove(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.ApproveOrder,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.ApproveOrder);
  }

  get canFinanceApprove(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.Approve2ndOrder,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.Approve2ndOrder);
  }

  get canViewOrder(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.ViewOrder,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.ViewOrder);
  }

  get canRejectOrder(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.RejectOrder,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.RejectOrder);
  }

  get canSubmitOrder(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.SubmitOrder,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.SubmitOrder);
  }

  get canCloseOrder(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.CloseOrder,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.CloseOrder);
  }

  get canDownloadFile(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.DownloadFile,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.DownloadFile);
  }

  get canSendFile(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.SendFile,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.SendFile);
  }

  get canRepublishOrder(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.RepublishOrder,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.RepublishOrder);
  }

  get canExportDeliveryStatus(): boolean {
    // TO BE REMOVED on API Integration
    if (!this.qaToolsFormGroup.get('simulateAMMRoles')!.value) {
      return this.authLibraryService.getElementOperationFlag([
        OrderOperationsEnum.ExportDeliveryStatus,
      ]);
    }
    return this.qaToolsFormGroup
      .get('roles')!
      .value.includes(OrderOperationsEnum.ExportDeliveryStatus);
  }

  get isPublishedApi() {
    return (
      this.orderStatus === this.orderStatuses.Published &&
      this.selectedOrderMode?.key === this.orderModes.API
    );
  }

  get enableForCreatorOnly() {
    return !this.canApprove || this.isOrderCreator;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public orderSvc: OrderService,
    private formEmitterService: FormEmitterService,
    private modalSvc: NgbModal,
    private router: Router,
    private authLibraryService: AuthorizationLibraryService,
    private quotationStateService: QuotationStateService,
    private modalService: NgbModal,
    private deliveryStatusService: DeliveryStatusService,
    private productService: ProductService,
    private attachmentService: AttachmentService,
    private expirationPolicyService: ExpiryPolicyService,
    private dictionaryService: DictionaryService,
    private quotationService: QuotationService,
    private emailTemplateStateService: EmailTemplateStateService,
    private languageStateService: LanguageStateService,
    private orderHistoryService: OrderHistoryService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.orderId = params['id'];
    });

    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }

    this.initializeForm();
    this.setEmailTemplateOptions();
    this.setSelectedOrderMode();
    this.setSelectedQuotationId();
    this.getDeliveryTableFields(1, this.emailTableRows);
    this.getDeliveryTableFields(2, this.smsTableRows);
    this.fetchOrderDetails();
    this.languageStateService.setLanguageList();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  getDeliveryTableFields(eventType: number, tableRows: TableRow[]) {
    this.deliveryStatusService.getDeliveryStatus(eventType).forEach((item) => {
      const tableRow: TableRow = {
        data: [{ value: item.status }, { value: item.quantity.toString() }],
      };

      tableRows.push(tableRow);
    });
  }

  onExport(event: number, order: Order) {
    const exportOrderModalRef = this.modalService.open(
      ExportDeliveryComponent,
      {
        size: 'md',
        backdrop: 'static',
        centered: true,
      }
    );
    exportOrderModalRef.componentInstance.eventType = event;
    exportOrderModalRef.componentInstance.order = order;
    exportOrderModalRef.componentInstance.orderMode = this.orderMode;
    exportOrderModalRef.componentInstance.tab =
      this.orderMode !== OrderModeEnum.API ? 1 : 2;
  }

  onOrderDetailsStateChange(editOrderDetailsType: number, save = false) {
    if (
      editOrderDetailsType !== EditOrderDetailsEnum.Attachment &&
      !this.isPublishedApi
    ) {
      // scroll to top
      window.scrollTo(0, 0);
    }

    switch (editOrderDetailsType) {
      case EditOrderDetailsEnum.BasicInfo: {
        // basic info and settings always disabled
        this.basicInfoFormGroup.disable();
        this.settingsFormGroup.disable();

        this.originalOrderValues = this.deepCopy(
          this.basicPropertiesFormGroup.getRawValue()
        );

        this.attachmentFieldsDefinition = new OrderAttachmentFieldsDefinition();
        this.basicPropertiesFormGroup.markAsPristine();
        this.takeAllRow = false;
        this.orderDetailsState = EditOrderDetailsEnum.BasicInfo;
        break;
      }
      case EditOrderDetailsEnum.Attachment: {
        this.formEmitterService.emitEvent.next('attachments');
        break;
      }
      case EditOrderDetailsEnum.SelectedProductList: {
        if (this.isPublishedApi) {
          this.selectProductOnPublishedApi();
          break;
        }

        this.originalProductList = [...this.productList];
        this.isProductListDirty = false;
        this.orderDetailsState = EditOrderDetailsEnum.SelectedProductList;
        break;
      }
      case EditOrderDetailsEnum.DefaultDeliveryContent: {
        this.originalOrderValues = this.deliveryDetailsFormGroup.getRawValue();
        this.deliveryDetailsFormGroup.markAsPristine();
        this.takeAllRow = false;
        this.orderDetailsState = EditOrderDetailsEnum.DefaultDeliveryContent;
        break;
      }
      case EditOrderDetailsEnum.ViewDirectDeliveryDetails: {
        this.orderDetailsState =
          this.editOrderDetailsType.ViewDirectDeliveryDetails;
        break;
      }
      default: {
        switch (this.orderDetailsState) {
          case EditOrderDetailsEnum.BasicInfo: {
            if (save) {
              this.saveAttachmentsFromBasicProperties();
              this.updateBasicInfoDetails();
            } else {
              this.orderSvc.updateOrder(this.originalOrderValues!);
              this.attachments?.setValue(
                this.originalOrderValues?.attachmentFormGroup?.attachments
              );
            }
            this.deletedAttachments = [];
            this.setValuesFromOrderService(this.order);
            this.takeAllRow = true;
            this.attachmentFieldsDefinition =
              new OrderAttachmentFieldsDefinition(false);
            break;
          }

          case EditOrderDetailsEnum.SelectedProductList: {
            if (!save) {
              this.productList = [...this.originalProductList];
            } else {
              this.orderSvc
                .batchUpdateOrderLine(this.orderId, this.orderLines, true)
                .subscribe({
                  next: (res: BaseResponse) => {
                    if (res.success) {
                      this.fetchOrderDetails();
                    } else {
                      this.toast.showDanger(res.message);
                    }
                  },
                  error: () => {
                    this.toast.showDanger(
                      'Error updating selected product list. Please try again later.'
                    );
                  },
                });
            }
            this.assignSelectedProductsSummaryValues();
            break;
          }

          case EditOrderDetailsEnum.DefaultDeliveryContent: {
            if (save) {
              const deliveryDetailsValue =
                this.deliveryDetailsFormGroup.getRawValue();
              this.orderSvc
                .updateDefDelContent(this.orderId, deliveryDetailsValue)
                .pipe(takeUntil(this.destroyed$))
                .subscribe((result: BaseResponse) => {
                  if (!result.success) {
                    this.toast.showDanger(
                      result.message ??
                        'Error in updating default delivery content. Please try again later.'
                    );
                  } else {
                    this.order.mwvEmailTemplateId =
                      deliveryDetailsValue.emailTemplate;
                    this.order.emailSubject = deliveryDetailsValue.emailSubject;
                    this.order.emailGreeting =
                      deliveryDetailsValue.emailGreeting;
                    this.order.smsGreeting = deliveryDetailsValue.smsGreeting;
                    this.order.msgEncoding = deliveryDetailsValue.msgEncoding;

                    this.setValuesFromOrderService(this.order);
                  }
                });
            } else {
              this.setValuesFromOrderService(this.order);
            }

            break;
          }

          default: {
            break;
          }
        }

        this.orderDetailsState = EditOrderDetailsEnum.ViewDetails;
        break;
      }
    }
  }

  onStatusChanged($event: { orderLineId: number; status: number }) {
    this.orderSvc
      .updateOrderLineStatus(this.orderId, [$event.orderLineId], $event.status)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: BaseResponse) => {
          if (!response.success) {
            this.toast.showDanger(
              'Error in updating order line status. Please try again later.'
            );
          }
        },
        error: () => {
          this.toast.showDanger(
            'Error in updating order line status. Please try again later.'
          );
          const orderLine = this.productList.find(
            (product) => product.orderLineId === $event.orderLineId
          );
          if (!orderLine) return;
          orderLine.isActive = $event.status === 1 ? false : true;
        },
      });
  }

  saveAttachmentsFromBasicProperties() {
    const tempAttachments = this.attachments?.value.filter(
      (attachment: CustomFile) => attachment.isRecentlyUploaded
    );

    if (this.deletedAttachments.length > 0) {
      this.deleteAttachments(this.deletedAttachments, true);
    }
    if (tempAttachments.length > 0) {
      this.uploadAttachment(tempAttachments, true);
    }
  }

  fileEvent(fileEvent: FileEvent, isFromBasicInfo: boolean = false) {
    switch (fileEvent.eventType) {
      case FileEventTypeEnum.UPLOAD:
        if (isFromBasicInfo) return;
        this.uploadAttachment(fileEvent.customFiles);
        break;
      case FileEventTypeEnum.DOWNLOAD:
        this.downloadAttachment(fileEvent.customFiles[0]);
        break;
      case FileEventTypeEnum.DELETE:
        if (isFromBasicInfo) {
          if (
            fileEvent.customFiles[0].hasDuplicate ||
            !fileEvent.customFiles[0].isRecentlyUploaded
          ) {
            this.deletedAttachments.push(fileEvent);
          }
          return;
        }
        this.deleteAttachments([fileEvent]);
        break;
      default:
        break;
    }
  }

  deleteAttachments(fileEvents: FileEvent[], isSave: boolean = false) {
    const fileNames: string[] = [];
    const indexes: number[] = [];
    fileEvents.forEach((fileEvent) => {
      fileNames.push(fileEvent.customFiles[0].name);
      indexes.push(fileEvent.index!);
    });
    this.attachmentService
      .deleteFileAttachment(this.orderId, this.orderCreatedDateTime, fileNames)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            if (isSave) {
              this.getAttachments(this.orderId);
              return;
            }
            const tempAttachments = [...this.attachments?.value];
            indexes.forEach((index) => {
              tempAttachments.splice(index, 1);
            });

            this.attachments?.setValue(tempAttachments);
          }
        },
        error: () => {
          this.toast.showDanger(
            'Error deleting attachment. Please try again later.'
          );
        },
      });
  }

  downloadAttachment(file: CustomFile) {
    this.attachmentService
      .downloadOrderAttachment(file.name, this.orderId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => {
          saveAs(res, file.name);
        },
        error: () => {
          this.toast.showDanger(
            'Error downloading attachment. Please try again later.'
          );
        },
      });
  }

  uploadAttachment(files: CustomFile[], isSave: boolean = false) {
    this.attachmentService
      .editFileAttachment(this.orderId, files)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.getAttachments(this.orderId);
          }
        },
        error: () => {
          this.toast.showDanger(
            'Error uploading attachment. Please try again later.'
          );
        },
      });
  }

  updateBasicInfoDetails() {
    const memoValue = this.memoFormGroup.get('memo')?.value;
    this.orderSvc.updateOrderBasicInfo(this.orderId, memoValue).subscribe({
      next: (res) => {
        if (res.success) {
          this.fetchOrderDetails();
        } else {
          this.toast.showDanger(res.message);
        }
      },
      error: () => {
        this.toast.showDanger(
          'Error updating basic info. Please try again later.'
        );
      },
    });
  }

  selectProductOnPublishedApi() {
    const modal = this.productService.openProductSelectionModal('orderDetails');

    modal.dismissed.subscribe((data) => {
      this.productList.unshift(...data.productList);
      this.productSelectionErrorMessages = data.errorMessages;
      this.assignSelectedProductsSummaryValues();
    });
  }

  onActiveAllClicked() {
    this.productList.forEach((product) => {
      product.isActive = true;
    });

    const orderLineIds = this.productList.map(
      (product) => product.orderLineId as number
    );

    this.orderSvc
      .updateOrderLineStatus(this.orderId, orderLineIds, 1)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: BaseResponse) => {
          if (!response.success) {
            this.toast.showDanger(
              'Error in updating order line status. Please try again later.'
            );
          }
        },
        error: () => {
          this.toast.showDanger(
            'Error in updating order line status. Please try again later.'
          );
        },
      });
  }

  onShowChildProduct(event: boolean) {
    this.showChildProduct = event;
    this.checkForChildProducts(event);
  }

  onProductSelectionChanged($event: {
    estimatedTotal: number;
    disableProductSelectionNext: boolean;
    productSelectionErrorMessages: ErrorMessage[];
    productList: Product[];
    orderLines: OrderLineProduct[];
  }) {
    this.productList = [...$event.productList];
    this.orderLines = [...$event.orderLines];
    this.productSelectionErrorMessages = [
      ...$event.productSelectionErrorMessages,
    ];
    this.estimatedTotal = $event.estimatedTotal;
  }

  onManualProductSelectionClicked($event: number) {
    if ($event > 0) {
      this.selectProductEditMode = true;
      this.currentProduct = this.productList.find((p) => p.id === $event);
    } else {
      this.selectProductEditMode = false;
    }

    this.orderDetailsState = EditOrderDetailsEnum.SelectProductManually;
  }

  onManualSelectProductCancelled() {
    this.goBackToProductSelection();
  }

  onManualSelectProductConfirmed($event: Product) {
    if (this.selectProductEditMode) {
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

    this.isProductListDirty = true;
    this.goBackToProductSelection();
  }

  onDirectDeliveryDetailsClicked($event: Product) {
    window.scrollTo(0, 0);
    this.selectedProduct = $event;
    this.orderDetailsState = EditOrderDetailsEnum.ViewDirectDeliveryDetails;
  }

  onSyncClicked(event: number) {
    const syncStatusHistoryModalRef = this.modalSvc.open(
      SyncStatusHistoryComponent,
      {
        size: 'lg',
        backdrop: 'static',
        centered: true,
      }
    );
    syncStatusHistoryModalRef.componentInstance.templateType = event;
    syncStatusHistoryModalRef.componentInstance.orderId = this.orderId;
    syncStatusHistoryModalRef.componentInstance.voucherIds =
      this.orderVoucherIds;
  }

  submitOrder(orderStatus: number) {
    window.scrollTo(0, 0);

    const orderStatusBody = {
      id: this.orderId,
      statusId: orderStatus,
    };
    switch (orderStatus) {
      case OrderStatusEnum.Failed:
        orderStatusBody.statusId = OrderStatusEnum.Publishing;
        break;
      case OrderStatusEnum.UnderReview:
        orderStatusBody.statusId = OrderStatusEnum.Approved;
        break;
      case OrderStatusEnum.Approved:
        orderStatusBody.statusId = OrderStatusEnum.ApprovedByFT;
        break;
      default:
        orderStatusBody.statusId = OrderStatusEnum.UnderReview;
        break;
    }

    if (this.isOrderModeMock(this.orderMode)) {
      this.navigateToOtherStatus(orderStatusBody.statusId);
    } else {
      this.statusMessages = [];
      this.orderSvc.updateOrderStatus(orderStatusBody).subscribe({
        next: (res) => {
          if (res.success) {
            this.orderStatus = orderStatusBody.statusId;
            this.failedErrorMessages = [];
          } else {
            this.failedErrorMessages.push({
              type: 'Order Status',
              description:
                'There was an error updating order. Please try again later.',
            });
          }
        },
        error: (err) => {
          this.failedErrorMessages = [];

          if (!err.error.data || !err.error.data.errorValidationDto.length) {
            this.failedErrorMessages.push({
              type: 'Order Status',
              description:
                err.error.message ??
                'There was an error updating order. Please try again later.',
            });

            return;
          }

          err.error.data.errorValidationDto.forEach(
            (item: ErrorValidationDto) => {
              this.failedErrorMessages.push({
                type: item.columnName,
                description: item.errorMessage,
              });
            }
          );
        },
      });
    }
  }

  closeOrder(
    actionType:
      | CloseModalEnum.Close
      | CloseModalEnum.Reject = CloseModalEnum.Close
  ) {
    const modalRef = this.modalSvc.open(CloseOrderModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.orderId = this.orderId;
    modalRef.componentInstance.orderMode = this.orderMode;
    modalRef.componentInstance.actionType = actionType;

    modalRef.dismissed.subscribe((data) => {
      window.scrollTo(0, 0);

      this.failedErrorMessages = [];
      if (data.close) {
        if (data.errorMessages) this.failedErrorMessages = data.errorMessages;
      }

      if (data.success) {
        this.statusMessages = [];
        this.order.status = data.status;
        this.order.operator = data.operator;
        this.order.comment = data.reason;
        this.order.createdDateTime = data.timestamp;
        this.orderStatus = data.status;
      }
    });
  }

  sendFile() {
    const sendFileModalRef = this.modalSvc.open(SendFileComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });
    sendFileModalRef.componentInstance.orderId = this.orderId;
    sendFileModalRef.dismissed.subscribe((noEmail: boolean) => {
      if (noEmail) {
        const noEmailModalRef = this.modalSvc.open(ConfirmationModalComponent, {
          size: 'md',
          backdrop: 'static',
          centered: true,
          windowClass: 'confirmation-modal',
        });
        noEmailModalRef.componentInstance.title = 'No available email';
        noEmailModalRef.componentInstance.description =
          'No available email for this client contact info, please go to client to create one.';
        noEmailModalRef.componentInstance.firstButton = {
          buttonText: 'Close',
          buttonClass: 'btn-secondary',
        };
        noEmailModalRef.componentInstance.centered = false;
      }
    });
  }

  downloadExcelFile() {
    const downloadExcelModalRef = this.modalSvc.open(
      DownloadExcelFileComponent,
      {
        size: 'md',
        backdrop: 'static',
        centered: true,
      }
    );

    downloadExcelModalRef.componentInstance.orderName =
      this.basicInfoFormGroup.get('orderName')!.value;
    downloadExcelModalRef.componentInstance.orderId = this.orderId;
    downloadExcelModalRef.componentInstance.orderMode = this.orderMode;
  }

  openHistoryModal() {
    const historyModalRef = this.modalSvc.open(OrderHistoryComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });
    historyModalRef.componentInstance.orderId = this.orderId;
  }

  private navigateToOtherStatus(status: number) {
    this.router.navigateByUrl(`order/${this.orderId}?orderStatus=${status}`);
    window.scrollTo(0, 0);
  }

  private initializeForm() {
    // TO BE REMOVED on API integration
    this.qaToolsFormGroup = this.formBuilder.group({
      orderStatus: { value: 2, disabled: false },
      orderMode: { value: 1, disabled: false },
      isOrderCreator: { value: false, disabled: false },
      simulateAMMRoles: { value: false, disabled: false },
      roles: { value: [OrderOperationsEnum.CreateOrder], disabled: false },
      noEmailForSend: { value: false, disabled: false },
    });
    this.qaToolsFormGroup.controls['simulateAMMRoles'].valueChanges.subscribe(
      (value) => {
        if (value) {
          this.qaToolsFormModel.fieldsDefinition.find(
            (field) => field.formControlName === 'roles'
          )!.hidden = false;
        } else {
          this.qaToolsFormModel.fieldsDefinition.find(
            (field) => field.formControlName === 'roles'
          )!.hidden = true;
        }
      }
    );
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.orderStatus = parseInt(params['orderStatus']);
      if (Number.isNaN(this.orderStatus)) {
        this.orderStatus = OrderStatusEnum.Created;
      }
      this.qaToolsFormGroup.controls['orderStatus'].setValue(this.orderStatus);
    });

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
    // initializeDeliveryDetailsForm
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

    // TO BE REMOVED on API integration
    this.qaToolsFormGroup.controls['orderMode'].valueChanges.subscribe(
      (value) => {
        this.selectedOrderMode = ORDER_CONSTANTS.ORDER_MODE.find(
          (type) => type.key === value
        ) as OrderMode;
        this.quotationStateService.setSelectedOrderModeState(
          this.selectedOrderMode
        );
      }
    );
  }

  assignSelectedProductsSummaryValues() {
    this.totalQuantities = new TotalQuantities();
    this.totalQuantities.productQuantity = this.productList.filter(
      (p) => !p.isChildProduct
    ).length;
    for (const product of this.productList) {
      this.totalQuantities.voucherQuantity += Number(
        product['voucherQuantity'] || 0
      );
      this.totalQuantities.emailQuantity += Number(
        product['emailQuantity'] || 0
      );
      this.totalQuantities.smsQuantity += Number(product['smsQuantity'] || 0);
      this.totalQuantities.issueQuantity += Number(
        product['issuedQuantity'] || 0
      );
      this.totalQuantities.emailIssueQuantity += Number(
        product['emailIssuedQuantity'] || 0
      );
      this.totalQuantities.smsIssueQuantity += Number(
        product['smsIssuedQuantity'] || 0
      );
    }

    this.estimatedTotal = 0;
    for (const product of this.productList) {
      if (product.voucherQuantity) {
        if (
          product.productType === ProductTypeEnum.DynamicFaceValue &&
          product.dfvPercentage
        ) {
          let estimatedTotal = 0;
          product.dfvQuantity?.forEach((qty) => {
            const voucherQuantity = Number(qty.voucherQuantity);
            const faceValue = Number(qty.faceValue);

            estimatedTotal +=
              voucherQuantity * (product.dfvPercentage! / 100) * faceValue;
          });
          this.estimatedTotal += estimatedTotal;
        } else {
          this.estimatedTotal +=
            product.voucherQuantity * product.sellingPrice!;
        }
      }
    }
    // checking for master product code
    if (!this.productList?.some((list) => list.isMaster)) {
      this.showChildProduct = false;
      this.disableChildToggle = true;
    }
  }

  private setValuesFromOrderService(order: Order) {
    // set order mode
    this.selectedOrderMode = ORDER_CONSTANTS.ORDER_MODE.find(
      (mode) => mode.key === order.mode
    ) as OrderMode;

    // get channels
    if (this.selectedTenant === BusinessUnitEnum.Taiwan) {
      this.dictionaryService
        .getChannels()
        .pipe(
          takeUntil(this.destroyed$),
          map((response) => JSON.parse(response.data).dictionaries)
        )
        .subscribe({
          next: (dictionaries: Dictionary[]) => {
            const channelSelect2Data = dictionaries.map((dictionary) => ({
              label: dictionary.displayName,
              value: dictionary.dictionaryId,
            }));

            this.settingsFormModel.fieldsDefinition.find(
              (field) => field.formControlName === 'channelId'
            )!.select2Data = channelSelect2Data;

            this.settingsFormGroup
              .get('channelId')
              ?.setValue(this.settingsFormGroup.get('channelId')?.value);
          },
        });
    }

    this.basicInfoFormGroup.patchValue(new OrderBasicInfoModel(order));
    this.settingsFormGroup.patchValue(new OrderSettingsModel(order));
    this.memoFormGroup.patchValue({ memo: order.memo });
    this.deliveryDetailsFormGroup.patchValue(new DefaultDeliveryModel(order));
  }

  setEmailTemplateOptions() {
    this.emailTemplateStateService
      .setEmailTemplates()
      .pipe(takeUntil(this.destroyed$))
      .subscribe();
    this.emailTemplateStateService.selectedEmailTemplates$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((templates) => {
        this.deliveryDetailsFieldsDefinition =
          new DeliveryDetailsFieldsDefinition(
            templates.map((template) => {
              return {
                value: template.templateId,
                label: template.templateName,
              } as EmailTemplateOption;
            }),
            true
          );
      });
  }

  private goBackToProductSelection() {
    this.orderDetailsState = EditOrderDetailsEnum.SelectedProductList;
  }

  onEditDeliveryDetailsClicked() {
    this.orderDetailsState = EditOrderDetailsEnum.EditDeliveryContent;
  }

  onGoBackToOrderDetails($event: {
    orderTemplateId: number;
    productVersionId: number;
  }) {
    if ($event.orderTemplateId && $event.productVersionId) {
      this.orderSvc
        .updateOrderLineTemplate(
          $event.orderTemplateId,
          $event.productVersionId
        )
        .pipe(takeUntil(this.destroyed$))
        .subscribe(
          (result: BaseResponse) => {
            if (!result.success) {
              this.toast.showDanger(
                result.message ??
                  'Error in update order template. Please try again later.'
              );
            } else {
              this.fetchOrderDetails();
            }
          },
          () => {
            this.toast.showDanger(
              'Error in update order template. Please try again later.'
            );
          }
        );
    }
    this.orderDetailsState = EditOrderDetailsEnum.DefaultDeliveryContent;
  }

  private deepCopy(oldObj: any) {
    let newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {
      if (oldObj instanceof Date) {
        return new Date(oldObj.getTime());
      }
      newObj =
        Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
      for (const i in oldObj) {
        newObj[i] = this.deepCopy(oldObj[i]);
      }
    }
    return newObj;
  }

  setSelectedOrderMode() {
    this.selectedOrderMode = ORDER_CONSTANTS.ORDER_MODE.find(
      (type) => type.key === this.orderMode
    ) as OrderMode;
    this.quotationStateService.setSelectedOrderModeState(
      this.selectedOrderMode
    );

    // listen to order type change
    this.quotationStateService.selectedOrderMode$.subscribe((orderMode) => {
      this.selectedOrderMode = orderMode;

      this.orderBasicInfoFieldsDefinition = new OrderBasicInfoFieldsDefinition(
        this.selectedOrderMode
      );
      this.settingsFieldsDefinition = new OrderSettingsFieldsDefinition(
        this.selectedOrderMode
      );

      // basic info and settings always disabled
      this.basicInfoFormGroup.disable();
      this.settingsFormGroup.disable();
    });
  }

  setSelectedQuotationId() {
    this.quotationStateService.selectedQuotation$.subscribe(
      (item) => (this.quotationId = item.id)
    );
  }

  fetchOrderDetails() {
    this.orderSvc
      .getOrderById(this.orderId)
      .pipe(
        // cross reference remaining quantity
        switchMap((order: Order) => {
          this.orderCreatedDateTime = order.createdDateTime;
          return this.orderSvc
            .getOrderRemainingQuantity(order.clientQuotationId)
            .pipe(
              map((servedQuantities: ServedQuantity[]) => {
                for (const orderLine of order.orderLines) {
                  const servedQuantity = servedQuantities.find(
                    (servedQuantity) =>
                      servedQuantity.productVersionId ===
                      orderLine.productVersionId
                  );

                  orderLine.remainingQuantity =
                    servedQuantity?.remainingQuantity ?? null;
                }

                return { ...order };
              })
            );
        }),
        // cross reference expiration policy
        switchMap((order: Order) => {
          return this.expirationPolicyService.getExpirationPolicies().pipe(
            map((expirationPolicies: ExpirationPolicy[]) => {
              for (const orderLine of order.orderLines) {
                const expirationPolicy = expirationPolicies.find(
                  (expirationPolicy) =>
                    expirationPolicy.id === orderLine.expirationPolicyId
                );
                orderLine.expirySchemeText = expirationPolicy?.name;
              }

              return { ...order };
            })
          );
        }),
        switchMap((order: Order) => {
          if (
            [
              OrderStatusEnum.Closed,
              OrderStatusEnum.Rejected,
              OrderStatusEnum.Failed,
            ].includes(order.status)
          ) {
            return this.orderHistoryService
              .getOrderActionHistories(order.id)
              .pipe(
                map((histories: OrderActionHistory[]) => {
                  const result =
                    order.status === OrderStatusEnum.Closed
                      ? 'closed'
                      : 'rejected';
                  const getHistory = histories
                    .filter(
                      (history) => history.result.toLowerCase() === result
                    )
                    .pop();

                  if (!getHistory) {
                    return { ...order };
                  }
                  order.operator = getHistory.operator;
                  order.comment = getHistory.comment;
                  order.createdDateTime = getHistory.createdDateTime;

                  return { ...order };
                })
              );
          } else {
            return of({ ...order });
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: (order: Order) => {
          this.orderStatus = order.status;
          this.order = order;
          // select order mode state
          this.selectedOrderMode = ORDER_CONSTANTS.ORDER_MODE.find(
            (type) => type.key === order.mode
          ) as OrderMode;
          this.quotationStateService.setSelectedOrderModeState(
            this.selectedOrderMode
          );

          this.setValuesFromOrderService(order);
          this.getReference(order.clientQuotationId, order);
          this.getAttachments(order.id);
        },
        error: () => {
          this.router.navigateByUrl('/order').then(() => {
            this.toast.showDanger(
              'Error while fetching order details. Please try again later.'
            );
          });
        },
      });
  }

  getReference(quotationId: number, order: Order) {
    this.quotationService
      .getQuotationById(quotationId)
      .pipe(
        switchMap((result: BaseResponse) => {
          if (result.success) {
            if (result.data?.quotationItemList?.length > 0) {
              this.selectedQuotation = result.data?.quotationItemList[0];
              this.quotationStateService.setSelectedQuotationState(
                this.selectedQuotation
              );
              this.isAdvanceBilling = this.selectedQuotation.advanceBilling;

              return this.quotationService.getQuotationProduct(
                this.selectedQuotation.quotationNumber,
                this.orderId
              );
            } else {
              return of({
                success: false,
                message: 'No quotation found for this orderId',
                data: '',
              });
            }
          } else {
            return of({
              success: false,
              message: 'No quotation found for this orderId',
              data: '',
            });
          }
        })
      )
      .subscribe({
        next: (quotationProducts) => {
          if (!quotationProducts) {
            this.toast.showDanger('No quotation found for this orderId');
          }

          order.orderLines.forEach((orderLine) => {
            orderLine.productVersion.forEach((productVersion) => {
              const findOrderLine = quotationProducts.orderLines.find(
                (ol: OrderLine) => ol.id === orderLine.id
              );

              if (!findOrderLine) {
                return;
              }

              const pvId = productVersion.productVersionId;
              const findProductVersion = findOrderLine.productVersion.find(
                (pv: ProductVersion) => pv.productVersionId === pvId
              );

              if (!findProductVersion) {
                return;
              }

              const soldPrice = findProductVersion.product.quotationProduct
                .clientQuotationProductSoldPrice.length
                ? findProductVersion.product.quotationProduct
                    .clientQuotationProductSoldPrice[0].soldPriceWithTax
                : undefined;
              const faceValue = findProductVersion.contractSKU
                ? findProductVersion.contractSKU[0].faceValueWithTax
                : undefined;

              orderLine.orderLineDetails.push({
                soldPrice,
                faceValue,
              } as OrderLineDetails);
            });
          });
          this.mapOrderLines(order.orderLines);
          this.retrieveOrderVoucherIds();
        },
        error: () => {
          this.toast.showDanger(
            'Error loading advance billing data. Please try again later.'
          );
        },
      });
  }

  getAttachments(orderId: number) {
    this.attachmentService.getOrderAttachments(orderId).subscribe({
      next: (attachments) => {
        const sortedAttachments = [...attachments].sort((a, b) =>
          b.createdOn.localeCompare(a.createdOn)
        );
        this.attachmentFormGroup.setValue({
          attachments: sortedAttachments,
        });
      },
      error: () => {
        // set to empty
        this.attachmentFormGroup.setValue({ attachments: [] });
      },
    });
  }

  mapOrderLines(orderLines: OrderLine[]) {
    const orderLineForks = orderLines
      .filter((ol) => {
        return (
          ol.productVersion.map((version) => version.product.productType)[0] ===
          ProductTypeEnum.DynamicFaceValue
        );
      })
      .map((ol) => this.orderSvc.getOrderLineDetail(this.orderId, ol.id));

    if (orderLineForks.length) {
      forkJoin(orderLineForks)
        .pipe(takeUntil(this.destroyed$))
        .subscribe((resultArray) => {
          resultArray.forEach((result) => {
            if (result.success) {
              const getOL = orderLines.find(
                (ol) => ol.id === result.data.orderLineId
              );

              if (getOL && result.data.orderLineDetails.length) {
                const emailQty = result.data.orderLineDetails.map(
                  (ol: OrderLineDetails) => ol.email !== ''
                ).length;
                const smsQty = result.data.orderLineDetails.map(
                  (ol: OrderLineDetails) => ol.mobile !== ''
                ).length;

                getOL.orderLineDetails = [
                  {
                    id: result.data.orderLineDetails[0].id ?? 0,
                    voucherQuantity: result.data.orderLineDetails.length ?? 0,
                    emailQty:
                      this.order.mode === OrderModeEnum.DirectNonAPI
                        ? emailQty
                        : 0,
                    smsQty:
                      this.order.mode === OrderModeEnum.DirectNonAPI
                        ? smsQty
                        : 0,
                    faceValue: result.data.orderLineDetails[0].faceValue,
                    soldPrice: result.data.orderLineDetails[0].soldPrice,
                  },
                ];
              }
            }
          });

          this.finalizeProductList(orderLines);
        });
    } else {
      this.finalizeProductList(orderLines);
    }
  }

  finalizeProductList(orderLines: OrderLine[]) {
    this.productList = orderLines.map((orderLine: OrderLine) => {
      return {
        id: orderLine.productVersion[0].skuId,
        productVersionId: orderLine.productVersion[0].productVersionId,
        productName: orderLine.productVersion.map(
          (version) => version.product.productName
        )[0],
        productCode: orderLine.productVersion.map(
          (version) => version.product.productCode
        )[0],
        productType: orderLine.productVersion.map(
          (version) => version.product.productType
        )[0],
        expiryScheme: orderLine.expirationPolicyId,
        expirySchemeText: orderLine.expirySchemeText,
        expiryDate: orderLine.defaultExpirationDate,
        voucherQuantity: orderLine.totalQuantity,
        remainingQuantity: orderLine.remainingQuantity ?? 0,
        emailQuantity: orderLine.emailQuantity ?? 0,
        smsQuantity: orderLine.smsQuantity ?? 0,
        issuedQuantity: orderLine.totalQuantity ?? 0,
        emailIssuedQuantity: orderLine.emailQuantity ?? 0,
        smsIssuedQuantity: orderLine.smsQuantity ?? 0,
        faceValue:
          orderLine.productVersion.map(
            (version) => version.product.productType
          )[0] !== ProductTypeEnum.DynamicFaceValue
            ? orderLine.orderLineDetails.map((details) => details.faceValue)[0]
            : undefined,
        sellingPrice: orderLine.orderLineDetails.map(
          (details) => details.soldPrice
        )[0],
        reservationCode: orderLine.voucherReservationCode,
        clientOrderNumber: orderLine.clientOrderNumber,
        // investigate how to determine child product
        isChildProduct: false,
        isMaster:
          orderLine.productVersion.map(
            (version) => version.product.isMaster
          )[0] ?? false,
        // DFV
        dfvQuantity: orderLine.orderLineDetails.map((details) => {
          return {
            voucherQuantity: details.voucherQuantity,
            faceValue: details.faceValue,
            sellingPrice: details.soldPrice,
            emailQty: details.emailQty,
            smsQty: details.smsQty,
          };
        }),
        dfvPercentage: orderLine.remainingQuantity
          ? (orderLine.totalQuantity /
              (orderLine.remainingQuantity as number)) *
            100
          : 0,
        isActive: orderLine.status === 1,
        isEditMode: true,
        orderLineTemplateId: orderLine.orderLineTemplateId,
        orderLineTemplate: orderLine.orderLineTemplate,
        orderLineId: orderLine.id,
      };
    });
    this.assignSelectedProductsSummaryValues();
  }

  checkForChildProducts(event: boolean) {
    if (event) {
      // filtering previous records for updating with new one
      if (this.productList.some((ele) => ele.isChildProduct)) {
        this.productList = this.productList.filter(
          (list) => list.isChildProduct === false
        );
      }
      // retriving master product codes
      const MasterProductCodes = this.productList
        .filter((list) => list.isMaster)
        ?.map((product) => product.productCode);

      // calling childProductInQuotation api
      this.quotationService
        .childProductInQuotation(this.quotationId, MasterProductCodes)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (result: BaseResponse) => {
            if (result.success) {
              const finalProducts =
                this.quotationService.convertChildProductQuotation(
                  result.data.getChildProductInQuotation,
                  this.productList
                );
              if (finalProducts) this.productList = [...finalProducts];
            } else {
              this.toast.showDanger(result.message);
            }
          },
          error: () => {
            this.toast.showDanger(
              'Error while fetching child product in quotation. Please try again later.'
            );
            this.showChildProduct = false;
          },
        });
    } else {
      this.productList = this.productList.filter(
        (list) => list.isChildProduct === false
      );
    }
  }

  retrieveOrderVoucherIds() {
    this.order?.orderLines?.map((orderLine: OrderLine) => {
      if (orderLine?.orderLineDetails) {
        orderLine.orderLineDetails?.map((details: OrderLineDetails) => {
          if (details.voucherId)
            this.orderVoucherIds.push(`${details.voucherId}`);
        });
      }
    });
  }
}
