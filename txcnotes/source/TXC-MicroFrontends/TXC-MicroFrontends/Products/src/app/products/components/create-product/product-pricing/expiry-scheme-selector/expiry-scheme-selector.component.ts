import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { ExpiryScheme } from 'src/app/products/models/expiry-scheme.model';
import { IProgram } from 'src/app/products/models/program.model';
import { ExpirationPolicyTypeEnum } from 'src/app/products/enums/expiration-policy-type.enum';
import { ExpiryTypeEnum } from 'src/app/products/enums/expiry-type.enum';
import { ProductApiService } from 'src/app/products/services/product-api.service';
import { ProductVoucherGeneratorEnum } from 'src/app/products/enums/voucher-generator.enum';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/products/services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expiry-scheme-selector',
  templateUrl: './expiry-scheme-selector.component.html',
  styleUrls: ['./expiry-scheme-selector.component.scss'],
})
export class ExpirySchemeSelectorComponent implements OnInit {
  @Input() selectedTenant!: string;
  @Input() merchantProgram!: IProgram;
  @Input() expirySchemeList: number[] = [];
  
  _selectedExpirySchemes!: ExpiryScheme[];
  get selectedExpirySchemes(): ExpiryScheme[] {
    return this._selectedExpirySchemes;
  }
  @Input() set selectedExpirySchemes(value: ExpiryScheme[]) {
    this._selectedExpirySchemes = [...value];
  }
  @Input() fixExpiryDate!: string | undefined;
  isFixedExpiryPolicy!: boolean | null | undefined;
  @Input() isFixedExpiryPolicy$!: Observable<boolean | null | undefined>;
  @Output() openModalButtonClicked = new EventEmitter<string>();
  @Output() removeFromSelectionClicked = new EventEmitter<{
    selectedExpirySchemes: ExpiryScheme[];
    index: number;
  }>();
  @Output() onSelectedExpirySchemesChanged = new EventEmitter<{
    expirySchemes: ExpiryScheme[];
    selectedExpirySchemes: ExpiryScheme[];
    fixExpiryDate: string | undefined;
  }>();

  expirySchemes: ExpiryScheme[] = [];
  expirationPolicyTypeEnum = ExpirationPolicyTypeEnum;
  expiryType!: string;
  expiryTypes = ExpiryTypeEnum;
  expirySchemeListMap = new Map<any, ExpiryScheme[]>();

  constructor(
    private readonly productAPI: ProductApiService,
    private route: ActivatedRoute,
    private productSvc: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
      this.productSvc.getExpiryPolicyType(id).subscribe(value => { 
        const policy = JSON.parse(value.data).products.items[0];
        this.expiryType = policy?.isFixedExpiryPolicy ?  ExpiryTypeEnum.FIXED : ExpiryTypeEnum.FLEXIBLE;
        this.getExpirationPolicies(this.expiryType)
      })
    } else {
      this.isFixedExpiryPolicy$.subscribe(value => {
        this.expiryType = value ? ExpiryTypeEnum.FIXED : ExpiryTypeEnum.FLEXIBLE;
        this.getExpirationPolicies(this.expiryType);
      })
    }
  }

  getExpirationPolicies(expiryType?: string, isOpenModal: boolean = false) {
    let generator;
    if (expiryType) {
      generator = this.merchantProgram.isEdenred
        ? expiryType === ExpiryTypeEnum.FIXED
          ? `[${ProductVoucherGeneratorEnum.EdenredFixed}]`
          : `[${ProductVoucherGeneratorEnum.EdenredFlexable}]`
        : expiryType === ExpiryTypeEnum.FIXED
        ? `[${ProductVoucherGeneratorEnum.ThirdPartyFixed}]`
        : `[${ProductVoucherGeneratorEnum.ThirdPartyFlexable}]`;
    }

    this.productAPI.getExpirationPolicies(generator).subscribe((res) => {
      this.expirySchemes = JSON.parse(res.data).expirationPolicyByGeneratorEnum;
      if (isOpenModal) {
        this.openModalButtonClicked.emit(expiryType);
      }
      this.setSelectedExpirationScheme(isOpenModal);
    });
  }

  setSelectedExpirationScheme(isOpenModal: boolean) {
    if (this.expirySchemeList && this.expirySchemeList.length) {
      this.expirySchemeList.forEach((id: number) => {
        const selectedExpiryScheme = this.expirySchemes.find(
          (expiryScheme: ExpiryScheme) => expiryScheme.id === id
        ) as ExpiryScheme;
        if (selectedExpiryScheme && !isOpenModal) {
          this.selectedExpirySchemes.push(selectedExpiryScheme);
        }
      });
    }

    this.onSelectedExpirySchemesChanged.emit({
      expirySchemes: this.expirySchemes,
      selectedExpirySchemes: this.selectedExpirySchemes,
      fixExpiryDate: this.selectedExpirySchemes[0]?.fixExpiryDate || this.fixExpiryDate
    });
  }

  emitOpenModal(expiryType: string) {
    this.expiryType = expiryType;
    this.getExpirationPolicies(expiryType, true);
  }

  emitRemoveFromSelection(index: number) {
    this.removeFromSelectionClicked.emit({
      selectedExpirySchemes: this.selectedExpirySchemes,
      index,
    });
  }
}
