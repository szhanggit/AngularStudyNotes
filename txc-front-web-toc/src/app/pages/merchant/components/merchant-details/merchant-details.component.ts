import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { AuthService } from 'src/app/core/service/security/auth.service';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { environment } from 'src/environments/environment';
import { Merchant } from '../../models/merchant.model';
import { MerchantService } from '../../services/merchant.service';
import { ShopListComponent } from '../shops/shop-list/shop-list.component';

@Component({
  selector: 'app-merchant-details',
  templateUrl: './merchant-details.component.html',
  styleUrls: ['./merchant-details.component.scss']
})
export class MerchantDetailsComponent implements OnInit {
  merchant!: Merchant;
  tenant!: string;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild(ShopListComponent) shopList!: ShopListComponent;

  merchantDetailsCollapsed = true;

  contractCollapsed : boolean = true;

  skuCollapsed : boolean = true;

  showContractIntro : boolean = localStorage.getItem('showContractIntro') ? false : true;

  showskuIntro :boolean = true;

  userClaim = new UserAuthClaim(); 

  showCreateContract : boolean = true;

  showContractManually : boolean = false;

  showListContract : boolean = false;

  constructor(private readonly _router: Router,
    private readonly _route: ActivatedRoute,
    private readonly _merchantService: MerchantService,
    private readonly authSvc: AuthService) { 
    const tenantFromRoute = this._route.snapshot.queryParamMap.get('tenantName');
    const idFromRoute = this._route.snapshot.queryParamMap.get('merchantId');

    this.tenant = tenantFromRoute ? tenantFromRoute : 'TW';
    const id = idFromRoute ? Number.parseInt(idFromRoute) : 0;

    this._merchantService.getMerchantById(id).subscribe(res => {
      this.merchant = res.data.merchantDetails[0];
    });
    
    _route.params.subscribe(() => {
      if (this._router.getCurrentNavigation()?.extras?.state?.action) {
        const action = this._router.getCurrentNavigation().extras.state.action;
        const shopName = this._router.getCurrentNavigation().extras.state.shopName;
        const merchantName = this._router.getCurrentNavigation().extras.state.merchantName;

        if (action) {
          setTimeout(() => {
            if (action.includes('shop')) {
              this.toast?.showSuccess(`Successfully ${action === 'shopCreated' ? 'created shop' : 'updated shop'} ${shopName} for ${this.merchant.merchantName}`);
              this.shopList.collapse();
            } else {
              if (action.includes('batch')) {
                this.toast?.showSuccess('Batch shop upload successful');
                this.shopList.collapse();
              } else {
                this.toast?.showSuccess(`Successfully ${action} merchant ${merchantName}`);
                this.merchantDetailsCollapsed = false;
              }
            }
          }, 2000)
        }
      }
    });

    this.authSvc.userAuthClaim.subscribe(data =>
      {
        if(data == null || data == undefined){
          this._router.navigate(['account/error-404']);
        }
        this.userClaim = data;
        this.bindOprationPermission();
      });
  }

  bindOprationPermission() : void {
    if(this.userClaim.operations.length)
    {
      this.showCreateContract = this.userClaim.operations.some(e => e === parseInt(environment.contract_create_op_id));
      this.showListContract = this.userClaim.operations.some(e => e === parseInt(environment.contract_list_op_id));
    }
  }

  ngOnInit(): void {
  }

  navigateToUpdateMerchant() {
    this._router.navigate(['merchant-list/edit'],
          {
            queryParams: {
              tenantName: 'TW',
              merchantId: this.merchant.merchantId
            },
            state: {
              merchant: this.merchant
            }
          });
  }

  backToList(): void {
    this._router.navigateByUrl('/merchant-list');
  }

  navigateToCreateContract(): void{

    this._router.navigate(['/merchant-list/contract/create']);

  }

  onIntroDismiss(){
    this.showContractIntro = !this.showContractIntro;
    localStorage.setItem('showContractIntro', 'false');
  }

  showIntro(event: any){
      this.showContractManually = !event;
  }

}
