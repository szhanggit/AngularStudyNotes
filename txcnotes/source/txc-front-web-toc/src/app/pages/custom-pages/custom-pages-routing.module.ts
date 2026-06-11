import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./profile-pages/profile.module').then(m => m.ProfileModule) },
  { path: 'faq', loadChildren: () => import('./others/faq/faq.module').then(m => m.FaqModule) },
  { path: 'pricing', loadChildren: () => import('./others/pricing/pricing.module').then(m => m.PricingModule) },
  { path: 'invoice', loadChildren: () => import('./others/invoice/invoice.module').then(m => m.InvoiceModule) },
  { path: 'starter', loadChildren: () => import('./others/starter/starter.module').then(m => m.StarterModule) },
  { path: 'preloader', loadChildren: () => import('./others/preloader/preloader.module').then(m => m.PreloaderModule) },
  { path: 'timeline', loadChildren: () => import('./others/timeline/timeline.module').then(m => m.TimelineModule) },
  { path: 'error-404-alt', loadChildren: () => import('./error/error-404-alt/error-alt.module').then(m => m.ErrorAltModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomPagesRoutingModule { }
