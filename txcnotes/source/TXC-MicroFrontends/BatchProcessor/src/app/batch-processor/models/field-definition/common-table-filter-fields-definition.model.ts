import { DatepickerModel, InputModel, SelectModel } from '@txc-angular/component-library';
import { FieldsDefinition } from './field-definition.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import {
  BATCH_STATUS_ITEM_VIEW_OPTIONS,
  BATCH_STATUS_OPTIONS,
  CLIENT_OPTIONS,
  ERROR_REASON_OPTIONS,
  ERROR_REASON_OPTIONS_ITEM_VIEW,
  ERROR_REASON_OPTIONS_ORDER_LIST,
  SEARCH_BY_OPTIONS,
  SOURCE_OPTIONS,
  SOURCE_OPTIONS_TW,
} from 'src/app/batch-processor/constants/select-options.const';
import { BusinessUnitEnum } from '../../enums/tenant.enum';
import { BatchDomainsEnum } from '../../enums/batch-domains.enum';

export class CommonTableFilterFieldsDefinition implements FieldsDefinition {
  private searchBy: SelectModel;
  private batchStatus: SelectModel;
  private errorReason: SelectModel;
  private source: SelectModel;
  private client: SelectModel;
  private definitionFields: InputModel[];
  private createdOn: DatepickerModel;
  private labelStyle = 'font-size: 12px; font-weight: 400';

  constructor(selectedTenant?: BusinessUnitEnum, domain?: BatchDomainsEnum) {

    this.createdOn = {
      type: FormInputTypeEnum.Date,
      label: 'Created date',
      formControlName: 'createdOn',
      required: false,
      datepickerType: 'calendar',
      selectMode: 'range',
      placeholder: 'YYYY/MM/DD - YYYYY/MM/DD',
      style: this.labelStyle,
      customMinDate: true,
      minDate: new Date('1990/01/01'),
    };

    this.searchBy = {
      type: FormInputTypeEnum.Select,
      formControlName: 'searchBy',
      required: false,
      select2Data: SEARCH_BY_OPTIONS,
      hidden: domain !== BatchDomainsEnum.OrderItemView
    };

    this.batchStatus = {
      type: FormInputTypeEnum.Select,
      label: 
        domain === BatchDomainsEnum.OrderItemView 
         ? 'Status' 
         : 'Batch status',
      formControlName: 'batchStatus',
      required: false,
      select2Data: 
        domain === BatchDomainsEnum.OrderItemView
         ? BATCH_STATUS_ITEM_VIEW_OPTIONS
         : BATCH_STATUS_OPTIONS,
      style: this.labelStyle,
    };

    this.errorReason = {
      type: FormInputTypeEnum.Select,
      label: 
        domain === BatchDomainsEnum.OrderItemView 
        ? 'Reason' 
        : 'Error reason',
      formControlName: 'errorReason',
      placeholder: 'Select error reason',
      required: false,
      select2Data: domain === BatchDomainsEnum.OrderItemView 
        ? ERROR_REASON_OPTIONS_ITEM_VIEW 
        : domain === BatchDomainsEnum.OrderList 
          ? ERROR_REASON_OPTIONS_ORDER_LIST 
          : ERROR_REASON_OPTIONS,
      style: this.labelStyle, 
    };

    this.source = {
      type: FormInputTypeEnum.Select,
      label: 'Source',
      formControlName: 'source',
      required: false,
      select2Data:
        selectedTenant === BusinessUnitEnum.Taiwan
          ? SOURCE_OPTIONS_TW
          : SOURCE_OPTIONS,
      style: this.labelStyle,
      hidden: domain === BatchDomainsEnum.OrderItemView
    };

    this.client = {
      type: FormInputTypeEnum.Select,
      label: 'Client',
      formControlName: 'client',
      required: false,
      select2Data: CLIENT_OPTIONS,
      style: this.labelStyle,
      hidden: domain !== BatchDomainsEnum.OrderItemView
    };

    this.definitionFields = [
      this.createdOn,
      this.searchBy,
      this.batchStatus,
      this.errorReason,
      this.source,
      this.client
    ];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
