import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { TableHeader, TableModel, TableRow } from '../dumb-models/table.model';
import { TableDefinition } from './table-definition.model';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import { OrderStatusEnum } from 'src/app/order/enums/order-status.enum';

export class ProductSelectionTableDefinition implements TableDefinition {
  private tableDefinition: TableModel;
  private headerDefs: TableHeader[];
  public rows!: TableRow[];
  private orderMode?: OrderMode;

  constructor(
    orderMode?: OrderMode,
    isDirectOrderDeliveryDetails?: boolean,
    orderStatus?: OrderStatusEnum,
    editMode = false
  ) {
    this.orderMode = orderMode;
    this.headerDefs = [
      {
        headerName: 'Product Code / Product Name',
        headerId: 'productCodeName',
      },
      {
        headerName: 'Remaining Q\'ty',
        headerId: 'remainingQty',
      },
      {
        headerName: 'Issued Q\'ty',
        headerId: 'issuedQuantity',
        hidden: this.isColumnHidden('issuedQuantity', editMode),
      },
      {
        headerName: 'Email issued Q\'ty',
        headerId: 'emailIssuedQuantity',
        hidden: this.isColumnHidden('emailIssuedQuantity', editMode),
      },
      {
        headerName: 'SMS issued Q\'ty',
        headerId: 'smsIssuedQuantity',
        hidden: this.isColumnHidden('smsIssuedQuantity', editMode),
      },
      {
        headerName: 'Voucher Q\'ty',
        headerId: 'voucherQty',
        hidden: this.isColumnHidden('voucherQty'),
      },
      {
        headerName: 'Email Q\'ty',
        headerId: 'emailQty',
        hidden: this.isColumnHidden('emailQty'),
      },
      {
        headerName: 'SMS Q\'ty',
        headerId: 'smsQty',
        hidden: this.isColumnHidden('smsQty'),
      },
      {
        headerName: 'Face Value',
        headerId: 'faceValue',
        hidden: isDirectOrderDeliveryDetails,
      },
      {
        headerName: 'Sold Price',
        headerId: 'soldPrice',
        hidden: isDirectOrderDeliveryDetails,
      },
      {
        headerName: 'Reservation Code',
        headerId: 'reservationCode',
        hidden: isDirectOrderDeliveryDetails,
      },
      {
        headerName: 'Expiry Date Scheme / Date',
        headerId: 'expiryDateScheme',
      },
      {
        headerName: 'Client Order No.',
        headerId: 'expiryDateScheme',
        hidden: isDirectOrderDeliveryDetails || this.isColumnHidden('expiryDateScheme'),
      },
      {
        headerName: 'Status',
        headerId: 'status',
        hidden:
          this.isColumnHidden('status', editMode) ||
          orderStatus !== OrderStatusEnum.Published,
      },
      {
        headerName: 'Actions',
        headerId: 'actions',
      },
    ];

    this.tableDefinition = {
      tableHeaders: this.headerDefs,
      tableRows: this.rows,
    };
  }

  private isColumnHidden(formControlName?: string, isEditMode = false) {
    let orderModes: OrderModeEnum[] = [];
    switch (formControlName) {
      case 'issuedQuantity':
      case 'emailIssuedQuantity':
      case 'smsIssuedQuantity':
      case 'status':
        orderModes = [
          OrderModeEnum.PaperVoucher,
          OrderModeEnum.DirectNonAPI,
          OrderModeEnum.IndirectNonAPI,
        ];
        if (!isEditMode) {
          orderModes.push(OrderModeEnum.API);
        }
        break;
      case 'voucherQty':
        orderModes = [OrderModeEnum.API];
        break;
      case 'emailQty':
      case 'smsQty':
        orderModes = [
          OrderModeEnum.IndirectNonAPI,
          OrderModeEnum.API,
          OrderModeEnum.PaperVoucher,
        ];
        break;
      case 'expiryDateScheme':
        orderModes = [OrderModeEnum.DirectNonAPI, OrderModeEnum.API];
        break;
    }
    return this.orderMode ? orderModes.includes(this.orderMode.key) : false;
  }


  define(): TableModel {
    return this.tableDefinition;
  }
}
