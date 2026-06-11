import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularComponent } from 'simplebar-angular';
import { OpenMode, ShopModalInfo, ShopOption } from 'src/app/merchant/models/acceptance-loop.model';

@Component({
  selector: 'app-acceptance-loop-shop',
  templateUrl: './acceptance-loop-shop.component.html',
  styleUrls: ['./acceptance-loop-shop.component.scss']
})
export class AcceptanceLoopShopComponent implements OnInit {
  @Input() shopModalInfo!: ShopModalInfo;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @ViewChild('shopList') shopList!: SimplebarAngularComponent ;

  pageSize: number = 100;
  pageCount: number = 0;
  pageNumber: number = 0;
  totalCount: number = 0;
  
  isAllSelected: boolean = false;
  searchTerm: string = '';
  isConfirmDisabled: boolean = true;

  shopOptions: ShopOption[] = [];
  shopOptionsCollection: ShopOption[] = [];
  ActiveStatusDescription: string = 'Active';
  InactiveStatusDescription: string = 'Inactive';

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    // TODO:
    // The "New" flag needs to compare the creation date of the merchant shop and AL latest modified date
    // The creation date of the merchant shop is not provided yet, might need to get it from graphQL
    // but graphQL has a pagination issue that hasn't been resolved yet.

    if (this.shopModalInfo.mode === OpenMode.view) {
      this.shopOptions = this.shopModalInfo.acceptanceLoopMerchantShops ?? [];
    } else if (this.shopModalInfo.mode === OpenMode.edit) {
      this.shopOptions = this.shopModalInfo.acceptanceLoopMerchantShops?.sort((a, b) => {
        return Number(a.isSelected) - Number(b.isSelected)
      }) ?? [];
    } else if (this.shopModalInfo.mode === OpenMode.create) {
      this.shopOptions = this.shopModalInfo.acceptanceLoopMerchantShops ?? [];
    }

    this.updateTotalCount();
    this._loadShopOptionsCollection(1);
  }

  ngAfterViewInit(): void {
    if (this.shopList) {
      this.shopList.SimpleBar.getScrollElement().addEventListener('scroll', (e:Event) => this._onListScroll(e));
    }
  }

  public passBack(): void {
    this.passEntry.emit(this.shopOptions);
    this.closeModal();
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  showNew(shop : ShopOption) : boolean{
    
    let acceptanceLoopLastUpdateDate = new Date(this.shopModalInfo.acceptanceLoopLastUpdateDate?this.shopModalInfo.acceptanceLoopLastUpdateDate:"");
    
    let shopCreatedOn = new Date(shop.createdOn?shop.createdOn:"");
    
    return this.shopModalInfo.mode === OpenMode.edit && acceptanceLoopLastUpdateDate < shopCreatedOn
  }

  public tickSelectAll(): void {
    this.shopOptions.forEach(x => {
      x.isSelected = this.isAllSelected;
    })
    this.updateTotalCount();
  }

  public updateTotalCount(): void {
    const selectedShops = this.shopOptions.filter(x => x.isSelected === true);
    this.totalCount = selectedShops.length;
    this.isAllSelected = this.shopOptions.length === this.totalCount;
    this.isConfirmDisabled = this.totalCount <= 0;
  }

  public clearSearchTerm(): void {
    this.searchTerm = '';
    this.search();
  }

  public search(): void {
    const regex = new RegExp(this.searchTerm, 'i')
    this.shopOptions.forEach(x => {
      x.isVisible = this.searchTerm.length > 0 ? (x.shopName?.match(regex) !== null) : true
    })
    this.shopOptionsCollection = this.shopOptions;
  }

  private _loadShopOptionsCollection(newPageNumber: number):void {
    const startIndex: number = (newPageNumber - 1) * this.pageSize;
    let endIndex: number = startIndex + this.pageSize;

    if (endIndex > this.shopOptions.length) {
      endIndex = this.shopOptions.length
    }

    for (let i = startIndex; i < endIndex; i++) {
      const shopOption = this.shopOptions[i];
      this.shopOptionsCollection.push(shopOption);
    }

    this.pageNumber = newPageNumber;
  }

  private _onListScroll(e: any): void {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 5) {
      this._loadShopOptionsCollection(this.pageNumber + 1);
    }
  }
}