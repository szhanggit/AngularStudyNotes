import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { AdvancedComponent } from './advanced/advanced.component';
import { BasicComponent } from './basic/basic.component';
import { EditorComponent } from './editor/editor.component';
import { UploadComponent } from './upload/upload.component';
import { ValidationComponent } from './validation/validation.component';
import { WizardComponent } from './wizard/wizard.component';

const routes: Routes = [
  { path: 'basic', component: BasicComponent },
  { path: 'advanced', component: AdvancedComponent },
  { path: 'validation', component: ValidationComponent },
  { path: 'wizard', component: WizardComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'editors', component: EditorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule { }
