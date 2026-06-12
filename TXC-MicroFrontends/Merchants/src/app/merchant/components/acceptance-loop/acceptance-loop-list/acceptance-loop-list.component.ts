import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {forkJoin } from 'rxjs';
import { MonoAcceptanceLoop, OpenMode, ShopOption } from 'src/app/merchant/models/acceptance-loop.model';
import { AcceptanceLoopApiService } from 'src/app/merchant/services/acceptance-loop-api.service';
import { MerchantPermissionService } from 'src/app/merchant/services/merchant-permission.service';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { AcceptanceLoopShopComponent } from '../acceptance-loop-shop/acceptance-loop-shop.component';

@Component({
  selector: 'app-acceptance-loop-list',
  templateUrl: './acceptance-loop-list.component.html',
  styleUrls: ['./acceptance-loop-list.component.scss']
})
export class AcceptanceLoopListComponent implements OnInit {

  @Input() merchantId!: number;
  @Input() showNote! : boolean | undefined;
  @Input() allowSelect! : boolean | undefined;
  @Input() allowAction! : boolean | undefined;
  @Input() allowPagination! : boolean | undefined;
  @Output() noData:EventEmitter<boolean>= new EventEmitter();
  @Output() selectedItem = new EventEmitter<number[]>();

  acceptanceLoops : MonoAcceptanceLoop[] = [];
  total : number = 0;

  pageIndex : number = this.allowPagination ? 1 : 0;
  pageSize : number = this.allowPagination ? 10 : 100;
  
  acceptanceLoopsId : number[] = []
  selctedAcceptanceLoopsId : number[] = [];
  selectedTenantUTC!: string;
  
  get itemStart() {
    return this.pageIndex === 1 ? 1 : this.total < 1 ? this.total : (((this.pageIndex - 1) * this.pageSize) + 1);
  }

  get itemEnd() {
    return this.pageIndex === this.pageCount || this.total < this.pageIndex * this.pageSize ? this.total : this.pageIndex * this.pageSize;
  }

  get pageCount() {
    return Math.ceil(this.total / this.pageSize);
  }

  constructor(private readonly _router: Router,
    private modalService: NgbModal,
    private _acceptanceLoopApiService: AcceptanceLoopApiService,
    public _merchantPermissionService : MerchantPermissionService,
    private utilityService: UtilityService) {
    this.selectedTenantUTC=utilityService.FetchLocalTimeFromUTC();
    }

  ngOnInit(): void {
    this.bindData();  
  }

  bindData(): void {
    this._acceptanceLoopApiService.getMonoAcceptanceLoopByMerchantId(this.merchantId, this.allowPagination?  this.itemStart -1 : undefined, this.allowPagination? this.pageSize : undefined).subscribe((res) => {
      if(res.success) {
        this.total = JSON.parse(res.data).monoAcceptanceLoopByMerchantId.totalCount;
        this.acceptanceLoops = JSON.parse(res.data).monoAcceptanceLoopByMerchantId.items;
        this.noData.emit(this.acceptanceLoops.length == 0);
        for (let index = 0; index < this.acceptanceLoops.length; index++) {
          const element = this.acceptanceLoops[index];
          if(!element?.isDefault)
          this.selctedAcceptanceLoopsId.push(element.acceptanceLoopId);
          this.selectedItem.emit(this.selctedAcceptanceLoopsId);
        }
      }});
  }

  navigateToAcceptanceLoopCreate()
  {
    if (this.merchantId) {
      this._router.navigate(['merchants/acceptance-loop/create'],
      {
        queryParams: {
          merchantId: this.merchantId
        }
      });
    }
  }

  navigateToAcceptanceLoopEdit(acceptanceLoop: any)
  {
    this._router.navigate(['merchants/acceptance-loop/edit/'+ acceptanceLoop.acceptanceLoopId],
    {
      queryParams: {
        merchantId: this.merchantId
      }
    });    
  }

  openModal(acceptanceLoopId: number) {
    let shopObservable  = this._acceptanceLoopApiService.getMerchantShop(this.merchantId);
    let alObservable = this._acceptanceLoopApiService.getMonoAcceptanceLoopMerchantShopByAcceptanceLoopId(acceptanceLoopId);
    forkJoin([shopObservable, alObservable]).subscribe((resList) => {
      if(resList[0].success && resList[1].success) {
        
        let shops : any[] = JSON.parse(resList[0].data).shops.items;

        const modalRef = this.modalService.open(AcceptanceLoopShopComponent);

        let acceptanceLoopMerchants = JSON.parse(resList[1].data).acceptanceLoopMerchants.items; 
        let shopOption : ShopOption[] = [];
        for (let i = 0; i < acceptanceLoopMerchants.length; i++) {
          const alMerchant = acceptanceLoopMerchants[i];
          for (let j = 0; j < alMerchant.acceptanceLoopMerchantShops.length; j++) {
            const alMerchantShop = alMerchant.acceptanceLoopMerchantShops[j];
            if(alMerchantShop.status){
              shopOption.push({
                isSelected:alMerchantShop.status??false,
                shopId: alMerchantShop.shopId??0,
                acceptanceLoopMerchantShopId: 0,
                isVisible: true,
                shopName: shops.find(x=> x.shopId === alMerchantShop.shopId)?.name,
                shopStatus:shops.find(x=> x.shopId === alMerchantShop.shopId)?.status,
                identityCode:shops.find(x=> x.shopId === alMerchantShop.shopId)?.identityCode,
                hasChanged : false        
              });
            }
          }
        }

        modalRef.componentInstance.shopModalInfo = {
          merchantId: this.merchantId,
          acceptanceLoopId: acceptanceLoopId,
          mode: OpenMode.view,
          acceptanceLoopMerchantShops:  shopOption,
          title: 'Shop List'
        };
      }
    });
  }

  get allSelected() : boolean {
    return this.selctedAcceptanceLoopsId.length + 1 == this.total ? true : false;
  } 

  isSelected(item : any) : boolean{
    if(item.isDefault || this.selctedAcceptanceLoopsId.find(x=> x == item.acceptanceLoopId)){
      return true;
    }
    else{
      return false;
    }
  }

  onSelectAllChange(event:any) : void{
    if(event.target.checked){
      this.selctedAcceptanceLoopsId = []
      for (let index = 0; index < this.total; index++) {
        var element = this.acceptanceLoops[index];
        if(!element?.isDefault)
          this.selctedAcceptanceLoopsId.push(element.acceptanceLoopId);        
      }
    }
    else{
      this.selctedAcceptanceLoopsId = [];
    }
    this.selectedItem.emit(this.selctedAcceptanceLoopsId);
  }

  onCheckChanged(event : any, item : any) : void {
    if(event.target.checked){
      this.selctedAcceptanceLoopsId.push(item.acceptanceLoopId); 
    }
    else{
      let index = this.selctedAcceptanceLoopsId.indexOf(item.acceptanceLoopId);
      if (index > -1 && index < this.selctedAcceptanceLoopsId.length) {
        this.selctedAcceptanceLoopsId.splice(index, 1);
      }
    }
    this.selectedItem.emit(this.selctedAcceptanceLoopsId);
  }

}
