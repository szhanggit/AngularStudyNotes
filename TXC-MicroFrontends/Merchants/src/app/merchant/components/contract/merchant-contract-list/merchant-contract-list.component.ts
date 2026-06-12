import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Merchant } from 'src/app/merchant/models/merchant.model';
import { BaseResponse } from 'src/app/merchant/services/base-response.model';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { MerchantPermissionService } from 'src/app/merchant/services/merchant-permission.service';

@Component({
  selector: 'app-merchant-contract-list',
  templateUrl: './merchant-contract-list.component.html',
  styleUrls: ['./merchant-contract-list.component.scss']
})
export class MerchantContractListComponent implements OnInit {

  @Input() merchant!: Merchant;
  @Input() action!: string;

  operations: number[] = [];

  contractCollapsed: boolean = true;

  showContractIntro: boolean = this.getCookie('showContractIntro') ? false : true;
  showContractManually: boolean = false;


  constructor(private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private contractService : ContractService,
    public _merchantPermissionService : MerchantPermissionService) {
    }

  ngOnInit(): void {
    if(this.action === "contractCancelled" || this.action === "contractCreated"){
      this.contractCollapsed = false;
    }
    this.contractService.getCount(this.merchant.merchantId).subscribe((response:BaseResponse)=>{
      if(response.success){
        let totalCount = JSON.parse(response.data).contracts.totalCount;
        if(totalCount > 0){
          this.showContractManually = false;
        }
        else{
          this.showContractManually = true;
        }
      }
    });
  }

  onIntroDismiss() {
    this.showContractIntro = !this.showContractIntro;
    this.setCookie('showContractIntro', 'false', 3650);
  }

  navigateToCreateContract(): void {

    this._router.navigate(['/merchants/contract/create'], { queryParams: { merchantId: this.merchant.merchantId } });

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

}
