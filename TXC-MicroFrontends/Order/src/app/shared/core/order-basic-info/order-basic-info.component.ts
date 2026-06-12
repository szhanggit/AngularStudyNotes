import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormModel } from '../../models/dumb-models/form.model';
import { InputModel } from '../../models/dumb-models/input.model';
import { OrderBasicInfoFieldsDefinition } from '../../models/fields-definition/order-basic-info-fields-definition.model';
import { Subject, distinctUntilChanged } from 'rxjs';
import { ActivationTypeEnum } from '../../enums/activation-type.enum';
import { DatePipe } from '@angular/common';
import { DatepickerModel } from '../../models/dumb-models/datepicker.model';
import { WizardService } from 'src/app/order/services/wizard.service';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { SelectedOrderMode } from 'src/app/order/interface/quotation-state.interface';
@Component({
  selector: 'app-order-basic-info',
  templateUrl: './order-basic-info.component.html',
  styleUrls: ['./order-basic-info.component.scss'],
})
export class OrderBasicInfoComponent implements OnInit, OnDestroy {
  @Input() basicInfoFormGroup!: FormGroup;
  @Output() formInvalid: EventEmitter<boolean> = new EventEmitter<boolean>();
  orderBasicInfoFieldsDefinition!: OrderBasicInfoFieldsDefinition;
  datePickerIconClass: string = 'mdi mdi-clock-time-three-outline timer_icon';
  destroyed$: Subject<boolean> = new Subject<boolean>();

  specificOrderTimeDropdown = [
    {
      label: 'Same as publish date',
      value: 1,
    },
    {
      label: 'n days from publish date',
      value: 2,
    },
    {
      label: 'Fixed of date',
      value: 3,
    },
    {
      label: 'Inactive',
      value: 4,
    },
  ];

  noSpecificOrderTimeDropdown = this.specificOrderTimeDropdown.filter(
    (v) => v.value !== 3
  );

  get basicInfoFormModel(): FormModel {
    return {
      title: 'Basic info',
      formGroup: this.basicInfoFormGroup,
      fieldsDefinition: this.orderBasicInfoFieldsDefinition.define(),
    };
  }

  get publishDate() {
    return this.basicInfoFormGroup.get('publishDate');
  }

  get hasNoTargetPublishDate() {
    return this.basicInfoFormGroup.get('hasNoTargetPublishDate');
  }

  get activationType() {
    return this.basicInfoFormGroup.get('activationType');
  }

  get activationDate() {
    return this.basicInfoFormGroup.get('activationDate');
  }

  get afterPublished() {
    return this.basicInfoFormGroup.get('afterPublished');
  }

  constructor(
    private datePipe: DatePipe,
    private wizardService: WizardService,
    private quotationStateService: QuotationStateService
  ) {}
  ngOnInit(): void {
    this.quotationStateService.selectedOrderMode$.subscribe((orderMode) => {
      this.orderBasicInfoFieldsDefinition = new OrderBasicInfoFieldsDefinition(
        orderMode
      );
      this.listenToHasNoTargetPublishDate(orderMode);
      this.hasNoTargetPublishDateCheck(
        this.hasNoTargetPublishDate?.value,
        orderMode,
        false
      );
    });

    this.listenToDateInput();
    this.listenToActivationType();
    this.listenToTargetPublishDate();
    this.initializeBasicInfoControlState();
    this.wizardService.checkFormValidation(
      this.basicInfoFormGroup,
      this.formInvalid,
      this.destroyed$
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private listenToActivationType() {
    this.activationType?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: number) => {
        this.resetDateControl();

        switch (value) {
          case ActivationTypeEnum.SameAsPublishDate: {
            this.activationDate?.setValue(this.publishDate?.value);
            this.hideActivationDateControl(false);
            break;
          }

          case ActivationTypeEnum.NDaysFromPublishDate: {
            this.afterPublished?.enable();
            this.hideActivationDateControl(true);
            this.computeActivationDatePreview(this.afterPublished?.value);
            break;
          }

          case ActivationTypeEnum.Inactive: {
            this.afterPublished?.setValue(null);
            this.hideActivationDateControl(false);
            break;
          }

          case ActivationTypeEnum.FixedOfDate: {
            this.activationDate?.enable();
            this.hideActivationDateControl(false);
            this.customMinDate(value);
            break;
          }

          default: {
            this.hideActivationDateControl(false);
            break;
          }
        }
      });
  }

