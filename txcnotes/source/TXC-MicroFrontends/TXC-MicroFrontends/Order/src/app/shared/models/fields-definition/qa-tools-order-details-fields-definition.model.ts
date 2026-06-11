import { InputModel } from '../dumb-models/input.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { FieldsDefinition } from './field-definition.model';
import { SelectModel } from '../dumb-models/select.model';
import { OrderOperationsEnum } from 'src/app/order/enums/order-operations.enum.';

export class QAToolsOrderDetailsFieldsDefinition implements FieldsDefinition {
  private orderStatus: SelectModel;
  private orderMode: SelectModel;
  private isOrderCreator: InputModel;
  private noEmailForSend: InputModel;
  private roles: InputModel;
  private simulateAMMRoles: InputModel;
  private definitionFields: InputModel[];

  constructor() {
    this.orderStatus = {
      type: FormInputTypeEnum.Select,
      label: 'Status',
      formControlName: 'orderStatus',
      required: true,
      placeholder: 'Select status',
      select2Data: [
        {
          value: 2,
          label: 'Created',
        },
        {
          value: 256,
          label: 'Under Review',
        },
        {
          value: 8,
          label: 'Approved',
        },
        {
          value: 16,
          label: 'Approved by FT',
        },
        {
          value: 32,
          label: 'Publishing',
        },
        {
          value: 64,
          label: 'Published',
        },
        {
          value: 4096,
          label: 'Failed',
        },
        {
          value: 4,
          label: 'Rejected',
        },
        {
          value: 128,
          label: 'Closed',
        },
      ],
    };

    this.orderMode = {
      type: FormInputTypeEnum.Select,
      label: 'Order Mode',
      formControlName: 'orderMode',
      required: true,
      placeholder: 'Select Mode',
      select2Data: [
        {
          value: 1,
          label: 'Non-API + Indirect',
        },
        {
          value: 2,
          label: 'Non-API + Direct',
        },
        {
          value: 3,
          label: 'API',
        },
        {
          value: 4,
          label: 'Paper Voucher',
        },
      ],
    };

    this.simulateAMMRoles = {
      type: FormInputTypeEnum.ToggleButton,
      label: 'Simulate AMM operations?',
      formControlName: 'simulateAMMRoles',
      required: true,
    };

    this.roles = {
      type: FormInputTypeEnum.RadioButton,
      label: 'Roles',
      formControlName: 'roles',
      required: true,
      options: [
        { value: [OrderOperationsEnum.ViewOrder], label: 'Order Viewer [View]' },
        {
          value: [
            OrderOperationsEnum.ViewOrder,
            OrderOperationsEnum.CreateOrder,
            OrderOperationsEnum.EditOrder,
            OrderOperationsEnum.SubmitOrder,
            OrderOperationsEnum.CloseOrder,
            OrderOperationsEnum.ExportDeliveryStatus,
          ],
          label: 'Order Editor [View/Create/Edit/Submit/Close/Export]',
        },
        {
          value: [
            OrderOperationsEnum.ViewOrder,
            OrderOperationsEnum.ApproveOrder,
            OrderOperationsEnum.RejectOrder,
            OrderOperationsEnum.CloseOrder,
            OrderOperationsEnum.RepublishOrder,
            OrderOperationsEnum.ExportDeliveryStatus,
          ],
          label: 'Order Approver [View/Approve/Reject/Close/Republish/Export]',
        },
        {
          value: [
            OrderOperationsEnum.ViewOrder,
            OrderOperationsEnum.Approve2ndOrder,
            OrderOperationsEnum.RejectOrder,
            OrderOperationsEnum.CloseOrder,
          ],
          label: 'Financial Approver [View/FinanceApprove/Reject/Close]',
        },
        {
          value: [
            OrderOperationsEnum.ViewOrder,
            OrderOperationsEnum.DownloadFile,
            OrderOperationsEnum.SendFile,
          ],
          label: 'Order File Manager [View/Download/Send]',
        },
      ],
    };

    this.isOrderCreator = {
      type: FormInputTypeEnum.ToggleButton,
      label: 'Is Order Owner?',
      formControlName: 'isOrderCreator',
      required: true,
    };

    this.noEmailForSend = {
      type: FormInputTypeEnum.ToggleButton,
      label: 'No Email for Send?',
      formControlName: 'noEmailForSend',
      required: false,
    };

    this.definitionFields = [
      this.orderStatus,
      this.simulateAMMRoles,
      this.orderMode,
      this.isOrderCreator,
      this.roles,
      this.noEmailForSend,
    ];
  }

  define(): InputModel[] {
    return this.definitionFields;
  }
}
