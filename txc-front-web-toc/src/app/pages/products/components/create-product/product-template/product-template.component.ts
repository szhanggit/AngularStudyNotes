import { Component, Input, OnInit } from '@angular/core';
import { ProductType } from '../../../models/product-type.model';
import { ProductCustomizationService } from '../../../services/product-customization.service';

@Component({
  selector: 'app-product-template',
  templateUrl: './product-template.component.html',
  styleUrls: ['./product-template.component.scss']
})
export class ProductTemplateComponent implements OnInit {
  @Input() selectedTenant!: string;
  @Input() selectedType!: ProductType;

  templateType = 1;

  constructor(public productCustomizationSvc: ProductCustomizationService) { }

  ngOnInit(): void {
  }

}
