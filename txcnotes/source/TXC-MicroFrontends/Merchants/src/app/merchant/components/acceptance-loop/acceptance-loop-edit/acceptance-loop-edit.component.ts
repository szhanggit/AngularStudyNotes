import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AcceptanceLoopFormGroup } from 'src/app/merchant/models/acceptance-loop-form-group.model';
import { AcceptanceLoop, AcceptanceLoopMerchant, AcceptanceLoopMerchantShop, ShopOption } from 'src/app/merchant/models/acceptance-loop.model';
import { GraphqlCollectionSegment } from 'src/app/merchant/models/graphql-collection-segment.model';
import { AcceptanceLoopApiService } from 'src/app/merchant/services/acceptance-loop-api.service';
import { AcceptanceLoopService } from 'src/app/merchant/services/acceptance-loop.service';

@Component({
  selector: 'app-acceptance-loop-edit',
  templateUrl: './acceptance-loop-edit.component.html',
  styleUrls: ['./acceptance-loop-edit.component.scss']
})
export class AcceptanceLoopEditComponent implements OnInit {
  
  merchantId : number;
  acceptanceLoopId: number = 0;
  acceptanceLoopMerchantId: number = 0;
  acceptanceLoopMerchant: AcceptanceLoopMerchant | undefined;
  acceptanceLoopMerchants: GraphqlCollectionSegment<AcceptanceLoopMerchant> | undefined;
  acceptanceLoop: AcceptanceLoop | undefined;
  acceptanceLoops: GraphqlCollectionSegment<AcceptanceLoop> | undefined;
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

    this.acceptanceLoopId = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
    this.acceptanceLoopFormGroup = this.acceptanceLoopFormGroupDef.define(formBuilder);
    this.shopOptions = [];
    this._setValues();
  }

  private _setValues() {

    this.acceptanceLoopApiService.getAcceptanceLoopById(this.acceptanceLoopId).subscribe((res) => {
      if(res.success) {
        const wrappedResponse = JSON.parse(res.data);
        this.acceptanceLoops = wrappedResponse.acceptanceLoops;

        if(this.acceptanceLoops?.items && this.acceptanceLoops.items[0]) {
          this.acceptanceLoopFormGroup.setValue({
            code: this.acceptanceLoops.items[0].code,
            description: this.acceptanceLoops.items[0].description,
            lastUpdatedOn : this.acceptanceLoops.items[0].lastUpdatedOn == null ? this.acceptanceLoops.items[0].createdOn : this.acceptanceLoops.items[0].lastUpdatedOn
          });
        }
      }
    });

    this.acceptanceLoopApiService.getMonoAcceptanceLoopMerchantShopByAcceptanceLoopId(this.acceptanceLoopId).subscribe((res) => {
      if(res.success) {
        const wrappedResponse = JSON.parse(res.data);
        this.acceptanceLoopMerchants = wrappedResponse.acceptanceLoopMerchants;

        if(this.acceptanceLoopMerchants?.items && this.acceptanceLoopMerchants.items[0]) {
          this.acceptanceLoopMerchant = this.acceptanceLoopMerchants.items[0];
          this.acceptanceLoopMerchantId = this.acceptanceLoopMerchant.acceptanceLoopMerchantId;
          this._setShopValue();
        }
      }
    });
  }

  private _setShopValue() {
    this.acceptanceLoopApiService.getMerchantShop(this.merchantId).subscribe((res) => {
      if(res.success && res.data) {
        let shopDetailsModel = JSON.parse(res.data).shops.items;
        shopDetailsModel.forEach((s:any) => {
          const acShop: AcceptanceLoopMerchantShop | undefined 
            = this.acceptanceLoopMerchant?.acceptanceLoopMerchantShops?.find(x => x.shopId == s.shopId);
          const isAcShopSelected = (acShop && acShop.status) ?? false;

          const shopOption : ShopOption = {
            shopId: s.shopId,
            shopName: s.name,     // TODO: confirm 'shopName', 'name'
            shopStatus: s.status, // TODO: confirm 'shopStatus', 'status'
            identityCode: s.identityCode,
            createdOn : s.createdOn,
            acceptanceLoopMerchantShopId: acShop?.acceptanceLoopMerchantShopId ?? 0,
            isSelectedOrigin: isAcShopSelected,
            isSelected: isAcShopSelected,
            isVisible: true,
            hasChanged: false
          }
          this.shopOptions?.push(shopOption);
        })

        this.acceptanceLoopService.refreshShopOptions(this.shopOptions);
      }
    });
  }

  ngOnInit(): void {
  }

}
