import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { DownloadExcelFileFieldsDefinition } from 'src/app/shared/models/fields-definition/download-excel-file-definition.model';
import { DownloadAndSendService } from 'src/app/order/services/download-and-send.service';
import { BaseResponse } from 'src/app/order/models/base-response.model';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import {
  DownloadVoucherExcelResponse,
  DownloadVoucherRequestBody,
} from 'src/app/order/models/download-send.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-download-excel-file',
  templateUrl: './download-excel-file.component.html',
  styleUrls: ['./download-excel-file.component.scss'],
})
export class DownloadExcelFileComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  orderName!: string;
  orderId!: number;
  orderMode!: number;
  downloadExcelFileFieldsDefinition = new DownloadExcelFileFieldsDefinition();
  downloadExcelFileFormGroup!: FormGroup;
  fileObject: DownloadVoucherExcelResponse = {
    file: '',
    fileName: '',
    password: '',
    contentType: '',
  };
  destroy$ = new Subject();

  get downloadExcelFileFormModel(): FormModel {
    return {
      formGroup: this.downloadExcelFileFormGroup,
      title: 'Download Excel file',
      fieldsDefinition: this.downloadExcelFileFieldsDefinition.define(),
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private downloadSendService: DownloadAndSendService
  ) {}

  ngOnInit(): void {
    this.downloadExcelFileFormGroup = this.formBuilder.group({
      excelPassword: { value: '', disabled: false },
    });
    this.fetchFileWithPassword();
  }

  onButtonClicked(download = false) {
    if (download) {
      const fileByte = this.base64ToArrayBuffer(this.fileObject.file);
      const byteArray = new Uint8Array(fileByte);
      const link = document.createElement('a');
      link.setAttribute('type', 'hidden');
      link.href = window.URL.createObjectURL(
        new Blob([byteArray], { type: this.fileObject.contentType })
      );
      link.download = `${this.fileObject.fileName}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    this.activeModal.dismiss();
  }

  fetchFileWithPassword() {
    const requestBody: DownloadVoucherRequestBody = {
      orderId: this.orderId,
      orderMode: this.orderMode,
    };
    this.downloadSendService
      .DownloadOrderVoucherExcel(requestBody)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: BaseResponse) => {
          if (result.success) {
            this.assignFileValues(result.data);
          } else {
            this.toast.showDanger(result.message);
          }
        },
        error: () => {
          this.toast.showDanger(
            'Error while downloading order voucher excel. Please try again later.'
          );
        },
      });
  }

  assignFileValues(values: DownloadVoucherExcelResponse) {
    if (values) {
      this.fileObject = { ...values };
      this.downloadExcelFileFormGroup.patchValue({
        excelPassword: this.fileObject.password,
      });
    }
  }

  private base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
