import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Dictionary } from 'src/app/products/models/dictionary.model';
import { DictionaryService } from 'src/app/products/services/dictionary.service';
import { ExternalProperty } from '../../../models/external-property';
import { ProductCustomizationService } from '../../../services/product-customization.service';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { ProductType } from 'src/app/products/models/product-type.model';
import { Select2Data } from 'ng-select2-component';
import { BehaviorSubject, forkJoin, ReplaySubject, takeUntil } from 'rxjs';
import { ProductService } from 'src/app/products/services/product.service';
import { ReverseLimit } from 'src/app/products/models/reverselimit.model';
import { PRODUCT_CONSTANTS } from 'src/app/products/constants/product-constants';

@Component({
  selector: 'app-product-properties',
  templateUrl: './product-properties.component.html',
  styleUrls: ['./product-properties.component.scss']
})
export class ProductPropertiesComponent implements OnInit, OnDestroy {
  @Input() toast!: NgbdToastGlobal;
  @Input() selectedTenant!: string;
  @Input() selectedType!: ProductType;
  @Input() selectedExternalProperties: ExternalProperty[] = [];
  @Input() advanceSettingsFormGroup!: FormGroup;
  @Output() onExternalPropertiesChanged = new EventEmitter<ExternalProperty[]>();
  @Input() editMode: boolean = false;
  editModeForProperties: boolean = false;

  WALLETIMAGEPROPERTY = PRODUCT_CONSTANTS.WALLET_IMAGE1_KEY;

