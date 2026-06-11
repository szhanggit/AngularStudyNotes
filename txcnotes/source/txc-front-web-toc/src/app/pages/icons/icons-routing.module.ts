import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dripicons', loadChildren: () => import('./dripicons/dripicons.module').then(m => m.DripiconsModule) },
  { path: 'mdi', loadChildren: () => import('./mdi/mdi.module').then(m => m.MdiModule) },
  { path: 'unicons', loadChildren: () => import('./unicons/unicons.module').then(m => m.UniconsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IconsRoutingModule { }
