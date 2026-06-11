import { Component, Input } from '@angular/core';
import { Dictionary } from 'src/app/merchant/models/dictionary.model';
import { Shop } from 'src/app/merchant/models/shop.model';

@Component({
  selector: 'app-shop-address-span',
  templateUrl: './shop-address-span.component.html',
  styleUrls: ['./shop-address-span.component.scss']
})
export class ShopAddressSpanComponent {
  @Input() shop!: Shop;
  @Input() cities!: Dictionary[];
  @Input() statesOrProvinces!: Dictionary[];
  @Input() countries!: Dictionary[];
}
