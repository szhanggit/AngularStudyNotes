import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ProductComponent } from "./component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaAttrDirective } from "./attr.directive";
import { PaModel } from "./twoway.directive";
import { PaStructureDirective } from "./structure.directive";
import { PaIteratorDirective } from "./iterator.directive";
import { PaCellColor } from "./cellColor.directive";
import { PaCellColorSwitcher } from "./cellColorSwitcher.directive";
import { ProductTableComponent } from "./productTable.component";
import { ProductFormComponent } from "./productForm.component";
import { PaToggleView } from "./toggleView.component";
import { PaAddTaxPipe } from "./addTax.pipe";
import { PaCategoryFilterPipe } from "./categoryFilter.pipe";
import { LOCALE_ID } from "@angular/core";
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { PaDiscountDisplayComponent } from "./discountDisplay.component";
import { PaDiscountEditorComponent } from "./discountEditor.component";
import { DiscountService } from "./discount.service";
import { PaDiscountPipe } from "./discount.pipe";
import { PaDiscountAmountDirective } from "./discountAmount.directive";
import { SimpleDataSource } from "./datasource.model";
import { Model } from "./repository.model";
import { LogService, LOG_SERVICE, SpecialLogService, LogLevel, LOG_LEVEL } from "./log.service";

let logger = new LogService();
logger.minimumLevel = LogLevel.DEBUG;
registerLocaleData(localeFr);

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  declarations: [ProductComponent, PaAttrDirective, PaModel,
    PaStructureDirective, PaIteratorDirective,
    PaCellColor, PaCellColorSwitcher, ProductTableComponent,
    ProductFormComponent, PaToggleView, PaAddTaxPipe,
    PaCategoryFilterPipe, PaDiscountDisplayComponent, PaDiscountEditorComponent, 
    PaDiscountPipe, PaDiscountAmountDirective],
    //providers: [DiscountService, SimpleDataSource, Model, LogService],
    //providers: [DiscountService, SimpleDataSource, Model, { provide: LogService, useClass: LogService }],
    //providers: [DiscountService, SimpleDataSource, Model, { provide: "logger", useClass: LogService }],
    //providers: [DiscountService, SimpleDataSource, Model, { provide: LOG_SERVICE, useClass: LogService }],
    //providers: [DiscountService, SimpleDataSource, Model, { provide: LOG_SERVICE, useClass: SpecialLogService }],
    /*providers: [DiscountService, SimpleDataSource, Model,
      { provide: LOG_SERVICE, useClass: LogService, multi: true },
      { provide: LOG_SERVICE, useClass: SpecialLogService, multi: true }],*/
    /*providers: [DiscountService, SimpleDataSource, Model,
        { provide: LogService, useValue: logger }], */
      providers: [DiscountService, SimpleDataSource, Model,
        { provide: LOG_LEVEL, useValue: LogLevel.DEBUG },
        { provide: LogService,
          deps: [LOG_LEVEL],
          useFactory: (level) => {
            let logger = new LogService();
            logger.minimumLevel = level;
            return logger;
          }}],
  bootstrap: [ProductComponent]
})
export class AppModule { }
