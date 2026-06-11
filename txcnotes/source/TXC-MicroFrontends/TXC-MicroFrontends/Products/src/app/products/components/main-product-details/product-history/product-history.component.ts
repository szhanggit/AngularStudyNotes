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
    this._activatedRoute.params.subscribe((params: any) => {
      this._productSvc.selectedProduct$.subscribe(product => { 
        if (!product) {
          this._productSvc.getProduct(parseInt(params.id));
          return;
        }
        this.product = product
      });
      this._productSvc.getProductHistory(params.id).subscribe(res => {
        const historyData = res.data.productHistoryList;
        this.productHistory = historyData.sort((prev, next) => next.version! - prev.version!)
      });
    });
  }

  ngOnInit(): void {
  }

  navigateBackToProductDetails() {
    this._router.navigateByUrl(`products/${this.product.productId}`);
  }

  navigateToHistoryDetails(id: number) {
    const url = this._router.createUrlTree([`/products/product/history-details/${id}`])
    window.open('/move' + url.toString(), '_blank')
  }
}
