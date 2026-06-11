import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnInit,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddDeliveryDetailsModalComponent } from './add-delivery-details-modal/add-delivery-details-modal.component';
import {
  TableData,
  TableHeader,
  TableModel,
  TableRow,
} from 'src/app/shared/models/dumb-models/table.model';
import { TableButtonType } from 'src/app/shared/enums/table-button-type.enum';
import { ProductReferenceModel } from 'src/app/shared/models/product-reference.model';
import { environment } from 'src/environments/environment';
import { DeliveryService } from 'src/app/order/services/delivery.service';
import { ErrorMessage } from 'src/app/shared/models/dumb-models/error-message.model';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { DeliveryDetail } from 'src/app/order/models/delivery-details.model';
import {
  DirectDeliveryDetails,
  DirectDeliveryProperties,
  TotalQuantity,
} from 'src/app/order/models/direct-delivery-details.model';
import { FromUploadStateService } from 'src/app/order/services/state-service/from-upload-state.service';
import { ConfirmationModalComponent } from '@txc-angular/component-library';

@Component({
  selector: 'app-direct-delivery-details',
  templateUrl: './direct-delivery-details.component.html',
  styleUrls: ['./direct-delivery-details.component.scss'],
})
export class DirectDeliveryDetailsComponent implements OnInit {
  @ViewChild('inputFile') inputFile!: ElementRef;
  @Input() editMode!: boolean;
  @Input() selectedProduct!: ProductReferenceModel;
  @Input() mockSimulation!: {
    simulateValidationError: boolean;
    simulateDuplicateError: boolean;
  };
  deliveryDetailsErrorMessages: ErrorMessage[] = [];
  @Output() directDeliveryProperties =
    new EventEmitter<DirectDeliveryProperties>();
  tableHeaders: TableHeader[] = [
    {
      headerId: 'beneficiaryName',
      headerName: 'Beneficiary Name',
    },
    {
      headerId: 'contactInfoEmailAddress',
      headerName: 'Email Address',
    },
    {
      headerId: 'contactInfoPhoneNumber',
      headerName: 'Mobile No.',
    },
    {
      headerId: 'faceValue',
      headerName: 'Face Value',
    },
    {
      headerId: 'voucherQuantity',
      headerName: 'Voucher Qty',
    },
    {
      headerId: 'edOrderNumber',
      headerName: 'ED Order No.',
    },
    {
      headerId: 'language',
      headerName: 'Language',
    },
    {
      headerId: 'postCodeAddress',
      headerName: 'Post Code / Address',
    },
    {
      headerId: 'Action',
      headerName: 'Action',
    },
  ];

  tableRows: TableRow[] = [];
  hasDuplicateFields: boolean = false;
  fromUpload = false;

  get deliveryDetailsTableModel(): TableModel {
    return {
      tableHeaders: this.tableHeaders,
      tableRows: this.tableRows,
    };
  }
  get mappedTableRows() {
    const mappedTableRows: any[] = [];
    this.tableRows.forEach((row) => {
      mappedTableRows.push(this.mappedTableDataToFormValues(row.data));
    });

    return mappedTableRows;
  }
  constructor(
    private modalService: NgbModal,
    private deliverService: DeliveryService,
    private fromUploadStateService: FromUploadStateService
  ) {}

  ngOnInit() {
    this.initializeDeliveryListTableEdit();

    this.fromUploadStateService.fromUpload$.subscribe((value) => {
      this.fromUpload =
        value.fromUploadState.find(
          (fromUploadStates) =>
            fromUploadStates.productId === this.selectedProduct.id
        )?.deliveryDetailsFromUpload ?? false;
    });
  }

  initializeDeliveryListTableEdit() {
    if (this.editMode) {
      const list: TableRow[] = [];
      this.selectedProduct.directDeliveryDetails?.forEach((d) => {
        list.push({ data: this.mappedFormValuesToTableData(d) });
      });
      this.tableRows = list;
      this.emitDirectDeliveryDetailProps(true);
    }
  }

  downloadTemplate(event: Event) {
    event.stopPropagation();
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = environment.local
      ? '/assets/templates/delivery details template.xls'
      : '/move/assets/templates/delivery details template.xls';
    link.download = 'delivery details template.xls';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  onBatchUploadClicked() {
    if (!this.tableRows.length) {
      this.inputFile.nativeElement.click();
      return;
    }

    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true,
    });

