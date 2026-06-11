import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCollapse, NgbModal, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { Merchant } from '../../../models/merchant.model';
import { AcceptanceLoopList } from '../../../models/merchant-acceptance-loop-list.model';
import { PRODUCT_CONSTANTS } from 'src/app/merchant/constants/product-constants';
import { TenantConfigService } from 'src/app/merchant/services/tenant-config.service';
import { GraphqlCollectionSegment } from 'src/app/merchant/models/graphql-collection-segment.model';
import { AcceptanceLoopDetail, AcceptanceLoopMerchant, MonoAcceptanceLoop, OpenMode, ShopOption } from 'src/app/merchant/models/acceptance-loop.model';
import { AcceptanceLoopShopComponent } from '../acceptance-loop-shop/acceptance-loop-shop.component';
import { AcceptanceLoopApiService } from 'src/app/merchant/services/acceptance-loop-api.service';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { MerchantPermissionService } from 'src/app/merchant/services/merchant-permission.service';

@Component({
  selector: 'app-merchant-acceptance-loop-list',
  templateUrl: './merchant-acceptance-loop-list.component.html',
  styleUrls: ['./merchant-acceptance-loop-list.component.scss']
})
export class MerchantAcceptanceLoopListComponent implements OnInit {
  @Input() merchant!: Merchant;
  @Input() tenant!: string;
  @Input() action!: string;
  @ViewChild(NgbCollapse) acceptanceListCollapse!: NgbCollapse;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal; 
  
  acceptanceListCollapsed = true; 
  
  showCreateAction : boolean = true;

  constructor(private _acceptanceLoopApiService: AcceptanceLoopApiService,
    private modalService: NgbModal,
    private readonly _router: Router,
    private readonly _tenantConfigService: TenantConfigService,
    private readonly _authLibService: AuthorizationLibraryService,
    public _merchantPermissionService : MerchantPermissionService) {

    this.tenant = _tenantConfigService.getTenant(this.tenant).name;
    this.tenant = _tenantConfigService.getTenant(this.tenant).name;
  }

  ngOnInit(): void {
    if(this.action === "acceptanceLoopOpen"){
      this.acceptanceListCollapsed = false;
    }
  } 

  noDataList(event : any) : void{
    this.showCreateAction = !event
  }

  collapse() {
    this.acceptanceListCollapse.toggle();
    if (!this.acceptanceListCollapsed && this.merchant) {
      // this.merchantAcceptanceLoopListService.merchantId = this.merchant.merchantId;
      // this.merchantAcceptanceLoopListService.refresh();
    }
  }

  navigateToAcceptanceLoopCreate()
  {
    if (this.merchant) {
      this._router.navigate(['merchants/acceptance-loop/create'],
      {
        queryParams: {
          merchantId: this.merchant.merchantId
        }
      });
    }
  }
}