  loading$ = new BehaviorSubject<boolean>(true);
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  minDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };

  externalPropertyFormGroup!: FormGroup;
  remindersSelect2Data: Select2Data = [];
  reversalLimitsSelect2Data: Select2Data = [];
  preAuthorizationIntervalsSelect2Data: Select2Data = [
    {
      value: 3,
      label: 'Minutes'
    },
    {
      value: 1,
      label: 'Hours'
    },
    {
      value: 2,
      label: 'Days'
    },
  ];

  redemptionDays: Select2Data = [
    {
      value: 0,
      label: 'Sunday',
    }, {
      value: 1,
      label: 'Monday',
    }, {
      value: 2,
      label: 'Tuesday',
    }, {
      value: 3,
      label: 'Wednesday',
    }, {
      value: 4,
      label: 'Thursday',
    }, {
      value: 5,
      label: 'Friday',
    }, {
      value: 6,
      label: 'Saturday',
    },
  ]

  redemptionFrom: Select2Data = [
    { value: 0, label: '00:00' },
    { value: 1, label: '01:00' },
    { value: 2, label: '02:00' },
    { value: 3, label: '03:00' },
    { value: 4, label: '04:00' },
    { value: 5, label: '05:00' },
    { value: 6, label: '06:00' },
    { value: 7, label: '07:00' },
    { value: 8, label: '08:00' },
    { value: 9, label: '09:00' },
    { value: 10, label: '10:00' },
    { value: 11, label: '11:00' },
    { value: 12, label: '12:00' },
    { value: 13, label: '13:00' },
    { value: 14, label: '14:00' },
    { value: 15, label: '15:00' },
    { value: 16, label: '16:00' },
    { value: 17, label: '17:00' },
    { value: 18, label: '18:00' },
    { value: 19, label: '19:00' },
    { value: 20, label: '20:00' },
    { value: 21, label: '21:00' },
    { value: 22, label: '22:00' },
    { value: 23, label: '23:00' },
  ];

  redemptionTo: Select2Data = [
    { value: 0, label: '00:59' },
    { value: 1, label: '01:59' },
    { value: 2, label: '02:59' },
    { value: 3, label: '03:59' },
    { value: 4, label: '04:59' },
    { value: 5, label: '05:59' },
    { value: 6, label: '06:59' },
    { value: 7, label: '07:59' },
    { value: 8, label: '08:59' },
    { value: 9, label: '09:59' },
    { value: 10, label: '10:59' },
    { value: 11, label: '11:59' },
    { value: 12, label: '12:59' },
    { value: 13, label: '13:59' },
    { value: 14, label: '14:59' },
    { value: 15, label: '15:59' },
    { value: 16, label: '16:59' },
    { value: 17, label: '17:59' },
    { value: 18, label: '18:59' },
    { value: 19, label: '19:59' },
    { value: 20, label: '20:59' },
    { value: 21, label: '21:59' },
    { value: 22, label: '22:59' },
    { value: 23, label: '23:59' },
  ];

  // form
  get f(): any {
    return this.advanceSettingsFormGroup.controls;
  }

  get fm(): any {
    return this.externalPropertyFormGroup.controls;
  }


  // redemptionDayControl
  public getValueSpecificRedemptionDayControl(index: number): any {
    const redemptionDaysControl = <FormArray>this.advanceSettingsFormGroup.controls['redemptionDays'];
    const redemptionDaysControlFG = <FormGroup>redemptionDaysControl.controls[index];
    return redemptionDaysControlFG.controls['redemptionDay'].value;
  }

  constructor(public productCustomizationSvc: ProductCustomizationService,
    private readonly _dictionaryService: DictionaryService,
    private readonly _formBuilder: FormBuilder,
    private readonly _modalSvc: NgbModal,
    private readonly _productService: ProductService) { }

  ngOnInit(): void {
    this.externalPropertyFormGroup = this._formBuilder.group({
      propertyName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      propertyValue: new FormControl({ value: '', disabled: false }, [Validators.required]),
      description: new FormControl({ value: '', disabled: false }),
    });

    forkJoin(
      this._dictionaryService.getDictionaryItemsByCategory('ProductReminder'),
      this._productService.getProductReverseLimit()).
      pipe(
        takeUntil(this.destroyed$)).
      subscribe(([res1, res2]) => {
        this.remindersSelect2Data = JSON.parse(res1.data).dictionaries.map((dictionary: Dictionary) => { return { value: dictionary.dictionaryId, label: dictionary.name } });
        this.reversalLimitsSelect2Data = JSON.parse(res2.data).productReverseLimit?.items?.map((reverseLimit: ReverseLimit) => { return { value: reverseLimit.reverseLimitId, label: reverseLimit.name } });

        Promise.all([this.remindersSelect2Data, this.reversalLimitsSelect2Data]).then(
          () => {
            const reminderControl = this.advanceSettingsFormGroup.get('reminderId');
            const reversalLimitControl = this.advanceSettingsFormGroup.get('reversalLimitId');
            if (!reminderControl?.value) {
              const defaultValue = (this.remindersSelect2Data[0] as ({value: number})).value;
              reminderControl?.setValue(defaultValue);
            }
            if (!reversalLimitControl?.value) {
              reversalLimitControl?.setValue(2)
            }
          }
        );
      },
        () => {
          this.toast.showDanger('Error loading dropdown values. Please try again later.');
        }, () => {
          this.loading$.next(false);
        });
    if (this.f.redemptionDays) {
      this.f.redemptionDays.valueChanges.subscribe((value: any) => {
        value?.map((ele: any, index: any) => {
          if (ele.redemptionFrom === '' || ele.redemptionTo === '') {
            (<FormArray>this.advanceSettingsFormGroup.get('redemptionDays')).controls[index].setErrors({ 'required' : true });
          }
          if (ele.redemptionFrom > ele.redemptionTo) {
            (<FormArray>this.advanceSettingsFormGroup.get('redemptionDays')).controls[index].setErrors({ 'incorrect' : true });
          }
        })
      });
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private createRedemptionDays(): FormGroup {
    return new FormGroup({
      'redemptionDay': new FormControl(null, { validators: [Validators.required]}),
      'redemptionFrom': new FormControl({ value: '', disabled: false }),
      'redemptionTo': new FormControl({ value: '', disabled: false }),
    });
  }

  public addRedemptionDays() {
    const redemptionDays = this.advanceSettingsFormGroup.get('redemptionDays') as FormArray
    redemptionDays.push(this.createRedemptionDays())
    this.advanceSettingsFormGroup.get('redemptionDays')?.markAsDirty();
  }

  public removeRedemptionDays(i: number) {
    const redemptionDays = this.advanceSettingsFormGroup.get('redemptionDays') as FormArray
    if (redemptionDays.length > 1) {
      redemptionDays.removeAt(i)
      this.advanceSettingsFormGroup.get('redemptionDays')?.markAsDirty();
    } else {
      redemptionDays.reset()
    }
  }

  private createRedemptionExcludeDates(): FormGroup {
    return new FormGroup({
      'redemptionExcludeDate': new FormControl({ value: null, disabled: false }),
    });
  }

  public addRedemptionExcludeDates() {
    const redemptionExcludeDates = this.advanceSettingsFormGroup.get('redemptionExcludeDates') as FormArray
    redemptionExcludeDates.push(this.createRedemptionExcludeDates())
    this.advanceSettingsFormGroup.get('redemptionExcludeDates')?.markAsDirty();
  }

  public removeRedemptionExcludeDates(i: number) {
    const redemptionExcludeDates = this.advanceSettingsFormGroup.get('redemptionExcludeDates') as FormArray
    if (redemptionExcludeDates.length > 1) {
      redemptionExcludeDates.removeAt(i)
      this.advanceSettingsFormGroup.get('redemptionExcludeDates')?.markAsDirty();
    } else {
      redemptionExcludeDates.reset()
    }
  }

  openAddExternalPropertyModal(content: TemplateRef<NgbModal>, type: string, index: number = 0): void {
    if (type === 'edit') {
      this.externalPropertyFormGroup.controls['propertyName'].setValue(this.selectedExternalProperties[index].propertyName);
      this.externalPropertyFormGroup.controls['propertyValue'].setValue(this.selectedExternalProperties[index].propertyValue);
      this.externalPropertyFormGroup.controls['description'].setValue(this.selectedExternalProperties[index].description);
      this.editModeForProperties = true;
    }

    const modalRef = this._modalSvc.open(content, { size: 'md', backdrop: 'static', centered: true });

    modalRef.result.then((data) => {
      if (data === 'Save') {
        if (this.editModeForProperties) {
          this.selectedExternalProperties.splice(index, 1, this.externalPropertyFormGroup.getRawValue());
          this.editModeForProperties = false;
        } else {
          this.selectedExternalProperties.push(this.externalPropertyFormGroup.getRawValue());
        }
        this.externalPropertyFormGroup.reset();
        this.onExternalPropertiesChanged.emit(this.selectedExternalProperties);
        this.f.productExternalPropertyList.setValue(this.selectedExternalProperties);
      } else {
        this.editModeForProperties = false;
        this.externalPropertyFormGroup.reset();
      }
    })
  }

  deleteExternalProperty(index: number): void {
    this.selectedExternalProperties.splice(index, 1);
    this.onExternalPropertiesChanged.emit(this.selectedExternalProperties);
    this.f.productExternalPropertyList.setValue(this.selectedExternalProperties);
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }
}
