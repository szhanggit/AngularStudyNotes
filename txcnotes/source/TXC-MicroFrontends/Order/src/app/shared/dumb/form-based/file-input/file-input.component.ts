import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Self,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BaseControlComponent } from '../base-control.component';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { NgControl, ValidationErrors } from '@angular/forms';
import { FormEmitterService } from '../../form/form-emitter.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CustomFile, FileEvent } from 'src/app/shared/models/custom-file.model';
import { AttachmentService } from 'src/app/order/services/attachment.service';
import { FileEventTypeEnum } from 'src/app/shared/enums/file-event-type.enum';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent
  extends BaseControlComponent
  implements OnInit, OnDestroy
{
  @ViewChild('inputFile') inputFile!: ElementRef;
  @Input() fileInput!: InputModel;
  @Output() fileEventWithApi: EventEmitter<FileEvent> =
    new EventEmitter<FileEvent>();
  @Output() fileEvent: EventEmitter<FileEvent> = new EventEmitter<FileEvent>();
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  controlName!: string;
  errorMessages: { [key: string]: string } = {};

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    @Self() public controlDir: NgControl,
    private formEmitterService: FormEmitterService,
    private attachmentService: AttachmentService
  ) {
    super();
    controlDir.valueAccessor = this;
  }

  get controlErrors() {
    if (this.controlDir.control?.errors) {
      return Object.keys(this.controlDir.control?.errors as ValidationErrors);
    }

    return [];
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control?.validator ? [control.validator] : [];
    control?.setValidators(validators);
    this.controlName = this.controlDir.name as string;
    this.setErrorMessages();

    this.formEmitterService.emitEvent
      .pipe(takeUntil(this.destroyed$))
      .subscribe((formControlName) => {
        if (formControlName === this.controlName) {
          (this.inputFile as any).nativeElement.click();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  writeValue(value: any): void {
    this.value = value;
    if (this.controlDir.control?.value !== value) {
      this.controlDir.control?.setValue(value);
      this.controlDir.control?.updateValueAndValidity();
    }
  }

  onFileSelected($event: any): void {
    let files = this.checkExtension($event.target.files);
    files = this.mapAdditionalFileProps(files);
    if (this.emitFileEventWithApi(files, FileEventTypeEnum.UPLOAD)) {
      return;
    }

    const value =
      this.value && this.value.length ? [...files, ...this.value] : [...files];

    this.value = value.filter((item: any, index: any, self: any) => {
      const firstIndex = self.findIndex((t: any) => t.name === item.name);
      return firstIndex === index;
    });

    this.onChange(this.value);
    (this.inputFile as any).nativeElement.value = null;
    this.fileEvent.emit({
      customFiles: files,
      eventType: FileEventTypeEnum.UPLOAD,
    });
  }

  onFileRemove(index: number, file: CustomFile): void {
    if (this.emitFileEventWithApi([file], FileEventTypeEnum.DELETE, index)) {
      return;
    }
    this.value.splice(index, 1);
    this.onChange(this.value);
    this.fileEvent.emit({
      customFiles: [file],
      eventType: FileEventTypeEnum.DELETE,
      index: index,
    });
  }

  onFileDropped(files: CustomFile[]) {
    this.value = this.mapAdditionalFileProps([...files]);
    if (this.emitFileEventWithApi(files, FileEventTypeEnum.UPLOAD)) {
      return;
    }
    this.onChange(this.value);
  }

  emitFileEventWithApi(
    files: CustomFile[],
    eventType: FileEventTypeEnum,
    index?: number
  ) {
    if (this.fileInput.eventWithApi) {
      this.fileEventWithApi.emit({
        customFiles: files,
        eventType: eventType,
        index: index,
      });
      return true;
    }

    return false;
  }

  onFileDownload(file: CustomFile) {
    if (file.isRecentlyUploaded) {
      this.attachmentService.downloadRecentlyUploadedAttachment(file);
      return;
    }

    this.fileEventWithApi.emit({
      customFiles: [file],
      eventType: FileEventTypeEnum.DOWNLOAD,
    });
  }

  mapAdditionalFileProps(files: CustomFile[]) {
    if (files.length === 0) return files;

    return files.map((file: CustomFile) => {
      const hasDuplicate = this.value?.some((v: File) => v.name === file.name);
      if (hasDuplicate) {
        file.hasDuplicate = true;
      }
      file.isRecentlyUploaded = true;
      return file;
    });
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.fileInput.label} is mandatory.`,
      email: `${this.fileInput.label} is invalid.`,
      pattern: `Only accepts hypen, space, underscore, and unicode characters.`,
    };
  }

  private checkExtension(files: CustomFile[]): CustomFile[] {
    const result = [];
    for (const file of files) {
      const ext = file.name.split('.').pop();
      if (
        ext &&
        [
          'pdf',
          'xls',
          'xlsx',
          'doc',
          'docx',
          'png',
          'tif',
          'html',
          'msg',
        ].includes(ext.toLowerCase())
      ) {
        result.push(file);
      }
    }
    return result;
  }
}
