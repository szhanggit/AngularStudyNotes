import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModelModule } from "./model/model.module";
import { CoreModule } from "./core/core.module";
import { TableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
import { MessageModule } from "./messages/message.module";
import { MessageComponent } from "./messages/message.component";
import { AppComponent } from './app.component';
import { routing } from "./app.routing";
import { TermsGuard } from "./terms.guard"

@NgModule({
    imports: [BrowserModule, ModelModule, CoreModule, MessageModule, routing, RouterModule],
    declarations: [AppComponent],
    providers: [TermsGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
