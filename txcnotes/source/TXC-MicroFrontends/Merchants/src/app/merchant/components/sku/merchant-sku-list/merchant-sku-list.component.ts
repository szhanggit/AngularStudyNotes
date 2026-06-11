import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Merchant } from 'src/app/merchant/models/merchant.model';
import { SkuService } from '../../../services/sku.service';
import { debounceTime } from 'rxjs/operators';
import { BaseResponse } from 'src/app/merchant/services/base-response.model';

@Component({
  selector: 'app-merchant-sku-list',
  templateUrl: './merchant-sku-list.component.html',
  styleUrls: ['./merchant-sku-list.component.scss']
})
export class MerchantSkuListComponent implements OnInit {
  @Input() merchant!: Merchant;
  @Input() valid!: boolean;
  @Input() action!: string;

  
  skuCollapsed: boolean = true;
  showskuIntro: boolean = this.getCookie('showskuIntro') ? false : true;
  showValidSKU: boolean = false;
  showInValidSKU: boolean = false;
  totalSKU : number=0;
  constructor(private SkuService : SkuService) {
  }
 
  
  ngOnInit(): void {
    if(this.action == "contractCreated" || this.action == "SKUUpdated"){
      this.skuCollapsed = false;
    }
    if(this.merchant)
    {
        this.getMerchantContractSKUData();
    }
  }

  
  onCloseSKUBanner() {
    this.showskuIntro = !this.showskuIntro;
    this.setCookie('showskuIntro', 'false', 3650);
  }
  
  //Valid list to visible false/true
  hasValidList(event : boolean) : void{
    this.showValidSKU = !event;
  }

  //InValid list to visible false/true
  hasInValidList(event : boolean) : void{
    this.showInValidSKU = !event;
  }

  //Valid list to visible false/true
  getShowSkuList()
  {
     return (this.totalSKU > 0 ? false : true)
  }

  setCookie(cname : string, cvalue : any , exdays : number) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  getCookie(cname : string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  //To Get Contract SKU Count
  getMerchantContractSKUData(){
    if(this.merchant){
      this.SkuService.getSKUCountByMerchantID(this.merchant.merchantId).pipe(
        debounceTime(3000)
      ).subscribe((response:BaseResponse)=>{
        if(response.success){ 
          this.totalSKU =  JSON.parse(response.data).contracts.items.reduce((counter: any, obj: { contractSKUCosts:  any[]; }) => {
            counter += obj.contractSKUCosts.length
           return counter;
         }, 0);
        }
      });
    }
  }
}
