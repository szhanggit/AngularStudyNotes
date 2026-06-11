import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantGroupView } from 'src/app/merchant/models/get-merchant-group-response.model';

@Component({
  selector: 'app-merchant-group-merchant-map',
  templateUrl: './merchant-group-merchant-map.component.html',
  styleUrls: ['./merchant-group-merchant-map.component.scss']
})
export class MerchantGroupMerchantMapComponent implements OnInit {
  @Input() merchantGroup!: MerchantGroupView;
  @Input() merchantCount!: number;
  @Input() isMerchantEditor!: boolean;

  merchantDetailsCollapsed: boolean = true;
  merchantDetailsViewAllCollapsed: boolean = true;

  constructor(
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    if (history.state?.action === "merchantMapOpen") {
      this.merchantDetailsCollapsed = false;
    } 
  }

  navigateToEditMerchantGroup() {
    this.router.navigate([`/merchants/merchant-group/edit`],
      {
        queryParams: {
          merchantId: this.merchantGroup.merchantId
        }
      });
  }
}
