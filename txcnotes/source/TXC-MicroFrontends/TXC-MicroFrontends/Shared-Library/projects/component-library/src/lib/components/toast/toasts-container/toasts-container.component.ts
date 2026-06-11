import { Component, TemplateRef } from '@angular/core';
import { IToast, ToastType } from '../toast.model';
import { ToastService } from '../toast.service';


@Component({
  selector: 'app-toasts',
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.scss'],
  host: {'class': 'toast-container position-fixed bottom-0 end-0 p-3', 'style': 'z-index: 1200'},
})
export class ToastsContainer {

  readonly ToastType = ToastType;

  constructor(public toastService: ToastService) {}

  isTemplate(toast : IToast): boolean { 
    return toast.message instanceof TemplateRef; 
  }

  getTemplate(toast: IToast): TemplateRef<any> | null {
    if (this.isTemplate(toast)) return toast.message as TemplateRef<any>; 
    return null;
  }

  closeToast(toast: IToast) {
    this.toastService.remove(toast);
  }
}
