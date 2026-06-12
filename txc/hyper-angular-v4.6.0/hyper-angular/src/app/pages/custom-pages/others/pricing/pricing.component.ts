import { Component, OnInit } from '@angular/core';

// type
import { PricingPlan } from 'src/app/shared/widget/pricing-card/pricing-card.model';
import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';

// data
import { PLANS } from './pricing.data';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  pricingPlans: PricingPlan[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Pages', path: '/' }, { label: 'Pricing', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * Fetches the plans data
   */
  _fetchData() {
    this.pricingPlans = PLANS;
  }


}
