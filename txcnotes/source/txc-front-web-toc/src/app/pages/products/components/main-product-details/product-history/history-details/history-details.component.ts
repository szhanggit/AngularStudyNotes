import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutEventType } from 'src/app/core/constants/events';
import { EventService } from 'src/app/core/service/event.service';
import { Product } from 'src/app/pages/products/models/product.model';
import { ProductCustomizationService } from 'src/app/pages/products/services/product-customization.service';
import { ProductService } from 'src/app/pages/products/services/product.service';

@Component({
  selector: 'app-history-details',
  templateUrl: './history-details.component.html',
  styleUrls: ['./history-details.component.scss']
})
export class HistoryDetailsComponent implements OnInit {
  productDetailsCollapsed = false;
  selectedTenant: string = 'TW';
  product!: Product;

  constructor(
    private readonly _productService: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _eventService: EventService,
    public productCustomizationService: ProductCustomizationService
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      this._productService.getProductHistoryDetails(params.id).subscribe(res => this.product = res.data.productBasicInfo);
    });

    this._eventService.subscribe(LayoutEventType.CHANGE_TENANT_COUNTRY, (tenantCountry) => {
      this.selectedTenant = tenantCountry as string;
    });
  }

  navigateBackToProductHistory() {
    this._router.navigateByUrl(`products/product/history/${this.product.productId}`);
  }

}
