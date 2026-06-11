import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseResponse } from 'src/app/pages/products/models/base-response';
import { AcceptanceLoop } from '../../../models/acceptance-loop.model';
import { AcceptanceLoopService } from '../../../services/acceptance-loop.service';

@Component({
  selector: 'app-acceptance-loop-shop',
  templateUrl: './acceptance-loop-shop.component.html',
  styleUrls: ['./acceptance-loop-shop.component.scss']
})
export class AcceptanceLoopShopComponent implements OnInit {

  @Input() public merchant : any;

  shopList : any;

  selectedShop : any[] = [];

  acceptanceLoop : AcceptanceLoop;

  currentIndex : number = -1;

  constructor(public activeModal: NgbActiveModal,
    private Activatedroute:ActivatedRoute,
    private acceptanceLoopService : AcceptanceLoopService) { }

  ngOnInit(): void {
    this.acceptanceLoop = this.acceptanceLoopService.get();
    this.Activatedroute.snapshot.queryParamMap.get('index')||-1;
    if(this.acceptanceLoop != null )
    console.log(this.merchant);
    this.getData();
  }

  getData() : void{
    this.acceptanceLoopService.getAllShopByMerchantId(this.merchant.merchantId).subscribe((response : BaseResponse)=>{
      if(response.success){
        this.shopList = JSON.parse(response.data).shops.items;
      }
    })
  }

  get allSelected() : boolean {
    return this.selectedShop.length == 0 ? true : false;
  } 

  isSelected(id : any) : boolean{
    if(this.selectedShop.find(x=>x.shopId == id)){
      return false;
    }
    else{
      return true;
    }
  }

  onSelectAllChange(event:any) : void{
    if(!event.target.checked){
      for (let index = 0; index < this.shopList.length; index++) {
        this.selectedShop.push(this.shopList[index]);        
      }
    }
    else{
      this.selectedShop = [];
    }
    console.log(this.selectedShop);
  }

  onSelectChange(event : any, item : any) : void{
    if(!event.target.checked){
      this.selectedShop.push(item); 
    }
    else{
      let index = this.selectedShop.indexOf(item);
    if (index > -1 && index < this.selectedShop.length) {
        //value = arr[index];
        this.selectedShop.splice(index, 1);

    }
    
      //this.selectedShop.p(this.shops[index]); 
    }
    console.log(this.selectedShop);
  }

  OnSelectConfirm() : void{
    let unselected : any[] = [];
    let selected : any[] = [];
    for (let index = 0; index < this.shopList.length; index++) {
      const element = this.shopList[index];
      if(this.isSelected(element.shopId)){
        selected.push(element);
      }
      else{
        unselected.push(element);
      }
      
    }
    this.activeModal.close({ merchant : this.merchant, unselected : unselected, selected : selected })
  }

}
