import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderProductSelectionModalComponent } from './order-product-selection-modal/order-product-selection-modal.component';
import { ProductSelectionTableDefinition } from '../../models/table-definition/product-selection-table-definition.model';
import { TableModel } from '../../models/dumb-models/table.model';
import { ErrorMessage } from '../../models/dumb-models/error-message.model';
import { OrderLine, Product } from '../../models/product.model';
import { ProductTypeEnum } from '../../enums/product-type.enum';
import { OrderService } from 'src/app/order/services/order.service';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { FourStepWizardEnum } from 'src/app/order/enums/order-steps.enum';
import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { BusinessUnitEnum } from '../../enums/tenant.enum';
import { ProductDtoService } from 'src/app/order/services/product-dto.service';
import { Subject, takeUntil } from 'rxjs';
import { ErrorValidationDto } from '../../models/product-dto.model';
import { UtilityServiceService } from 'src/app/order/services/utility-service.service';
import { QuotationService } from 'src/app/order/services/quotation.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BaseResponse } from 'src/app/order/models/base-response.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-order-product-selection',
  templateUrl: './order-product-selection.component.html',
  styleUrls: ['./order-product-selection.component.scss'],
})
export class OrderProductSelectionComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild('inputFile') inputFile!: ElementRef;
  @Input() productSelectionOnInitialState = true;
  @Input() productSelectionErrorMessages: ErrorMessage[] = [];
  @Input() fromUpload = false;
  @Input() editMode = false;
  @Input() orderStep: number = 0;
  @Input() title: string = 'Selected product list';
  @Input() activationDate!: string | null;
  @Input() deliveryDetailsFormGroup!: FormGroup;
  @Output() productListDirty: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() fileUploaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() statusChanged: EventEmitter<{
    orderLineId: number;
    status: number;
  }> = new EventEmitter<{ orderLineId: number; status: number }>();

  private _productList: Product[] = [];
  public get productList(): Product[] {
    return this._productList;
  }

  @Input() set productList(products: Product[]) {
    if (!this.utilitySvc.isEqual(this._productList, products)) {
      this.estimatedTotal = 0;
      if (products.length > 0) {
        for (const product of products) {
          if (this.selectedOrderMode?.key === this.orderModes.API) {
            if (
              product.remainingQuantity! < 1 &&
              this.selectedTenant === this.tenantEnum.Taiwan
            ) {
              // TODO: Check if we will display in EDITMODE
              // this.setValidationError(product);
            }
          } else {
            // if product.remainingQuantity is null, it means that the qty is unlimited
            if (
              !product.isChildProduct &&
              product.voucherQuantity &&
              product.remainingQuantity &&
              product.remainingQuantity! < product.voucherQuantity
            ) {
              this.setValidationError(product);
            } else {
              this.removeValidationError(product);
            }

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
                    voucherQuantity *
                    (product.dfvPercentage! / 100) *
                    faceValue;
                });
                this.estimatedTotal += estimatedTotal;
              } else {
                this.estimatedTotal +=
                  product.voucherQuantity * product.sellingPrice!;
              }
            }
          }
        }
        // checking for master product code
        if (!products.some((list) => list.isMaster)) {
          this.showChildProduct = false;
          this.disableChildToggle = true;
        }
      }
      this._productList = products;

      if (
        this.productList.length ||
        this.productSelectionErrorMessages.length
      ) {
        this.productSelectionOnInitialState = false;
      } else {
        this.productSelectionOnInitialState = true;
      }
      this.handleProductSelectionEmit();
    }
  }

  orderLines: OrderLine[] = [];

  @Output() productSelectionChanged: EventEmitter<{
    estimatedTotal: number;
    disableProductSelectionNext: boolean;
    productSelectionErrorMessages: ErrorMessage[];
    productList: Product[];
    orderLines: OrderLine[];
  }> = new EventEmitter<{
    estimatedTotal: number;
    disableProductSelectionNext: boolean;
    productSelectionErrorMessages: ErrorMessage[];
    productList: Product[];
    orderLines: OrderLine[];
  }>();
  @Output() manualSelectProductClicked: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() editDeliveryDetailsClicked: EventEmitter<number> =
    new EventEmitter<number>();

  estimatedTotal: number = 0;
  showChildProduct = false;
  productSelectionTableModel!: TableModel;
  selectedOrderMode!: OrderMode;
  selectedTenant!: string;
  orderModes = OrderModeEnum;
  quotationNumber!: string;
  destroy$ = new Subject();
  showRefreshButton = false;
  quotationId!: number;
  disableChildToggle: boolean = false;

  get isDirectOrderDeliveryDetails() {
    return this.orderStep === FourStepWizardEnum.DeliveryDetails;
  }

  get tenantEnum(): typeof BusinessUnitEnum {
    return BusinessUnitEnum;
  }

  constructor(
    private modalService: NgbModal,
    private orderSvc: OrderService,
    private quotationStateService: QuotationStateService,
    private productDtoSvc: ProductDtoService,
    private utilitySvc: UtilityServiceService,
    private quotationService: QuotationService
  ) {}

  ngOnInit() {
    this.setSelectedQuotationType();
    this.setSelectedQuotationNumber();
    this.setSelectedTenant();
    this.setSelectedQuotationId();
    this.productSelectionTableModel = new ProductSelectionTableDefinition(
      this.selectedOrderMode,
      this.isDirectOrderDeliveryDetails,
      undefined,
      this.editMode
    ).define();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  setSelectedQuotationType() {
    this.quotationStateService.selectedOrderMode$.subscribe(
      (orderMode) => (this.selectedOrderMode = orderMode)
    );
  }

  setSelectedQuotationNumber() {
    this.quotationStateService.selectedQuotation$.subscribe(
      (item) => (this.quotationNumber = item.quotationNumber)
    );
  }

  setSelectedQuotationId() {
    this.quotationStateService.selectedQuotation$.subscribe(
      (item) => (this.quotationId = item.id)
    );
  }

  setSelectedTenant() {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }
  }

  setValidationError(product: Product) {
    const exists = this.productSelectionErrorMessages.some(
      (item) => item.type === product.productCode
    );
    if (!exists) {
      this.productSelectionErrorMessages.push({
        type: product.productCode,
        description: `${product.productName} is not enough in stock`,
      });
    }
  }

  removeValidationError(product: Product) {
    if (this.productList.length && this.productSelectionErrorMessages.length) {
      this.productSelectionErrorMessages =
        this.productSelectionErrorMessages.filter(
          (item) => item.type !== product.productCode
        );
    }
  }

  // TODO: use OrderProductSelectionModalComponent logic from product service
  openModal() {
    const modalRef = this.modalService.open(
      OrderProductSelectionModalComponent,
      {
        size: 'md',
        backdrop: 'static',
        centered: true,
      }
    );
    modalRef.componentInstance.quotationNumber = this.quotationNumber;
    modalRef.componentInstance.orderMode = this.selectedOrderMode;
    modalRef.dismissed.subscribe((res: string) => {
      if (res === 'uploadExcelFile') {
        (this.inputFile as any).nativeElement.click();
      } else {
        this.onProductCreateClicked();
      }
    });
  }

  onFileSelected($event: any): void {
    this.productSelectionErrorMessages = [];
    this.showChildProduct = false;
    const files = this.checkExtension($event.target.files);
    (this.inputFile as any).nativeElement.value = null;
    this.productSelectionOnInitialState = false;
    // integrated NonAPI - Indirect and Direct
    if (
      [
        OrderModeEnum.IndirectNonAPI,
        OrderModeEnum.DirectNonAPI,
        OrderModeEnum.API,
      ].includes(this.selectedOrderMode.key)
    ) {
      this.fetchProducts(files[0]);
    } else {
      // else mock the product list for now
      this.productList =
        this.selectedOrderMode.key === OrderModeEnum.PaperVoucher
          ? // For demo replacing product list only
            [...this.orderSvc.getProductListAppend()]
          : [...this.orderSvc.getMockedProductList()];
    }
  }

  private fetchProducts(file: File): void {
    this.orderSvc.saveTemporaryFile(file);
    this.orderSvc
      .getProductList(
        this.quotationNumber,
        this.activationDate,
        file,
        this.selectedOrderMode.key
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => this.handleProductResponse(res),
        (error) => this.handleProductError(error)
      );
  }

  private handleProductResponse(res: any): void {
    if (res.success) {
      const convertedItems = this.productDtoSvc.fromDtoToModel(
        res.data.orderProductList
      );
      this.productList = [...convertedItems];
      this.orderLines = [...res.data.orderLines];
      // if it contains insufficient qty error object for warning
      if (res.data?.errorValidationDto?.length > 0) {
        this.showRefreshButton = true;
        this.productSelectionErrorMessages = [];
        res.data.errorValidationDto.forEach((item: ErrorValidationDto) => {
          if (item.referenceKey === 'M0083') {
            const modifiedError = item.errorMessage.split(':');
            this.productSelectionErrorMessages.push({
              type: `${modifiedError[0]}`,
              description: `${modifiedError[1]}`,
            });
          } else {
            this.productSelectionErrorMessages.push({
              type: `Row ${item.rowNumber}`,
              description: `${item.errorMessage}`,
            });
          }
        });
        if (this.selectedTenant === this.tenantEnum.Taiwan) {
          this.handleProductSelectionEmit();
        }
      } else {
        this.showRefreshButton = false;
      }
    }
    this.emitProductStatus();
  }

  private handleProductError(error: any): void {
    const errorObj = error.error.data;
    if (!errorObj || !errorObj.errorValidationDto) {
      this.productSelectionErrorMessages = [
        { type: 'General', description: 'Something went wrong.' },
      ];
    } else {
      errorObj.errorValidationDto.forEach((item: ErrorValidationDto) => {
        this.productSelectionErrorMessages.push({
          type: `Row ${item.rowNumber}`,
          description: `${item.errorMessage}`,
        });
      });
    }
    this.handleError();
  }

  private handleError(): void {
    this.productList = [];
    this.emitProductStatus();
  }

  private emitProductStatus(): void {
    this.handleProductSelectionEmit();
    this.productListDirty.emit(true);
    this.fileUploaded.emit(true);
  }

  private handleProductSelectionEmit(): void {
    const errorsExist = !!this.productSelectionErrorMessages.length;
    const isNextDisabled =
      this.productList.length > 0
        ? errorsExist && this.selectedTenant === this.tenantEnum.Taiwan
        : errorsExist;
    this.productSelectionChanged.emit({
      estimatedTotal: this.estimatedTotal,
      disableProductSelectionNext: isNextDisabled,
      productSelectionErrorMessages: this.productSelectionErrorMessages,
      productList: [...this.productList],
      orderLines: [...this.orderLines],
    });
  }

  private checkExtension(files: File[]): File[] {
    const result = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      if (ext && ['xls', 'xlsx'].includes(ext)) {
        result.push(file);
      } else {
        this.productSelectionErrorMessages.push({
          type: 'File',
          description: 'Invalid file type',
        });
      }
    }
    this.emitProductStatus();
    return result;
  }

  onProductDeleted($event: Product[]): void {
    this.productList = [
      ...this.productList.filter(
        (product) => product.parentCode !== $event[0].productCode
      ),
    ];
    this.productListDirty.emit(true);
  }

  onProductEditClicked($event: number): void {
    this.manualSelectProductClicked.emit($event);
  }

  onEditDeliveryDetailsClicked($event: number): void {
    this.editDeliveryDetailsClicked.emit($event);
  }

  onProductCreateClicked(): void {
    this.manualSelectProductClicked.emit(0);
    this.fileUploaded.emit(false);
  }

  handleRefreshCall(refreshStatus: boolean) {
    if (refreshStatus) {
      const savedFile = this.orderSvc.getSavedTemporaryFile();
      this.fetchProducts(savedFile);
    }
  }

  toggleChildProduct(event: any) {
    this.showChildProduct = event?.target?.checked;
    if (this.showChildProduct) {
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
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result: BaseResponse) => {
            if (result.success) {
              const finalProducts =
                this.quotationService.convertChildProductQuotation(
                  result.data.getChildProductInQuotation,
                  this.productList
                );
              if (finalProducts) this.productList = [...finalProducts];
              this.handleProductSelectionEmit();
              this.productListDirty.emit(true);
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

  onStatusChanged(event: { orderLineId: number; status: number }) {
    this.statusChanged.emit({
      orderLineId: event.orderLineId,
      status: event.status,
    });
  }
}
