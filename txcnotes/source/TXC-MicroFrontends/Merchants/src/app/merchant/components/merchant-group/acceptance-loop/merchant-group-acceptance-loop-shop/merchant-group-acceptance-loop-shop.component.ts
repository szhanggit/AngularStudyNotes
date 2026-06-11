import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { BehaviorSubject, debounceTime, filter, fromEvent, map, mergeMap, Observable, Subject, takeUntil, takeWhile } from 'rxjs';
import { SimplebarAngularComponent } from 'simplebar-angular';
import { ShopModalInfo, ShopOption, ShopSelectedType } from 'src/app/merchant/models/acceptance-loop.model';
import { AcceptanceLoopApiService } from 'src/app/merchant/services/acceptance-loop-api.service';
import { MerchantGroupService } from 'src/app/merchant/services/merchant-group.service';

@Component({
  selector: 'app-merchant-group-acceptance-loop-shop',
  templateUrl: './merchant-group-acceptance-loop-shop.component.html',
  styleUrls: ['./merchant-group-acceptance-loop-shop.component.scss']
})
export class MerchantGroupAcceptanceLoopShopComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild('shopList') shopList!: SimplebarAngularComponent;
  @ViewChild('searchBox') searchBox!: ElementRef;
  @Input() shopModalInfo!: ShopModalInfo;

  readonly ACTIVE_STATUS_DESCRIPTION: string = 'Active';
  readonly INACTIVE_STATUS_DESCRIPTION: string = 'Inactive';
  readonly DEBOUNCE_TIME: number = 500;

  pageSize: number = 50;
  totalCount: number = 0;
  selectedCount: number = 0;
  onLastPage: boolean = false;

  isAllSelected: boolean = false;
  isSearchBoxDisabled = true;

  searchTerm: string = '';
  shopOptions: ShopOption[] = [];

  simpleBarOptions = { autoHide: false };
  destroy$ = new Subject();

  compositionStarted$ = new BehaviorSubject<boolean>(false);
  isCompositionStarted: boolean = false;
  IsCountedByActiveShopOnly = false;

  get isEdit(): boolean {
    return this.shopModalInfo.acceptanceLoopId !== 0
  }

  public get isSearching(): boolean {
    return this.searchTerm.length !== 0;
  }

  constructor(
    private activeModal: NgbActiveModal,
    private merchantGroupService: MerchantGroupService
  ) { }

  ngOnInit(): void {
    Promise.resolve().then(() => this.getMerchantShops(true))
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.setScrollEvent();
    this.setSearchEvent();
  }

  public passBack(): void {
    this.shopModalInfo.selectedShopCount = this.selectedCount
    this.activeModal.close(this.shopModalInfo);
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  isNewShow(shop: ShopOption): boolean {
    if (!this.isEdit)
      return false;

    if (this.shopModalInfo.acceptanceLoopLastUpdatedOn && shop.createdOn)
      return this.shopModalInfo.acceptanceLoopLastUpdatedOn < shop.createdOn;

    return true;
  }

  public selectAll(): void {
    this.shopOptions.forEach(x => {
      x.isSelected = this.isAllSelected;
    })

    this.selectedCount = this.isAllSelected ? this.totalCount : 0;
    this.shopModalInfo.shopSelectedType = this.isAllSelected ? ShopSelectedType.includeAllShop : ShopSelectedType.excludeAllShop;
    this.shopModalInfo.IsCountedByActiveShopOnly = !this.isAllSelected;

    if (this.isAllSelected)
      this.shopModalInfo.acceptanceLoopMerchantShops = [] as ShopOption[];
  }

  public selectShop(e: any): void {
    const selectedShop = this.shopOptions.find((x) => x.shopId === Number(e.target.id));
    if (!selectedShop) {
      this.toast.showDanger("Select shop fail");
      return;
    }

    selectedShop.hasChanged = true;

    this.selectedCount += e.target.checked ? 1 : -1;
    this.isAllSelected = this.selectedCount === this.totalCount;

    if (!this.shopModalInfo.IsCountedByActiveShopOnly)
      this.shopModalInfo.IsCountedByActiveShopOnly = this.selectedCount === 0;

    const updatedShop = this.shopModalInfo.acceptanceLoopMerchantShops?.find((x) => x.shopId === Number(e.target.id));
    if (updatedShop) {
      updatedShop.isSelected = e.target.checked;
      updatedShop.hasChanged = true;
    } else {
      this.shopModalInfo.acceptanceLoopMerchantShops?.push(selectedShop);
    }
  }

  public clearSearchTerm(): void {
    this.searchTerm = '';
    this.getMerchantShops(true, false);
  }

  private setScrollEvent() {
    if (!this.shopList)
      return;

    fromEvent(this.shopList.SimpleBar.getScrollElement(), 'scroll')
      .pipe(
        map((event: any) => {
          const {
            scrollTop,
            clientHeight,
            scrollHeight
          } = event.target

          if (this.shopOptions.length === this.totalCount)
            this.onLastPage = true;
          return (scrollTop + clientHeight) >= (scrollHeight - 5);
        }),
        debounceTime(this.DEBOUNCE_TIME),
        takeWhile(_ => this.shopOptions.length < this.totalCount)
      ).subscribe({
        next: (isAtButtom) => {
          if (isAtButtom) {
            this.getMerchantShops(false, false);
          }
        }
      })
  }

  private setSearchEvent() {
    if (!this.searchBox)
      return;

    fromEvent(this.searchBox.nativeElement, 'input')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(this.DEBOUNCE_TIME),
        takeUntil(this.destroy$),
        filter(() => !this.isCompositionStarted),
      ).subscribe({
        next: () => {
          this.getMerchantShops(true, false);
        }
      })

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

  private getMerchantShops(isFirstPage: boolean = false, updateSelectedCount = true) {
    let skip = 0;
    if (!isFirstPage && this.shopOptions.length < this.totalCount) {
      skip = this.shopOptions.length;
    }

    let shops$: Observable<any> = this.merchantGroupService
      .getShopsByMerchantId(this.shopModalInfo.merchantId, this.searchTerm, skip, this.pageSize)

    if (this.isEdit) {
      shops$ = shops$.pipe(
        mergeMap(response => {
          const merchantShops = JSON.parse(response.data).shops;
          const shopsInAcceptanceLoop$ = this.merchantGroupService
            .getAcceptanceLoopMerchantShops(this.shopModalInfo.acceptanceLoopMerchantId, merchantShops.items.map((x: any) => x.shopId))

          if (!this.isSearching)
            this.totalCount = merchantShops.totalCount;

          return shopsInAcceptanceLoop$.pipe(
            map(acceptanceLoopShopsData => {
              const acceptanceLoopShops = JSON.parse(acceptanceLoopShopsData.data).acceptanceLoopMerchantShops.items

              const shops: ShopOption[] = merchantShops.items.map((x: any) => <ShopOption>{
                isSelected: this.isShopSelected(x.shopId, acceptanceLoopShops.find((y: any) => x.shopId === y.shopId)),
                shopName: x.name,
                shopId: x.shopId,
                identityCode: x.identityCode,
                isVisible: true,
                shopStatus: x.status,
                createdOn: new Date(x.createdOn)
              })
              return shops;
            })
          )
        })
      )
    } else {
      shops$ = shops$.pipe(
        map(response => {
          const result = JSON.parse(response.data).shops;

          if (!this.isSearching)
            this.totalCount = result.totalCount;

          const shops: ShopOption[] = result.items.map((x: any) => <ShopOption>{
            isSelected: this.isShopSelected(x.shopId, null),
            shopName: x.name,
            shopId: x.shopId,
            identityCode: x.identityCode,
            isVisible: true,
            shopStatus: x.status
          })

          return shops;
        })
      )
    }

    shops$.subscribe({
      next: (shops) => {
        if (isFirstPage && updateSelectedCount) {
          this.isSearchBoxDisabled = false;

          if (this.shopModalInfo.acceptanceLoopMerchantShops) {
            const includedShops = this.shopModalInfo.acceptanceLoopMerchantShops.filter((x) => x.isSelected === true);
            const excludedShops = this.shopModalInfo.acceptanceLoopMerchantShops.filter((x) => x.isSelected === false);

            if (this.isEdit) {
              this.selectedCount = this.shopModalInfo.selectedShopCount;
            } else if (this.shopModalInfo.shopSelectedType === ShopSelectedType.includeAllShop) {
              this.selectedCount = this.totalCount - excludedShops.length;
            } else {
              this.selectedCount = includedShops.length;
            }
            this.isAllSelected = this.selectedCount == this.totalCount;
          } else {
            this.selectedCount = this.totalCount;
            this.isAllSelected = true;
          }
        }

        if (isFirstPage) {
          if (this.onLastPage === true && this.shopOptions.length < this.totalCount) {
            this.setScrollEvent();
            this.onLastPage = false;
          }

          this.shopOptions = shops;
        } else {
          this.shopOptions = this.shopOptions.concat(shops);
        }
      },
      error: (err) => {
        this.toast.showDanger(err.message ?? err.error.message);
      }
    })
  }

  private isShopSelected(shopId: number, acceptanceLoopMetchantShop: any): boolean {
    if (this.shopModalInfo.selectedShopCount === this.shopModalInfo.merchantAllShopCount)
      return true;

    if (this.shopModalInfo.selectedShopCount === 0)
      return false;

    const updatedShop = this.shopModalInfo.acceptanceLoopMerchantShops?.find((x) => x.shopId === shopId);

    if (this.shopModalInfo.shopSelectedType === ShopSelectedType.includeAllShop) {
      return updatedShop ? updatedShop.isSelected : true;
    } else if (this.shopModalInfo.shopSelectedType === ShopSelectedType.excludeAllShop) {
      return updatedShop ? updatedShop.isSelected : false;
    } else {
      if (updatedShop)
        return updatedShop.isSelected

      return acceptanceLoopMetchantShop?.status
    }
  }
}
