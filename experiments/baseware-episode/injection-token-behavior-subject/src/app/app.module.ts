import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs'; 
import { MY_SUBJECT_TOKEN } from './tokens';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [{
    provide: MY_SUBJECT_TOKEN,
  	useValue: new BehaviorSubject([])
  }],
  bootstrap: [AppComponent, AdminComponent]
})
export class AppModule { }
