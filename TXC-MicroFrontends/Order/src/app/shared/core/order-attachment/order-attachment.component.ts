import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderAttachmentFieldsDefinition } from '../../models/fields-definition/order-attachment-fields-definition.model';
import { FormGroup } from '@angular/forms';
import { FormModel } from '../../models/dumb-models/form.model';
import { FileEvent } from '../../models/custom-file.model';

@Component({
  selector: 'app-order-attachment',
  templateUrl: './order-attachment.component.html',
  styleUrls: ['./order-attachment.component.scss'],
})
export class OrderAttachmentComponent {
  @Input() attachmentFormGroup!: FormGroup;
  @Output() fileEvent: EventEmitter<FileEvent> = new EventEmitter<FileEvent>();
  @Input() fieldsDefinition: OrderAttachmentFieldsDefinition =
    new OrderAttachmentFieldsDefinition();
  get formModel(): FormModel {
    return {
      title: 'Attachment',
      formGroup: this.attachmentFormGroup,
      fieldsDefinition: this.fieldsDefinition.define(),
      actionButtons: [
        {
          text: 'Upload file',
          formControlName: 'attachments',
        },
      ],
    };
  }
  constructor() {}

  emitFileEvent(fileEvent: FileEvent) {
    this.fileEvent.emit(fileEvent);
  }
}
