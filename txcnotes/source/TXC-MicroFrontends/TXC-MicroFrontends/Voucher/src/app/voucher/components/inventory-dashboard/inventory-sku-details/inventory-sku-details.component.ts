import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductTypeEnum, SkuDetailSourceTypeEnum } from 'src/app/voucher/enum/product-type.enum';
import { TenantConfigService } from 'src/app/voucher/service/tenant-config.service';
import { Subject, takeUntil, map, fromEvent, filter, debounceTime, timer, switchMap } from 'rxjs';
import { ActionInterface } from 'src/app/voucher/interface/action-interface';
import { InventorySkuDetailsActionEnum } from 'src/app/voucher/enum/inventory-sku-details-action-enum';
import { ResponseContractSKUCostsMerchant } from 'src/app/voucher/interface/response-interface';
import { StockLevelEnum } from 'src/app/voucher/enum/voucher-status.enum';
import { InventoryDashboardComponent } from '../inventory-overviw/inventory-dashboard.component';
import { SimplebarAngularComponent } from 'simplebar-angular';
import { VoucherGeneralService } from 'src/app/voucher/service/voucher-general.service';
import { InventoryApiService } from 'src/app/voucher/service/inventory-api.service';

@Component({
  selector: 'app-sku-details',
  templateUrl: './inventory-sku-details.component.html',
  styleUrls: ['./inventory-sku-details.component.scss'],
  providers: [],
})
export class InventorySkuDetailsComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild('downloadReasonTemplate') downloadReasonTemplate!: TemplateRef<any>;
  @ViewChild('trashInventoryTemplate') trashInventoryTemplate!: TemplateRef<any>;
  @ViewChild('addStockQtyTemplate') addStockQtyTemplate!: TemplateRef<any>;
  @ViewChild(SimplebarAngularComponent) list!: SimplebarAngularComponent;

  // tenant names
  readonly TENANT_NAME_TW = 'TW';
  readonly TENANT_NAME_IN = 'IN';
  readonly ADD_STOCK_QTY_TITLE = 'Add stock quantity';
  readonly NEW_RESERVATION_QTY_TITLE = 'New reservation code';

  readonly skuDetailSourceTypeEnum = SkuDetailSourceTypeEnum;
  readonly actionEnum = InventorySkuDetailsActionEnum;
  readonly ACTIONLIST_THIRD_PARTY_IMPORT: ActionInterface[] = [
    { actionName: this.actionEnum.DOWNLOAD_INVENTORY, }
  ];
  readonly ACTIONLIST_EDENRED: ActionInterface[] = [
    { actionName: this.actionEnum.DOWNLOAD_INVENTORY },
    { actionName: this.actionEnum.ADD_STOCK_QTY },
    { actionName: this.actionEnum.TRASH_INVENTORY },
  ];
  readonly ACTIONLIST_TPC: ActionInterface[] = [
    { actionName: this.actionEnum.DOWNLOAD_INVENTORY }
  ];

  source: SkuDetailSourceTypeEnum = SkuDetailSourceTypeEnum.ALL;
  isCritical: boolean = false;
  isConfirmToTrash: boolean = false;
  trashReason: string = '';
  skuId = '';
  destroy$ = new Subject();
  actionList: ActionInterface[] = [];
  actionListFiltered: ActionInterface[] = [{
    actionName: this.actionEnum.ADD_STOCK_QTY,
  }];
  addStockQtyTitle = this.ADD_STOCK_QTY_TITLE;
  isRegenerateToWording = true;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private readonly tenantConfigService: TenantConfigService,
    private readonly activateRoute: ActivatedRoute,
    public inventoryApiService: InventoryApiService,
    private inventoryDashboardComponent: InventoryDashboardComponent,
    private voucherGeneralService: VoucherGeneralService,
  ) {
    const tenantFromRoute = this.activatedRoute.snapshot.queryParamMap.get('tenantName');
    this.tenant = this.tenantConfigService.getTenant(tenantFromRoute).name.toUpperCase();

    const modeCode = this.activateRoute.snapshot.queryParamMap.get('source');
    if (modeCode) {
      this.source = +modeCode;
    }
  }

  skuDetails = {
    skuCode: 'Null',
    skuName: 'Null',
  }
  merchantList: MerchantCostUiInterface[] = [];
  productList: any[] = [];
  inventoryList: any[] = [];

  productListTotalCount = 0;
  safetyStockQty = 0;
  inStockWatermark: number | null = 0;
  apiBuffer: number | null = 0;
  replenishmentQty: number | null = 0;
  thresholdWatermark: number | null = null;
  regenerateTo: number | null = null;
  hasExistingReservationCode: boolean = false;

  totalStockQty = 0;

  isExpanded: boolean = false;
  pageInfo = {
    currentPage: 1,
    pageCount: 1,
    pageSize: 25,
    itemStart: 1,
    itemEnd: 25,
    total: 0
  };
  tenant!: string;

  voucherWaterMarkRuleForm = this.formBuilder.group({
    inStockWatermark: [],
    replenishmentQty: [],
    apiBuffer: [],
    thresholdWatermark: [],
    regenerateTo: [],
  });

  provideDownloadReasonForm = this.formBuilder.group({
    downloadReason: [],
  });

  addStockQtyForm = this.formBuilder.group({
    reservationCode: [{ value: '', disabled: true }, Validators.required],
    expiryDate: [null],
    addStockQty: ['', Validators.required],
  });


  ngOnInit(): void {
    const idFromUrl = this.activatedRoute.snapshot.paramMap.get('id');
    this.skuId = idFromUrl ? idFromUrl : '';

    const skuDetailsFromLocalStorage = JSON.parse(localStorage.getItem('skuDetails') || '{ }');
    if (+skuDetailsFromLocalStorage?.skuId === +this.skuId && this.skuId) {
      this.totalStockQty = +skuDetailsFromLocalStorage.totalStockQty;
      this.source = +skuDetailsFromLocalStorage.source;
      this.isCritical = skuDetailsFromLocalStorage.isCritical;
      this.getInventorySkuList();
      this.setActionDropdown();
    } else {
      this.getSkuDetaisBySkuId();
    }
    this.getProductList(5);
    this.getBasicInfo();
    this.getWatermarks();
  }

  setActionDropdown() {
    switch (this.source) {
      case this.skuDetailSourceTypeEnum.EDENRED:
        this.actionList = this.ACTIONLIST_EDENRED;
        break

      case this.skuDetailSourceTypeEnum.IMPORT:
        this.actionList = this.ACTIONLIST_THIRD_PARTY_IMPORT;
        break

      case this.skuDetailSourceTypeEnum.TPC:
        this.actionList = this.ACTIONLIST_TPC;
        break
    }
  }

  toggleCollapsibleTable() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded && this.productList.length !== this.productListTotalCount) {
      this.getProductList(500);
    }
  }

  navigateToProductDetails(product: any): string {
    if (product.productType === ProductTypeEnum.SMART_CHOICE_VOUCHER) {
      return `products/product/edit/smart-choice-voucher/${product.productId}`;
    } else if (product.productType === ProductTypeEnum.SUPER_VOUCHER) {
      return `products/product/edit/super-voucher/${product.productId}`;
    } else {
      return `products/${product.productId}`;
    }
  }

  setDataInStorage(rowData: any) {
    if (this.source === this.skuDetailSourceTypeEnum.IMPORT) {
      const skuDetails = {
        source: this.skuDetailSourceTypeEnum.IMPORT,
        issueAvailableStartDate: rowData.issueAvailableStartDate,
        issueAvailableEndDate: rowData.issueAvailableEndDate,
        expiryDate: rowData.expiryDate,
        trustAccountEndDate: rowData.trustAccountEndDate
      };
      localStorage.setItem('skuDetails', JSON.stringify(skuDetails));
    }
    if (this.source === this.skuDetailSourceTypeEnum.EDENRED) {
      const skuDetails = {
        source: this.skuDetailSourceTypeEnum.EDENRED,
        reservationCode: rowData.reservationCode,
      };
      localStorage.setItem('skuDetails', JSON.stringify(skuDetails));
    };
  }

  getSkuDetaisBySkuId(): void {
    this.inventoryApiService.getInventoryDetailsBySkuId(+this.skuId).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          if (data.inventoryDashboard.items.length === 0) {
            this.toast.showDanger('Loading data failed.');
            return;
          }
          const item = data.inventoryDashboard.items[0];
          this.isCritical = item.stockLevel === StockLevelEnum.CRITICAL;
          this.totalStockQty = item.totalRemainingQuantity;
          this.source = this.inventoryDashboardComponent.sourceMapper(item.merchantSKU[0]?.voucherNumberRule.voucherGenerateWay, item.merchantSKU[0]?.voucherNumberRule.onDemand)
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
        complete: () => {
          this.getInventorySkuList();
          this.setActionDropdown();
        },
      })
  }

  getBasicInfo(): void {
    this.inventoryApiService.getSkuDetailsBySkuId(+this.skuId).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          this.skuDetails.skuName = data.skuById[0].skuName;
          this.skuDetails.skuCode = data.skuById[0].skuNumber;
          const costList: MerchantCostUiInterface[] =
            data.skuById[0].contractSKUCosts.map((e: ResponseContractSKUCostsMerchant) => {
              const costDetails = {
                merchantId: e.skuCostContract.merchant?.merchantId,
                merchantName: e.skuCostContract.merchant?.name,
                cost: e.costWithTax,
                costStartDate: e.validStartDate,
                costEndDate: e.validEndDate,
              };
              return costDetails;
            });
          this.merchantList = costList;
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
      })
  }

  getProductList(takeAmount: number): void {
    this.inventoryApiService.getProductListBySkuId(+this.skuId, takeAmount).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          this.productList = data?.productInfo?.items;
          this.productListTotalCount = data?.productInfo?.totalCount;
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
      });
  }

  getInventorySkuList() {
    switch (this.source) {
      case this.skuDetailSourceTypeEnum.EDENRED:
        this.inventoryApiService.getEdenredInventory(+this.skuId, this.pageInfo.pageSize, this.pageInfo.currentPage === 1 ? 0 : (+this.pageInfo.currentPage - 1) * this.pageInfo.pageSize).pipe(
          takeUntil(this.destroy$)
        )
          .subscribe({
            next: (res: any) => {
              const data = JSON.parse(res.data);
              console.log(data);
              const totalCount = data.inventoryBatches.totalCount;
              this.calPageInfo(totalCount);
              const remainingQuantity = data.inventoryBatches.items.filter((item: any) => item.isDefault === true);
              this.inventoryList = data.inventoryBatches.items
                .filter((item: any) => item.isDefault !== true)
                .map((e: any) => {
                  e.inStockQty = +e.remainingQuantity
                  return e;
                });
              if (remainingQuantity.length > 0) {
                this.safetyStockQty = remainingQuantity[0]?.remainingQuantity;
              }
            },
            error: (err: any) => {
              this.toast.showDanger(err.message);
            },
          });
        break

      case this.skuDetailSourceTypeEnum.IMPORT:
        this.inventoryApiService.getImportInventory(+this.skuId, this.pageInfo.pageSize, this.pageInfo.currentPage === 1 ? 0 : (+this.pageInfo.currentPage - 1) * this.pageInfo.pageSize).pipe(
          takeUntil(this.destroy$)
        )
          .subscribe({
            next: (res: any) => {
              const data = JSON.parse(res.data);
              const list = data.inventoryImportAggregations.items;
              const totalCount = data.inventoryImportAggregations.totalCount;
              this.inventoryList = list.map((e: any) => {
                e.inStockQty = e.remainingQuantity;
                return e;
              });
              this.calPageInfo(totalCount);
            },
            error: (err: any) => {
              this.toast.showDanger(err.message);
            },
          });
        break

      case this.skuDetailSourceTypeEnum.TPC:
        this.inventoryApiService.getTpcInventory(+this.skuId, this.pageInfo.pageSize, this.pageInfo.currentPage === 1 ? 0 : (+this.pageInfo.currentPage - 1) * this.pageInfo.pageSize).pipe(
          takeUntil(this.destroy$)
        )
          .subscribe({
            next: (res: any) => {
              const data = JSON.parse(res.data);
              const list = data.inventoryTPCAggregations.items;
              const totalCount = data.inventoryTPCAggregations.totalCount;
              this.inventoryList = list.map((e: any) => {
                e.inStockQty = e.remainingQuantity;
                return e;
              });
              this.calPageInfo(totalCount);
            },
            error: (err: any) => {
              this.toast.showDanger(err.message);
            },
          });
        break
    }
  }

  getWatermarks() {
    this.inventoryApiService.getWatermarks(+this.skuId).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          const inventoryQtys = data.inventorySKUBatches.items[0];
          this.inStockWatermark = inventoryQtys.warningWaterLevel;
          this.apiBuffer = inventoryQtys.apiOrderBuffer;
          this.replenishmentQty = inventoryQtys.replenishQuantity;
          this.thresholdWatermark = inventoryQtys.warningWaterLevel;
          this.regenerateTo = inventoryQtys.procurementQuantity;
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
      });
  }

  calPageInfo(total: number) {
    this.pageInfo.total = total;
    this.pageInfo.pageCount = Math.ceil(total / this.pageInfo.pageSize);
    this.pageInfo.itemStart = (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize + 1;
    if (this.pageInfo.pageCount === 1 && this.pageInfo.total < this.pageInfo.pageSize) {
      this.pageInfo.itemEnd = this.pageInfo.total;
    } else {
      if (this.pageInfo.pageCount === this.pageInfo.currentPage) {
        this.pageInfo.itemEnd = this.pageInfo.total;
      } else {
        this.pageInfo.itemEnd = this.pageInfo.currentPage * this.pageInfo.pageSize;
      }
    }
  }


  convertDateToNgbDate(date: Date): NgbDateStruct {
    const ngbDate = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    }
    return ngbDate;
  };

  onAction(type: string, row?: any): void {
    switch (type) {
      case InventorySkuDetailsActionEnum.DOWNLOAD_INVENTORY:
        this.openModal(this.downloadReasonTemplate, 'md', row);
        break
      case InventorySkuDetailsActionEnum.TRASH_INVENTORY:
        this.openModal(this.trashInventoryTemplate, 'md', row);
        break
      case InventorySkuDetailsActionEnum.ADD_STOCK_QTY:
        this.openModalAddStockQty(this.addStockQtyTemplate, row);
        break
    }
  }

  openModalAddStockQty(content: TemplateRef<NgbModal>, rowData?: any): void {
    this.hasExistingReservationCode = false;
    let expiryDateFormat = '';
    if (rowData) {
      if(rowData.expiryDate) {
        const dateExpiryDate = new Date(rowData.expiryDate);
        expiryDateFormat = `${dateExpiryDate.getFullYear()}/${dateExpiryDate.getMonth()+1}/${dateExpiryDate.getDate()}`;
         console.log(rowData.expiryDate);
      }
      this.addStockQtyTitle = this.ADD_STOCK_QTY_TITLE;
      this.addStockQtyForm.get('reservationCode')?.setValue(rowData.reservationCode);
      this.addStockQtyForm.get('expiryDate')?.setValue(expiryDateFormat);
      this.addStockQtyForm.get('reservationCode')?.disable();
      this.addStockQtyForm.get('expiryDate')?.disable();
    } else {
      this.addStockQtyTitle = this.NEW_RESERVATION_QTY_TITLE;
      this.addStockQtyForm.reset();
      this.addStockQtyForm.get('reservationCode')?.enable();
    }
    const modalRef = this.modalService.open(content, { size: 'md', backdrop: 'static', centered: true });
    modalRef.closed.subscribe(btn => {
      if (btn) {
        this.addStockQty(!rowData);
      }
    });
  }

  onSafetyStockValueChange(): void {
    const voucherWaterMarkRule = this.voucherWaterMarkRuleForm.getRawValue();
    if (+voucherWaterMarkRule.regenerateTo <= +voucherWaterMarkRule.thresholdWatermark) {
      this.isRegenerateToWording = false;
    } else {
      this.isRegenerateToWording = true;
    }
  }

  openModal(content: TemplateRef<NgbModal>, size = 'md', rowData?: any): void {
    this.voucherWaterMarkRuleForm.get('thresholdWatermark')?.setValue(this.thresholdWatermark);
    this.voucherWaterMarkRuleForm.get('regenerateTo')?.setValue(this.regenerateTo);
    this.voucherWaterMarkRuleForm.get('inStockWatermark')?.setValue(this.inStockWatermark);
    this.voucherWaterMarkRuleForm.get('apiBuffer')?.setValue(this.apiBuffer);
    this.voucherWaterMarkRuleForm.get('replenishmentQty')?.setValue(this.replenishmentQty);

    const modalRef = this.modalService.open(content, { size: size, backdrop: 'static', centered: true });
    modalRef.closed.subscribe(btn => {
      switch (btn) {
        case 'save-editDate': {
          this.toast.showSuccess("You have edited date successfully.");
          break;
        }
        case 'save-inStockWatermark': {
          this.updateWatermark();
          break;
        }
        case 'save-safetyStockWatermark': {
          this.updateSafetyWatermark();
          break;
        }
        case 'save-downloadReason': {
          this.downloadVoucherDetails(rowData);
          this.provideDownloadReasonForm.reset();
          break;
        }
        case 'trash': {
          this.trashByReservation(rowData.reservationCode);
          break;
        }
      }
    });
  }

  trashByReservation(reservationCode: string): void {
    this.inventoryApiService.getBatchIdByReservationCode(reservationCode).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          const batchId = data.inventoryBatches.items[0]?.id;
          if (batchId) {
            this.trashByBatchId(batchId);
          }
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
          this.isConfirmToTrash = false;
        },
      });
  }

  trashByBatchId(batchId: string): void {
    this.inventoryApiService.trashInventoryVoucherByBatchId(batchId, this.trashReason).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toast.showSuccess('You have trashed inventory successfully.');
            this.isConfirmToTrash = false;
            this.trashReason = '';
          }
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
          this.isConfirmToTrash = false;
        },
      });
  }

  updateWatermark(): void {
    const voucherWaterMarkRule = this.voucherWaterMarkRuleForm.getRawValue();
    this.inStockWatermark = voucherWaterMarkRule.inStockWatermark;
    this.replenishmentQty = voucherWaterMarkRule.replenishmentQty;
    this.apiBuffer = voucherWaterMarkRule.apiBuffer;
    const request = {
      skuId: this.skuId,
      warningWaterLevel: voucherWaterMarkRule.inStockWatermark ? voucherWaterMarkRule.inStockWatermark : 0,
      apiOrderBuffer: voucherWaterMarkRule.apiBuffer ? voucherWaterMarkRule.apiBuffer : 0,
      replenishQuantity: voucherWaterMarkRule.replenishmentQty ? voucherWaterMarkRule.replenishmentQty : 0,
    }
    if (this.tenant !== this.TENANT_NAME_IN) {
      delete request.replenishQuantity
    }
    this.inventoryApiService.editWatermark(request).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
        complete: () => {
          this.getWatermarks();
        }
      });
  }

  updateSafetyWatermark(): void {
    const voucherWaterMarkRule = this.voucherWaterMarkRuleForm.getRawValue();
    const request = {
      skuId: this.skuId,
      warningWaterLevel: voucherWaterMarkRule.thresholdWatermark,
      procurementQuantity: voucherWaterMarkRule.regenerateTo
    }
    this.inventoryApiService.editWatermark(request).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.thresholdWatermark = voucherWaterMarkRule.thresholdWatermark;
            this.regenerateTo = voucherWaterMarkRule.replenishmentQty;
          }
        },
        error: (err: any) => {
          if (err.error.message == 'Invalid model') {
            this.toast.showDanger(err.error.data);
          } else {
            this.toast.showDanger(err.error.message);
          }
        },
        complete: () => {
          this.getWatermarks();
        }
      });
  }

  downloadVoucherDetails(rowData: any) {
    switch (this.source) {
      case this.skuDetailSourceTypeEnum.IMPORT: {
        const trustAccountDateQuery = `&TrustAccountEndDate=${rowData.trustAccountEndDate}`
        const request = `SkuId=${this.skuId}&IssueAvailableStartDate=${rowData.issueAvailableStartDate}&IssueAvailableEndDate=${rowData.issueAvailableEndDate}&ExpiryDate=${rowData.expiryDate}&Reason=${this.provideDownloadReasonForm.get('downloadReason')?.value}
        ${this.tenant === this.TENANT_NAME_TW ? trustAccountDateQuery : ''}`
        this.inventoryApiService.downloadVoucherDetailsImport(request).subscribe({
          next: (res: any) => {
            let blob: Blob = res.body as Blob;
            let fileExport = document.createElement('a');
            const today = `${new Date().getFullYear()}${(+new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}`
            fileExport.download = `Inventory_download_${this.skuDetails.skuCode}_${today}.xlsx`;
            fileExport.href = window.URL.createObjectURL(blob);
            fileExport.click();
            this.provideDownloadReasonForm.get('downloadReason')?.reset();
          },
          error: err => {
            this.toast.showDanger(err.name);
          },
        });
        break
      }
      case this.skuDetailSourceTypeEnum.EDENRED: {
        const request = `SkuId=${this.skuId}&ReservationCode=${rowData.reservationCode}&Reason=${this.provideDownloadReasonForm.get('downloadReason')?.value}`
        this.inventoryApiService.downloadVoucherDetailsEdenred(request).subscribe({
          next: (res: any) => {
            let blob: Blob = res.body as Blob;
            let fileExport = document.createElement('a');
            const today = `${new Date().getFullYear()}${(+new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}`
            console.log(today);
            fileExport.download = `Inventory_download_${this.skuDetails.skuCode}_${today}.xlsx`;
            fileExport.href = window.URL.createObjectURL(blob);
            fileExport.click();
            this.provideDownloadReasonForm.get('downloadReason')?.reset();
          },
          error: err => {
            this.toast.showDanger(err.name);
          },
        });
        break
      }
      case this.skuDetailSourceTypeEnum.TPC: {
        const request = `SkuId=${this.skuId}&ExpiryDate=${rowData.expiryDate}&Reason=${this.provideDownloadReasonForm.get('downloadReason')?.value}`
        this.inventoryApiService.downloadVoucherDetailsTPC(request).subscribe({
          next: (res: any) => {
            let blob: Blob = res.body as Blob;
            let fileExport = document.createElement('a');
            const today = `${new Date().getFullYear()}${(+new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}`
            fileExport.download = `Inventory_download_${this.skuDetails.skuCode}_${today}.xlsx`;
            fileExport.href = window.URL.createObjectURL(blob);
            fileExport.click();
            this.provideDownloadReasonForm.get('downloadReason')?.reset();
          },
          error: err => {
            this.toast.showDanger(err.name);
          },
        });
        break
      }
    }
  }

  navigateTo(url: string, item: any) {
    this.router.navigate([url],
      {
        queryParams: {
          source: item.source,
        }
      });
  }

  checkExistingReservationCode() {

    this.inventoryApiService.getEdenredInventory(+this.skuId, this.pageInfo.pageSize, 0, this.addStockQtyForm.get('reservationCode')?.value).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          if (data.inventoryEdenredAggregations.items.length > 0) {
            this.hasExistingReservationCode = true;
            this.addStockQtyForm.get('reservationCode')?.setErrors({ 'incorrect': true });
          } else {
            this.hasExistingReservationCode = false;
          }
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
          this.hasExistingReservationCode = true;
          this.addStockQtyForm.get('reservationCode')?.setErrors({ 'incorrect': true });
        },
        complete: () => {
        }
      });
  }

  addStockQty(isNew: boolean) {
    let request = {
      skuId: this.skuId,
      reservationCode: this.addStockQtyForm.get('reservationCode')?.value,
      quantity: this.addStockQtyForm.get('addStockQty')?.value,
    };
    if (isNew) {
      const expiredate = this.addStockQtyForm.get('expiryDate')?.value ? this.voucherGeneralService.ngbDateToUTCDate(this.addStockQtyForm.get('expiryDate')?.value.ngbSimpleDate, true) : null;
      request = { ...request, ...{ expiryDate: expiredate } }
    }
    this.inventoryApiService.updateReservationQty(request).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
        complete: () => {
        }
      });

    this.toast.showSuccess(isNew ? 'Reservation creation request is successful, please wait a while and refresh.' : 'Add quantity request is successful, please wait a while and refresh.');
    this.addStockQtyForm.reset();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}


export interface MerchantCostUiInterface {
  merchantId?: number;
  merchantName?: string;
  cost?: string;
  costStartDate?: string;
  costEndDate?: string
}
