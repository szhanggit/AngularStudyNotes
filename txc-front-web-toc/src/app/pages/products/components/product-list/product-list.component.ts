import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbPagination, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { LayoutEventType } from 'src/app/core/constants/events';
import { EventService } from 'src/app/core/service/event.service';
import { NgbdToastGlobal } from 'src/app/shared/toast/toast-global.component';
import { PRODUCT_CONSTANTS } from '../../constants/product-constants';
import { Product } from '../../models/product.model';
import { ProductCustomizationService } from '../../services/product-customization.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  // list of products 
  products$: Observable<Product[]>;
  productTypes = PRODUCT_CONSTANTS.PRODUCT_TYPE;
  merchantAcquirers = PRODUCT_CONSTANTS.MERCHANT_ACQUIRER;
  total$: Observable<number>;
  total: number = 0;

  selectedTenant!: string;

  duplicateProduct!: Product;
  duplicateFormGroup!: FormGroup;

  get itemStart() {
    return this.productSvc.page === 1 ? 1 : this.total < 1 ? this.total : (((this.productSvc.page - 1) * this.productSvc.pageSize) + 1);
  }

  get itemEnd() {
    return this.productSvc.page === this.pageCount || this.total < this.productSvc.page * this.productSvc.pageSize ? this.total : this.productSvc.page * this.productSvc.pageSize;
  }

  get pageCount() {
    return this.pagination?.pageCount;
  }

  setProductStatus(product: Product) {
    if (product.status === 0) {
      product.status = 1;
    } else {
      product.status = 0;
    }

    this.productSvc.setStatus(product.productId, product.status).subscribe(res => {
      if (res.success) {
        this.toast?.showSuccess(`Status for ${product.productName} was successfully updated to ${product.status ? 'active' : 'inactive'}.`);
      } else {
        this.toast?.showDanger(`There was a problem updating status of product ${product.productName}.`);
      }
      this.productSvc.refresh();

    });
  }

  // form
  get f() {
    return this.duplicateFormGroup.controls;
  }

  constructor(
    public productSvc: ProductService,
    public productCustomizationSvc: ProductCustomizationService,
    private cdr: ChangeDetectorRef,
    private eventSvc: EventService,
    private router: Router,
    private _modalSvc: NgbModal,
    private readonly _formBuilder: FormBuilder) {
    this.products$ = productSvc.products$;
    this.total$ = productSvc.total$;

    this.total$.subscribe(total => this.total = total);
  }

  ngOnInit(): void {
    this.eventSvc.subscribe(LayoutEventType.CHANGE_TENANT_COUNTRY, (tenantCountry) => {
      this.selectedTenant = tenantCountry as string;
    });

    this.duplicateFormGroup = this._formBuilder.group({
      productId: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      productType: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      productName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      productCode: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  navigateToProductDetails(id: number) {
    this.router.navigateByUrl(`products/${id}`);
  }

  openDuplicateModal(content: TemplateRef<NgbModal>, product: Product): void {
    this.duplicateProduct = product;
    this.f.productId.setValue(product.productId);
    this.f.productType.setValue(product.productType);
    const modalRef = this._modalSvc.open(content, { size: 'md', backdrop: 'static', centered: true });

    modalRef.result.then((data) => {
      if (data === 'Create') {
        this.router.navigate(['products/product/create'],
          {
            queryParams: {
              productId: this.f.productId.value,
              productName: this.f.productName.value,
              productCode: this.f.productCode.value,
              productType: this.f.productType.value
            }
          });
      }
    })
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }
}
