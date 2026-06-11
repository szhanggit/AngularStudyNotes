import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ExpirationPolicyTypeEnum } from 'src/app/products/enums/expiration-policy-type.enum';
import { ExpiryScheme } from 'src/app/products/models/expiry-scheme.model';
import { IProgram } from 'src/app/products/models/program.model';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { ProductApiService } from 'src/app/products/services/product-api.service';

@Component({
  selector: 'app-expiry-scheme',
  templateUrl: './expiry-scheme.component.html',
  styleUrls: ['./expiry-scheme.component.scss']
})
export class ExpirySchemeComponent implements OnInit {
  @Input() selectedTenant!: string;
  @Input() merchantProgram!: IProgram;
  @Input() expirySchemeList: number[] = [];
  @Input() fixExpiryDate!: string | undefined;
  @Output() stepHasIssue = new EventEmitter<number>();
  
  allExpirySchemes: ExpiryScheme[] = [];
  selectedExpirySchemes: ExpiryScheme[] = [];
  expirationPolicyTypeEnum = ExpirationPolicyTypeEnum;
  
  constructor(
    public readonly masterProductAPI: MasterProductApiService,
    private readonly productAPI: ProductApiService
    ) { }

  ngOnInit(): void {
    this.productAPI.getExpirationPolicies().subscribe(res => {
      this.allExpirySchemes = JSON.parse(res.data).expirationPolicyByGeneratorEnum
      this.setSelectedExpirationScheme();
    })
  }

  setSelectedExpirationScheme(){
    this.expirySchemeList.forEach((id: number) => {
      
      const selectedExpiryScheme = this.allExpirySchemes.find((expiryScheme:ExpiryScheme) => expiryScheme.id === id) as ExpiryScheme;
      if (selectedExpiryScheme) this.selectedExpirySchemes.push(selectedExpiryScheme);
    });
    if (!this.selectedExpirySchemes.length) {
      this.stepHasIssue.emit(2);
    }
  }
}
