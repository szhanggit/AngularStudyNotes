import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalProperty } from 'src/app/products/models/external-property';
import { ExternalPropertyBody } from 'src/app/products/models/external-property-body';
import { Product } from '../../../../models/product.model';
import { ProductService } from '../../../../../products/services/product.service';
import { GetSingleProductResp } from '../../../../models/get-single-product-response';
import { IDefineFormGroup } from 'src/app/products/models/define-form-group.model';
import { GeneralProductAdvanceSettingsFormGroup, ValueBasedAdvanceSettingsFormGroup } from 'src/app/products/models/product-form-group/product-advance-settings-form-group.model';
import { ProductType } from 'src/app/products/models/product-type.model';
import { PRODUCT_CONSTANTS } from 'src/app/products/constants/product-constants';
import { ProductCondition, ProductWizardStepFive } from 'src/app/products/models/product-wizard-dto.model';
import { NgbdToastGlobal, TxcDateTimeService } from '@txc-angular/component-library';
import { productDateRestrictionModel, productTimeRestrictionModel, productTimeRestrictionRequestModel, restrictionUpdateBodyModel } from 'src/app/products/models/product-restriction.model';
import { BehaviorSubject } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-edit-external-properties',
  templateUrl: './edit-external-properties.component.html',
  styleUrls: ['./edit-external-properties.component.scss']
})
export class EditExternalPropertiesComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  PRODUCT_UPDATED_ACTION = 'productUpdated';
  PRODUCT_ADVANCE_PANEL = 'productAdvance';

  product!: Product;
  selectedTenant: string = 'TW';
  selectedTenantUTCOffset: string = '+08:00';
  currentExternalProperties: ExternalProperty[] = [];
  selectedType!: ProductType;

  advanceSettingsFormGroupDefinitions: IDefineFormGroup[] = [
    new GeneralProductAdvanceSettingsFormGroup(),
    new ValueBasedAdvanceSettingsFormGroup()
  ]
  advanceSettingsFormGroup!: FormGroup;
  loadingAdvanceSetting$ = new BehaviorSubject<boolean>(true);
  actionLoading$ = new BehaviorSubject<boolean>(false);
  externalPropertyDirty = false;

  constructor(private _productSvc: ProductService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _router: Router,
    private readonly _formBuilder: FormBuilder,
    private _txcDateTimeService: TxcDateTimeService,
  ) { }

  get f(): any {
    return this.advanceSettingsFormGroup.controls;
  }

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
      this.selectedTenantUTCOffset = JSON.parse(tenantFromLocalStorage).currentUTCOffset;
    };
    this._activatedRoute.params.subscribe((params: any) => {
      this._productSvc.selectedProduct$.subscribe((product) => {
        if (!product) {
          this._productSvc.getProduct(parseInt(params.id));
          return;
        }
        this.product = product;
        this.selectedType = PRODUCT_CONSTANTS.PRODUCT_TYPE.find((productType: ProductType) => productType.key === this.product.productType) as ProductType;
        const advanceSettingsDefintion = this.advanceSettingsFormGroupDefinitions.find(f => f.productTypes?.includes(this.selectedType.key));
        if (advanceSettingsDefintion) {
          this.advanceSettingsFormGroup = advanceSettingsDefintion.define(this._formBuilder, false);
        }
        this._productSvc.getProductCondition(params.id).subscribe(res => {
          res.data.reversalLimitId = res.data.reverseLimitId!;
          this.advanceSettingsFormGroup.patchValue(res.data);
          this.loadingAdvanceSetting$.next(false)
          this._productSvc.getProductRestriction(params.id).subscribe(res => {
            // patching value for redemption days
            res.data?.productTimeRestrictionList?.filter(dataRes => dataRes.hours !== '')
              .forEach((dayEle, index) => {
                let hoursArray = dayEle.hours.split(';')
                let filteredHoursArray: string[] = []
                let startHour = ''
                let endHour = ''
                for (let i = 0; i < hoursArray.length; i++) {
                  let hour = hoursArray[i]
                  if (hour === '') {
                    continue
                  }
                  if (startHour === '') {
                    startHour = hour
                  } else if (parseInt(hour) - parseInt(endHour) > 1) {
                    filteredHoursArray.push(startHour + ';' + endHour)
                    startHour = hour
                  }
                  endHour = hour
                }
                filteredHoursArray.push(startHour + ';' + endHour)

                const redemptionDaysFA = this.advanceSettingsFormGroup.get('redemptionDays') as FormArray;
                filteredHoursArray.forEach((hours, hourIndex) => {
                  let [startTime, endTime] = hours.split(';')
                  startTime = startTime.length === 1 ? '0' + startTime + ':00' : startTime + ':00'
                  endTime = endTime.length === 1 ? '0' + endTime + ':59' : endTime + ':59'

                  if (index + hourIndex > 0) {
                    redemptionDaysFA.push(new FormGroup({
                      'redemptionDay': new FormControl({ value: dayEle.dayOfTheWeek, disabled: false }),
                      'redemptionFrom': new FormControl({ value: startTime, disabled: false }),
                      'redemptionTo': new FormControl({ value: endTime, disabled: false }),
                    }));
                  } else {
                    const newRedemptionDay = new FormGroup({
                      'redemptionDay': new FormControl({ value: dayEle.dayOfTheWeek, disabled: false }),
                      'redemptionFrom': new FormControl({ value: startTime, disabled: false }),
                      'redemptionTo': new FormControl({ value: endTime, disabled: false }),
                    });
                    redemptionDaysFA.setControl(0, newRedemptionDay);
                  }
                });
            });
            // patching value for redemption exclude dates
            res.data?.productDateRestrictionList?.map((dateEle, index) => {
              const localDate = this._txcDateTimeService.getLocalDateTime(dateEle.blackDate);
              const redemptionExcludeDatesFA = this.advanceSettingsFormGroup.get('redemptionExcludeDates') as FormArray
              if (index > 0) {
                redemptionExcludeDatesFA.push(new FormGroup({
                  'redemptionExcludeDate': new FormControl({ value: new NgbDate(new Date(localDate).getFullYear(), new Date(localDate).getMonth() + 1, new Date(localDate).getDate()), disabled: false }),
                }));
              } else {
                redemptionExcludeDatesFA.controls[0].patchValue({
                  redemptionExcludeDate: new NgbDate(new Date(localDate).getFullYear(), new Date(localDate).getMonth() + 1, new Date(localDate).getDate())
                });
              }
            });
            this.advanceSettingsFormGroup.markAsPristine()
          });
        }, () => {
          this.toast.showDanger('Error while loading product condition data. Please try again later.')
        });
        this._productSvc.getProductExternalProperty(params.id).subscribe(res => {
          this.currentExternalProperties = res.data
          this.advanceSettingsFormGroup.patchValue({ productExternalPropertyList : res.data })
        });
      }, () => {
        this.toast.showDanger('Error while loading product advanced settings. Please try again later.')
      });
    });
  }

  getOffsetInMin(utcOffset: string) {
    const [sign, hours, minutes] = utcOffset.match(/^([+-])(\d{2}):?(\d{2})$/)?.slice(1) || [];
    return sign === '-' ? -(+hours * 60 + +minutes) : +hours * 60 + +minutes;
  }

  formatData(date: Date) :string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = (date.getDate().toString().padStart(2, '0'));
    const hours = (date.getHours()).toString().padStart(2, '0');
    const minutes = (date.getMinutes()).toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  OnExternalPropertyChanged(externalProperties: ExternalProperty[]) {
    this.currentExternalProperties = externalProperties;
    this.externalPropertyDirty = true;
    this.advanceSettingsFormGroup.markAsDirty();
  }

  navigateBackToProductDetails() {
    this._router.navigateByUrl(`products/${this.product.productId}`);
  }

  generateTimeRestrictionList(lists: productTimeRestrictionModel[]) {
    const productTimeRestrictionList: productTimeRestrictionRequestModel[] = []
    const dayWeeks = [0, 1, 2, 3, 4, 5, 6];

    dayWeeks.forEach((day: number) => {
      //here it iterates thorugh lists and if it finds more than one object with the same redemptionDay property value,
      //it will modify the existing object in the productTimeRestrictionList instead of creating a new one
      let matchIndices: number[] = [];
      lists.forEach((weekDay, index) => {
        if (weekDay.redemptionDay === day) {
          matchIndices.push(index);
        }
      });

      if (matchIndices.length > 0) {
        let hours: number[] = [];
        matchIndices.forEach((index) => {
          let redemptionFrom = Number.parseFloat(lists[index].redemptionFrom);
          let redemptionTo = Number.parseFloat(lists[index].redemptionTo);
          for (let hour = redemptionFrom; hour <= redemptionTo; hour++) {
            if (!hours.includes(hour)) {
              hours.push(hour);
            }
          }
        });

        hours = hours.sort((a, b) => a - b)

        const obj: productTimeRestrictionRequestModel = {
          dayOfTheWeek: day,
          hours: hours.join(';') + ';',
          productRedeemTimeRestrictionId: 0,
          productRedeemTimeRestrictionSetId: 0
        };
        productTimeRestrictionList.push(obj);
      } else {
        const obj: productTimeRestrictionRequestModel = {
          dayOfTheWeek: day,
          hours: '',
          productRedeemTimeRestrictionId: 0,
          productRedeemTimeRestrictionSetId: 0
        };
        productTimeRestrictionList.push(obj);
      }
    });
    return productTimeRestrictionList;
  }

  generateDateRestrictionList(datesObj: productDateRestrictionModel[]) {
    if(datesObj.length > 0) {
      const productDateRestrictionList = datesObj?.filter(exludeDate => exludeDate.redemptionExcludeDate !== null)
      .map((date) => {
        let ngbDate = date.redemptionExcludeDate;
        // the date needs to be send to db according to selected Tenant timezone, not user local timezone
        const localDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
        const localDateOffset = localDate.getTimezoneOffset();
        const tenantUTCOffset = this.getOffsetInMin(this.selectedTenantUTCOffset);
        const timeDiff = tenantUTCOffset + localDateOffset;
        const correctDate = new Date(localDate.setMinutes(localDate.getMinutes() + localDateOffset - timeDiff))
        return this.formatData(correctDate);
      })
      return productDateRestrictionList;
    } else {
      return [];
    }
  }

  saveAdvanceSettingsData(): void {
    let dirtyControls = 0;
    const formData = this.advanceSettingsFormGroup.getRawValue();

    const restrictionBody: restrictionUpdateBodyModel = {
      productId: this.product.productId,
      timeRestrictionList: this.generateTimeRestrictionList(formData.redemptionDays),
      redeemDateBlacklist: this.generateDateRestrictionList(formData.redemptionExcludeDates)
    }

    const externalPropertyBody: ExternalPropertyBody = {
      productId: this.product.productId,
      productExternalPropertyList: this.currentExternalProperties
    }
    const conditionBody: ProductCondition = new ProductWizardStepFive(this.advanceSettingsFormGroup.getRawValue()).productConditionDto;
    const conditionFormData: any = new FormData();
    conditionFormData.append('ProductId', this.product.productId);
    conditionFormData.append('MinRedeemQuantity', conditionBody.minRedeemQuantity);
    if (conditionBody.maxIssuingQuantity)  {
      conditionFormData.append('MaxIssuingQuantity', conditionBody.maxIssuingQuantity);
    }
    conditionFormData.append('ReverseLimitId', conditionBody.reversalLimitId);
    conditionFormData.append('PreAuthorizationExpiryInterval', conditionBody.preAuthorizationExpiryInterval);
    conditionFormData.append('PreAuthorizationExpiryUnit', conditionBody.preAuthorizationExpiryUnit);
    conditionFormData.append('ReminderId', conditionBody.reminderId);
    conditionFormData.append('useTimeControl', conditionBody.useTimeControl);
    conditionFormData.append('useTimeControlInterval', conditionBody.useTimeControlInterval)

    if (this.f.minRedeemQuantity.dirty || this.f.maxIssuingQuantity.dirty || this.f.reminderId.dirty || this.f.reversalLimitId.dirty ||
      this.f.preAuthorizationExpiryUnit.dirty || this.f.preAuthorizationExpiryInterval.dirty
      || this.f.useTimeControl?.dirty || this.f.useTimeControlInterval?.dirty) {
      this.actionLoading$.next(true);
      dirtyControls++;
      this._productSvc.updateProductCondition(conditionFormData).subscribe(res => {
        if (res.success) {
          dirtyControls--;
          this.advanceSettingsFormGroup.markAsPristine();
          this.actionLoading$.next(false);

          if (!dirtyControls) {
            this.navigateToProductDetailsWithToast();
          }
        } else {
          this.toast.showDanger(res.message);
          this.actionLoading$.next(false);
        }
      }, () => {
        this.toast.showDanger('Error while updating product condition data. Please try again later.');
        this.actionLoading$.next(false);
      })
    }

    if (this.f.redemptionDays.dirty || this.f.redemptionExcludeDates.dirty) {
      this.actionLoading$.next(true);
      dirtyControls++;
      this._productSvc.updateProductRestriction(restrictionBody).subscribe(res => {
        if (res.success) {
          dirtyControls--;
          this.advanceSettingsFormGroup.markAsPristine();
          this.actionLoading$.next(false);

          if (!dirtyControls) {
            this.navigateToProductDetailsWithToast();
          }
        } else {
          this.toast.showDanger(res.message);
          this.actionLoading$.next(false);
        }
      }, () => {
        this.toast.showDanger('Error while updating product restriction data. Please try again later.');
        this.actionLoading$.next(false);
      })
    }

    if (this.externalPropertyDirty) {
      this.actionLoading$.next(true);
      dirtyControls++;
      this._productSvc.updateProductExternalProperty(externalPropertyBody).subscribe(res => {
        if (res.success) {
          dirtyControls--;
          this.externalPropertyDirty = false;
          this.actionLoading$.next(false);

          if (!dirtyControls) {
            this.navigateToProductDetailsWithToast();
          }
        } else {
          this.toast.showDanger(res.message);
          this.actionLoading$.next(false);
        }
      }, () => {
        this.toast.showDanger('Error while updating product external properties. Please try again later.');
        this.actionLoading$.next(false);
      })
    }
  }

  navigateToProductDetailsWithToast() {
    this._router.navigate([`/products/${this.product.productId}`], {
      state: {
        action: this.PRODUCT_UPDATED_ACTION,
        panel: this.PRODUCT_ADVANCE_PANEL,
        message: `${this.product.productName} updated successfully`
      }
    });
  }

  checkForRedemptionDayDuplicates(redemptionDays: productTimeRestrictionModel[]) {
    let redemptionArr = redemptionDays.map(element => element.redemptionDay);
    let isDuplicate = redemptionArr.some((redemption, idx) => redemptionArr.indexOf(redemption) !== idx);
    return isDuplicate;
  }
}
