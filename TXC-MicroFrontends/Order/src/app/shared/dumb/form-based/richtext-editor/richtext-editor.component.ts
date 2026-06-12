import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Self,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { BaseControlComponent } from '../base-control.component';
import { NgControl, ValidationErrors } from '@angular/forms';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { decode } from 'html-entities';
import { TextEditorService } from 'src/app/order/services/text-editor.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-richtext-editor',
  templateUrl: './richtext-editor.component.html',
  styleUrls: ['./richtext-editor.component.scss'],
})
export class RichtextEditorComponent
  extends BaseControlComponent
  implements OnInit
{
  @Input() richTextEditorModel!: InputModel;
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  controlName!: string;
  errorMessages: { [key: string]: string } = {};
  hideErrors = false;
  richTextValue: SafeHtml = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
    ],
    toolbarHiddenButtons: [
      ['customClasses', 'insertImage', 'insertVideo', 'insertHorizontalRule'],
    ],
  };

  constructor(
    @Self() public controlDir: NgControl,
    private textEditorService: TextEditorService
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
  }

  writeValue(value: any): void {
    this.value = value;
    this.richTextValue = this.textEditorService.convertHtmlToPlainText(
      decode(value)
    );
    if (this.controlDir.control?.value !== value) {
      this.controlDir.control?.setValue(value);
      this.controlDir.control?.updateValueAndValidity();
    }
  }

  onRichTextChanged($event: any): void {
    this.onChange(decode($event.target.innerHTML));
    this.richTextValue = this.textEditorService.convertHtmlToPlainText(
      decode($event.target.innerHTML)
    );
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.richTextEditorModel.label} is required!`,
      maxlength:
        this.richTextEditorModel.validatorsErrorMessage?.maxlength ??
        'Reached maximum length of required characters',
    };
  }
}
