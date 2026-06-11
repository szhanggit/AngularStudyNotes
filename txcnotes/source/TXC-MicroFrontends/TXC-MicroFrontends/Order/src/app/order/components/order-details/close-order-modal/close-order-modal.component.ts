import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { UserAuthClaim } from '@txc-angular/authorization-library/models/user-auth-claim.model';
import { CloseModalEnum } from 'src/app/order/enums/close-modal.enum';
import { OrderStatusEnum } from 'src/app/order/enums/order-status.enum';
import { OrderService } from 'src/app/order/services/order.service';
import { FormModel } from 'src/app/shared/models/dumb-models/form.model';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { CloseOrderFieldsDefinition } from 'src/app/shared/models/fields-definition/close-order-fields-definition.model';
import { ErrorValidationDto } from 'src/app/order/models/order-request.model';
import { ErrorMessage } from 'src/app/shared/models/dumb-models/error-message.model';

@Component({
  selector: 'app-close-order-modal',
  templateUrl: './close-order-modal.component.html',
  styleUrls: ['./close-order-modal.component.scss'],
})
export class CloseOrderModalComponent implements OnInit {
  @Input() actionType: CloseModalEnum.Close | CloseModalEnum.Reject =
    CloseModalEnum.Close;
  closeOrderFieldsDefinition = new CloseOrderFieldsDefinition();
  closeOrderFormGroup!: FormGroup;
  orderId!: number;
  orderMode!: number;
  username!: string | null;
  orderStatusErrorMessages: ErrorMessage[] = [];

  get closeOrderFormModel(): FormModel {
    return {
      formGroup: this.closeOrderFormGroup,
      title: this.getActionTitle(),
      fieldsDefinition: this.closeOrderFieldsDefinition.define(),
    };
  }

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private orderService: OrderService,
    private authLibraryService: AuthorizationLibraryService
  ) {}

  ngOnInit(): void {
    this.closeOrderFormGroup = this.formBuilder.group({
      reason: { value: '', disabled: false },
      approver: { value: '', disabled: false },
      timeStamp: { value: null, disabled: false },
    });

    this.authLibraryService.userAuthClaim.subscribe(
      (userAuthClaim: UserAuthClaim) => {
        this.username = userAuthClaim.user.userName;
      }
    );

    if (this.actionType === CloseModalEnum.Reject) {
      const reason = this.closeOrderFormModel.fieldsDefinition.find(
        (field: InputModel) => field.formControlName === 'reason'
      ) as InputModel;
      reason.placeholder = 'Please specify your reject reason (optional)';
    }
  }

  onButtonClicked(close = false) {
    if (close) {
      window.scrollTo(0, 0);
      const orderStatus =
        this.actionType === CloseModalEnum.Close
          ? OrderStatusEnum.Closed
          : OrderStatusEnum.Rejected;
      this.closeOrderFormGroup.get('approver')?.setValue(this.username);
      this.closeOrderFormGroup
        .get('timeStamp')
        ?.setValue(new Date().toUTCString());
      const orderStatusBody = {
        id: this.orderId,
        statusId: orderStatus,
        comment: this.closeOrderFormGroup.get('reason')?.value,
      };

      // update the status with api
      this.orderService.updateOrderStatus(orderStatusBody).subscribe({
        next: (res) => {
          if (res.success) {
            this.activeModal.dismiss({
              success: res.success,
              status: orderStatus,
              reason: this.closeOrderFormGroup.get('reason')?.value,
              operator: this.closeOrderFormGroup.get('approver')?.value,
              timestamp: this.closeOrderFormGroup.get('timeStamp')?.value,
            });
          } else {
            this.orderStatusErrorMessages.push({
              type: 'Order Status',
              description:
                'There was an error updating order. Please try again later.',
            });

            this.activeModal.dismiss({
              close,
              errorMessages: this.orderStatusErrorMessages,
            });
          }
        },
        error: (err) => {
          window.scrollTo(0, 0);
          if (!err.error.data || !err.error.data.errorValidationDto.length) {
            this.orderStatusErrorMessages.push({
              type: 'Order Status',
              description:
                err.error.message ??
                'There was an error updating order. Please try again later.',
            });

            this.activeModal.dismiss({
              close,
              errorMessages: this.orderStatusErrorMessages,
            });

            return;
          }

          err.error.data.errorValidationDto.forEach(
            (item: ErrorValidationDto) => {
              this.orderStatusErrorMessages.push({
                type: item.columnName,
                description: item.errorMessage,
              });
            }
          );

          this.activeModal.dismiss({
            close,
            errorMessages: this.orderStatusErrorMessages,
          });
        },
      });
    }
  }

  getActionTitle(): string {
    return this.actionType.charAt(0).toUpperCase() + this.actionType.slice(1);
  }

  getActionMessage(): string {
    return `Are you sure you want to ${this.actionType} this order? The data cannot be retrieved.`;
  }
}
