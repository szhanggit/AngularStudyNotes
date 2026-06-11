import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { MerchantGroupService } from 'src/app/merchant/services/merchant-group.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { ContractSKUCost, PageDetails, ResponseShopCountByMerchantIds, SkuDetail, SkuMerchantGroupListUI } from 'src/app/merchant/models/merchant-group-sku.model';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { ContractSkuStatusEnum, SkuTypeEnum, UISkuStatusEnum } from 'src/app/merchant/enums/merchant-group.enum';
import { MerchantGroupSharedService } from 'src/app/merchant/services/merchant-group-shared.service';

@Component({
  selector: 'app-merchant-group-sku-details',
  templateUrl: './merchant-group-sku-details.component.html',
  styleUrls: ['./merchant-group-sku-details.component.scss']
})
export class MerchantGroupSkuDetailsComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  selectedTenantUTC!: string;
  merchantId: number;
  merchantGroupId: number = 0;
  skuId: number;
  skuCollapsed: boolean = true;
  merchantList: number[] = []; // array of 'vailable Merchants' id 
  skuDetail: SkuDetail = { id: 0 }; // data for displaying 'SKU section'
  detailColumns = ['SKU name', 'SKU code', 'SKU type', 'Face value', 'Group voucher number rule', 'Cost scheme', 'Creator', 'Created time']
  skuMerchantList: SkuMerchantGroupListUI[] = []; // data for displaying 'SKU section'
  tenant!: string;
  totalSku = 1;
  isLoading$ = new BehaviorSubject<boolean>(false);
  searchTerm: string = '';
  pageInfo: PageDetails = {
    currentPage: 1,
    pageCount: 1,
    pageSize: 20,
    itemStart: 1,
    itemEnd: 20,
    total: 0
  }
  isExpired = false;
  today = new Date();
  UISkuStatusEnum = UISkuStatusEnum;
  SkuTypeEnum = SkuTypeEnum;
  contractList: number[] = [];

  constructor(
    public merchantGroupService: MerchantGroupService,
    private readonly router: Router,
    private readonly tenantConfigService: TenantConfigService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly authLibraryService: AuthorizationLibraryService,
    public merchantGroupSharedService: MerchantGroupSharedService,
    private utilityService: UtilityService
  ) {
    const tenantFromRoute = this.activatedRoute.snapshot.queryParamMap.get('tenantName');
    this.tenant = this.tenantConfigService.getTenant(tenantFromRoute).name;
    const idFromRoute = this.activatedRoute.snapshot.queryParamMap.get('merchantId');
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
    const skuIdRoute = this.activatedRoute.snapshot.queryParamMap.get('skuId');
    this.skuId = skuIdRoute ? +skuIdRoute : 0;
    this.selectedTenantUTC = utilityService.FetchLocalTimeFromUTC();
  }

  ngOnInit(): void {
    this.getGroupSkuDetailsBySkuId();
  }

  detailValueMapping(detailName: string) {
    switch (detailName) {
      case 'SKU name':
        return this.skuDetail.skuName;
      case 'SKU code':
        return this.skuDetail.skuNumber;
      case 'SKU type':
        return this.skuDetail.skuType?.value;
      case 'Multiplier':
        return this.skuDetail.multiplier;
      case 'Face value':
        return this.skuDetail.faceValueWithTax;
      case 'Group voucher number rule':
        return this.skuDetail.voucherNumberRule?.ruleName;
      case 'Cost scheme':
        if (this.skuDetail.skuType?.id === SkuTypeEnum.ProductBased || this.skuDetail.skuType?.id === SkuTypeEnum.SmarBooklet) {
          return 'Fixed';
        }
        else if (this.skuDetail.skuType?.id === SkuTypeEnum.ValueBased || this.skuDetail.skuType?.id === SkuTypeEnum.DynamicFaceValue) {
          return 'Cost %';
        }
        else {
          return '';
        }

      case 'Creator':
        return this.skuDetail.createdBy;
      case 'Created time':
        return this.skuDetail.createdDateTime;
      default:
        return ''
    }
  }

  modifyDetailColumns(skuTypeId: number) {
    if (skuTypeId === SkuTypeEnum.SmarBooklet) {
      this.detailColumns.splice(3, 0, 'Multiplier');
    }
    if (skuTypeId === SkuTypeEnum.DynamicFaceValue) {
      this.detailColumns.splice(3, 1);
    }
  }

  getGroupSkuDetailsBySkuId() {
    this.merchantGroupService.getGroupSkuDetailsBySkuIdForViewOnly(+this.skuId).subscribe({
      next: (res: any) => {
        const result = JSON.parse(res.data);
        const details: SkuDetail = result?.contractSKUDetails.items[0];
        details['skuStatus'] = details.contractSKUCosts && details.contractSKUCosts.length > 0 ? this.getSkuStatusTag(details.contractSKUCosts) : '';
        details.skuType ? this.modifyDetailColumns(details.skuType?.id) : '';
        this.skuDetail = details;
        this.calPageInfo(details.contractSKUCosts?.length ?? 0);

        const skuMerchantList = details.contractSKUCosts?.map(e => {
          const row = {
            merchantId: 0,
            merchantName: '',
            contractName: '',
            contractNumber: null,
            contractId: e.contractId ?? 0,
            shopAmount: 0,
            costWithTax: e.costWithTax ? Number(e.costWithTax) : 0,
            costWithoutTax: e.costWithoutTax ? Number(e.costWithoutTax): 0,
            validStartDate: e.validStartDate ?? '',
            validEndDate: e.validEndDate ?? '',
            status: e.contractSkuStatus.id,
            createdBy: e.createdBy ?? '',
            createdDateTime: e.createdDateTime ?? '',
          }
          return row;
        });

        if (skuMerchantList) {
          this.skuMerchantList = skuMerchantList;

          const validSkuMerchantList = skuMerchantList.filter(merchant => {
            return new Date(merchant.validEndDate) > this.today;
          })
          this.isExpired = validSkuMerchantList.length === 0;
        }
        details.contractSKUCosts?.forEach(contract => {
          this.contractList.push(contract.contractId);
        })
      },
      error: err => {
        this.isLoading$.next(false);
        this.toast.showDanger(err.error.Message ?? err.error.message);
      },
      complete: () => {
        this.getContractsDetails();
      }
    });
  }

  getContractsDetails() {
    this.merchantGroupService.getContractsDetails(this.contractList).subscribe({
      next: (res: any) => {
        const result = JSON.parse(res.data);
        if (result.contractInfo.items) {
          this.merchantList = result.contractInfo.items.map((e: any) => e.merchant.merchantId);
          this.skuMerchantList.forEach((contractInfo: any, i) => {
            const index = result.contractInfo.items.findIndex((sku: any) => sku.contractId === contractInfo.contractId)
            this.skuMerchantList[i].contractName = result.contractInfo.items[index].contractName;
            this.skuMerchantList[i].contractNumber = result.contractInfo.items[index].contractNumber;
            this.skuMerchantList[i].merchantId = result.contractInfo.items[index].merchant.merchantId;
            this.skuMerchantList[i].merchantName = result.contractInfo.items[index].merchant.name;
          });
        }
        this.skuMerchantList.sort((a: any, b: any) => a.merchantName.localeCompare(b.merchantName));
      },
      error: err => {
        this.isLoading$.next(false);
        this.toast.showDanger(err.error.Message ?? err.error.message);
      },
      complete: () => {
        this.getShopsByMerchants();
      }
    })
  }

  getSkuStatusTag(list: ContractSKUCost[]): string {
    return this.merchantGroupSharedService.getSkuStatusTag(list);
  }

  getMerchantStatusTag(merchant: SkuMerchantGroupListUI): string {
    if (new Date(merchant.validEndDate) <= this.today) {
      return UISkuStatusEnum.Expired
    } else if (merchant.status === ContractSkuStatusEnum.Approved) {
      return UISkuStatusEnum.Approved;
    } else if (merchant.status === ContractSkuStatusEnum.Deleted) {
      return UISkuStatusEnum.Deleted;
    } else {
      return UISkuStatusEnum.Others;
    }
  }



  getShopsByMerchants() {
    if (this.merchantList.length <= 0) { return; }
    this.merchantGroupService.getShopCountByMerchantIdsAndStatus(this.merchantList).subscribe({
      next: res => {
        const list: ResponseShopCountByMerchantIds = JSON.parse(res.data);
        list.shopCountByMerchantIds.forEach((shop) => {
          this.skuMerchantList.forEach(merchant => {
            if (merchant.merchantId === shop.id) {
              merchant.shopAmount = shop.count;
            }
          });
        });
      },
      error: err => {
        this.isLoading$.next(false);
        this.toast.showDanger(err.error.Message ?? err.error.message);
      }
    });
  }


  // getter for merchant editor flag
  get isMerchantEditor(): boolean {
    return this.authLibraryService.getElementOperationFlag([environment.merchant_create_op_id]);
  }

  setPageSize() {
    this.pageInfo.currentPage = 1;
    this.getGroupSkuDetailsBySkuId();
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

  navigateToEditGroupSku() {
    this.router.navigate(['merchants/merchant-group/sku/edit'],
      {
        queryParams: {
          merchantId: this.merchantId,
          skuId: this.skuId
        }
      });
  }

  navigateToMerchantGroupDetails() {
    this.router.navigate(['merchants/merchant-group-details'],
      {
        queryParams: {
          merchantId: this.merchantId
        }
      });
  }
}
