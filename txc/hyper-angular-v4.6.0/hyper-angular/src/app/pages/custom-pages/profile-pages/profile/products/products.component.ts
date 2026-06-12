import { Component, OnInit } from '@angular/core';

// type
import { ProfileProductItem } from '../profile.model';

// data
import { profileProducts } from '../data';

@Component({
  selector: 'app-profile-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  productList: ProfileProductItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this._fetchData();
  }

  /**
   *  fetches product list
   */
  _fetchData(): void {
    this.productList = profileProducts;
  }

}