  private listenToTargetPublishDate() {
    this.publishDate?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        switch (this.activationType?.value) {
          case ActivationTypeEnum.SameAsPublishDate: {
            this.activationDate?.setValue(value);
            break;
          }
          case ActivationTypeEnum.NDaysFromPublishDate: {
            this.computeActivationDatePreview(this.activationType?.value);
            break;
          }
          case ActivationTypeEnum.FixedOfDate: {
            this.customMinDate(this.activationType?.value);
            break;
          }
          default: {
            break;
          }
        }
      });
  }

  private listenToHasNoTargetPublishDate(orderMode: SelectedOrderMode) {
    this.hasNoTargetPublishDate?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: boolean) => {
        this.hasNoTargetPublishDateCheck(value, orderMode, true);
      });
  }

  private hasNoTargetPublishDateCheck(
    value: boolean,
    orderMode: SelectedOrderMode,
    reset: boolean
  ) {
    if (value) {
      this.assignFieldDefValue('publishDate', 'datepickerType', 'calendar');
      this.assignFieldDefValue('activationDate', 'datepickerType', 'calendar');
      this.assignFieldDefValue(
        'activationType',
        'select2Data',
        this.noSpecificOrderTimeDropdown
      );
    } else {
      this.assignFieldDefValue('publishDate', 'datepickerType', 'both');
      this.assignFieldDefValue('activationDate', 'datepickerType', 'both');
      this.assignFieldDefValue(
        'activationType',
        'select2Data',
        this.specificOrderTimeDropdown
      );
    }

    if (
      this.activationType?.value === ActivationTypeEnum.NDaysFromPublishDate
    ) {
      this.computeActivationDatePreview(this.activationType?.value);
    }

    if (reset) {
      this.disableDateControls(value);
      this.activationType?.setValue(null);
      if (
        orderMode.key === OrderModeEnum.API ||
        orderMode.key === OrderModeEnum.PaperVoucher
      ) {
        this.assignFieldDefValue('activationDate', 'hidden', true);
        this.activationDate?.disable();
        this.activationType?.disable();
      }
    }
  }

  private listenToDateInput() {
    this.afterPublished?.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value: string) => {
        this.computeActivationDatePreview(value);
      });
  }

  private initializeBasicInfoControlState() {
    if (
      this.activationType?.value === ActivationTypeEnum.NDaysFromPublishDate
    ) {
      this.hideActivationDateControl(true);
    }
  }

  private assignFieldDefValue(
    formControlName: string,
    inputModel: keyof InputModel,
    inputModelValue: any
  ) {
    const field = this.basicInfoFormModel.fieldsDefinition.find(
      (field: InputModel) => field.formControlName === formControlName
    ) as any;

    if (field) {
      field[inputModel] = inputModelValue;
    }
  }

  private computeActivationDatePreview(value: string) {
    const parsedValue = parseInt(value);

    if (!this.publishDate?.value || !parsedValue) {
      this.assignFieldDefValue('afterPublished', 'preview', '');
      return;
    }

    const date = new Date(this.publishDate?.value);
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + parsedValue,
      date.getHours(),
      date.getMinutes()
    );
    const format = this.hasNoTargetPublishDate?.value
      ? 'YYYY/MM/dd'
      : 'YYYY/MM/dd hh:mm a';
    const previewValue = this.datePipe.transform(newDate, format);

    if (!previewValue) return;
    this.assignFieldDefValue('afterPublished', 'preview', previewValue);
  }

  private customMinDate(value: number): void {
    if (value === ActivationTypeEnum.FixedOfDate) {
      const activationDate = this.basicInfoFormModel.fieldsDefinition.find(
        (field: InputModel) => field.formControlName === 'activationDate'
      )! as DatepickerModel;
      const targetPublishDateValue = this.publishDate?.value;

      if (!targetPublishDateValue) {
        activationDate.customMinDate = false;
        return;
      }

      activationDate.customMinDate = true;
      const date = new Date(this.publishDate?.value);
      if (activationDate.datepickerType === 'calendar') {
        activationDate.minDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
      } else {
        activationDate.minDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        );
      }
    }
  }

  private resetDateControl(): void {
    this.activationDate?.setValue(null);
    this.activationDate?.disable();

    this.afterPublished?.setValue(null);
    this.afterPublished?.disable();
  }

  private hideActivationDateControl(hide: boolean): void {
    this.assignFieldDefValue('activationDate', 'hidden', hide);
    this.assignFieldDefValue('afterPublished', 'hidden', !hide);

    if (hide) {
      this.activationDate?.setValidators(null);
      this.afterPublished?.setValidators([
        Validators.required,
        Validators.pattern(/^[1-9]\d*$/),
        Validators.min(1),
      ]);
    } else {
      this.activationDate?.markAsPristine();
      this.afterPublished?.markAsPristine();
      this.activationDate?.setValidators(Validators.required);
      this.afterPublished?.setValidators(null);
    }
  }

  private disableDateControls(disable: boolean): void {
    if (disable) {
      this.publishDate?.setValue(null);
      this.publishDate?.setValidators(null);
      this.publishDate?.disable();
      this.publishDate?.markAsUntouched();
      this.publishDate?.markAsPristine();

      this.activationDate?.setValue(null);
      this.activationDate?.setValidators(null);
      this.activationDate?.disable();
      this.activationDate?.markAsUntouched();
      this.activationDate?.markAsPristine();
    } else {
      this.publishDate?.setValidators(Validators.required);
      this.publishDate?.enable();

      this.activationDate?.setValidators(Validators.required);
      this.activationDate?.enable();
    }
  }
}
