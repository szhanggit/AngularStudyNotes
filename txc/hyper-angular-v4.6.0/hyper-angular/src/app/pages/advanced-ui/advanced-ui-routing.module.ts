import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dragdrop', loadChildren: () => import('./dragdrop/dragdrop.module').then(m => m.DragdropModule) },
  { path: 'rangesliders', loadChildren: () => import('./rangesliders/rangesliders.module').then(m => m.RangeslidersModule) },
  { path: 'ratings', loadChildren: () => import('./ratings/ratings.module').then(m => m.RatingsModule) },
  { path: 'scrollbar', loadChildren: () => import('./scrollbar/scrollbar.module').then(m => m.ScrollbarModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancedUiRoutingModule { }
