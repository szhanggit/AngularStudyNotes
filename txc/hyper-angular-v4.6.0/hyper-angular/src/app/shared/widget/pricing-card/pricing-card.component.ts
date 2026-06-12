import { Component, Input, OnInit } from '@angular/core';

// type
import { PricingPlan } from './pricing-card.model';

@Component({
  selector: 'app-widget-pricing-card',
  templateUrl: './pricing-card.component.html',
  styleUrls: ['./pricing-card.component.scss']
})
export class PricingCardComponent implements OnInit {

  @Input() pricingPlans: PricingPlan[] = [];
  @Input() containerClass: string = '';

  constructor () { }

  ngOnInit(): void {
  }

}
