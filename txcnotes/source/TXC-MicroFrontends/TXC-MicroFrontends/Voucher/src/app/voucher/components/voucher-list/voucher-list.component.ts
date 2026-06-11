import { Subject, map, takeUntil } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Tenant, TenantConfigService } from '../../service/tenant-config.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { ProductTypeEnum } from '../../enum/product-type.enum';
import { VoucherSearchTermsEnum } from '../../enum/voucher-search-terms';
import { VoucherApiService } from '../../service/voucher-api.service';
import { VoucherStatusEnum } from '../../enum/voucher-status.enum';

@Component({
  selector: 'app-voucher-list',
  templateUrl: './voucher-list.component.html',
  styleUrls: ['./voucher-list.component.scss']
})
export class VoucherListComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  // tenant names
  readonly TENANT_NAME_IN = "IN";
  readonly TENANT_NAME_GR = "GR";
  readonly TENANT_NAME_TW = "TW";
  readonly TENANT_NAME_SG = "SG";
  // enum
  readonly voucherStatusEnum = VoucherStatusEnum;

  readonly searchTermsEnum = VoucherSearchTermsEnum;
  readonly SINGLE_RESULT_CONDITIONS = [
    this.searchTermsEnum.VOUCHER_NUMBER,
    this.searchTermsEnum.ALIAS,
    this.searchTermsEnum.VOUCHER_GUID,
    this.searchTermsEnum.ECODE
  ];
  readonly MULTI_RESULTS_CONDITIONS = [
    this.searchTermsEnum.EMAIL,
    this.searchTermsEnum.MOBILE,
    this.searchTermsEnum.CLIENT_ORDER_NUMBER,
    this.searchTermsEnum.GR_ORDER_ID,
    this.searchTermsEnum.CORRELATION_ID,
  ];
  readonly DISABLE_DISTRIBUTION_STATUS = [
    this.searchTermsEnum.CLIENT_ORDER_NUMBER,
    this.searchTermsEnum.GR_ORDER_ID,
    this.searchTermsEnum.CORRELATION_ID,
  ]

  searchTermFormGroup: FormGroup;
  showSearchResult: boolean = false;
  searchPlaceholder = 'Enter voucher number';
  tenant!: Tenant;
  selectedList: VoucherRelatedData[] = [];
  selectAll: boolean = false;
  voucherList: VoucherRelatedData[] = [];
  destroy$ = new Subject();

  // dropdown list
  voucherStatusList: VoucherStatusEnum[] = [
    this.voucherStatusEnum.ALL,
    this.voucherStatusEnum.ACTIVATED,
    this.voucherStatusEnum.BLOCKED,
    this.voucherStatusEnum.EXPIRED,
    this.voucherStatusEnum.ISSUED,
    this.voucherStatusEnum.TRASHED,
    this.voucherStatusEnum.USED,
  ];

  pageInfo = {
    currentPage: 1,
    pageCount: 1,
    pageSize: 20,
    itemStart: 1,
    itemEnd: 20,
    total: 1,
  }



  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly tenantConfigService: TenantConfigService,
    public voucherApiService: VoucherApiService,
  ) {
    this.searchTermFormGroup = this.formBuilder.group({
      searchOption: new FormControl(this.searchTermsEnum.VOUCHER_NUMBER),
      voucherStatus: new FormControl({ value: this.voucherStatusEnum.ALL, disabled: true }),
      productName: new FormControl({ value: '', disabled: true }, [Validators.maxLength(255)]),
      searchTerm: new FormControl('', [Validators.maxLength(255)]),
    });
  }

  ngOnInit(): void {
    this.tenant = this.tenantConfigService.getTenant();

  }

  onSearchOptionChange(searchOption: string): void {
    let searchOptionString: string = searchOption.replace(/[A-Z]/g, (c) => { return ' ' + c.toLowerCase() });
    if (searchOption === this.searchTermsEnum.ECODE) {
      searchOptionString = searchOption;
    }
    if (searchOption === this.searchTermsEnum.CORRELATION_ID) {
      searchOptionString = 'correlation ID';
    }
    if (searchOption === this.searchTermsEnum.GR_ORDER_ID) {
      searchOptionString = 'GR order ID';
    }
    this.searchPlaceholder = `Enter ${searchOptionString}`
    if (this.MULTI_RESULTS_CONDITIONS.some(e => e === searchOption)) {
      if (this.DISABLE_DISTRIBUTION_STATUS.some(e => e === searchOption)) {
        this.enableMultiConditions();
      } else {
        this.enableMultiConditions();
      }
    } else {
      this.resetMultiConditions();
      this.disableMultiConditions();
    }
  }

  search(): void {
    switch (this.searchTermFormGroup.get('searchOption')?.value) {
      // Single result
      case this.searchTermsEnum.VOUCHER_NUMBER: {
        this.voucherApiService.getVoucherListByVoucherNumber(this.searchTermFormGroup.get('searchTerm')?.value).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (res: any) => {
            const data = JSON.parse(res.data);
            this.setVoucherList(data.vouchersByVoucherNumber.items);
          },
          error: (err: any) => {
            this.toast.showDanger(err.error.Message ?? err.error.message);
            this.voucherList = [];
          },
          complete: () => {
            this.showSearchResult = true;
          },
        });
        break
      }
      case this.searchTermsEnum.ALIAS: {
        this.voucherApiService.getVoucherListByAlias(this.searchTermFormGroup.get('searchTerm')?.value).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (res: any) => {
            const data = JSON.parse(res.data);
            this.setVoucherList(data.vouchersByAliases.items);

          },
          error: (err: any) => {
            this.toast.showDanger(err.error.Message ?? err.error.message);
            this.voucherList = [];
          },
          complete: () => {
            this.showSearchResult = true;
          },
        });
        break
      }
      case this.searchTermsEnum.VOUCHER_GUID: {
        this.voucherApiService.getVoucherListByGuid(this.searchTermFormGroup.get('searchTerm')?.value).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (res: any) => {
            const data = JSON.parse(res.data);
            this.setVoucherList(data.vouchersByGUIDs.items);

          },
          error: (err: any) => {
            this.toast.showDanger(err.error.Message ?? err.error.message);
            this.voucherList = [];
          },
          complete: () => {
            this.showSearchResult = true;
          },
        });
        break
      }
      case this.searchTermsEnum.GCID: {
        this.voucherApiService.getVoucherListByGcid(this.searchTermFormGroup.get('searchTerm')?.value).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (res: any) => {
            const data = JSON.parse(res.data);
            this.setVoucherList(data.vouchersByGcid.items);
          },
          error: (err: any) => {
            this.toast.showDanger(err.error.Message ?? err.error.message);
            this.voucherList = [];
          },
          complete: () => {
            this.showSearchResult = true;
          },
        });
        break
      }
      case this.searchTermsEnum.ECODE: {
        this.voucherApiService.getVoucherListByEcode(this.searchTermFormGroup.get('searchTerm')?.value).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          next: (res: any) => {
            const data = JSON.parse(res.data);
            this.setVoucherList(data.vouchersByeCode.items);
          },
          error: (err: any) => {
            this.toast.showDanger(err.error.Message ?? err.error.message);
            this.voucherList = [];
          },
          complete: () => {
            this.showSearchResult = true;
          },
        });
        break
      }

      // Multi result
      case this.searchTermsEnum.EMAIL: {
        break
      }
      case this.searchTermsEnum.MOBILE: {
        break
      }
      case this.searchTermsEnum.CLIENT_ORDER_NUMBER: {
        break
      }
      case this.searchTermsEnum.GR_ORDER_ID: {
        break
      }
      case this.searchTermsEnum.CORRELATION_ID: {
        break
      }
    }
  }

  setVoucherList(responseList: any) {
    const list = responseList.map((voucherData: any) => {
      const voucherRow = {
        voucherId: voucherData.id,
        voucherNumber: voucherData.voucherNumberMask,
        orderNumber: voucherData.orderLineDetail[0]?.orderLine?.order.orderNumber,
        productName: voucherData.orderLineDetail[0]?.orderLine?.order.orderLines[0]?.productVersion[0]?.product.productName,
        clientName: voucherData.orderLineDetail[0]?.orderLine?.order.client[0].clientName,
        email: voucherData.orderLineDetail[0]?.mobile ? voucherData.orderLineDetail[0]?.email : '',
        mobile: voucherData.orderLineDetail[0]?.mobile ? voucherData.orderLineDetail[0]?.mobile : '',
        alias: voucherData.alias?.alias,
        publishDate: voucherData.orderLineDetail[0]?.orderLine?.order.publishDateTime,
        activateDate: voucherData.activatedOn,
        voucherSatus: voucherData.stateDescription,
        tick: false,
        productType: voucherData.orderLineDetail[0]?.orderLine?.order.orderLines[0].productVersion[0].product.productType,
        productId: voucherData.orderLineDetail[0]?.orderLine?.order.orderLines[0].productVersion[0].product.productId,
        orderId: voucherData.orderLineDetail[0]?.orderLine?.order.orderLines[0].orderId,
        orderStatus: voucherData.orderLineDetail[0]?.orderLine?.order.orderLines[0]?.status,
        clientId: voucherData.orderLineDetail[0]?.orderLine?.order.client[0]?.id,
        clientCode: voucherData.orderLineDetail[0]?.orderLine?.order.client[0]?.identityCode,
        guid: voucherData.guid?.guid,
      }
      return voucherRow;
    });
    this.voucherList = list;
  }

  enableMultiConditions(): void {
    this.searchTermFormGroup.get('voucherStatus')?.enable();
    this.searchTermFormGroup.get('productName')?.enable();
  }

  disableMultiConditions(): void {
    this.searchTermFormGroup.get('voucherStatus')?.disable();
    this.searchTermFormGroup.get('productName')?.disable();
  }

  resetMultiConditions(): void {
    this.searchTermFormGroup.get('voucherStatus')?.reset(this.voucherStatusEnum.ALL);
    this.searchTermFormGroup.get('productName')?.reset('');
  }

  resendVoucher(): void {
    this.toast.showSuccess("Resending request is successful, please wait a while.");
  }

  onSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.voucherList.forEach(e => e.tick = this.selectAll);
    this.selectedList = this.voucherList.filter(e => e.tick === true);
  }

  tickToggle(i: number) {
    this.voucherList[i].tick = !this.voucherList[i].tick;
    this.selectedList = this.voucherList.filter(e => e.tick === true);
    if (this.selectedList.length === 0) {
      this.selectAll = false;
    }
  }

  navigateToVoucherDetails(item: any) {
    return `voucher/voucher-details/${item.guid}`;
  }

  navigateToProductDetails(item: any): string {
    if (item.productType === ProductTypeEnum.SMART_CHOICE_VOUCHER) {
      return `products/product/edit/smart-choice-voucher/${item.productId}`;
    } else if (item.productType === ProductTypeEnum.SUPER_VOUCHER) {
      return `products/product/edit/super-voucher/${item.productId}`;
    } else {
      return `products/${item.productId}`;
    }
  }

  navigateToOrderDetails(item: any): string {
    return `order/${item.orderId}?orderStatus=${item.orderStatus}`;
  }


  navigateToClientDetails(item: any): string {
    return `clients/details?clientId=${item.clientId}&identityCode=${item.clientCode}`;
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}

export interface VoucherRelatedData {
  voucherId: number;
  voucherNumber: string;
  orderNumber?: string;
  quotationNumber?: string;
  productName?: string;
  clientName?: string;
  email: string;
  mobile: string;
  alias?: string;
  publishDate?: string;
  activateDate?: string;
  voucherSatus: VoucherStatusEnum;
  tick?: boolean;
  productType?: number;
  productId?: number;
  orderId?: number;
  clientId?: number;
  clientCode?: number;
}
