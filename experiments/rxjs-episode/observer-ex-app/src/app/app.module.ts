import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Row00Component } from './row00/row00.component';
import { Row01Component } from './row01/row01.component';
import { Row02Component } from './row02/row02.component';
import { Row10Component } from './row10/row10.component';
import { Row11Component } from './row11/row11.component';
import { Row12Component } from './row12/row12.component';
import { Row20Component } from './row20/row20.component';
import { Row21Component } from './row21/row21.component';
import { Row22Component } from './row22/row22.component';
import { Row00controlComponent } from './row00control/row00control.component';
import { Row01controlComponent } from './row01control/row01control.component';
import { Row02controlComponent } from './row02control/row02control.component';
import { Row10controlComponent } from './row10control/row10control.component';
import { Row11controlComponent } from './row11control/row11control.component';
import { Row12controlComponent } from './row12control/row12control.component';
import { Row20controlComponent } from './row20control/row20control.component';
import { Row21controlComponent } from './row21control/row21control.component';
import { Row22controlComponent } from './row22control/row22control.component';


@NgModule({
  declarations: [
    AppComponent,
    Row00Component,
    Row01Component,
    Row02Component,
    Row10Component,
    Row11Component,
    Row12Component,
    Row20Component,
    Row21Component,
    Row22Component,
    Row00controlComponent,
    Row01controlComponent,
    Row02controlComponent,
    Row10controlComponent,
    Row11controlComponent,
    Row12controlComponent,
    Row20controlComponent,
    Row21controlComponent,
    Row22controlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbCollapseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
