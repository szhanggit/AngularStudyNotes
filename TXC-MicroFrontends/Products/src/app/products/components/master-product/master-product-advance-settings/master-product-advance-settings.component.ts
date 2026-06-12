import { Component, OnInit, Input, OnDestroy, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, filter, Subject, takeUntil } from 'rxjs';
import { ExternalProperty } from 'src/app/products/models/external-property';
import { ExternalPropertyBody } from 'src/app/products/models/external-property-body';
import { ActionMode, MasterProduct, MasterProductAdvanceSettings, ProductConditionDto, ProductExternalPropertyObject } from 'src/app/products/models/master-product/master-product.model';
import { GeneralService } from 'src/app/products/services/general.service';
import { MasterProductApiService } from 'src/app/products/services/master-product-api.service';
import { MasterProductService } from 'src/app/products/services/master-product.service';
import { TenantConfigService } from 'src/app/products/services/tenant-config.service';
import { AlreadyExistValidator } from 'src/app/products/validators/already-exists.validator';
import { StepEnum } from '../master-product.component';

@Component({
  selector: 'app-master-product-advance-settings',
  templateUrl: './master-product-advance-settings.component.html',
  styleUrls: ['./master-product-advance-settings.component.scss']
})
export class MasterProductAdvanceSettingsComponent implements OnInit, OnDestroy {

  @Input() parent!: any;

  readonly STEP = StepEnum.AdvanceSettings;
  readonly SAVE = "Save";
  readonly ADD = "Add";
  readonly EDIT = "Edit";
  readonly CLOSE = "Close";
  readonly PRODUCT_REMINDER = "ProductReminder";
  readonly RESERVE_LIMIT_ALWAYS_CAN_REVERSED = "AlwaysCanReversed";
  // form control names
  readonly PROPERTY_NAME = "propertyName";
  readonly PROPERTY_VALUE = "propertyValue";
  readonly DESCRIPTION = "description";
  // error messages
  readonly ERROR_GETTING_WIZARD_DATA = "Error getting data from wizard";
  readonly ERROR_GETTING_EXTERNAL_PROPERTIES = "Error getting external properties";
  readonly NO_MASTER_PRODUCT = "Did not get initial product data";
  readonly NO_WIZARD_KEY = "No valid wizard key provided";
  readonly PROPERTY_NAME_NOT_UNIQUE = "Property names are not unique. Please check again.";
  readonly NO_CHANGE = "No Change";
  readonly UPDATE_FAILED = "Update failed.";
  readonly DEFAULT_REMINDER_NOT_FOUND = "Default product reminder not found";
  readonly DEFAULT_REVERSE_LIMIT_NOT_FOUND 
    = `${this.RESERVE_LIMIT_ALWAYS_CAN_REVERSED} item of reverse limit not found`;
  readonly DEFAULT_REVERSE_LIMIT_MORE_THAN_ONE 
    = `More than one ${this.RESERVE_LIMIT_ALWAYS_CAN_REVERSED} items of reverse limit found`;

  masterProduct?: MasterProduct;
  externalPropertyFormGroup!: FormGroup;
  externalProperties: ExternalProperty[] = [];
  reminderId?: number;
  reverseLimitId?: number;

  modify$ = new Subject<boolean>();

  openedModalRef?: NgbModalRef;
  editMode$ = new BehaviorSubject<boolean>(false);
  closeModal$ = new Subject<boolean>();
  destroy$ = new Subject();

  // form
  get f(): any {
    return this.externalPropertyFormGroup.controls;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly tenantConfigService: TenantConfigService,
    private readonly masterProductService: MasterProductService,
    private readonly masterProductApiService: MasterProductApiService,
    private readonly generalService: GeneralService,
    private readonly ngbModal: NgbModal,
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.setFormGroup();
    this.subscribeProductService();
    this.subscribeCloseModal();

    // Create
    if (this.parent.actionMode == ActionMode.Create && this.parent.wizardKey) {
      this.getMasterProductByWizard(this.parent.wizardKey);
      this.getProductReminder();
      this.getDefaultProductReverseLimit();
      return;
    }
    // Edit
    if (this.parent.actionMode == ActionMode.Edit && this.parent.productId) {
      this.setEditButtonControl();
      this.getExternalPropertiesByProductId(this.parent.productId);
    }
  }