    modalRef.componentInstance.title = 'Batch Upload';
    modalRef.componentInstance.description =
      'Are you sure you want to upload another excel file? All the benificiaries on the list will be cleared and cannot be retrieved';
    modalRef.componentInstance.firstButton = {
      buttonText: 'Cancel',
      buttonClass: 'btn-secondary',
    };
    modalRef.componentInstance.secondButton = {
      buttonText: 'Continue',
      buttonClass: 'btn-primary',
    };
    modalRef.componentInstance.centered = false;
    modalRef.result.then((res: string) => {
      if (res !== 'cancel') {
        this.inputFile.nativeElement.click();
      }
    });
  }

  onFileSelected($event: any): void {
    // reset rows and error message
    this.deliveryDetailsErrorMessages = [];
    this.tableRows = [];

    const files = this.checkExtension($event.target.files);
    (this.inputFile as any).nativeElement.value = null;

    if (!this.deliveryDetailsErrorMessages.length) {
      this.setTableRows([...this.deliverService.getDeliveryDetails()]);
      this.fromUploadStateService.setDeliveryDetailsFromUpload(
        this.selectedProduct.id,
        true
      );
    }
  }

  openAddDeliveryDetailsModal() {
    const modalRef = this.modalService.open(AddDeliveryDetailsModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });

    modalRef.dismissed.subscribe((data) => {
      if (data && data !== 1) {
        const tableRow: TableRow = {
          data: [
            {
              field: 'beneficiaryName',
              value: data.beneficiaryName,
            },
            {
              field: 'contactInfoEmailAddress',
              value: data.contactInfoEmailAddress,
            },
            {
              field: 'contactInfoPhoneNumber',
              value: data.contactInfoPhoneNumber,
            },
            {
              field: 'faceValue',
              value: data.faceValue,
            },
            {
              field: 'voucherQuantity',
              value: data.voucherQuantity,
            },
            {
              field: 'edOrderNumber',
              value: data.edOrderNumber,
            },
            {
              field: 'language',
              value: data.language,
            },
            {
              field: 'postCodeAddress',
              value: data.postCodeAddress,
            },
            {
              isButton: true,
              buttonType: TableButtonType.EditDeleteButton,
            },
          ],
        };
        this.tableRows.unshift(tableRow);
        this.fromUploadStateService.setDeliveryDetailsFromUpload(
          this.selectedProduct.id,
          false
        );
        this.emitDirectDeliveryDetailProps();
      }
    });
    this.setModalProperties(modalRef);
  }

  emitDirectDeliveryDetailProps(isInit: boolean = false) {
    let list: DirectDeliveryDetails[] = [];
    this.tableRows.forEach((r) => {
      list.push(this.mappedTableDataToFormValues(r.data));
    });

    list = [...list].map((d) => {
      let emailQty: number = 0;
      let smsQty: number = 0;

      if (d.contactInfoEmailAddress) {
        emailQty! = d.voucherQuantity;
      }

      if (d.contactInfoPhoneNumber) {
        smsQty! = d.voucherQuantity;
      }

      return { ...d, emailQty: emailQty, smsQty: smsQty };
    });

    this.directDeliveryProperties.emit({
      directDeliveryDetails: list,
      quantity: this.calculateTotalQuantity(list),
      isInit: isInit,
    });
  }

  calculateTotalQuantity(list: DirectDeliveryDetails[]) {
    const quantity: TotalQuantity = {
      emailQty: 0,
      smsQty: 0,
      voucheryQty: 0,
      faceValue: 0,
    };
    list.forEach((d) => {
      const voucherQty = Number(d.voucherQuantity);
      const faceValue = Number(d.faceValue);
      if (d.contactInfoEmailAddress) {
        quantity.emailQty! += voucherQty;
      }

      if (d.contactInfoPhoneNumber) {
        quantity.smsQty! += voucherQty;
      }

      quantity.voucheryQty! += voucherQty;
      quantity.faceValue! += faceValue;
    });

    return quantity;
  }

  deleteClicked() {
    this.emitDirectDeliveryDetailProps();
  }

  editClicked(event: any) {
    const modalRef = this.modalService.open(AddDeliveryDetailsModalComponent, {
      size: 'lg',
      backdrop: 'static',
      centered: true,
    });

    modalRef.componentInstance.editDeliveryDetails =
      this.mappedTableDataToFormValues(event.row);

    modalRef.dismissed.subscribe((data) => {
      if (data && data !== 1) {
        this.tableRows[event.index].data =
          this.mappedFormValuesToTableData(data);
      }
      this.emitDirectDeliveryDetailProps();
    });
    this.setModalProperties(modalRef);
  }

  setModalProperties(modalRef: NgbModalRef) {
    modalRef.componentInstance.faceValueRange =
      this.selectedProduct?.faceValueRange;
    modalRef.componentInstance.existingTableRows = this.mappedTableRows;
    modalRef.componentInstance.productType = this.selectedProduct.productType;
  }

  mappedFormValuesToTableData(formValues: any) {
    delete formValues['emailQty'];
    delete formValues['smsQty'];
    const { address, postCode, ...modifiedFormValues } = formValues;
    const value: any = Object.entries(modifiedFormValues).map(
      ([field, value]) => ({
        field,
        value,
      })
    );

    const sortedValues = value.sort((a: any, b: any) => {
      const headerA = this.tableHeaders.findIndex(
        (header) => header.headerId === a.field
      );
      const headerB = this.tableHeaders.findIndex(
        (header) => header.headerId === b.field
      );
      return headerA - headerB;
    });

    sortedValues.push({
      isButton: true,
      buttonType: TableButtonType.EditDeleteButton,
    });

    return sortedValues;
  }

  mappedTableDataToFormValues(row: TableData[]): DirectDeliveryDetails {
    const mappedRow: any = {};
    row.forEach((r) => {
      if (r.field) {
        mappedRow[r.field] = r.value;
      }
    });

    const postCodeAddress = mappedRow.postCodeAddress.split(',');
    mappedRow.postCode = postCodeAddress[0];
    mappedRow.address = postCodeAddress[1];
    return mappedRow;
  }

  private checkExtension(files: File[]): File[] {
    const result = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      if (ext && ['xls', 'xlsx'].includes(ext)) {
        result.push(file);
      } else {
        this.deliveryDetailsErrorMessages.push({
          type: 'File',
          description: 'Invalid file type',
        });
      }
    }
    return result;
  }

  private setTableRows(deliveryDetails: DeliveryDetail[]) {
    // TO BE REMOVED ON API INTEGRATION
    if (
      this.mockSimulation.simulateDuplicateError ||
      this.mockSimulation.simulateValidationError
    ) {
      if (this.mockSimulation.simulateDuplicateError) {
        this.deliveryDetailsErrorMessages.push({
          type: 'Contact Info was duplicated',
          description: 'row01, row02',
        });
      }

      if (this.mockSimulation.simulateValidationError) {
        this.deliveryDetailsErrorMessages.push({
          type: 'Not enough stock',
          description: 'row01',
        });
      }
    } else {
      this.deliveryDetailsErrorMessages = [];
    }

    if (this.deliveryDetailsErrorMessages.length) {
      this.tableRows = [];
      this.emitDirectDeliveryDetailProps();
      return;
    }

    for (const data of deliveryDetails) {
      const tableRow: TableRow = {
        data: [
          {
            field: 'beneficiaryName',
            value: data.beneficiaryName,
          },
          {
            field: 'contactInfoEmailAddress',
            value: data.contactInfoEmailAddress,
          },
          {
            field: 'contactInfoPhoneNumber',
            value: data.contactInfoPhoneNumber,
          },
          {
            field: 'faceValue',
            value:
              this.selectedProduct.productType ===
              ProductTypeEnum.DynamicFaceValue
                ? data.faceValue?.toString()
                : null,
          },
          {
            field: 'voucherQuantity',
            value: data.voucherQuantity.toString(),
          },
          {
            field: 'edOrderNumber',
            value: data.edOrderNumber,
          },
          {
            field: 'language',
            value: data.language,
          },
          {
            field: 'postCodeAddress',
            value: data.postCode
              ? `${data.postCode}, ${data.address}`
              : data.address,
          },
          {
            isButton: true,
            buttonType: TableButtonType.EditDeleteButton,
          },
        ],
      };
      this.tableRows.push(tableRow);
    }
    this.emitDirectDeliveryDetailProps();
  }
}
