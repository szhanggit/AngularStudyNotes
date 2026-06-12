import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbProgressbarModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { NgxMaskModule } from 'ngx-mask';
import { QuillModule } from 'ngx-quill';

// modules
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { FormRoutingModule } from './form-routing.module';

// components
import { BasicComponent } from './basic/basic.component';
import { AdvancedComponent } from './advanced/advanced.component';
import { ValidationComponent } from './validation/validation.component';
import { WizardComponent } from './wizard/wizard.component';
import { UploadComponent } from './upload/upload.component';
import { EditorComponent } from './editor/editor.component';




@NgModule({
  declarations: [
    BasicComponent,
    AdvancedComponent,
    ValidationComponent,
    WizardComponent,
    UploadComponent,
    EditorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    Select2Module,
    QuillModule,
    NgxDropzoneModule,
    NgbProgressbarModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbTypeaheadModule,
    NgxMaskModule.forRoot(),
    NgbNavModule,
    PageTitleModule,
    FormRoutingModule
  ]
})
export class FormModule { }
