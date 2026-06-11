import { Injectable } from '@angular/core';
import { IToast } from './toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: IToast[] = [];

  show(toast: IToast): IToast {
    const length = this.toasts.push(toast);
    return this.toasts[length-1];
  }

  remove(toast: IToast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
