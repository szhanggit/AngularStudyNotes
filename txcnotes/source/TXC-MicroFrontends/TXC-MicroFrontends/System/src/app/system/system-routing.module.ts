import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaLibraryListComponent } from './components/media-library/media-library-list/media-library-list.component';
import { TemplateListComponent } from './components/template/template-list/template-list.component';

const routes: Routes = [
  { path: 'media-library', component: MediaLibraryListComponent },
  { path: 'template-list', component: TemplateListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
