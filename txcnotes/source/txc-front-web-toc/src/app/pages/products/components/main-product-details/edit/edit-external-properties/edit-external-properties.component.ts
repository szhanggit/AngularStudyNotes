import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutEventType } from 'src/app/core/constants/events';
import { EventService } from 'src/app/core/service/event.service';
import { ExternalProperty } from 'src/app/pages/products/models/external-property';
import { ExternalPropertyBody } from 'src/app/pages/products/models/external-property-body';
import { Product } from 'src/app/pages/products/models/product.model';
import { ProductService } from 'src/app/pages/products/services/product.service';

@Component({
  selector: 'app-edit-external-properties',
  templateUrl: './edit-external-properties.component.html',
  styleUrls: ['./edit-external-properties.component.scss']
})
export class EditExternalPropertiesComponent implements OnInit {
  product!: Product;
  selectedTenant: string = 'TW';
  currentExternalProperties: ExternalProperty[] = [];
  dirty = false;

  constructor(private _productSvc: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _formBuilder: FormBuilder,
    private eventService: EventService) { }

  ngOnInit(): void {
    this.eventService.subscribe(LayoutEventType.CHANGE_TENANT_COUNTRY, (tenantCountry) => {
      this.selectedTenant = tenantCountry as string;
    });

    this._activatedRoute.params.subscribe(params => {
      this._productSvc.getProduct(params.id).subscribe(res => {
        this.product = res.data.productBasicInfo;
        this._productSvc.getProductExternalProperty(params.id).subscribe(res => {
          this.currentExternalProperties = res.data;
        });
      });
    });
  }

  OnExternalPropertyChanged(externalProperties: ExternalProperty[]) {
    this.currentExternalProperties = externalProperties;
    this.dirty = true;
  }

  navigateBackToProductDetails() {
    this._router.navigateByUrl(`products/${this.product.productId}`);
  }

  saveExternalProperty(): void {
    const externalPropertyBody: ExternalPropertyBody = {
      productId: this.product.productId,
      productExternalPropertyList: this.currentExternalProperties
    }

    this._productSvc.createProductExternalProperty(externalPropertyBody).subscribe(res => {
      this.navigateBackToProductDetails();
    });
  }

}