  // Save button is enabled only after changes made to the page
  private setEditButtonControl() {
    this.parent.editSaveButtonDisableFlag$.next(true);
    this.modify$.asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isModified => this.parent.editSaveButtonDisableFlag$.next(!isModified));
  }

  private subscribeCloseModal() {
    this.closeModal$.asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(_ => {
        // handling for spaces only cases
        this.trimPropertyFormGroupValues();
        if (this.externalPropertyFormGroup.valid) {
          this.openedModalRef?.close(this.SAVE);
        }
      });
  }

  openAddExternalPropertyModal(content: TemplateRef<NgbModal>, index: number = -1): void {
    const isEdit = index > -1;

    this.editMode$.next(isEdit);

    if (isEdit) {
      this.externalPropertyFormGroup.get(this.PROPERTY_NAME)?.setValue(this.externalProperties[index].propertyName);
      this.externalPropertyFormGroup.get(this.PROPERTY_VALUE)?.setValue(this.externalProperties[index].propertyValue);
      this.externalPropertyFormGroup.get(this.DESCRIPTION)?.setValue(this.externalProperties[index].description);
    }

    // uniqueness check for property name
    const ValidatorFn = isEdit  
      ? AlreadyExistValidator.isAlreadyExists(this.externalProperties.filter((v, i, a) => i != index).map(x => x.propertyName))
      : AlreadyExistValidator.isAlreadyExists(this.externalProperties.map(x => x.propertyName));
    this.externalPropertyFormGroup.get(this.PROPERTY_NAME)?.addValidators(ValidatorFn);
    this.externalPropertyFormGroup.updateValueAndValidity();

    this.openedModalRef = this.ngbModal.open(content, { size: 'md', backdrop: 'static', centered: true });

    this.openedModalRef.result.then((data) => {
      if (data === this.SAVE) {
        // edit existing property
        if (this.editMode$.getValue()) {
          this.externalProperties.splice(index, 1, this.externalPropertyFormGroup.value);
        }
        // add new property 
        else {
          this.externalProperties.push(this.externalPropertyFormGroup.value);
        }
        this.modify$.next(true);
      }
      // reset forms
      this.externalPropertyFormGroup.get(this.PROPERTY_NAME)?.removeValidators(ValidatorFn);
      this.externalPropertyFormGroup.reset();
      this.externalPropertyFormGroup.updateValueAndValidity();
    });
  }

  deleteExternalProperty(index: number): void {
    this.externalProperties.splice(index, 1);
    this.modify$.next(true);
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

  private setFormGroup() {
    this.externalPropertyFormGroup = this.formBuilder.group({});
    this.externalPropertyFormGroup.addControl(
      this.PROPERTY_NAME,
      new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]));
    this.externalPropertyFormGroup.addControl(
      this.PROPERTY_VALUE,
      new FormControl({ value: '', disabled: false }, [Validators.required, Validators.maxLength(500)]));
    this.externalPropertyFormGroup.addControl(
      this.DESCRIPTION,
      new FormControl({ value: '', disabled: false }, [Validators.maxLength(500)]));
  }

  private setValues(data: MasterProductAdvanceSettings) {
    if (data) {
      this.externalProperties = data.productExternalPropertyList as ExternalProperty[];
    }
  }

  private getMasterProductByWizard(wizardKey: string) {
    this.masterProductApiService.getProductWizard(wizardKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.masterProduct = this.masterProductService.wizardDataToMasterProduct(wizardKey, res.data);

            let settings = this.masterProduct!.masterProductAdvanceSettings;
            if (settings) {
              this.setValues(settings);
            }
            return;
          }
          this.parent.toastDanger(this.ERROR_GETTING_WIZARD_DATA);
        },
        error: () => {
          this.parent.toastDanger(this.ERROR_GETTING_WIZARD_DATA);
        }
      });
  }

  private getExternalPropertiesByProductId(productId: number) {
    this.masterProductApiService.getExternalPropertiesByProductId(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.externalProperties = res.data as ExternalProperty[];
            return;
          }
          this.parent.toastDanger(this.ERROR_GETTING_EXTERNAL_PROPERTIES);
        },
        error: () => {
          this.parent.toastDanger(this.ERROR_GETTING_EXTERNAL_PROPERTIES);
        }
      });
  }

  private getDefaultProductReverseLimit() {
    this.masterProductApiService.getProductReverseLimitByName(this.RESERVE_LIMIT_ALWAYS_CAN_REVERSED)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            const reverseLimits = data?.productReverseLimit?.items?.length > 0 
              ? data?.productReverseLimit?.items : [];
            if (reverseLimits.length == 1 && reverseLimits[0].reverseLimitId > 0) {
              this.reverseLimitId = reverseLimits[0].reverseLimitId;
              return;
            }
            if (reverseLimits.length > 1) {
              this.parent.toastDanger(this.DEFAULT_REVERSE_LIMIT_MORE_THAN_ONE);
              return;
            }
          }
          this.parent.toastDanger(this.DEFAULT_REVERSE_LIMIT_NOT_FOUND);
        },
        error: () => {
          this.parent.toastDanger(this.DEFAULT_REVERSE_LIMIT_NOT_FOUND);
        }
      });
  }

  private getProductReminder() {
    this.generalService.getDictionariesByCategory(this.PRODUCT_REMINDER)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success) {
            const data = JSON.parse(res.data);
            this.reminderId = data?.dictionaries?.length > 0 
              ? data?.dictionaries[0]?.dictionaryId : 0;
            if (this.reminderId && this.reminderId > 0) {
              return;
            }
          }
          this.parent.toastDanger(this.DEFAULT_REMINDER_NOT_FOUND);
        },
        error: () => {
          this.parent.toastDanger(this.DEFAULT_REMINDER_NOT_FOUND);
        }
      })
  }

  private subscribeProductService() {
    // stepper notification
    this.masterProductService.nextStep$
      .pipe(
        filter(step => step !== this.STEP),
        takeUntil(this.destroy$)
      ).subscribe(x => {
        this.onStepChange();
      });
  }

  private onStepChange() {
    if (this.parent.actionMode == ActionMode.Create &&
      this.masterProduct == null
    ) {
      this.toastAndThrowException(this.NO_MASTER_PRODUCT);
    }
    if (this.parent.actionMode == ActionMode.Create &&
      (this.masterProduct!.wizardKey == null || this.masterProduct!.wizardKey.length == 0)
    ) {
      this.toastAndThrowException(this.NO_WIZARD_KEY);
    }

    if (!this.isAllUnique(this.externalProperties.map(x => x.propertyName))) {
      this.parent.toastDanger(this.PROPERTY_NAME_NOT_UNIQUE);
      return;
    }

    // Create
    if (this.parent.actionMode == ActionMode.Create) {
      this.updateWizard();
      return;
    }
    // Edit
    this.updateExternalProperties();
  }

  private updateWizard() {
    const data = {
      productExternalPropertyList: this.externalProperties as ProductExternalPropertyObject[],
      productConditionDto: {
        reminderId: this.reminderId,
        reversalLimitId: this.reverseLimitId,
      } as ProductConditionDto
    } as MasterProductAdvanceSettings;

    this.masterProduct!.tenant = this.tenantConfigService.getTenant();
    this.masterProduct!.masterProductAdvanceSettings = data;
    this.masterProductService.pushMasterProduct(this.masterProduct!, this.STEP);
  }

  private updateExternalProperties() {
    this.externalProperties.forEach(x => x.description = x.description ?? '');
    const externalPropertyBody: ExternalPropertyBody = {
      productId: this.parent.productId,
      productExternalPropertyList: this.externalProperties
    }

    this.masterProductApiService.updateProductExternalProperty(externalPropertyBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.success || res.message === this.NO_CHANGE) {
            this.parent.notifyUpdateSuccess();
            return;
          }
          this.parent.toastDanger(`${this.UPDATE_FAILED} ${res.message}`);
        },
        error: (err) => {
          this.parent.toastDanger(this.UPDATE_FAILED);
        }
      });
  }

  private toastAndThrowException(msg: string) {
    this.parent.toastDanger(msg)
    throw new Error(msg);
  }

  private isAllUnique(values: string[]): boolean {
    let valueSet = new Set();
    values.forEach(x => valueSet.add(x));
    return values.length === valueSet.size;
  }

  private setExternalPropertiesByResponse(res: any) {
    const data = JSON.parse(res.data);
    let propertySets: any[] = (data?.products?.items?.length ?? 0) > 0
      ? ((data.products.items[0].productExternalProperties?.length ?? 0) > 0
        ? data.products.items[0].productExternalProperties[0].productExternalPropertySets
        : [])
      : [];
    if (propertySets?.length > 0) {
      this.externalProperties = propertySets.map(x => {
        return {
          productExternalPropertySetId: x.id,
          productExternalPropertyId: x.productExternalPropertyId,
          propertyName: x.propertyName,
          propertyValue: x.propertyValue,
          description: x.description,
        } as ExternalProperty;
      });
    }
  }

  private trimPropertyFormGroupValues() {
    this.trimFormControlValue(this.externalPropertyFormGroup.get(this.PROPERTY_NAME));
    this.trimFormControlValue(this.externalPropertyFormGroup.get(this.PROPERTY_VALUE));
    this.trimFormControlValue(this.externalPropertyFormGroup.get(this.DESCRIPTION));
  }

  private trimFormControlValue(control: AbstractControl | null) {
    if (control == null) return;
    const trimmedValue = control.value?.trim();
    control.setValue(trimmedValue);
  }
}
