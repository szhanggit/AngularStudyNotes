import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AcceptanceLoopFormGroup } from 'src/app/merchant/models/acceptance-loop-form-group.model';
import { ShopOption } from 'src/app/merchant/models/acceptance-loop.model';
import { AcceptanceLoopApiService } from 'src/app/merchant/services/acceptance-loop-api.service';
import { AcceptanceLoopService } from 'src/app/merchant/services/acceptance-loop.service';

@Component({
  selector: 'app-acceptance-loop-create',
  templateUrl: './acceptance-loop-create.component.html',
  styleUrls: ['./acceptance-loop-create.component.scss']
})
export class AcceptanceLoopCreateComponent implements OnInit {

  merchantId: number;

  acceptanceLoopFormGroupDef: AcceptanceLoopFormGroup = new AcceptanceLoopFormGroup();
  acceptanceLoopFormGroup: FormGroup;
  
  shopOptions: ShopOption[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly acceptanceLoopApiService: AcceptanceLoopApiService,
    private readonly acceptanceLoopService: AcceptanceLoopService,
    private readonly formBuilder: FormBuilder,
  ) {

    const idFromRoute = this.route.snapshot.queryParamMap.get('merchantId');
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;

    this.acceptanceLoopFormGroup = this.acceptanceLoopFormGroupDef.define(formBuilder);
    this.shopOptions = [];
    this._setShopValue(this.merchantId);
  }

  ngOnInit(): void {
  }

  private _setShopValue(merchantId: number) {
    if(merchantId == 0) {
      // TODO: error handling
      console.error('merchantId should not be zero.');
    }

    this.acceptanceLoopApiService.getMerchantShop(merchantId).subscribe((res) => {
      if(res.success && res.data) {
        let shopDetailsModel = JSON.parse(res.data).shops.items;
        shopDetailsModel.forEach((s:any) => {
          const shopOption : ShopOption = {
            shopId: s.shopId,
            shopName: s.name,     // TODO: confirm 'shopName', 'name'
            shopStatus: s.status, // TODO: confirm 'shopStatus', 'status'
            identityCode: s.identityCode,
            createdOn : s.createdOn,
            acceptanceLoopMerchantShopId: 0,
            isSelectedOrigin: false,
            isSelected: false,
            isVisible: true,
            hasChanged: false
          }

          this.shopOptions?.push(shopOption);
        })

        this.acceptanceLoopService.refreshShopOptions(this.shopOptions);
      }
    });
  }

}
