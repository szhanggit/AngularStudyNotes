import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductCustomizationService } from '../../../services/product-customization.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {
  @Input() product!: Product;
  @Input() selectedTenant: string = 'TW';
  constructor(public productCustomizationService: ProductCustomizationService) { }

  ngOnInit(): void {
  }

}
