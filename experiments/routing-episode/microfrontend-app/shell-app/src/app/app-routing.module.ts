import { loadRemoteModule } from '@angular-architects/module-federation';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) 
  },
  { 
    path: 'landing', 
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) 
  },
  {
    path: 'shops',
    loadChildren: () => loadRemoteModule({
      type: 'module',
      remoteEntry: "http://localhost:4231/remoteEntry.js",
      exposedModule: './shop.module'
    }).then(m => m.ShopModule)
  },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
