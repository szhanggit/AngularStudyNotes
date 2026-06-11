import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { SendFileFieldsDefinition } from 'src/app/shared/models/fields-definition/send-file-fields-definition.model';
import { DownloadAndSendService } from 'src/app/order/services/download-and-send.service';
import { BaseResponse } from 'src/app/order/models/base-response.model';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import {
  ClientContact,
  SendVoucherRequestBody,
} from 'src/app/order/models/download-send.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-send-file',
  templateUrl: './send-file.component.html',
  styleUrls: ['./send-file.component.scss'],
})
export class SendFileComponent implements OnInit, OnDestroy {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  sendFileFieldsDefinition = new SendFileFieldsDefinition();
  sendFileFormGroup!: FormGroup;
  clientEmailList!: ClientContact[];
  orderId!: number;
  destroy$ = new Subject();

  get sendFileFormModel(): FormModel {
    return {
      formGroup: this.sendFileFormGroup,
      title: 'Send file',
      fieldsDefinition: this.sendFileFieldsDefinition.define(),
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private downloadSendService: DownloadAndSendService
  ) {}

  ngOnInit(): void {
    this.sendFileFormGroup = this.formBuilder.group({
      emailAddress: { value: '', disabled: false },
    });
    this.fetchClientEmailList();
  }

  onButtonClicked(send = false) {
    if (send) {
      if (this.sendFileFormGroup.get('emailAddress')?.value !== '') {
        const sendRequestBody: SendVoucherRequestBody = {
          email: this.sendFileFormGroup.get('emailAddress')?.value,
          orderId: Number.parseInt(this.orderId.toString()),
        };
        this.downloadSendService
          .SendOrderVoucherExcel(sendRequestBody)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (result: BaseResponse) => {
              if (result.success) {
                this.toast.showSuccess(
                  `Sent successfully to ${result.data?.email}`
                );
              } else {
                this.toast.showDanger(result.message);
              }
            },
            error: () => {
              this.toast.showDanger(
                'Error while sending request. Please try again later.'
              );
            },
          });
        this.activeModal.dismiss();
      } else {
        this.toast.showDanger('Please select client email address.');
      }
    } else {
      this.activeModal.dismiss();
    }
  }

  fetchClientEmailList() {
    this.downloadSendService
      .getClientContact()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientEmailList: ClientContact[]) => {
          if (clientEmailList.length > 0) {
            this.updateEmailList(clientEmailList);
          } else {
            this.activeModal.dismiss(true);
          }
        },
        error: () => {
          this.toast.showDanger(
            'Error while fetching client email list. Please try again later.'
          );
        },
      });
  }

  updateEmailList(emailList: ClientContact[]) {
    const uniqueEmailList = emailList?.filter(
      (list, index, arr) =>
        arr.findIndex((element) => element.email === list.email) === index
    )?.map((client) => ({
      label: `${client.name} (${client.email})`,
      value: client.email,
    }));

    this.sendFileFormModel.fieldsDefinition.find(
      (field) => field.formControlName === 'emailAddress'
    )!.select2Data = uniqueEmailList;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
