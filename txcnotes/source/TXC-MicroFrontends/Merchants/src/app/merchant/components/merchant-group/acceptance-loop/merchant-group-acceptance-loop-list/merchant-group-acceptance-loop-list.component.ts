import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCollapse, NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { GeneralViewItem, GeneralViewModalInfo, GroupAcceptanceLoop, ViewItemType, PageDetails } from 'src/app/merchant/models/acceptance-loop.model';
import { GraphqlCollectionSegment } from 'src/app/merchant/models/graphql-collection-segment.model';
import { AcceptanceLoopApiService } from 'src/app/merchant/services/acceptance-loop-api.service';
import { MerchantGroupService } from 'src/app/merchant/services/merchant-group.service';
import { environment } from 'src/environments/environment';
import { MerchantGroupAcceptanceLoopViewModalComponent } from '../merchant-group-acceptance-loop-view-modal/merchant-group-acceptance-loop-view-modal.component';

@Component({
  selector: 'app-merchant-group-acceptance-loop-list',
  templateUrl: './merchant-group-acceptance-loop-list.component.html',
  styleUrls: ['./merchant-group-acceptance-loop-list.component.scss']
})
export class MerchantGroupAcceptanceLoopListComponent implements OnInit, OnDestroy {
  @Input() merchantGroupId!: number;
  @Input() merchantId!: number;
  @Input() action!: string;

  @ViewChild(NgbCollapse) acceptanceListCollapse!: NgbCollapse;
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  acceptanceListCollapsed = true;

  PAGE_SIZE: number = 3;
  MERCHANT_DEFAULT_SIZE = 5;
  pageInfo: PageDetails = {
    currentPage: 1,
    pageCount: 1,
    pageSize: this.PAGE_SIZE,
    itemStart: 1,
    itemEnd: this.PAGE_SIZE,
    total: 0
  }

  acceptanceLoops$ = new BehaviorSubject<GroupAcceptanceLoop[]>([]);
  acceptanceLoops: GroupAcceptanceLoop[] = [];

  destroy$ = new Subject();

  // getter for merchant editor flag
  get isMerchantEditor(): boolean {
    return this.authLibraryService.getElementOperationFlag([environment.merchant_create_op_id]);
  }

  constructor(
    private readonly authLibraryService: AuthorizationLibraryService,
    private readonly acceptanceLoopApiService: AcceptanceLoopApiService,
    private readonly ngbModal: NgbModal,
    private readonly router: Router,
    private readonly merchantGroupService: MerchantGroupService,
  ) { }

  ngOnInit(): void {
    this.setSubscriptions();
    this.setValues();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.acceptanceLoops$.complete();
  }

  private setSubscriptions() {
    this.acceptanceLoops$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (x) => {
        this.acceptanceLoops = x;
      }
    });
  }

  private setValues() {
    this.getAcceptanceLoopList();
  }

  getAcceptanceLoopList() {
    const skip = (this.pageInfo.currentPage - 1) * this.pageInfo.pageSize;
    const take = this.pageInfo.pageSize;

    this.acceptanceLoopApiService.getAcceptanceLoopsAggregationByMerchantGroupId(this.merchantGroupId, skip, take).subscribe({
      next: (res) => {
        if (res.success) {
          let ac: GraphqlCollectionSegment<GroupAcceptanceLoop> = JSON.parse(res.data).acceptanceLoopsAggregation;
          
          ac.items?.forEach(x => {
            // setting for merchant expansion
            x.isExpanded = false;
            x.merchantsDisplay = x.merchantAggregation.slice(0, this.MERCHANT_DEFAULT_SIZE);

            // special handling for default acceptance loop
            if (x.isDefault) {
              x.merchantAggregation.forEach(y => {
                y.availableShopCount = y.merchantActiveShopCount;
              });
            }
          });

          this.acceptanceLoops$.next(ac.items ?? []);
          this.calPageInfo(ac.totalCount ?? 0);

          if (this.action === "acceptanceLoopOpen") {
            this.acceptanceListCollapsed = false;
          }
        }
      },
      error: (err) => {
        this.toast.showDanger(err?.error?.message);
      }
    });
  }

  toggleViewAll(i: number) {
    let item = this.acceptanceLoops[i];
    item.isExpanded = !item.isExpanded;

    if (item.isExpanded) {
      item.merchantsDisplay = item.merchantAggregation;
    }
    else {
      item.merchantsDisplay = item.merchantAggregation.slice(0, 5);
    }

    this.acceptanceLoops$.next(this.acceptanceLoops);
  }

  clickShop(merchantId: number, acceptanceLoopMerchantId: number, isDefaultAL: boolean) {
    this.openViewModal({
      title: 'Shop List',
      id: isDefaultAL? merchantId : acceptanceLoopMerchantId,
      itemType: ViewItemType.shop,
      items: [] as GeneralViewItem[],
      options: {
        isDefault: isDefaultAL
      }
    } as GeneralViewModalInfo, { centered: true } );
  }

  clickProduct(acceptanceLoopId: number) {
    this.openViewModal({
      title: 'Product List',
      id: acceptanceLoopId,
      itemType: ViewItemType.product,
      items: [] as GeneralViewItem[],
    } as GeneralViewModalInfo, { centered: true, size: 'lg' });
  }

  private openViewModal(modalInfo: GeneralViewModalInfo, options?: any) {
    const modalRef = this.ngbModal.open(MerchantGroupAcceptanceLoopViewModalComponent, options);
    modalRef.componentInstance.modalInfo = modalInfo;
  }

  navigateToAcceptanceLoopEdit(item: GroupAcceptanceLoop) {
    this.router.navigate([`merchants/merchant-group/acceptance-loop/edit/${item.acceptanceLoopId}`], {
      queryParams: {
        merchantId: this.merchantId
      },
    }); 
  }

  navigateToAcceptanceLoopCreate() {
    this.router.navigate([`merchants/merchant-group/acceptance-loop/create`], 
      {
        queryParams: {
          merchantId: this.merchantId
        },
      }); 
  }

  private calPageInfo(total: number) {
    this.pageInfo.total = total;
    this.pageInfo.pageCount = Math.ceil(total / this.pageInfo.pageSize);
    this.pageInfo.itemStart = this.pageInfo.currentPage === 1 ? 1 : this.pageInfo.total < 1 ? this.pageInfo.total : (((this.pageInfo.currentPage - 1) * this.pageInfo.pageSize) + 1);
    this.pageInfo.itemEnd = this.pageInfo.currentPage === this.pageInfo.pageCount || this.pageInfo.total < this.pageInfo.currentPage * this.pageInfo.pageSize ? this.pageInfo.total : this.pageInfo.currentPage * this.pageInfo.pageSize;
  }
}
