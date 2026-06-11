import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetModule } from './widget/widget.module';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ModalComponent } from './modal/modal.component';
import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from './toast/toast-global.component';
import { ToastsContainer } from './toast/toasts-container.component';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';



@NgModule({
  declarations: [
    ConfirmationModalComponent,
    ModalComponent,
    ToggleButtonComponent,
    NgbdToastGlobal,
    ToastsContainer,
    ClickStopPropagationDirective
  ],
  imports: [
    CommonModule,
    WidgetModule,
    NgxSliderModule,
    NgxDropzoneModule,
    NgbModule
  ],
  exports: [
    ConfirmationModalComponent,
    ModalComponent,
    ToggleButtonComponent,
    NgxSliderModule,
    NgxDropzoneModule,
    NgbdToastGlobal,
    ToastsContainer,
    ClickStopPropagationDirective
  ]
})
export class SharedModule { }
