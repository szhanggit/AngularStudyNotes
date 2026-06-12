import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbPagination, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { PRODUCT_CONSTANTS } from '../../constants/product-constants';
import { Product } from '../../models/product.model';
import { ProductCustomizationService } from '../../services/product-customization.service';
import { ProductService } from '../../services/product.service';
import { DraftService } from '../../services/draft.service';

import { NgbdToastGlobal } from '@txc-angular/component-library';
import { ConfirmationModalComponent } from '@txc-angular/component-library';
import { Draft } from '../../models/draft.model';
import { ProductTypeEnum } from '../../enums/product-type.enum';
import { Dictionary } from '../../models/dictionary.model';
import { DictionaryService } from '../../services/dictionary.service';
import { Select2Data } from 'ng-select2-component';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';
import { ProductWizardService } from '../../services/product-wizard.service';
import { ProductWizardDto } from '../../models/product-wizard-dto.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(NgbPagination) pagination!: NgbPagination;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;

  loading$ = new BehaviorSubject<boolean>(true);
  checkingProductCode$: ReplaySubject<boolean> = new ReplaySubject(1);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  // list of products 
  products$: Observable<Product[]>;
  drafts$: Observable<Draft[]>;

  productTypes = [{ value: 0, label: 'All product types' }, ...PRODUCT_CONSTANTS.PRODUCT_TYPE.map((type: { key: number, value: string }) => { return { value: type.key, label: type.value } })];
  isCreated: boolean = false;

  get isProductEditor(): boolean {
    return this._authLibService.getElementOperationFlag([environment.product_create_op_id]);
  }

  get isProductApprover(): boolean {
    return this._authLibService.getElementOperationFlag([environment.product_approve_op_id]);
  }

  commonFormValidators: ValidatorFn[] = [Validators.required, Validators.maxLength(100)]
  duplicateModal: any;

  merchantAcquirers: Dictionary[] = [];
  merchantAcquirersSelect2Data: Select2Data = [];
  pageSizes: Select2Data = [
    {
      value: 20,
      label: '20'
    },
    {
      value: 40,
      label: '40'
    },
  ];

  total$: Observable<number>;
  draftTotal$: Observable<number>;

  total: number = 0;
  draftTotal: number = 0;

  selectedTenant!: string;
  selectedTenantUTC!: string;

  duplicateProduct!: Product;
  duplicateFormGroup!: FormGroup;

  get itemStart() {
    let service = this.productSvc.status !== 3 ? this.productSvc : this.draftSvc;
    let total = this.productSvc.status !== 3 ? this.total : this.draftTotal;
    return service.page === 1 ? 1 : total < 1 ? total : (((service.page - 1) * service.pageSize) + 1);
  }

  get itemEnd() {
    let service = this.productSvc.status !== 3 ? this.productSvc : this.draftSvc;
    let total = this.productSvc.status !== 3 ? this.total : this.draftTotal;
    return service.page === this.pageCount || total < service.page * service.pageSize ? total : service.page * service.pageSize;
  }

  get pageCount() {
    const service = this.productSvc.status !== 3 ? this.productSvc : this.draftSvc;
    const total = this.productSvc.status !== 3 ? this.total : this.draftTotal;
    return Math.ceil(total / service.pageSize);
  }

  setProductStatus(product: Product) {
    if (product.status === 0) {
      product.status = 1;
    } else {
      product.status = 0;
    }

    this.productSvc.setStatus(product.productId, product.status).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((res: any) => {
      if (res.success) {
        this.toast?.showSuccess(`Status for ${product.productName} was successfully updated to ${product.status ? 'active' : 'inactive'}.`);
      } else {
        if (res.message) {
          this.toast?.showDanger(res.message);
        } else {
          this.toast?.showDanger(`There was a problem updating status of product ${product.productName}.`);
        }
      }
      this.productSvc.refresh();
    });
  }

  // form
  get f(): any {
    return this.duplicateFormGroup.controls;
  }

  constructor(
    public productSvc: ProductService,
    public draftSvc: DraftService,
    public productCustomizationSvc: ProductCustomizationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private _modalSvc: NgbModal,
    private readonly _productWizardService: ProductWizardService,
    private readonly _authLibService: AuthorizationLibraryService,
    private readonly _dictionaryService: DictionaryService,
    private readonly _formBuilder: FormBuilder) {
    this.products$ = productSvc.products$;
    this.drafts$ = draftSvc.drafts$;

    this.total$ = productSvc.total$;
    this.draftTotal$ = draftSvc.draftTotal$

    this.total$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(total => this.total = total);
    this.draftTotal$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(total => this.draftTotal = total);

    this.route.params.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.productSvc.searchTerm = '';
      this.productSvc.page = 1;
      this.productSvc.pageSize = 20;
      this.productSvc.refresh();

      // this.draftSvc.page = 1;
      this.draftSvc.pageSize = 20;
      this.draftSvc.refresh();
    });

    route.params.subscribe(() => {
      if (this.router.getCurrentNavigation()?.extras?.state) {
        const action = JSON.parse(JSON.stringify(this.router.getCurrentNavigation()?.extras?.state)).action;
        if (action) {
          setTimeout(() => {
            this.toast.showSuccess(`You have successfully created a new product!`);
            this.productSvc.status = 2;
          }, 500)
        }
      }
    });
  }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');

    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
      this.selectedTenantUTC = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    }

    if (this.productCustomizationSvc.isGlobal(this.selectedTenant)) {
      this._dictionaryService.getDictionaryItemsByCategory('VoucherIssuer').pipe(
        takeUntil(this.destroyed$)
      ).subscribe(
        res => {
          this.merchantAcquirers = JSON.parse(res.data).dictionaries;
          this.merchantAcquirersSelect2Data = [{ value: 0, label: 'All merchant acquirers' }, ...this.merchantAcquirers.map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.displayName } })];
        },
        () => {
          this.toast.showDanger('Error loading merchant acquirer list. Please try again later.');
        },
        () => {
          this.loading$.next(false);
        }
      )
    } else {
      this.loading$.next(false);
    }

    this.duplicateFormGroup = this._formBuilder.group({
      productId: new FormControl({ value: '', disabled: false }, this.commonFormValidators),
      productType: new FormControl({ value: '', disabled: false }, this.commonFormValidators),
      productName: new FormControl({ value: '', disabled: false }, this.commonFormValidators),
      productCode: new FormControl({ value: '', disabled: false }, this.commonFormValidators),
    });

    this.f.productCode.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((value: string) => {
      this.checkingProductCode$.next(true);
      this.productSvc.getProductCountByProductCode(value)
        .pipe(takeUntil(this.destroyed$))
        .subscribe(res => {
          const isExistedInProduct: boolean = (JSON.parse(res.data)?.products?.totalCount ?? 0) > 0;
          if (isExistedInProduct) {
            this.f.productCode.setErrors({ alreadyExists: true });
          }
          this.checkingProductCode$.next(false);
        });
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {
    if (history.state?.isCreated) {
      this.toast.showSuccess('You have successfully created a new product!');
      this.productSvc.status = 2;
    }
    if (history.state?.isBatchUpdatedCombo) {
      this.toast.showSuccess('Batch update product combo successful!');
      this.productSvc.status = 1;
    }
    this.cdr.detectChanges();
  }

  navigateToProductDetails(event: MouseEvent, product: Product) {
    event.preventDefault();
    if (event.ctrlKey) {
      window.open(this.getProductUrl(product), '_blank');
    } else {
      this.router.navigateByUrl(this.getProductUrl(product));
    }
  }
  
  getProductUrl(product: Product): string {
    if (product.productType === ProductTypeEnum.SmartChoiceVoucher) {
      return `products/product/edit/smart-choice-voucher/${product.productId}`;
    } else if (product.productType === ProductTypeEnum.SuperVoucher) {
      return `products/product/edit/super-voucher/${product.productId}`;
    } else {
      return `products/${product.productId}`;
    }
  }
  
  navigateToCreateProductDraft(wizardKey: string) {
    this.router.navigate(['/products/product/create'],
      {
        queryParams: {
          key: wizardKey,
          isDraft: true
        }
      });
  }

  openDuplicateModal(content: TemplateRef<NgbModal>, product: Product): void {
    this.duplicateProduct = product;
    this.f.productId.setValue(product.productId);
    this.f.productType.setValue(product.productType);

    if (product.productType === 4) {
      this.f.productName.setValidators([
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/{FV}/),
      ]);
    } else {
      this.f.productName.setValidators(this.commonFormValidators);
    }

    this.duplicateModal = this._modalSvc.open(content, { size: 'md', backdrop: 'static', centered: true });

    this.duplicateModal.result.then((data: any) => {
      if (data === 'Create') {
        this._productWizardService.initializeProductWizard({ productId: this.f.productId.value, productType: this.f.productType.value })
          .pipe(takeUntil(this.destroyed$)).subscribe(initializeProductDraft => {
            const wizardKey = initializeProductDraft.data;
            if (initializeProductDraft.success) {
              this._productWizardService.getProductWizard(wizardKey).pipe(takeUntil(this.destroyed$)).subscribe(productDraftDetails => {
                if (productDraftDetails.success) {
                  let stepOne = (productDraftDetails.data as ProductWizardDto)?.productWizardStepOne;

                  if (!stepOne) return;

                  stepOne.productCode = this.f.productCode.value;
                  stepOne.productName = this.f.productName.value;

                  this._productWizardService.updateProductWizard(wizardKey, 1, stepOne).pipe(takeUntil(this.destroyed$)).subscribe(updateProductDraft => {
                    if (updateProductDraft.success) {
                      this.navigateToCreateProductDraft(wizardKey);
                    } else {
                      this.toast.showDanger('Error in duplicating product. Please try again later.');
                      return;
                    }
                  },
                    () => {
                      this.toast.showDanger('Error in duplicating product. Please try again later.');
                      return;
                    });
                } else {
                  this.toast.showDanger('Error in duplicating product. Please try again later.');
                  return;
                }
              },
                () => {
                  this.toast.showDanger('Error in duplicating product. Please try again later.');
                  return;
                });
            } else {
              this.toast.showDanger('Error in duplicating product. Please try again later.');
              return;
            }
          },
            () => {
              this.toast.showDanger('Error in duplicating product. Please try again later.');
              return;
            });
      }
    })
  }

  closeModal() {
    this.duplicateModal.close();
    this.duplicateFormGroup.reset();
    this.f.productName.clearValidators();
    this.f.productName.updateValueAndValidity();
  }

  deleteDraft(wizardKey: string) {
    const modalRef = this._modalSvc.open(ConfirmationModalComponent, { size: 'md', backdrop: 'static', centered: true });
    modalRef.componentInstance.title = 'Delete product draft';
    modalRef.componentInstance.description = 'Are you sure you want to delete this product draft? The data cannot be retrieved.';
    modalRef.componentInstance.firstButton = {
      buttonText: 'Cancel',
      buttonClass: 'btn-secondary'
    };
    modalRef.componentInstance.secondButton = {
      buttonText: 'Delete',
      buttonClass: 'btn-danger'
    };

    modalRef.result.then(res => {
      if (res === 'confirm') {
        this.draftSvc.deleteDraft(wizardKey).pipe(
          takeUntil(this.destroyed$)
        ).subscribe(
          () => {
            this.toast.showSuccess('Successfully deleted product draft.');
            this.draftSvc.refresh();
          },
          () => {
            this.toast.showDanger('Error in deleting product draft.');
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

  navigateToBatchUpdateProduct() {
    this.router.navigate(['products/product/batch-update-product']);
  }
  
  navigateToBatchUpdateProductCombo() {
    this.router.navigate(['products/product/batch-update-product-combo']);
  }
}
