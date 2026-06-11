import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Observable,
  OperatorFunction,
  Subject,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  skip,
  takeUntil,
} from 'rxjs';
import { ProductReferenceModel } from 'src/app/shared/models/product-reference.model';
import { ProductService } from '../../services/product.service';
import {
  Product,
  DFVQuantityStatus,
} from 'src/app/shared/models/product.model';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { ExpirySchemeTypeEnum } from 'src/app/shared/enums/expiry-scheme-type.enum';
import * as moment from 'moment';
import { DfvForm } from 'src/app/shared/models/dfvForm.model';
import { BusinessUnitEnum } from 'src/app/shared/enums/tenant.enum';
import { OrderMode } from '../../models/quotation-type.model';
import { OrderModeEnum } from '../../enums/order-mode.enum';
import { QAToolsSelectProductFieldsDefinition } from 'src/app/shared/models/fields-definition/qa-tools-select-product-fields-definition.model';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import {
  DirectDeliveryDetails,
  DirectDeliveryProperties,
  TotalQuantity,
} from '../../models/direct-delivery-details.model';
import { QuotationStateService } from '../../services/state-service/quotation-state.service';
import { Quotation } from '../../interface/quotation-state.interface';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.component.html',
  styleUrls: ['./select-product.component.scss'],
})
export class SelectProductComponent implements OnInit, OnDestroy {
  @Input() quotationId!: number;
  @Input() editMode = false;
  @Input() hideTitle = false;
  @Input() product!: Product | undefined;
  @Output() manualSelectProductCancel: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() manualSelectProductConfirmed: EventEmitter<Product> =
    new EventEmitter<Product>();

  // headers
  get TITLE(): string {
    return !this.editMode ? 'Select Product' : 'Edit Product details';
  }

  get productTypeEnum(): typeof ProductTypeEnum {
    return ProductTypeEnum;
  }

  get voucherQuantity() {
    return this.productDetailsFormGroup.get('voucherQuantity');
  }

  selectedProduct!: ProductReferenceModel | undefined;
  selectedTenant: string = '';
  selectedOrderMode!: OrderMode;

  // qa tools - TO BE REMOVED when doing API Integration
  hideQATools = true;
  qaToolsCollapsed = true;
  qaToolsFormGroup!: FormGroup;
  qaToolsFieldsDefinition: QAToolsSelectProductFieldsDefinition =
    new QAToolsSelectProductFieldsDefinition();

  get qaToolsFormModel(): FormModel {
    return {
      title: 'QA Tools',
      formGroup: this.qaToolsFormGroup,
      fieldsDefinition: this.qaToolsFieldsDefinition.define(),
    };
  }

  get mockSimulation() {
    return this.qaToolsFormGroup.value;
  }

  productNameFormGroup!: FormGroup;
  productPropertiesFormGroup!: FormGroup;
  productDetailsFormGroup!: FormGroup;
  dfvDetailsFormGroup!: FormGroup;
  dfvDetailsFormArray!: FormArray;
  trustAccountFormGroup!: FormGroup;
  orderModes = OrderModeEnum;
  deliveryDetailsQty!: TotalQuantity;
  directDeliveryDetails: DirectDeliveryDetails[] = [];
  isDeliveryDetailsTableDirty: boolean = true;

  productFormatter = (result: ProductReferenceModel) => result.productName;

  focusProduct$ = new Subject<string>();
  clickProduct$ = new Subject<string>();

  selectedQuotation!: Quotation;

