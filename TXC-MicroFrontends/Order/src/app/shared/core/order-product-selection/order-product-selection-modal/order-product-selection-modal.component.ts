import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/order/services/order.service';
import { ErrorMessage } from 'src/app/shared/models/dumb-models/error-message.model';
import { OrderMode } from 'src/app/order/models/quotation-type.model';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-product-selection-modal',
  templateUrl: './order-product-selection-modal.component.html',
  styleUrls: ['./order-product-selection-modal.component.scss'],
})
export class OrderProductSelectionModalComponent {
  @ViewChild('inputFile') inputFile!: ElementRef;
  productSelectionErrorMessages: ErrorMessage[] = [];
  calledFrom: 'orderDetails' | 'createOrder' = 'createOrder';
  quotationNumber!: string;
  orderMode!: OrderMode;

  // Flag for disabling single upload for MVP
  get disableSingleUpload() {
    return environment.isMvp;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private orderService: OrderService
  ) {}

  downloadTemplate(event: Event) {
    event.stopPropagation();
    this.orderService
      .getProductTemplateFile(this.quotationNumber, this.orderMode.key)
      .subscribe((res) => {
        const type = this.orderMode.value.split(' ');
        const link = document.createElement('a');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.href = (window as any).URL.createObjectURL(res);
        link.download = `${this.quotationNumber}_${
          type[type.length - 1]
        }.xlsx`;
        link.click();
        link.remove();
    });
  }

  onUploadFileClicked() {
    // TODO: remove when implemented in createOrder
    if (this.calledFrom === 'orderDetails') {
      this.inputFile.nativeElement.click();
      return;
    }

    this.activeModal.dismiss('uploadExcelFile');
  }

  onFileSelected(event: any) {
    let productSelectionDismissData = null;
    const files = this.checkExtension(event.target.files);
    // Upload from orderDetails will append product list.
    const productList =
      this.calledFrom === 'orderDetails'
        ? this.orderService.getProductListAppend()
        : [];
    productSelectionDismissData = {
      type: 'uploadExcelFile',
      callFrom: this.calledFrom,
      productList: productList,
      errorMessages: this.productSelectionErrorMessages,
    };
    this.activeModal.dismiss(productSelectionDismissData);
  }

  private checkExtension(files: File[]): File[] {
    const result = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      if (ext && ['xls', 'xlsx'].includes(ext)) {
        result.push(file);
      } else {
        this.productSelectionErrorMessages.push({
          type: 'File',
          description: 'Invalid file type',
        });
      }
    }
    return result;
  }
}
