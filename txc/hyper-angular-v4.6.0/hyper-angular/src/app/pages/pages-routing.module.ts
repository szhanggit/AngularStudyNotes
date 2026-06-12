import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardModule) },
  { path: 'pages', loadChildren: () => import('./custom-pages/custom-pages.module').then(m => m.CustomPagesModule) },
  { path: 'ui', loadChildren: () => import('./uikit/uikit.module').then(m => m.UikitModule) },
  { path: 'advanced-ui', loadChildren: () => import('./advanced-ui/advanced-ui.module').then(m => m.AdvancedUiModule) },
  { path: 'widgets', loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule) },
  { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
  { path: 'forms', loadChildren: () => import('./form/form.module').then(m => m.FormModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
