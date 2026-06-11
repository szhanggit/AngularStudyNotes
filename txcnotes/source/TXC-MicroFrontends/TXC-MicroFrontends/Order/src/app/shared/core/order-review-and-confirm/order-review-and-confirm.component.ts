import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormModel } from '../../models/dumb-models/form.model';
import { OrderBasicInfoFieldsDefinition } from '../../models/fields-definition/order-basic-info-fields-definition.model';
import { OrderSettingsFieldsDefinition } from '../../models/fields-definition/order-settings-fields-definition.model';
import { OrderMemoFieldsDefinition } from '../../models/fields-definition/order-memo-fields-definition.model';
import { OrderAttachmentFieldsDefinition } from '../../models/fields-definition/order-attachment-fields-definition.model';
import { Product } from '../../models/product.model';
import { ProductSelectionTableDefinition } from '../../models/table-definition/product-selection-table-definition.model';
import { DatePipe } from '@angular/common';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { DeliveryDetailsFieldsDefinition } from '../../models/fields-definition/delivery-details-fields-definition.model';
import { WizardService } from 'src/app/order/services/wizard.service';
import { ORDER_CONSTANTS } from 'src/app/order/constants/order-constants';
import { DictionaryService } from 'src/app/order/services/dictionary.service';
import { Subject, map, takeUntil } from 'rxjs';
import { Dictionary } from 'src/app/order/models/dictionary.model';
import { EmailTemplateOption } from 'src/app/order/interface/product-state.interface';
import { EmailTemplateStateService } from 'src/app/order/services/state-service/email-template-state.service';

@Component({
  selector: 'app-order-review-and-confirm',
  templateUrl: './order-review-and-confirm.component.html',
  styleUrls: ['./order-review-and-confirm.component.scss'],
})
export class OrderReviewAndConfirmComponent implements OnInit, OnChanges {
  @Input() basicInfoFormGroup!: FormGroup;
  @Input() settingsFormGroup!: FormGroup;
  @Input() memoFormGroup!: FormGroup;
  @Input() attachmentFormGroup!: FormGroup;
  @Input() deliveryDetailsFormGroup!: FormGroup;
  @Input() productList!: Product[];
  @Input() estimatedTotal!: number;
  @Output() jumpToStep: EventEmitter<number> = new EventEmitter<number>();
  orderReferenceCollapsed!: boolean;
  basicPropertiesCollapsed!: boolean;
  takeAllRow: boolean = true;
  showChildProduct: boolean = false;
  disableEditOnTrustAccount: boolean = true;

  totalProductQuantity: number = 0;
  totalVoucherQuantity: number = 0;
  totalEmailQuantity: number = 0;
  totalSmsQuantity: number = 0;

  computedActivatedDate!: string;
  nDaysFromPublishDate!: string;

  orderBasicInfoFieldsDefinition: OrderBasicInfoFieldsDefinition =
    new OrderBasicInfoFieldsDefinition();

  settingsFieldsDefinition!: OrderSettingsFieldsDefinition;

  memoFieldsDefinition: OrderMemoFieldsDefinition =
    new OrderMemoFieldsDefinition(this.takeAllRow);

  attachmentFieldsDefinition: OrderAttachmentFieldsDefinition =
    new OrderAttachmentFieldsDefinition();

  deliveryDetailsFieldsDefinition!: DeliveryDetailsFieldsDefinition;

  selectedOrderMode!: OrderMode;
  orderModes = OrderModeEnum;

  destroyed$: Subject<boolean> = new Subject<boolean>();
  disableChildToggle: boolean = false;

  get deliveryDetailsFormModel(): FormModel {
    return {
      formGroup: this.deliveryDetailsFormGroup,
      fieldsDefinition: this.deliveryDetailsFieldsDefinition.define(),
    };
  }

  get productSelectionTableModel() {
    return new ProductSelectionTableDefinition(this.selectedOrderMode).define();
  }

  get basicInfoFormModel(): FormModel {
    return {
      title: 'Basic Info',
      formGroup: this.basicInfoFormGroup,
      fieldsDefinition: this.orderBasicInfoFieldsDefinition.define(),
    };
  }

  get settingsFormModel(): FormModel {
    return {
      title: 'Settings',
      formGroup: this.settingsFormGroup,
      fieldsDefinition: this.settingsFieldsDefinition.define(),
    };
  }

