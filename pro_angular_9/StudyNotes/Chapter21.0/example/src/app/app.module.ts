import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ProductComponent } from "./component";
import { ComponentsModule } from "./components/components.module";

@NgModule({
    imports: [BrowserModule, //FormsModule, ReactiveFormsModule,
          ComponentsModule],//ModelModule, CommonModule,
    declarations: [ProductComponent],
    bootstrap: [ProductComponent]
})
export class AppModule { }
