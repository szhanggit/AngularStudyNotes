import { Component, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TenantConfigService } from '../../service/tenant-config.service';
import { NgbdToastGlobal, TxcDateTimeService } from '@txc-angular/component-library';
import { SkuDetailSourceTypeEnum } from '../../enum/product-type.enum';
import { ActionInterface } from '../../interface/action-interface';
import { InventoryBatchDetailsActionEnum } from '../../enum/inventory-sku-details-action-enum';
import { Subject, takeUntil } from 'rxjs';
import { VoucherGeneralService } from '../../service/voucher-general.service';
import { InventoryApiService } from '../../service/inventory-api.service';

@Component({
  selector: 'app-inventory-batch-details',
  templateUrl: './inventory-batch-details.component.html',
  styleUrls: ['./inventory-batch-details.component.scss']
})
export class InventoryBatchDetailsComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild('trashBatchTemplate') trashBatchTemplate!: TemplateRef<any>;
  @ViewChild('deleteBatchTemplate') deleteBatchTemplate!: TemplateRef<any>;
  @ViewChild('downloadBatchTemplate') downloadBatchTemplate!: TemplateRef<any>;
  @ViewChild('editDateInformationTemplate') editDateInformationTemplate!: TemplateRef<any>;

  readonly TENANT_NAME_TW = 'TW';
  readonly TENANT_NAME_IN = 'IN';
  readonly DATE_PLACEHOLDER = '--';
  readonly skuDetailSourceTypeEnum = SkuDetailSourceTypeEnum;
  readonly ACTIONLIST_THIRD_PARTY_IMPORT: ActionInterface[] = [
    {
      actionName: 'Trash batch',
    },
    {
      actionName: 'Delete batch',
    },
    {
      actionName: 'Download batch',
    },
    {
      actionName: 'Edit date info',
    },
  ];

  selectedTenantUTC!: string;
  totalCount = 0;
  isConfirmToTrash: boolean = false;
  isConfirmToDelete: boolean = false;
  trashReason: string = '';
  deleteReason: string = '';
  downloadReason: string = '';
  tenant!: string;
  startDate = { year: new Date().getUTCFullYear(), month: new Date().getUTCMonth(), day: new Date().getUTCDate() }
  source: number = this.skuDetailSourceTypeEnum.IMPORT;
  inventoryDetails: InventoryDetailsUIInterface | null = null;
  actionList: ActionInterface[] = [];
  destroy$ = new Subject();
  skuId = '';
  voucherBatchList: Array<InventoryBatchInterface> = [];
  reservationCode: string = '';

  pageInfo = {
    currentPage: 1,
    pageCount: 1,
    pageSize: 25,
    itemStart: 1,
    itemEnd: 20,
    total: 0
  };

  skuDetails = {
    skuCode: '',
    skuName: '',
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private readonly tenantConfigService: TenantConfigService,
    public inventoryApiService: InventoryApiService,
    private voucherGeneralService: VoucherGeneralService,
  ) {
    const tenantFromRoute = this.activatedRoute.snapshot.queryParamMap.get('tenantName');
    this.tenant = this.tenantConfigService.getTenant(tenantFromRoute).name.toUpperCase();
  }


  editDateInformationForm = this.formBuilder.group({
    availableStartDate: [null],
    availableEndDate: [null],
    expiryDate: [null],
    trustAccountEndDate: [null],
  });

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.tenant = JSON.parse(tenantFromLocalStorage).name;
      this.selectedTenantUTC = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    }
    const idFromUrl = this.activatedRoute.snapshot.paramMap.get('id');
    this.skuId = idFromUrl ? idFromUrl : '';
    this.getBasicInfo();
    this.setSkuDetails();
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
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
      })
  }

  setSkuDetails(): void {
    const skuDetails = localStorage.getItem('skuDetails');
    if (skuDetails) {
      this.actionList = this.ACTIONLIST_THIRD_PARTY_IMPORT;
      this.inventoryDetails = JSON.parse(skuDetails);
      this.getBatchInventoryDetailsByDates();
    }
  }

  setNoExpiry() {
    const noExpiry: NgbDateStruct = {
      year: 2999,
      month: 12,
      day: 31,
    }
    this.editDateInformationForm.get('expiryDate')?.setValue(noExpiry);
  }


  getBatchInventoryDetailsByDates():void  {
    const body = this.inventoryDetails;
    this.inventoryApiService.getBatchInventoryDetails(+this.skuId, body, this.source).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          this.calPageInfo(data.inventoryBatches.totalCount);
          const details = data.inventoryBatches.items;
          this.voucherBatchList = details;
          this.getTotalRemainingAmountByDates(details[0]);
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
      });
  }

  getTotalRemainingAmountByReservationCode(reservationCode: string) {
    this.inventoryApiService.getEdenredRemainingQtyByReservationCode(+this.skuId, reservationCode).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          const list = data.inventoryEdenredAggregations.items;
          this.totalCount = list[0]?.remainingQuantity;
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
      });
  }

  getTotalRemainingAmountByDates(details: any) {
    this.inventoryApiService.getImportRemainingQtyByDates(+this.skuId, details, this.tenant === this.TENANT_NAME_TW).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          const list = data.inventoryImportAggregations.items;
          this.totalCount = list[0]?.remainingQuantity;
        },
        error: (err: any) => {
          this.toast.showDanger(err.message);
        },
      });
  }

  onAction(type: string, row: InventoryBatchInterface): void {
    switch (type) {
      case InventoryBatchDetailsActionEnum.TRASH_BATCH:
        this.openModal(this.trashBatchTemplate, 'md', row);
        break
      case InventoryBatchDetailsActionEnum.DELETE_BATCH:
        this.openModal(this.deleteBatchTemplate, 'md', row);
        break
      case InventoryBatchDetailsActionEnum.DOWNLOAD_BATCH:
        this.openModal(this.downloadBatchTemplate, 'md', row);
        break
      case InventoryBatchDetailsActionEnum.EDIT_DATE_INFO:
        this.openModal(this.editDateInformationTemplate, 'md', row);
        break
    }
  }

  openModal(content: TemplateRef<NgbModal>, size = 'md', rowData: InventoryBatchInterface): void {
    const modalRef = this.modalService.open(content, { size: size, backdrop: 'static', centered: true });
    this.setValueIntoFromControl(rowData);
    const batchId = rowData.id;
    modalRef.closed.subscribe((btn: any) => {
      switch (btn) {
        case 'trash': {
          this.inventoryApiService.trashInventoryVoucherByBatchId(batchId, this.trashReason.trim()).pipe(
            takeUntil(this.destroy$)
          )
            .subscribe({
              next: (res: any) => {
                if (res.success) {
                  this.toast.showSuccess('You have trashed batch successfully.');
                  this.isConfirmToTrash = false;
                  this.trashReason = '';
                  this.getBatchInventoryDetailsByDates();
                }
              },
              error: (err: any) => {
                this.toast.showDanger(err.error.message);
                this.isConfirmToTrash = false;
              },
            });
          break;
        }
        case 'delete': {
          this.inventoryApiService.deleteInventoryVoucherByBatchId(rowData.skuId, batchId, this.deleteReason.trim()).pipe(
            takeUntil(this.destroy$)
          )
            .subscribe({
              next: (res: any) => {
                if (res.success) {
                  this.toast.showSuccess("You have deleted batch successfully.");
                  this.deleteReason = '';
                  this.isConfirmToDelete = false;
                  this.getBatchInventoryDetailsByDates();
                }
              },
              error: (err: any) => {
                this.toast.showDanger(err.error.message);
                this.isConfirmToTrash = false;
              },
            });
          break;
        }
        case 'download': {
          const request = `SkuId=${this.skuId}&BatchId=${rowData.id}&IssueAvailableStartDate=${rowData.issueAvailableStartDate}&IssueAvailableEndDate=${rowData.issueAvailableEndDate}&ExpiryDate=${rowData.expiryDate}&Reason=${this.downloadReason.trim()}`;
          this.inventoryApiService.downloadDetailsImportBatch(request).subscribe({
            next: (res: any) => {
              let blob: Blob = res.body as Blob;
              let fileExport = document.createElement('a');
              const today = `${new Date().getFullYear()}${(+new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}`
              fileExport.download = `Batch_download_${this.skuDetails.skuCode}_${today}.xlsx`;
              fileExport.href = window.URL.createObjectURL(blob);
              fileExport.click();
              this.downloadReason = '';
            },
            error: err => {
              this.toast.showDanger(err.error.message);
            },
          });
          break;
        }
        case 'save-editDate': {
          let request = {
            id: batchId,
            issueAvailableStartDate: this.voucherGeneralService.ngbDateToUTCDate(this.editDateInformationForm.get('availableStartDate')?.value, false),
            issueAvailableEndDate: this.voucherGeneralService.ngbDateToUTCDate(this.editDateInformationForm.get('availableEndDate')?.value, true),
            expiryDate: this.voucherGeneralService.ngbDateToUTCDate(this.editDateInformationForm.get('expiryDate')?.value, true),
          };
          if (this.tenant === this.TENANT_NAME_TW) {
            request = { ...request, ...{ trustAccountEndDate: this.voucherGeneralService.ngbDateToUTCDate(this.editDateInformationForm.get('trustAccountEndDate')?.value, true) } }
          }

          this.inventoryApiService.updateBatchDate(request).subscribe({
            next: (res: any) => {
              if (res.success) {
                this.toast.showSuccess('You have edited the batch date successfully.');
                this.editDateInformationForm.reset();
              }
            },
            error: err => {
              this.toast.showDanger(err.error.message);
            },
          });
          break;
        }
      }
    });
  }

  setValueIntoFromControl(rowData: InventoryBatchInterface) {
    this.editDateInformationForm.get('availableStartDate')?.setValue(this.voucherGeneralService.UTCDateToNgbDate(rowData.issueAvailableStartDate));
    this.editDateInformationForm.get('availableEndDate')?.setValue(this.voucherGeneralService.UTCDateToNgbDate(rowData.issueAvailableEndDate));
    this.editDateInformationForm.get('expiryDate')?.setValue(this.voucherGeneralService.UTCDateToNgbDate(rowData.expiryDate));
    this.editDateInformationForm.get('trustAccountEndDate')?.setValue(this.voucherGeneralService.UTCDateToNgbDate(rowData.trustAccountEndDate));
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

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

export interface InventoryDetailsUIInterface {
  id?: string;
  source?: number;
  issueAvailableStartDate?: Date | null;
  issueAvailableEndDate?: Date | null;
  expiryDate?: Date | null;
  trustAccountEndDate?: Date | null;
}

export interface InventoryBatchInterface {
  id: string,
  skuId: string,
  quantity?: number,
  remainingQuantity?: number,
  lockedQuantity?: number,
  issueAvailableStartDate: string,
  issueAvailableEndDate: string,
  expiryDate: string,
  trustAccountEndDate: string,
  reservationCode?: string,
  createdOn?: string,
  createdBy?: string,
  isDefault?: boolean,
  batchProcessorBatchId?: string,
}
