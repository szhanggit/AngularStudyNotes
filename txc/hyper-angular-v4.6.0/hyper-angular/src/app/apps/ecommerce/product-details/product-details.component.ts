import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Product } from '../shared/models';

// data
import { products } from '../shared/data';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  selectedProduct!: Product;

  constructor (private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'eCommerce', path: '/' }, { label: 'Product Details', path: '/', active: true }];
    // fetches product details
    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        this.selectedProduct = products.filter(x => String(x.id) === params['id'])[0];
      } else {
        this.selectedProduct = products[0];
      }
    });
  }

}
