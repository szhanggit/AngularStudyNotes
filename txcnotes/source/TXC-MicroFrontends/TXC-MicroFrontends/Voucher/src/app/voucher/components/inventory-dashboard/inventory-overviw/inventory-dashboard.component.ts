import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkuDetailSourceTypeEnum } from 'src/app/voucher/enum/product-type.enum';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TenantConfigService } from 'src/app/voucher/service/tenant-config.service';
import { Subject, forkJoin, takeUntil, skip } from 'rxjs';
import { StockLevelEnum } from 'src/app/voucher/enum/voucher-status.enum';
import { InventoryApiService } from 'src/app/voucher/service/inventory-api.service';

@Component({
  selector: 'app-inventory-dashboard',
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.scss']
})
export class InventoryDashboardComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  selectedTenantUTC!: string;
  readonly skuDetailSourceTypeEnum = SkuDetailSourceTypeEnum;
  readonly TENANT_NAME_TW = "TW";
  readonly TENANT_NAME_SG = "SG";
  readonly stockLevelEnum = StockLevelEnum;
  readonly searchTypeEnum = SearchTypeEnum;
  readonly NO_EXPIRATION = 'No expiration';
  readonly MULTIPLE_DATES = 'Multiple dates';
  readonly IDS_ONE_TAKE = 50;
  readonly SKU_LIST_ONE_TAKE = 50;
  tenant!: string;
  searchTermFormGroup: FormGroup;
  selectedList: any[] = [];
  selectAll = false;
  destroy$ = new Subject();
  filterBySourceSkuIds: number[] = [];
  isSearched = false;
  skuList: any[] = [];
  totalIdsAmount = 0;
  hasNextPage = false;
  skipAmount = 0;
  placeholder = '';
  inventoryHasNextPage = false;
  skuListSkip = 0;
  isLoading: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly _formBuilder: FormBuilder,
    private readonly tenantConfigService: TenantConfigService,
    public inventoryApiService: InventoryApiService,
  ) {
    const tenantFromRoute = this.activatedRoute.snapshot.queryParamMap.get('tenantName');
    this.tenant = this.tenantConfigService.getTenant(tenantFromRoute).name.toUpperCase();
    this.searchTermFormGroup = this._formBuilder.group({
      searchType: new FormControl({ value: this.searchTypeEnum.SKU_CODE, disabled: false }, [Validators.maxLength(255)]),
      searchTerm: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
      // StockLevel default value should be CRITICAL
      stockLevel: new FormControl({ value: this.stockLevelEnum.CRITICAL, disabled: false }, [Validators.maxLength(255)]),
      source: new FormControl({ value: +this.skuDetailSourceTypeEnum.ALL, disabled: false }),
      expiryPeriod: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
      trustPeriod: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
      importPeriod: new FormControl({ value: '', disabled: false }, [Validators.maxLength(255)]),
    });
  }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.tenant = JSON.parse(tenantFromLocalStorage).name;
      this.selectedTenantUTC = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    }
    this.onSearchTypeChange();
    this.onStockLevelChange();
  }

  onSearchTypeChange() {
    const searchType = this.searchTermFormGroup.get('searchType')?.value
    if (searchType === this.searchTypeEnum.BATCH_Number || searchType === this.searchTypeEnum.PRODUCT_CODE || searchType === this.searchTypeEnum.SKU_CODE) {
      this.resetAndDisableSourceType();
      const searchTypeUI = searchType.replace(/[A-Z]/g, (c: any) => { return ' ' + c.toLowerCase() });
      this.placeholder = `Enter exact ${searchTypeUI} to search`;
    } else {
      this.searchTermFormGroup.get('source')?.enable();
      this.placeholder = 'Enter any text to search';
    }
    if (!this.searchTermFormGroup.get('searchTerm')?.value) { this.searchTermFormGroup.get('source')?.enable(); }
  }

  onSelectAll() {
    this.selectAll = !this.selectAll;
    this.skuList.forEach(e => e.tick = this.selectAll);
    this.selectedList = this.skuList.filter(e => e.tick === true);
  }

  onStockLevelChange() {
    if (this.searchTermFormGroup.get('stockLevel')?.value === this.stockLevelEnum.CRITICAL) {
      this.searchTermFormGroup.get('source')?.setValue(this.skuDetailSourceTypeEnum.ALL);
    };
  }

  onSourceChange() {
    if (+this.searchTermFormGroup.get('source')?.value === this.skuDetailSourceTypeEnum.EDENRED ||
      +this.searchTermFormGroup.get('source')?.value === this.skuDetailSourceTypeEnum.TPC) {
      this.searchTermFormGroup.get('stockLevel')?.setValue(this.stockLevelEnum.NORMAL);
    }
  }

  tickToggle(i: number) {
    this.skuList[i].tick = !this.skuList[i].tick;
    this.selectedList = this.skuList.filter(e => e.tick === true);
    if (this.selectedList.length === 0) {
      this.selectAll = false;
    }
  }

  navigateTo(item: any): string {
    const skuDetails = {
      skuId: item.skuId,
      totalStockQty: item.totalRemainingQuantity,
      source: item.source,
      isCritical: item.isCritical,
    };
    localStorage.setItem('skuDetails', JSON.stringify(skuDetails))
    return `voucher/inventory/sku-details/${item.skuId}`;
  }

  exportSelectedList(): void {
    let request = '';
    this.selectedList.forEach((e, i) => {
      request = request + `${i > 0 ? '&' : ''}Id=${e.skuId}`;
    });
    this.inventoryApiService.exportSkuInventoy(request).subscribe({
      next: (res: any) => {
        let blob: Blob = res.body as Blob;
        let fileExport = document.createElement('a');
        const today = `${new Date().getFullYear()}${(+new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}`
        fileExport.download = `SKU_export_${today}.xlsx`;
        fileExport.href = window.URL.createObjectURL(blob);
        fileExport.click();
      },
      error: err => {
        this.toast.showDanger(err.name);
      },
    });
  }

  onSearch(): void {
    this.isSearched = true;
    if (this.isLoading) { return; }
    if (!this.searchTermFormGroup.get('searchTerm')?.value) {
      if (this.searchTermFormGroup.get('stockLevel')?.value === this.stockLevelEnum.NORMAL && +this.searchTermFormGroup.get('source')?.value == this.skuDetailSourceTypeEnum.ALL) {
        this.searchInventory(this.SKU_LIST_ONE_TAKE);
      } else {
        this.getInventoryIdsBySkuConditions();
      }
      return;
    }
    switch (this.searchTermFormGroup.get('searchType')?.value) {
      case this.searchTypeEnum.BATCH_Number: {
        this.searchInventory();
        break;
      }
      case this.searchTypeEnum.SKU_CODE: {
        this.getInventoryIdsBySkuConditions();
        break;
      }
      case this.searchTypeEnum.SKU_NAME: {
        this.getInventoryIdsBySkuConditions();
        break;
      }
      case this.searchTypeEnum.PRODUCT_CODE: {
        this.getInventoryIdsByProductCode();
        break;
      }
      case this.searchTypeEnum.MERCHANT_NAME: {
        this.getInventoryIdsByMerchantName();
        break;
      }
    }

  }

  resetAndDisableSourceType() {
    this.searchTermFormGroup.get('source')?.setValue(this.skuDetailSourceTypeEnum.ALL);
    this.searchTermFormGroup.get('source')?.disable();
  }

  searchInventory(take?: number): void {
    this.isLoading = true;
    const skip = take ? this.skuListSkip : 0;
    const expiryDate = this.searchTermFormGroup.get('expiryPeriod')?.value;
    const trustDate = this.searchTermFormGroup.get('trustPeriod')?.value;
    const importDate = this.searchTermFormGroup.get('importPeriod')?.value;
    const conditions = {
      batchNo: this.searchTermFormGroup.get('searchType')?.value === this.searchTypeEnum.BATCH_Number ? this.searchTermFormGroup.get('searchTerm')?.value.trim() : null,
      isCritical: this.searchTermFormGroup.get('stockLevel')?.value === this.stockLevelEnum.CRITICAL,
      startExpiryDate: expiryDate ? new Date(expiryDate.fromDate).toISOString() : '',
      endExpiryDate: expiryDate ? new Date(`${expiryDate.ngbToDate.year.toString().padStart(2, '0')}-${expiryDate.ngbToDate.month.toString().padStart(2, '0')}-${expiryDate.ngbToDate.day.toString().padStart(2, '0')} 23:59:59`).toISOString() : '',
      startTrustAccountEndDate: trustDate ? new Date(trustDate.fromDate).toISOString() : '',
      endTrustAccountEndDate: trustDate.toDate ? new Date(`${trustDate.ngbToDate.year.toString().padStart(2, '0')}-${trustDate.ngbToDate.month.toString().padStart(2, '0')}-${trustDate.ngbToDate.day.toString().padStart(2, '0')} 23:59:59`).toISOString() : '',
      startCreatedDate: importDate ? new Date(importDate.fromDate).toISOString() : '',
      endCreatedDate: importDate ? new Date(`${importDate.ngbToDate.year.toString().padStart(2, '0')}-${importDate.ngbToDate.month.toString().padStart(2, '0')}-${importDate.ngbToDate.day.toString().padStart(2, '0')} 23:59:59`).toISOString() : '',
    };
    this.inventoryApiService.getInventoryListBySearchConditions(conditions, this.filterBySourceSkuIds, take ? take : 0, skip).pipe(
      takeUntil(this.destroy$)
    )
      .subscribe({
        next: (res: any) => {
          const data = JSON.parse(res.data);
          const inventoryList = data.inventoryDashboard.items;
          this.inventoryHasNextPage = data.inventoryDashboard.pageInfo.hasNextPage;
          inventoryList.forEach((item: any) => {
            const rowData = {
              skuCode: item.merchantSKU[0]?.skuNumber,
              skuName: item.merchantSKU[0]?.skuName,
              skuId: item.skuId,
              source: this.sourceMapper(item.merchantSKU[0]?.voucherNumberRule.voucherGenerateWay, item.merchantSKU[0]?.voucherNumberRule.onDemand),
              tick: false,
              isCritical: item.stockLevel === this.stockLevelEnum.CRITICAL,
              expiryDate: this.dateUiDisplay(item.distinctExpiryDate),
              totalRemainingQuantity: item.totalRemainingQuantity,
              warningWaterLevel: item.warningWaterLevel,
              trustAccountEndDate: this.dateUiDisplay(item.distinctTrustAccountDate),
            }
            this.skuList.push(rowData);
          });
        },
        error: (err: any) => {
          this.isLoading = false;
          this.toast.showDanger(err.error.Message ?? err.error.message);
        },
        complete: () => {
          this.isLoading = false;
          if (this.skuListSkip === 0) {
            addEventListener("scroll", () => {
              const doc = document.documentElement;
              const offset = doc.scrollTop + window.innerHeight;
              const height = doc.offsetHeight;
              if ((offset + 20 >= height)&& (take ? this.inventoryHasNextPage : this.hasNextPage)) {
                this.onSearch();
              }
            });
          }

          if (this.hasNextPage && this.skuList.length < 20) {
            this.onSearch();
          }
          if (take && this.inventoryHasNextPage) {
            this.skuListSkip = this.skuListSkip + this.SKU_LIST_ONE_TAKE;
          }

          if (!this.inventoryHasNextPage && !this.hasNextPage) {
            this.removeScrollendListener();
            return
          }

        }
      });
  }


  removeScrollendListener() {
    removeEventListener("scrollend", () => { });
  }

  dateUiDisplay(dateArray: string[]): string {
    if (dateArray?.length === 1) { return dateArray[0].startsWith('2999') ? this.NO_EXPIRATION : dateArray[0] };
    if (dateArray?.length > 1) { return this.MULTIPLE_DATES };
    return '--'
  }

  sourceMapper(voucherGenerateWay: number, onDemand: boolean): number {
    if (voucherGenerateWay === 1) { return SkuDetailSourceTypeEnum.EDENRED };
    if (voucherGenerateWay == 2) { return onDemand ? SkuDetailSourceTypeEnum.TPC : SkuDetailSourceTypeEnum.IMPORT };
    return 0;
  }

  setTotalCountAndSkipAmountAndRecall(totalCount: number, hasNextPage: boolean) {
    this.totalIdsAmount = totalCount;
    this.skipAmount = hasNextPage ? this.skipAmount + this.IDS_ONE_TAKE : 0;
    this.hasNextPage = hasNextPage;
  }

  getInventoryIdsBySkuConditions(): void {
    this.isLoading = true;
    let sourceType = +this.searchTermFormGroup.get('source')?.value;
    const skuCode = this.searchTermFormGroup.get('searchType')?.value === this.searchTypeEnum.SKU_CODE ? this.searchTermFormGroup.get('searchTerm')?.value.trim() : null;
    const skuName = this.searchTermFormGroup.get('searchType')?.value === this.searchTypeEnum.SKU_NAME ? this.searchTermFormGroup.get('searchTerm')?.value.trim() : null;
    if (this.searchTermFormGroup.get('stockLevel')?.value === this.stockLevelEnum.CRITICAL) {
      sourceType = this.skuDetailSourceTypeEnum.IMPORT;
    }
    this.inventoryApiService.getSkuIdsBySourceOrSkuCodeOrName(sourceType, skuCode, skuName, this.IDS_ONE_TAKE, this.skipAmount).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        const data = JSON.parse(res.data);
        this.filterBySourceSkuIds = data.contractSKUDetails.items.map((e: any) => e.id);
        this.isLoading = false;
        this.setTotalCountAndSkipAmountAndRecall(data.contractSKUDetails.totalCount, data.contractSKUDetails.pageInfo.hasNextPage);
      },
      error: (err: any) => {
        this.toast.showDanger(err.error.Message ?? err.error.message);
        this.isLoading = false;
      },
      complete: () => {
        if (this.filterBySourceSkuIds.length > 0) {
          this.searchInventory();
        }
      }
    });
  }

  getInventoryIdsByProductCode(): void {
    this.isLoading = true;
    const productCode = this.searchTermFormGroup.get('searchType')?.value === this.searchTypeEnum.PRODUCT_CODE ? this.searchTermFormGroup.get('searchTerm')?.value.trim() : null;
    const sourceType = +this.searchTermFormGroup.get('source')?.value;
    forkJoin({
      idsBySource: this.inventoryApiService.getSkuIdsBySourceOrSkuCodeOrName(sourceType, '', '', this.IDS_ONE_TAKE, this.skipAmount),
      idsByProducts: this.inventoryApiService.getSkuIdsByProductCode(productCode)
    }).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: (res: any) => {
        const data = JSON.parse(res.idsByProducts.data);
        this.filterBySourceSkuIds = data.products.items.map((e: any) => e.skuId);
        this.isLoading = false;
        this.setTotalCountAndSkipAmountAndRecall(data.products.totalCount, data.products.pageInfo.hasNextPage);
      },
      error: (err: any) => {
        this.toast.showDanger(err.error.Message ?? err.error.message);
        this.isLoading = false;
      },
      complete: () => {
        if (this.filterBySourceSkuIds.length > 0) {
          this.searchInventory();
        }
      }
    });
  }

  getInventoryIdsByMerchantName(): void {
    this.isLoading = true;
    const merchantName = this.searchTermFormGroup.get('searchType')?.value === this.searchTypeEnum.MERCHANT_NAME ? this.searchTermFormGroup.get('searchTerm')?.value.trim() : null;
    const sourceType = +this.searchTermFormGroup.get('source')?.value;
    this.inventoryApiService.getSkuIdByMercahntName(merchantName, sourceType, this.IDS_ONE_TAKE, this.skipAmount).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res: any) => {
        const data = JSON.parse(res.data);
        this.filterBySourceSkuIds = data.contractSKUCost.items.map((e: any) => e.skuId);
        this.setTotalCountAndSkipAmountAndRecall(data.contractSKUCost.totalCount, data.contractSKUCost.pageInfo.hasNextPage);
      },
      error: (err: any) => {
        this.toast.showDanger(err.error.Message ?? err.error.message);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
        if (this.filterBySourceSkuIds.length > 0) {
          this.searchInventory();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}


export enum SearchTypeEnum {
  SKU_CODE = 'skuCode',
  SKU_NAME = 'skuName',
  PRODUCT_CODE = 'productCode',
  BATCH_Number = 'batchNumber',
  MERCHANT_NAME = 'merchantName',
}