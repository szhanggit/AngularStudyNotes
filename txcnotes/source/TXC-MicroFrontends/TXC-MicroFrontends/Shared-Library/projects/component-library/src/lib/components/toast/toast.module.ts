import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdToastGlobal } from './toast-global/toast-global.component';
import { ToastsContainer } from './toasts-container/toasts-container.component';



@NgModule({
  declarations: [
    NgbdToastGlobal,
    ToastsContainer,
  ],
  imports: [
    CommonModule,
    NgbToastModule,
  ],
  exports: [
    NgbdToastGlobal,
  ],
})
export class ToastModule { }