  // mock data until api is integrated
  productReference: ProductReferenceModel[] = [];

  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private productSvc: ProductService,
    private quotationStateService: QuotationStateService
  ) {}

  ngOnInit() {
    this.setSelectedQuotationState();
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }

    this.productReference = this.productSvc.getProductsListByQuotationId(
      this.quotationId
    ).data;

    this.initializeProductPropertiesFormGroup();
    this.initializeSubForms();
    this.listenOnProductNameFormGroupChange();
    this.listenOnTrustAccountFormGroupChange();
    this.initializeControlValidity();

    this.initializeOnEdit();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  initializeControlValidity() {
    if (this.selectedOrderMode?.key !== this.orderModes.DirectNonAPI) {
      this.voucherQuantity!.setValidators([
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/),
      ]);
    } else if (
      this.selectedOrderMode?.key === this.orderModes.DirectNonAPI
    ) {
      this.disableDfvFormGroup();
    }

    if (this.selectedTenant !== BusinessUnitEnum.Taiwan) {
      Object.keys(this.trustAccountFormGroup.controls).forEach(
        (controlName) => {
          (
            this.trustAccountFormGroup.get(controlName) as FormControl
          ).disable();
        }
      );
    }
  }

  initializeOnEdit() {
    if (this.editMode && this.product) {
      this.selectedProduct = this.product;

      this.productDetailsFormGroup.patchValue(this.product, {
        emitEvent: false,
        onlySelf: true,
      });

      if (this.product.trustAccount) {
        this.onTrustAccountDetailsSet(this.product);
      }

      setTimeout(() => {
        if (this.product && this.product.expiryDate) {
          this.productDetailsFormGroup
            .get('expiryDate')
            ?.patchValue(new Date(this.product.expiryDate));
        }

        if (
          this.product?.trustAccount &&
          this.product.trustAccount.trustExpiryDate
        ) {
          this.trustAccountFormGroup
            .get('trustExpiryDate')
            ?.patchValue(new Date(this.product.trustAccount.trustExpiryDate));
        }
      });

      if (
        this.product.productType !== ProductTypeEnum.DynamicFaceValue ||
        this.selectedOrderMode.key === this.orderModes.DirectNonAPI
      ) {
        this.dfvDetailsFormGroup.disable();
      } else {
        this.voucherQuantity!.disable();
        this.voucherQuantity!.patchValue(null);

        if (this.product && this.product.dfvQuantity) {
          this.dfvDetailsFormArray!.clear();
          const [minValue, maxValue] = this.selectedProduct
            ?.faceValueRange!.split(' to ')
            .map(Number);
          this.product.dfvQuantity.forEach((item) => {
            const formGroup = this.formBuilder.group({
              faceValue: [
                item.faceValue,
                [
                  Validators.required,
                  Validators.pattern(/^[0-9]\d*$/),
                  Validators.min(minValue),
                  Validators.max(maxValue),
                ],
              ],
              voucherQuantity: [
                item.voucherQuantity,
                [Validators.required, Validators.pattern(/^[1-9]\d*$/)],
              ],
            });

            this.dfvDetailsFormArray.push(formGroup);
          });
        }
      }
    }
  }

  listenOnTrustAccountFormGroupChange() {
    this.trustAccountFormGroup
      .get('trustAccountOption')
      ?.valueChanges.pipe(
        skip(
          this.editMode &&
            this.trustAccountFormGroup.get('trustAccountOption')?.value ===
              'Custom'
            ? 1
            : 0
        )
      )
      .subscribe((value) => {
        const product = this.selectedProduct?.trustAccount;
        this.trustAccountFormGroup
          .get('trustAmount')
          ?.patchValue(product?.trustAmount);
        if (value === 'Default') {
          this.trustAccountFormGroup.get('trustAmount')?.markAsPristine();
        } else if (value === 'Custom') {
          this.trustAccountFormGroup.get('trustAmount')?.patchValue(null);
        }
      });
  }

  listenOnProductNameFormGroupChange() {
    this.productNameFormGroup.valueChanges.subscribe((value) => {
      const product = value['productName'];
      if (this.selectedProduct) {
        this.onProductReset();
        this.onDfvDetailsReset();
      }
      if (
        (product && product.productType !== ProductTypeEnum.DynamicFaceValue) ||
        this.selectedOrderMode?.key === this.orderModes.DirectNonAPI
      ) {
        this.disableDfvFormGroup();
      } else {
        this.enableDfvFormGroup();
        // faceValueRange validation logic
        if (!this.editMode && product?.faceValueRange) {
          const [minValue, maxValue] = product?.faceValueRange
            .split(' to ')
            .map(Number);
          this.dfvDetailsFormArray.controls.forEach(
            (control: AbstractControl) => {
              const faceValueControl = control.get('faceValue');
              if (faceValueControl) {
                faceValueControl.setValidators([
                  Validators.required,
                  Validators.pattern(/^[0-9]\d*$/),
                  Validators.min(minValue),
                  Validators.max(maxValue),
                ]);
                faceValueControl.updateValueAndValidity();
              }
            }
          );
        }
      }

      if (product && product.trustAccount) {
        this.onTrustAccountDetailsSet(product);
      }
    });
  }

  setSelectedQuotationState() {
    this.quotationStateService.selectedOrderMode$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(
        (orderMode) => (this.selectedOrderMode = orderMode)
      );

    this.quotationStateService.selectedQuotation$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((quotation) => (this.selectedQuotation = quotation));
  }

  initializeProductPropertiesFormGroup() {
    // TO BE REMOVED on API integration
    this.qaToolsFormGroup = this.formBuilder.group({
      simulateValidationError: { value: false, disabled: false },
      simulateDuplicateError: { value: false, disabled: false },
    });

    this.productPropertiesFormGroup = this.formBuilder.group({
      productNameFormGroup: this.formBuilder.group({
        productName: new FormControl({
          value: null,
          disabled: false,
        }),
      }),
      productDetailsFormGroup: this.formBuilder.group({
        expiryScheme: new FormControl(
          {
            value: null,
            disabled: false,
          },
          [Validators.required]
        ),
        expiryDate: new FormControl(
          {
            value: null,
            disabled: true,
          },
          [Validators.required]
        ),
        voucherQuantity: new FormControl({
          value: null,
          disabled: false,
        }),
        reservationCode: new FormControl({
          value: null,
          disabled: false,
        }),
        clientOrderNumber: new FormControl({
          value: null,
          disabled: false,
        }),
        isShortUrlNeeded: new FormControl({
          value: 1,
          disabled: false,
        }),
      }),
      dfvDetailsFormGroup: this.formBuilder.group({
        dfvDetailsFormArray: this.formBuilder.array([
          this.formBuilder.group({
            faceValue: new FormControl(
              {
                value: null,
                disabled: false,
              },
              [Validators.required, Validators.pattern(/^[0-9]\d*$/)]
            ),
            voucherQuantity: new FormControl(
              {
                value: null,
                disabled: false,
              },
              [Validators.required, Validators.pattern(/^[1-9]\d*$/)]
            ),
          }),
        ]),
      }),
      trustAccountFormGroup: this.formBuilder.group({
        isTrustAccountNeeded: new FormControl({
          value: true,
          disabled: false,
        }),
        trustAccount: new FormControl({
          value: -1,
          disabled: false,
        }),
        trustAccountFee: new FormControl({
          value: null,
          disabled: true,
        }),
        trustAccountBatchNumber: new FormControl(
          {
            value: null,
            disabled: false,
          },
          [Validators.pattern(/^[0-9]\d*$/)]
        ),
        trustAccountOption: new FormControl({
          value: 'Default',
          disabled: false,
        }),
        trustAmount: new FormControl(
          {
            value: null,
            disabled: true,
          },
          [Validators.required, Validators.pattern(/^[0-9]\d*$/)]
        ),
        trustExpiryScheme: new FormControl({
          value: -1,
          disabled: false,
        }),
        trustExpiryDate: new FormControl(
          {
            value: null,
            disabled: false,
          },
          Validators.required
        ),
      }),
    });
  }

  initializeSubForms() {
    this.productNameFormGroup = this.productPropertiesFormGroup.get(
      'productNameFormGroup'
    ) as FormGroup;
    this.productDetailsFormGroup = this.productPropertiesFormGroup.get(
      'productDetailsFormGroup'
    ) as FormGroup;
    this.dfvDetailsFormGroup = this.productPropertiesFormGroup.get(
      'dfvDetailsFormGroup'
    ) as FormGroup;
    this.trustAccountFormGroup = this.productPropertiesFormGroup.get(
      'trustAccountFormGroup'
    ) as FormGroup;
    this.dfvDetailsFormArray = this.dfvDetailsFormGroup.get(
      'dfvDetailsFormArray'
    ) as FormArray;
  }

  disableDfvFormGroup() {
    this.dfvDetailsFormGroup.disable();
    if (this.selectedOrderMode?.key !== this.orderModes.DirectNonAPI) {
      this.voucherQuantity!.enable();
      if (this.selectedOrderMode.key !== OrderModeEnum.DirectNonAPI) {
        this.voucherQuantity!.setValidators([
          Validators.required,
          Validators.pattern(/^[1-9]\d*$/),
        ]);
      }
      this.voucherQuantity!.updateValueAndValidity();
    }
  }
  enableDfvFormGroup() {
    this.dfvDetailsFormGroup.enable();
    this.voucherQuantity!.disable();
    this.voucherQuantity!.clearValidators();
    this.voucherQuantity!.updateValueAndValidity();
  }
  onProductReset() {
    this.productDetailsFormGroup.reset();
    this.productDetailsFormGroup.get('expiryScheme')!.setValue(null);
    this.productDetailsFormGroup.get('isShortUrlNeeded')!.setValue(null);
  }

  onDfvDetailsReset() {
    while (this.dfvDetailsFormArray.length > 1) {
      this.dfvDetailsFormArray.removeAt(1);
    }
    this.dfvDetailsFormGroup.reset();
  }

  onTrustAccountDetailsSet(product: any) {
    const trustAccount = product.trustAccount;
    const isTrustAccountNeeded = trustAccount.isTrustAccountNeeded;
    this.trustAccountFormGroup.patchValue({
      isTrustAccountNeeded: isTrustAccountNeeded,
      trustAccount: trustAccount.trustAccount ?? -1,
      trustAccountFee: trustAccount.trustAccountFee ?? null,
      trustAccountBatchNumber: trustAccount.trustAccountBatchNumber ?? null,
      trustAccountOption: trustAccount.trustAccountOption ?? 'Default',
      trustAmount: trustAccount.trustAmount ?? null,
      trustExpiryScheme: trustAccount.trustExpiryScheme ?? -1,
    });
    if (isTrustAccountNeeded) {
      setTimeout(() => {
        if (trustAccount.trustExpiryDate) {
          this.trustAccountFormGroup
            .get('trustExpiryDate')
            ?.patchValue(new Date(trustAccount.trustExpiryDate));
        }
      });
    }
  }

  searchProduct: OperatorFunction<string, readonly ProductReferenceModel[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const inputFocus$ = this.focusProduct$;
    return merge(debouncedText$, inputFocus$).pipe(
      map((term) =>
        (term === ''
          ? this.productReference
          : this.productReference.filter(
              (product) =>
                product.productName
                  .toLowerCase()
                  .includes(term.toLowerCase()) ||
                product.productCode.toLowerCase().includes(term.toLowerCase())
            )
        ).slice(0, 20)
      )
    );
  };

  onCancel() {
    this.manualSelectProductCancel.emit(true);
  }

  getDirectDeliveryDetailsProperties(props: DirectDeliveryProperties) {
    this.directDeliveryDetails = props.directDeliveryDetails!;
    this.deliveryDetailsQty = props.quantity!;

    if (!props.isInit) {
      this.productPropertiesFormGroup.markAsDirty();
    }
  }

  onSelect(): void {
    if (!this.selectedProduct) return;
    let expiryDate;
    const value = this.productDetailsFormGroup.getRawValue();
    let dfvValue;
    let dfvPercentage: number | undefined;
    let dfvQuantity: DFVQuantityStatus[] | undefined;
    const trustAccount = this.trustAccountFormGroup.getRawValue();

    if (
      this.selectedProduct?.productType !== ProductTypeEnum.DynamicFaceValue
    ) {
      dfvValue = null;
    } else {
      dfvValue = this.dfvDetailsFormGroup.getRawValue();
      //dfvPercentage should be retrieved from DB, now it's a random number from 1 to 100, until api is ready
      dfvPercentage = Math.floor(Math.random() * 100) + 1;
      dfvQuantity = dfvValue.dfvDetailsFormArray.map((item: DfvForm) => {
        const faceValue = Number(item.faceValue);
        const voucherQuantity = Number(item.voucherQuantity);
        const sellingPrice = faceValue * (dfvPercentage! / 100);
        return {
          faceValue,
          voucherQuantity,
          sellingPrice,
        };
      });
    }
    const voucherQuantity = this.getVoucherQuantity(value, dfvQuantity);

    if (value.expiryDate) {
      if (value.expiryScheme === ExpirySchemeTypeEnum.FixNotEndOfDay) {
        const momentExpiryDate = moment(value.expiryDate);
        expiryDate = momentExpiryDate.format('YYYY/MM/DD HH:mm:ss');
      } else {
        expiryDate = moment(value.expiryDate)
          .endOf('day')
          .format('YYYY/MM/DD HH:mm:ss');
      }
    }

    const newProduct: Product = {
      id: this.selectedProduct.id,
      productVersionId: 1,
      productType: this.selectedProduct.productType,
      productCode: this.selectedProduct.productCode,
      productName: this.selectedProduct.productName,
      faceValue: dfvValue ? undefined : this.selectedProduct.faceValue,
      sellingPrice: this.selectedProduct.sellingPrice,
      remainingQuantity: this.selectedProduct.remainingQuantity,
      dfvQuantity: dfvQuantity,
      dfvPercentage: dfvPercentage,
      expiryScheme: value.expiryScheme,
      expirySchemeText: value.expiryScheme,
      expiryDate: expiryDate,
      voucherQuantity: voucherQuantity,
      emailQuantity: this.deliveryDetailsQty?.emailQty || 0,
      smsQuantity: this.deliveryDetailsQty?.smsQty || 0,
      reservationCode: value.reservationCode,
      clientOrderNumber: value.clientOrderNumber,
      isChildProduct: false,
      isShortUrlNeeded: value.isShortUrlNeeded,
      faceValueRange: this.selectedProduct.faceValueRange,
      trustAccount: trustAccount,
      directDeliveryDetails: this.directDeliveryDetails || [],
    };

    this.manualSelectProductConfirmed.emit(newProduct);
  }

  getVoucherQuantity(value: any, dfvQuantity: DFVQuantityStatus[] | undefined) {
    if (this.selectedOrderMode.key === OrderModeEnum.IndirectNonAPI) {
      if (dfvQuantity) {
        return dfvQuantity.reduce(
          (acc: number, obj: { voucherQuantity: number }) =>
            acc + obj.voucherQuantity,
          0
        );
      }
      return value.voucherQuantity;
    } else if (
      this.selectedOrderMode.key === OrderModeEnum.DirectNonAPI
    ) {
      return this.deliveryDetailsQty?.voucheryQty;
    }
  }
}
