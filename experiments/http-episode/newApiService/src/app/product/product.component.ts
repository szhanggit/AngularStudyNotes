import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  _productService: ProductService;
  constructor(productService: ProductService) { 
    this._productService = productService;
  }

  ngOnInit(): void {
  }

  testSetting(){
    this._productService.status = 1;
    this._productService.pageSize = 100;
    this._productService.page = 6;
    this._productService.productType = 5;
    this._productService.createdBy = 54;
    this._productService.searchTerm = "sdfasd";
    this._productService._getProducts();
  }
}
