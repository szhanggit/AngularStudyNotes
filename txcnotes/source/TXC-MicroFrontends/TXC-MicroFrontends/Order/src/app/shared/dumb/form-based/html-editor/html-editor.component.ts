import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Self,
} from '@angular/core';
import { BaseControlComponent } from '../base-control.component';
import { NgControl, ValidationErrors } from '@angular/forms';
import { InputModel } from 'src/app/shared/models/dumb-models/input.model';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { decode } from 'html-entities'; 
@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
})
export class HtmlEditorComponent
  extends BaseControlComponent
  implements OnInit
{
  @Input() htmlEditorModel!: InputModel;
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  controlName!: string;
  errorMessages: { [key: string]: string } = {};
  hideErrors = false;

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

  constructor(@Self() public controlDir: NgControl) {
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
    if (this.controlDir.control?.value !== value) {
      this.controlDir.control?.setValue(value);
      this.controlDir.control?.updateValueAndValidity();
    }
  }

  onHTMLTextChanged($event: any): void {
    this.onChange(decode($event.target.innerHTML));
  }

  private setErrorMessages() {
    this.errorMessages = {
      required: `${this.htmlEditorModel.label} is required!`,
      maxlength:
        this.htmlEditorModel.validatorsErrorMessage?.maxlength ??
        'Reached maximum length of required characters',
    };
  }
}
