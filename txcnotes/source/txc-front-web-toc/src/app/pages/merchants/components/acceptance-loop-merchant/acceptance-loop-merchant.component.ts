import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseResponse } from 'src/app/pages/products/models/base-response';
import { AcceptanceLoopService } from '../../services/acceptance-loop.service';
import { AcceptanceLoopShopComponent } from '../modals/acceptance-loop-shop/acceptance-loop-shop.component';
import { ActivatedRoute } from '@angular/router';
import { AcceptanceLoop } from '../../models/acceptance-loop.model';
import { AcceptanceLoopMerchantShop } from '../../models/acceptance-loop-merchant-shop.model';
import { Shop } from '../../models/shop.model';

@Component({
  selector: 'app-acceptance-loop-merchant',
  templateUrl: './acceptance-loop-merchant.component.html',
  styleUrls: ['./acceptance-loop-merchant.component.scss']
})
export class AcceptanceLoopMerchantComponent implements OnInit {

  searchTerm : string;

  merchantList : any;

  currentMerchant : any;

  disableSearch : boolean = false;

  shopSelectedList : any = [];

  shopUnselectedList : any = [];

  acceptanceLoop : AcceptanceLoop;

  currentIndex : number = -1;


  constructor(private location: Location, 
    private modalService: NgbModal,    
    private Activatedroute:ActivatedRoute,
    private acceptanceLoopService : AcceptanceLoopService) { }

  ngOnInit(): void {
    this.acceptanceLoop = this.acceptanceLoopService.get();
    this.currentIndex = Number(this.Activatedroute.snapshot.queryParamMap.get('index')||-1);
    if(this.acceptanceLoop != null && this.currentIndex > -1){
      this.bindData();
    }
  }

  bindData(){
    console.log("this.acceptanceLoop.acceptanceLoopMerchants",this.acceptanceLoop.acceptanceLoopMerchants);
    this.currentMerchant = this.acceptanceLoop.acceptanceLoopMerchants[this.currentIndex].merchant[0];
    this.disableSearch = true;
    console.log("this.currentMerchant",this.currentMerchant);

    for (let index = 0; index < this.acceptanceLoop.acceptanceLoopMerchants[this.currentIndex].merchant.length; index++) {
      let element = this.acceptanceLoop.acceptanceLoopMerchants[this.currentIndex].merchant[index];
      this.shopUnselectedList = element.shop;
      console.log("this.shopUnselectedList", this.shopUnselectedList);
    }

    for (let index = 0; index < this.acceptanceLoop.acceptanceLoopMerchants[this.currentIndex].acceptanceLoopMerchantShops.length; index++) {
      let element = this.acceptanceLoop.acceptanceLoopMerchants[this.currentIndex].acceptanceLoopMerchantShops[index];
      this.shopSelectedList= this.shopSelectedList.concat(element.shop);

      let position = this.shopUnselectedList.findIndex(function(item:any){ console.log("indexOf",item); return item.shopId == element.shop[0].shopId});
      console.log("position",position);
      if (position > -1 && position < this.shopUnselectedList.length) {
        //value = arr[index];
        this.shopUnselectedList.splice(position, 1);

    }

    }
    console.log("this.shopSelectedList", this.shopSelectedList);
    
  }

  goBackToPrevPage(): void {
    this.location.back();
  }

  getData() : void{
    this.acceptanceLoopService.getAllMerchant(this.searchTerm).subscribe((response : BaseResponse)=>{
      if(response.success){
        this.merchantList = JSON.parse(response.data).merchants;
      }
    })
  }

  onSearch() : void{
    let wordSearch = this.searchTerm;
    setTimeout(() => {
        if (wordSearch == this.searchTerm) {
              this.getData();
        }
    }, 1000); 
  }

  onSelected(item : any) : void {
    console.log(item);
    this.currentMerchant = item;
  }

  onShowShops() : void{
    const modalRef = this.modalService.open(AcceptanceLoopShopComponent);

    modalRef.componentInstance.merchant = this.currentMerchant;

    modalRef.result.then((result) => {
      console.log('Closed with: ', result);
      this.disableSearch = true;
      this.shopSelectedList = result.selected;
      this.shopUnselectedList = result.unselected;
    }, (reason) => {
      console.log("Dismissed reason: ", reason);
    });
  }

  onDeleteSelectedMerchant() : void{
    this.currentMerchant = undefined;
    this.disableSearch = false;
  }

  onDeleteShop(index: number, item : any, action : string) : void {
    if(action == "add"){
      this.shopSelectedList.push(item); 
      this.shopUnselectedList.splice(index, 1);
    }
    else{
      this.shopUnselectedList.push(item); 
      this.shopSelectedList.splice(index, 1);
    }    
  }

  onConfirm() {
    this.acceptanceLoop.acceptanceLoopMerchants[this.currentIndex].acceptanceLoopMerchantShops = [];
    for (let index = 0; index < this.shopSelectedList.length; index++) {
      let  _acceptanceLoopMerchantShop : AcceptanceLoopMerchantShop =  {
        shop : [this.shopSelectedList[index]]
      }
      this.acceptanceLoop.acceptanceLoopMerchants[this.currentIndex].acceptanceLoopMerchantShops.push(_acceptanceLoopMerchantShop);

      let _shop : Shop  = this.shopSelectedList[index];

      this.acceptanceLoop.acceptanceLoopMerchants[this.currentIndex].merchant[0].shop.push(_shop);
    }

    // for (let index = 0; index < this.shopUnselectedList.length; index++) {

    //   let _shop : Shop  = this.shopUnselectedList[index];

    //   this.acceptanceLoop.acceptanceLoopMerchants[this.currentIndex].merchant[0].shop.push(_shop);
      
    // }
    this.acceptanceLoopService.set(this.acceptanceLoop);

    this.goBackToPrevPage();
  }

}
