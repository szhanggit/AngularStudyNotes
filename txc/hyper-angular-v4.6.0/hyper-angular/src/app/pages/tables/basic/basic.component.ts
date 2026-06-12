import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { PersonDetails, ProductDetails } from './basic.model';

// data
import { PERSONLIST, PRODUCTLIST } from './data';

@Component({
  selector: 'app-tables-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  personData: PersonDetails[] = [];
  productData: ProductDetails[] = [];
  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Tables', path: '/' }, { label: 'Basic Tables', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.personData = PERSONLIST;
    this.productData = PRODUCTLIST;
  }

  /**
   * removes person
   * @param person person
   */
  removePerson(person: PersonDetails): void {
    const index = this.personData.indexOf(person);
    if (index > -1) {
      this.personData.splice(index, 1);
    }
  }

  /**
   * removes product
   * @param product product
   */
  removeProduct(product: ProductDetails): void {
    const index = this.productData.indexOf(product);
    if (index > -1) {
      this.productData.splice(index, 1);
    }
  }
}
