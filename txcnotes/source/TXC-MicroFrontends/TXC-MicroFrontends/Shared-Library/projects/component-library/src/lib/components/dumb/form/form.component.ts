import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormEmitterService } from './form-emitter.service';
import { FormModel } from '../../../models/dumb-models/form.model';
import { InputModel } from '../../../models/dumb-models/input.model';
import { DatepickerModel } from '../../../models/dumb-models/datepicker.model';
import { SelectModel } from '../../../models/dumb-models/select.model';
import { RadioButtonModel } from '../../../models/dumb-models/radio-button.model';
import { TypeaheadModel } from '../../../models/dumb-models/typeahead.model';
import { FormInputTypeEnum } from '../../enums/form-input-type.enum';
import { CustomFile, FileEvent } from '../../../models/custom-file.model';
import { AttachmentService } from '../../../services/attachment.service';


@Component({
  selector: 'lib-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormLibComponent implements OnInit {
  @Input() formModel!: FormModel;
  @Input() formInputModel!: InputModel;
  _disableAllInput: boolean = false;
  @Input() set disableAllInput(value: boolean) {
    this._disableAllInput = value;

    this.formModel.fieldsDefinition.forEach((field) => {
      if (value) {
        this.formModel.formGroup.get(field.formControlName)?.disable();
      } else {
        this.formModel.formGroup.get(field.formControlName)?.enable();
      }
    });
  }
  @Output() fileEventWithApi: EventEmitter<FileEvent> =
    new EventEmitter<FileEvent>();
  @Output() fileEvent: EventEmitter<FileEvent> =
    new EventEmitter<FileEvent>();
  get disableAllInput(): boolean {
    return this._disableAllInput;
  }
  hasDateContentProjected: boolean = false;
  hasSelectContentProjected: boolean = false;

  getFieldColumnClass(field: InputModel): string {
    if (field.columns && typeof field.columns === 'number') {
      return `col-${field.columns}`;
    }
    return 'col-12';
  }

  formInputModelAsDatepickerModel(field: InputModel): DatepickerModel {
    return field as DatepickerModel;
  }
  formInputModelAsSelectModel(field: InputModel): SelectModel {
    return field as SelectModel;
  }
  formInputModelAsRadioButtonModel(field: InputModel): RadioButtonModel {
    return field as RadioButtonModel;
  }
  formInputModelAsTypeaheadModel(field: InputModel): TypeaheadModel {
    return field as TypeaheadModel;
  }
  formInputCheckBoxModel(field: InputModel): InputModel {
    return field as InputModel;
  }
  get type(): typeof FormInputTypeEnum {
    return FormInputTypeEnum;
  }

  get filteredFieldsDefinition() {
    return this.formModel.fieldsDefinition.filter((field) => !field.hidden);
  }

  showActionButtons = false;
  selectedTenant!: string;

  constructor(
    private formEmitterService: FormEmitterService,
    private attachmentService: AttachmentService
  ) {}

  ngOnInit(): void {
    const tenantFromLocalStorage = localStorage.getItem('tenant');
    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }

    // if the form is dependent that there is a value selected to show action button
    this.formModel.fieldsDefinition.forEach((field) => {
      if (field.watchForValueChanges && field.hideActionButton) {
        if (this.formModel.formGroup.get(field.formControlName)!.value) {
          this.showActionButtons = true;
        }

        this.formModel.formGroup
          .get(field.formControlName)
          ?.valueChanges.subscribe((value) => {
            this.formModel.formGroup
              .get(field.formControlName)
              ?.markAsTouched();
            if (value.length) {
              this.showActionButtons = true;
            } else {
              this.showActionButtons = false;
            }
          });
      }
    });
  }

  onAttachmentDownload(attachment: CustomFile) {
    this.attachmentService.downloadRecentlyUploadedAttachment(attachment);
  }

  getMappedValue(options: any, value: any) {
    return options?.find((data: any) => data?.value === value)?.label || '--';
  }

  emitEvent(formControlName: string): void {
    this.formEmitterService.emitEvent.next(formControlName);
  }

  emitfileEventWithApi(fileEvent: FileEvent) {
    this.fileEventWithApi.emit(fileEvent);
  }

  emitFileEvent(fileEvent: FileEvent) {
    this.fileEvent.emit(fileEvent);
  }
}
