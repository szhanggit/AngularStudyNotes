import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { FirstexComponent } from './firstex/firstex.component';
import { SecondexComponent } from './secondex/secondex.component';

const routes: Routes = [
  {
    path:'first', component: FirstexComponent
  },
  {
    path: 'second', component: SecondexComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
