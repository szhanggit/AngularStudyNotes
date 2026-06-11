import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbNav, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { MerchantGroupService } from 'src/app/merchant/services/merchant-group.service';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';
import { SkuDetail, PageDetails, ContractSKUCost } from 'src/app/merchant/models/merchant-group-sku.model';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { MerchantGroupSharedService } from 'src/app/merchant/services/merchant-group-shared.service';
import { map, tap } from 'rxjs';
import { UISkuStatusEnum } from 'src/app/merchant/enums/merchant-group.enum';

@Component({
  selector: 'merchant-group-sku-view',
  templateUrl: './merchant-group-sku-view.component.html',
  styleUrls: ['./merchant-group-sku-view.component.scss']
})
export class MerchantGroupSkuViewComponent implements OnInit, AfterViewInit {
  @ViewChild(NgbNav) nav!: NgbNav;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  @Input() merchantId!: number;
  @Input() merchantGroupId!: number;

  skuCollapsed: boolean = true;
  selectedTenantUTC!: string;
  skuList: SkuDetail[] = [];
  skuStatus: string = ''
  currentTab = 'valid'
  totalSku = 1;
  tenant!: string;
  searchTerm: string = '';
  isLoading$ = new BehaviorSubject<boolean>(false);
  isValidTab = true;
  pageInfo: PageDetails = {
    currentPage: 1,
    pageCount: 1,
    pageSize: 20,
    itemStart: 1,
    itemEnd: 20,
    total: 0
  }
  UISkuStatusEnum = UISkuStatusEnum;

  // getter for merchant editor flag
  get isMerchantEditor(): boolean {
    return this.authLibraryService.getElementOperationFlag([environment.merchant_create_op_id]);
  }

  constructor(
    public merchantGroupService: MerchantGroupService,
    public merchantGroupSharedService: MerchantGroupSharedService,
    private readonly router: Router,
    private readonly tenantConfigService: TenantConfigService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly authLibraryService: AuthorizationLibraryService,
    private utilityService: UtilityService
  ) {
    const tenantFromRoute = this.activatedRoute.snapshot.queryParamMap.get('tenantName');
    this.tenant = this.tenantConfigService.getTenant(tenantFromRoute).name;
    this.selectedTenantUTC=utilityService.FetchLocalTimeFromUTC();
  }

  ngOnInit(): void {
    this.getGroupSkuList(true);
  }

  search() {
    this.getGroupSkuList(this.isValidTab);
  }

  ngAfterViewInit(): void {
    this.nav.navChange.subscribe(e => {
      if (e.nextId === 1) {
        this.currentTab = 'valid';
        this.getGroupSkuList(true);
      } else if (e.nextId === 2) {
        this.currentTab = 'expired';
        this.getGroupSkuList(false);
      }
    })

  }

  getGroupSkuList(isValidTab: boolean): void {
    this.isValidTab = isValidTab;
    this.skuList = [];
    const searchTerm = this.searchTerm.trim();
    this.merchantGroupService.getGroupSkuByMerchantId(this.merchantGroupId, isValidTab, this.pageInfo, searchTerm)
    .pipe(
      map(res => JSON.parse(res.data)),
      tap((data) => {
        const list = data.contractSKUDetails?.items;
        list.forEach((e: any) => {
          e.skuStatus = this.getSkuStatusTag(e.contractSKUCosts);
          return e;
        })
      })
    )
    .subscribe(
      list => {
        this.skuList = [...list.contractSKUDetails?.items];
        this.calPageInfo(list.contractSKUDetails.totalCount);
      }
    )
  }

  setPageSize() {
    this.pageInfo.currentPage = 1;
    this.getGroupSkuList(this.isValidTab);
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

  exportGroupSku() {
    this.merchantGroupService.getDownload(this.merchantGroupId, this.selectedTenantUTC).subscribe({
      next: (res: any) => {
        let filename = res.headers.get('content-disposition')?.split(';')[1].split('=')[1];
        let blob: Blob = res.body as Blob;
        let a = document.createElement('a');
        a.download = filename ?? `Group_SKU_${this.merchantGroupId}.xlsx`;
        a.href = window.URL.createObjectURL(blob);
        a.click();
      },
      error: err => {
        this.isLoading$.next(false);
        this.toast.showDanger(err.error.Message ?? err.error.message);
      },
    });
  }


  getSkuStatusTag(list: ContractSKUCost[]): string {
    if(list) {
      return this.merchantGroupSharedService.getSkuStatusTag(list);
    } else {
      return '';
    }
  }

  navigateToSkuDetails(event: MouseEvent, skuId: number): void {
    event.preventDefault();
    if (event.ctrlKey) {
      window.open(this.getUrl(skuId), '_blank');
    } else {
      this.router.navigateByUrl(this.getUrl(skuId));
    }
  }
  
  getUrl(skuId: number): string {
    return `merchants/merchant-group/sku/details?merchantId=${this.merchantId}&skuId=${skuId}`;
  }

  navigateToCreateGroupSku() {
    this.router.navigate(['merchants/merchant-group/sku/create'],
      {
        queryParams: {
          merchantId: this.merchantId
        }
      });
  }
  
  navigateToEditGroupSku(skuId: number) {
    this.router.navigate(['merchants/merchant-group/sku/edit'],
      {
        queryParams: {
          merchantId: this.merchantId,
          skuId: skuId
        }
      });
  }

}
