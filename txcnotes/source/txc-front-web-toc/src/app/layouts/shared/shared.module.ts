import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { SimplebarAngularModule } from 'simplebar-angular';

// components
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { FooterComponent } from './footer/footer.component';
import { RightSideBarComponent } from './right-side-bar/right-side-bar.component';
import { TopbarComponent } from './topbar/topbar.component';


@NgModule({
  declarations: [
    LeftSideBarComponent,
    FooterComponent,
    RightSideBarComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModule,
    SimplebarAngularModule,
    ClickOutsideModule
  ],
  exports: [LeftSideBarComponent, FooterComponent, RightSideBarComponent, TopbarComponent]
})
export class SharedModule { }
