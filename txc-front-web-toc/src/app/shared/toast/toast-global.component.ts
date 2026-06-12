import { Component, OnDestroy } from '@angular/core';

import { ToastService } from './toast-service';

@Component({ selector: 'ngbd-toast-global', templateUrl: './toast-global.component.html' })
export class NgbdToastGlobal implements OnDestroy {
  constructor(public toastService: ToastService) {}

  showStandard(message: string) {
    this.toastService.show(message);
  }

  showSuccess(message: string) {
    this.toastService.show(message, { classname: 'bg-success text-light' });
  }

  showDanger(dangerTpl: any) {
    this.toastService.show(dangerTpl, { classname: 'bg-danger text-light' });
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