  get memoFormModel(): FormModel {
    return {
      title: 'Memo',
      formGroup: this.memoFormGroup,
      fieldsDefinition: this.memoFieldsDefinition.define(),
    };
  }

  get attachmentFormModel(): FormModel {
    return {
      title: 'Attachment',
      formGroup: this.attachmentFormGroup,
      fieldsDefinition: this.attachmentFieldsDefinition.define(),
    };
  }

  get hasDeliveryDetailStep() {
    return (
      this.wizardService.getWizardSteps(this.selectedOrderMode) ===
      ORDER_CONSTANTS.WIZARD_STEPS.FOUR_STEPS
    );
  }

  constructor(
    private datePipe: DatePipe,
    private quotationStateService: QuotationStateService,
    private emailTemplateStateService: EmailTemplateStateService,
    private wizardService: WizardService,
    private dictionaryService: DictionaryService
  ) {}

  ngOnInit() {
    this.setSelectedQuotationType();
    this.setEmailTemplateOptions();
    this.orderBasicInfoFieldsDefinition = new OrderBasicInfoFieldsDefinition(
      this.selectedOrderMode
    );
    this.settingsFieldsDefinition = new OrderSettingsFieldsDefinition(
      this.selectedOrderMode
    );

    this.dictionaryService
      .getChannels()
      .pipe(
        takeUntil(this.destroyed$),
        map((response) => JSON.parse(response.data).dictionaries)
      )
      .subscribe({
        next: (dictionaries: Dictionary[]) => {
          const channelSelect2Data = dictionaries.map((dictionary) => ({
            label: dictionary.displayName,
            value: dictionary.dictionaryId,
          }));

          this.settingsFormModel.fieldsDefinition.find(
            (field) => field.formControlName === 'channelId'
          )!.select2Data = channelSelect2Data;
        },
      });

    // checking for master product code
    if (!this.productList?.some((list) => list.isMaster)) {
      this.showChildProduct = false;
      this.disableChildToggle = true;
    }
  }

  ngOnChanges() {
    this.assignSelectedProductsSummaryValues();
  }

  setEmailTemplateOptions() {
    this.emailTemplateStateService.selectedEmailTemplates$.subscribe(
      (templates) => {
        this.deliveryDetailsFieldsDefinition =
          new DeliveryDetailsFieldsDefinition(
            templates.map((template) => {
              return {
                value: template.templateId,
                label: template.templateName,
              } as EmailTemplateOption;
            }),
            true
          );
      }
    );
  }

  setSelectedQuotationType() {
    this.quotationStateService.selectedOrderMode$.subscribe((orderMode) => {
      this.selectedOrderMode = orderMode;
    });
  }

  private assignSelectedProductsSummaryValues() {
    this.totalProductQuantity = this.productList.filter(
      (p) => !p.isChildProduct
    ).length;

    for (const product of this.productList) {
      if (product['voucherQuantity']) {
        this.totalVoucherQuantity += Number(product['voucherQuantity']);
      }

      if (product['emailQuantity']) {
        this.totalEmailQuantity += Number(product['emailQuantity']);
      }

      if (product['smsQuantity']) {
        this.totalSmsQuantity += Number(product['smsQuantity']);
      }
    }
  }

  getComputedActivatedDate() {
    const date = new Date(
      this.basicInfoFormGroup.get('publishDate')?.value?._d
    );

    const n = Number(this.basicInfoFormGroup.get('afterPublished')?.value);
    if (date && !isNaN(date.getTime()) && n) {
      return this.datePipe.transform(
        new Date(date.setDate(date.getDate() + n)),
        'YYYY/MM/dd hh:mm a'
      );
    }

    return 'NA';
  }

  getNdaysFromPublishDate() {
    const options = this.basicInfoFormModel.fieldsDefinition.find(
      (f) => f.formControlName === 'activationType'
    )?.select2Data;

    const optionLabel = options?.find(
      (data: any) =>
        data?.value === this.basicInfoFormGroup.get('activationType')?.value
    )?.label;
    if (optionLabel === 'n days from publish date') {
      const n = this.basicInfoFormGroup.get('afterPublished')?.value;
      return optionLabel.replace('n', n);
    }
    return optionLabel || '--';
  }

  onShowChildProduct(event: boolean) {
    this.showChildProduct = event;
  }

  onEditClicked(step: number) {
    this.jumpToStep.emit(step);
  }
}
