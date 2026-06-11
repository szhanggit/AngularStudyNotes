import { APP_BASE_HREF } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, fromEvent, Subject, takeUntil, takeWhile } from 'rxjs';
import { SimplebarAngularComponent } from 'simplebar-angular';
import { AcceptanceLoopMerchantShopResponse, GeneralViewItem, GeneralViewModalInfo, ViewItemType, PageDetails, Product, ShopResponse } from 'src/app/merchant/models/acceptance-loop.model';
import { GraphqlCollectionSegment } from 'src/app/merchant/models/graphql-collection-segment.model';
import { AcceptanceLoopApiService } from 'src/app/merchant/services/acceptance-loop-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-merchant-group-acceptance-loop-view-modal',
  templateUrl: './merchant-group-acceptance-loop-view-modal.component.html',
  styleUrls: ['./merchant-group-acceptance-loop-view-modal.component.scss']
})
export class MerchantGroupAcceptanceLoopViewModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() modalInfo!: GeneralViewModalInfo;
  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild(SimplebarAngularComponent) list!: SimplebarAngularComponent;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  readonly ViewItemType = ViewItemType;
  searchTerm: string = '';

  PAGE_SIZE = 10;
  pageInfo: PageDetails = {
    currentPage: 1,
    pageCount: 1,
    pageSize: this.PAGE_SIZE,
    itemStart: 1,
    itemEnd: this.PAGE_SIZE,
    total: 0
  }

  items$ = new BehaviorSubject<GeneralViewItem[]>([]);
  itemList = this.items$.asObservable();
  itemsLoaded: GeneralViewItem[] = [];

  searchCount$ = new BehaviorSubject<number>(0);
  searchCount: number = 0;

  compositionStarted$ = new BehaviorSubject<boolean>(false);
  isCompositionStarted: boolean  = false;

  destroy$ = new Subject();

  // getter for product viewer flag
  get isProductViewer(): boolean {
    // TODO: confrimation on op for product
    return this.authLibraryService.getElementOperationFlag([environment.product_mngmt_res_id]);
  }

  constructor(
    @Inject(APP_BASE_HREF) private readonly appBaseHref: string,
    private readonly authLibraryService: AuthorizationLibraryService,
    private readonly acceptanceLoopApiService: AcceptanceLoopApiService,
    private readonly ngbActiveModal: NgbActiveModal,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.itemsLoaded = [];
    this.items$.next(this.itemsLoaded);
    this.searchCount$.asObservable().pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        this.searchCount = res;
      }
    });
      
    this.loadData(this.modalInfo.id, '', this.pageInfo);
  }

  ngAfterViewInit(): void {
    this.registerScrollBar();
    this.registerSearchBoxInput();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    this.items$.complete();
    this.searchCount$.complete();
  }

  private loadData(id: number, searchKey: string, pageInfo: PageDetails) {
    if (this.modalInfo.itemType === ViewItemType.shop) {
      this.loadShops(id, searchKey, pageInfo);
    }
    else if (this.modalInfo.itemType === ViewItemType.product) {
      this.loadProducts(id, searchKey, pageInfo);
    }
  }

  private loadShops(id: number, searchKey: string, pageInfo: PageDetails) {
    if (this.modalInfo.options?.isDefault) {
      this.loadMerchantShops(id, searchKey, pageInfo);
    }
    else {
      this.loadAcceptanceLoopMerchantShops(id, searchKey, pageInfo);
    }
  }

  private loadAcceptanceLoopMerchantShops(acceptanceLoopMerchantId: number, searchKey: string, pageInfo: PageDetails) {
    this.acceptanceLoopApiService.getAcceptanceLoopMerchantShops(acceptanceLoopMerchantId, searchKey, pageInfo).subscribe({
      next: (res) => {
        if(res.success && res.data) {
          let acItems: GraphqlCollectionSegment<AcceptanceLoopMerchantShopResponse> = JSON.parse(res.data).acceptanceLoopMerchantShops;

          acItems.items?.forEach(s => {
            const item : GeneralViewItem = {
              id: s.acceptanceLoopMerchantShopId,
              name: s.merchantShop.name,
              status: s.merchantShop.status,
              code: s.merchantShop.identityCode,
            }

            this.itemsLoaded.push(item);
          });
          this.items$.next(this.itemsLoaded);

          if (this.pageInfo.total === 0) {
            this.pageInfo.total = acItems.totalCount ?? 0;
          }
          this.searchCount$.next(acItems.totalCount ?? 0);
        }
      },
      error: (err) => {
        this.toast.showDanger(err?.error?.message);
      }
    });
  }

  private loadMerchantShops(merchantId: number, searchKey: string, pageInfo: PageDetails) {
    this.acceptanceLoopApiService.getMerchantShops(merchantId, searchKey, pageInfo).subscribe({
      next: (res) => {
        if(res.success && res.data) {
          let acItems: GraphqlCollectionSegment<ShopResponse> = JSON.parse(res.data).shops;

          acItems.items?.forEach(s => {
            const item : GeneralViewItem = {
              id: s.shopId,
              name: s.name,
              status: s.status,
              code: s.identityCode,
            }

            this.itemsLoaded.push(item);
          });
          this.items$.next(this.itemsLoaded);

          if (this.pageInfo.total === 0) {
            this.pageInfo.total = acItems.totalCount ?? 0;
          }
          this.searchCount$.next(acItems.totalCount ?? 0);
        }
      },
      error: (err) => {
        this.toast.showDanger(err?.error?.message);
      }
    });
  }

  private loadProducts(acceptanceLoopId: number, searchKey: string, pageInfo: PageDetails) {
    this.acceptanceLoopApiService.getAcceptanceLoopProducts(acceptanceLoopId, searchKey, pageInfo).subscribe({
      next: (res) => {
        if(res.success && res.data) {
          let acItems: GraphqlCollectionSegment<Product> = JSON.parse(res.data).products;

          acItems.items?.forEach(s => {
            const item : GeneralViewItem = {
              id: s.productId,
              name: s.productName,
              status: 1,
              code: s.productCode,
            }

            this.itemsLoaded.push(item);
          });
          this.items$.next(this.itemsLoaded);

          if (this.pageInfo.total === 0) {
            this.pageInfo.total = acItems.totalCount ?? 0;
          }
          this.searchCount$.next(acItems.totalCount ?? 0);
        }
      },
      error: (err) => {
        this.toast.showDanger(err?.error?.message);
      }
    });
  }

  search() {
    this.itemsLoaded = [];
    this.pageInfo.currentPage = 1;
    this.list.SimpleBar.getScrollElement().scrollTop = 0;

    this.loadData(this.modalInfo.id, this.searchTerm, this.pageInfo);
  }

  clearSearchTerm() {
    this.searchTerm = '';
    this.search();
  }

  closeModal() {
    this.ngbActiveModal.close();
  }

  navigateToProduct(productId: number) {
    const url = this.router.serializeUrl(this.router.createUrlTree([this.appBaseHref, 'products', productId]));
    window.open(url, '_blank');
  }

  private registerScrollBar() {
    if (this.list) {
      fromEvent(this.list.SimpleBar.getScrollElement(), 'scroll')
      .pipe(
        filter((e: any) => {
          const {
            scrollTop,
            scrollHeight,
            clientHeight
          } = e.target;
          return ((scrollTop + clientHeight) >= (scrollHeight - 5)) && (this.itemsLoaded.length < this.searchCount);
        }),
        debounceTime(50),
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.pageInfo.currentPage++;
          this.loadData(this.modalInfo.id, this.searchTerm, this.pageInfo);
        }
      });
    }
  }

  private registerSearchBoxInput() {
    if (this.searchBox) {
      fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        filter(() => !this.isCompositionStarted),
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.search();
        }
      });

      // handle events when user indirectly entering text (ex. some Chinese IMEs)     
      this.compositionStarted$.asObservable().pipe(takeUntil(this.destroy$)).subscribe({
        next: (isStarted) => this.isCompositionStarted = isStarted
      });

      fromEvent(this.searchBox.nativeElement, 'compositionstart')
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.compositionStarted$.next(true);
        }
      });

      fromEvent(this.searchBox.nativeElement, 'compositionend')
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.compositionStarted$.next(false);
        }
      });
    }
  }
}
