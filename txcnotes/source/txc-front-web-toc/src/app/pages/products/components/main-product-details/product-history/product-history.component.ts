import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-history',
  templateUrl: './product-history.component.html',
  styleUrls: ['./product-history.component.scss']
})
export class ProductHistoryComponent implements OnInit {
  product!: Product;
  productHistory!: Product[];

  constructor(private _productSvc: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router) {
    this._activatedRoute.params.subscribe(params => {
      this._productSvc.getProduct(params.id).subscribe(res => this.product = res.data.productBasicInfo);
      this._productSvc.getProductHistory(params.id).subscribe(res => this.productHistory = res.data.productHistoryList);
    });
  }

  ngOnInit(): void {
  }

  navigateBackToProductDetails() {
    this._router.navigateByUrl(`products/${this.product.productId}`);
  }

  navigateToHistoryDetails(id: number) {
    this._router.navigateByUrl(`products/product/history-details/${id}`);
  }

}
