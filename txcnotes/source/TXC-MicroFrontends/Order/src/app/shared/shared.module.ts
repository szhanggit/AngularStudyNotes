import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SvgControllerModule } from '@txc-angular/component-library';
import { DatePickerComponent } from './date-picker/date-picker.component';
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbDropdownModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoDataComponent } from './no-data/no-data.component';
import { LoaderComponent } from './loader/loader.component';
import { OrderReferenceDetailsComponent } from './core/order-reference-details/order-reference-details.component';
import { BusinessModelPipe } from './pipes/business.model.pipe';
import { QuotationTypePipe } from './pipes/quotation-type.pipe';
import { ComponentLibraryModule } from '@txc-angular/component-library';
import { TitleComponent } from './dumb/title/title.component';
import { OrderBasicInfoComponent } from './core/order-basic-info/order-basic-info.component';
import { ErrorMessageComponent } from './dumb/error-message/error-message.component';
import { FormComponent } from './dumb/form/form.component';
import { TextboxComponent } from './dumb/form-based/textbox/textbox.component';
import { DatepickerComponent } from './dumb/form-based/datepicker/datepicker.component';
import { RadioButtonComponent } from './dumb/form-based/radio-button/radio-button.component';
import { SelectComponent } from './dumb/form-based/select/select.component';
import { Select2Module } from 'ng-select2-component';
import { TextareaComponent } from './dumb/form-based/textarea/textarea.component';
import { ToggleButtonComponent } from './dumb/form-based/toggle-button/toggle-button.component';
import { CheckboxComponent } from './dumb/form-based/checkbox/checkbox.component';
import { OrderMemoComponent } from './core/order-memo/order-memo.component';
import { OrderSettingsComponent } from './core/order-settings/order-settings.component';
import {
  OwlDateTimeModule,
  OwlDateTimeIntl,
  OWL_DATE_TIME_FORMATS,
} from '@danielmoncada/angular-datetime-picker';
import { OwlDateTimeDefaultModel } from './models/owl-datetime-international.model';
import { OwlMomentDateTimeModule } from '@danielmoncada/angular-datetime-picker-moment-adapter';
import { OrderAttachmentComponent } from './core/order-attachment/order-attachment.component';
import { FileInputComponent } from './dumb/form-based/file-input/file-input.component';
import { DndDirective } from './directives/dnd.directive';
import { OrderProductSelectionComponent } from './core/order-product-selection/order-product-selection.component';
import { OrderProductSelectionModalComponent } from './core/order-product-selection/order-product-selection-modal/order-product-selection-modal.component';
import { TableComponent } from './dumb/table/table.component';
import { ProductSelectionTableComponent } from './core/order-product-selection/product-selection-table/product-selection-table.component';
import { ProductDetailsFormComponent } from '../order/components/select-product/product-details-form/product-details-form.component';
import { DfvFormComponent } from '../order/components/select-product/dfv-form/dfv-form.component';
import { StringSplitByCapitalLetterPipe } from '../order/pipes/string-split-by-capital-letter.pipe';
import { StatusComponent } from './dumb/status/status.component';
import { OrderReviewAndConfirmComponent } from './core/order-review-and-confirm/order-review-and-confirm.component';
import { ViewFormAccordionComponent } from './dumb/view-form-accordion/view-form-accordion.component';
import { ToggleValuePipe } from './pipes/toggle-value.pipe';
import { TrustAccountModalComponent } from './core/order-product-selection/trust-account-modal/trust-account-modal.component';
import { TrustAccountFormComponent } from '../order/components/select-product/trust-account-form/trust-account-form.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { OrderDeliveryDetailsComponent } from './core/order-delivery-details/order-delivery-details.component';
import { TemplateComponent } from './template/template.component';
import { NavWithTabsComponent } from './dumb/nav-with-tabs/nav-with-tabs.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { PageSizeComponent } from './dumb/page-size/page-size.component';
import { SearchComponent } from './dumb/search/search.component';
import { PaginationComponent } from './dumb/pagination/pagination.component';
import { TypeaheadComponent } from './dumb/form-based/typeahead/typeahead.component';
import { ImageSearchComponent } from './smart/image-search/image-search.component';
import { RichtextEditorComponent } from './dumb/form-based/richtext-editor/richtext-editor.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { StandardCasePipe } from './pipes/standard-case.pipe';
import { HtmlEditorComponent } from './dumb/form-based/html-editor/html-editor.component';
import { BottomButtonsComponent } from './dumb/bottom-buttons/bottom-buttons.component';
import { ProductListSummaryComponent } from './core/order-product-selection/product-list-summary/product-list-summary.component';

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'YYYY/MM/DD hh:mm a',
  datePickerInput: 'YYYY/MM/DD',
  timePickerInput: 'hh:mm a',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  declarations: [
    DatePickerComponent,
    NoDataComponent,
    LoaderComponent,
    OrderReferenceDetailsComponent,
    BusinessModelPipe,
    QuotationTypePipe,
    StandardCasePipe,
    TitleComponent,
    OrderBasicInfoComponent,
    ErrorMessageComponent,
    FormComponent,
    CheckboxComponent,
    TextboxComponent,
    DatepickerComponent,
    RadioButtonComponent,
    SelectComponent,
    TextareaComponent,
    ToggleButtonComponent,
    OrderMemoComponent,
    OrderSettingsComponent,
    OrderAttachmentComponent,
    FileInputComponent,
    DndDirective,
    OrderProductSelectionComponent,
    OrderProductSelectionModalComponent,
    TableComponent,
    ProductSelectionTableComponent,
    ProductDetailsFormComponent,
    DfvFormComponent,
    TrustAccountFormComponent,
    StringSplitByCapitalLetterPipe,
    StatusComponent,
    OrderReviewAndConfirmComponent,
    ViewFormAccordionComponent,
    ToggleValuePipe,
    TrustAccountModalComponent,
    OrderDeliveryDetailsComponent,
    TemplateComponent,
    NavWithTabsComponent,
    ProductDetailsComponent,
    PageSizeComponent,
    SearchComponent,
    PaginationComponent,
    TypeaheadComponent,
    ImageSearchComponent,
    RichtextEditorComponent,
    HtmlEditorComponent,
    BottomButtonsComponent,
    ProductListSummaryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SvgControllerModule,
    NgbDatepickerModule,
    Select2Module,
    ComponentLibraryModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    NgbDropdownModule,
    NgbCollapseModule,
    ClipboardModule,
    NgbModule,
    AngularEditorModule
  ],
  exports: [
    SvgControllerModule,
    NgbDatepickerModule,
    ComponentLibraryModule,
    DatePickerComponent,
    ReactiveFormsModule,
    FormsModule,
    NoDataComponent,
    LoaderComponent,
    TitleComponent,
    SelectComponent,
    OrderReferenceDetailsComponent,
    OrderBasicInfoComponent,
    OrderSettingsComponent,
    OrderMemoComponent,
    OrderAttachmentComponent,
    OrderProductSelectionComponent,
    TableComponent,
    ProductDetailsFormComponent,
    DfvFormComponent,
    StatusComponent,
    TrustAccountFormComponent,
    OrderReviewAndConfirmComponent,
    NgbCollapseModule,
    ViewFormAccordionComponent,
    FormComponent,
    ProductSelectionTableComponent,
    OrderDeliveryDetailsComponent,
    TextboxComponent,
    ErrorMessageComponent,
    ProductDetailsComponent,
    PageSizeComponent,
    SearchComponent,
    PaginationComponent,
    NavWithTabsComponent,
    BottomButtonsComponent,
    ProductListSummaryComponent
  ],
  providers: [
    DatePipe,
    StringSplitByCapitalLetterPipe,
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    { provide: OwlDateTimeIntl, useClass: OwlDateTimeDefaultModel },
    { provide: 'Window', useValue: window }
  ],
})
export class SharedModule {}
