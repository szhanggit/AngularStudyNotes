import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AcceptanceLoop } from 'src/app/products/models/acceptance-loop.model';
import { Merchant } from 'src/app/products/models/merchant.model';

@Component({
  selector: 'app-acceptance-loop-table',
  templateUrl: './acceptance-loop-table.component.html',
  styleUrls: ['./acceptance-loop-table.component.scss']
})
export class AcceptanceLoopTableComponent implements OnInit, OnChanges {
  MERCHANT_DEFAULT_SIZE = 5;
  PAGE_SIZE = 3;

  _acceptantLoopList!: AcceptanceLoop[];
  @Input() set acceptanceLoopList(value: AcceptanceLoop[]) {
    if (!value.length) return;
    if (!value[0].isDefault) {
      this._acceptantLoopList = [...value.reverse()];
    } else {
      this._acceptantLoopList = [...value];
    }
  };
  get acceptanceLoopList(): AcceptanceLoop[] {
    return this._acceptantLoopList;
  }

  acceptanceLoopListPaginated!: AcceptanceLoop[];
  _page = 1;
  @Input() set page(value: number) {
    this._page = value;
    this.acceptanceLoopPaginationChanged.emit(value);
  }
  get page(): number {
    return this._page;
  }

  @Input() selectedAcceptanceLoopId!: number;
  @Input() selectedMerchant: Merchant | undefined = undefined;
  @Input() isMonoMerchant = true;
  @Input() errorMessage!: string;
  @Input() merchantId!: number | undefined;
  @Input() shopCount!: number;
  @Input() isReview = false;
  @Output() acceptanceLoopSelectionChanged = new EventEmitter<number>();
  @Output() acceptanceLoopPaginationChanged = new EventEmitter<number>();

  tenant!: string;
  selectedTenantUTC!: string;

  // pagination
  get total(): number {
    return this.acceptanceLoopList.length;
  }

  get pageCount(): number {
    return Math.ceil(this.total / this.PAGE_SIZE);
  }
  get itemStart(): number {
    return this.page === 1 ? 1 : this.total < 1 ? this.total : (((this.page - 1) * this.PAGE_SIZE) + 1);;
  }
  get itemEnd(): number {
    return this.page === this.pageCount || this.total < this.page * this.PAGE_SIZE ? this.total : this.page * this.PAGE_SIZE;
  }

  constructor() { }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');

    if (tenantFromLocalStorage) {
      this.tenant = JSON.parse(tenantFromLocalStorage).name;
      this.selectedTenantUTC = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    }

    if (!this.acceptanceLoopList || !this.acceptanceLoopList.length) return;

    for (const acceptanceLoop of this.acceptanceLoopList) {
      if (acceptanceLoop.isDefault && !this.selectedAcceptanceLoopId) {
        this.selectedAcceptanceLoopId = acceptanceLoop.acceptanceLoopId;
      }
      if (this.shopCount === 0) {
        acceptanceLoop.availableShops = "No shops";
      }
    }
  }

  ngOnChanges() {
    this.setAcceptanceLoopPaginated();
  }

  setAcceptanceLoopPaginated() {
    this.resetViewAll();

    if (!this.acceptanceLoopList) return;
    
    if (!this.isReview) {
      this.acceptanceLoopListPaginated = this.acceptanceLoopList.slice((this.page - 1) * this.PAGE_SIZE, this.page * this.PAGE_SIZE);
    } else {
      this.acceptanceLoopListPaginated = this.acceptanceLoopList;
    }
  }

  resetViewAll() {
    const aclIds = new Set(
      this.acceptanceLoopList.map((acl) => acl.acceptanceLoopId)
    );
    for (let acl of this.acceptanceLoopList) {
      if (aclIds.has(acl.acceptanceLoopId)) {
        acl.isExpanded = false;
      }
    }
    this.acceptanceLoopListPaginated?.forEach((acl) => {
      acl.merchantsDisplay = acl.merchantAggregation?.slice(0, 5);
    });
  }

  OnAcceptanceLoopSelectionChanged() {
    this.acceptanceLoopSelectionChanged.emit(this.selectedAcceptanceLoopId);
  }

  toggleViewAll(i: number) {
    let item = this.acceptanceLoopListPaginated[i];
    item.isExpanded = !item.isExpanded;

    if (item.isExpanded) {
      item.merchantsDisplay = item.merchantAggregation;
    }
    else {
      item.merchantsDisplay = item.merchantAggregation.slice(0, 5);
    }
  }

}
