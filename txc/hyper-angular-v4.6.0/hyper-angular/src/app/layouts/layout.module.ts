import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SimplebarAngularModule } from 'simplebar-angular';

// shared module
import { SharedModule } from './shared/shared.module';

// modules
import { VerticalModule } from './vertical/vertical.module';
import { HorizontalModule } from './horizontal/horizontal.module';
import { DetachedModule } from './detached/detached.module';
import { FullModule } from './full/full.module';

// components
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { PrivateLayoutComponent } from './private-layout/private-layout.component';




@NgModule({
  declarations: [
    PublicLayoutComponent,
    PrivateLayoutComponent
  ],
  imports: [
    CommonModule,
    SimplebarAngularModule,
    SharedModule,
    VerticalModule,
    HorizontalModule,
    DetachedModule,
    FullModule,
    RouterModule
  ],
  exports: [
    PublicLayoutComponent,
    PrivateLayoutComponent
  ]
})
export class LayoutModule { }
