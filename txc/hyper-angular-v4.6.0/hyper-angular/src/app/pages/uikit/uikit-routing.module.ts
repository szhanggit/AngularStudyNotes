import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'accordions', loadChildren: () => import('./accordions/accordions.module').then(m => m.AccordionsModule) },
  { path: 'alerts', loadChildren: () => import('./alerts/alerts.module').then(m => m.AlertsModule) },
  { path: 'avatars', loadChildren: () => import('./avatars/avatars.module').then(m => m.AvatarsModule) },
  { path: 'badges', loadChildren: () => import('./badges/badges.module').then(m => m.BadgesModule) },
  { path: 'breadcrumb', loadChildren: () => import('./breadcrumb/breadcrumb.module').then(m => m.BreadcrumbModule) },
  { path: 'buttons', loadChildren: () => import('./buttons/buttons.module').then(m => m.ButtonsModule) },
  { path: 'cards', loadChildren: () => import('./cards/cards.module').then(m => m.CardsModule) },
  { path: 'carousel', loadChildren: () => import('./carousel/carousel.module').then(m => m.CarouselModule) },
  { path: 'dropdowns', loadChildren: () => import('./dropdowns/dropdowns.module').then(m => m.DropdownsModule) },
  { path: 'embedvideo', loadChildren: () => import('./embedvideo/embedvideo.module').then(m => m.EmbedvideoModule) },
  { path: 'grid', loadChildren: () => import('./grid/grid.module').then(m => m.GridModule) },
  { path: 'listgroups', loadChildren: () => import('./listgroups/listgroups.module').then(m => m.ListgroupsModule) },
  { path: 'modals', loadChildren: () => import('./modals/modals.module').then(m => m.ModalsModule) },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule) },
  { path: 'paginations', loadChildren: () => import('./paginations/paginations.module').then(m => m.PaginationsModule) },
  { path: 'popovers', loadChildren: () => import('./popovers/popovers.module').then(m => m.PopoversModule) },
  { path: 'progress', loadChildren: () => import('./progress/progress.module').then(m => m.ProgressModule) },
  { path: 'ribbons', loadChildren: () => import('./ribbons/ribbons.module').then(m => m.RibbonsModule) },
  { path: 'spinners', loadChildren: () => import('./spinners/spinners.module').then(m => m.SpinnersModule) },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule) },
  { path: 'tooltips', loadChildren: () => import('./tooltips/tooltips.module').then(m => m.TooltipsModule) },
  { path: 'typography', loadChildren: () => import('./typography/typography.module').then(m => m.TypographyModule) },
  { path: 'placeholders', loadChildren: () => import('./placeholder/placeholder.module').then(m => m.PlaceholderModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UikitRoutingModule { }
