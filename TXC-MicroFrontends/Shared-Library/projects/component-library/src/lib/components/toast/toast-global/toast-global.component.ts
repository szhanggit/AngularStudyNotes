import { Component, OnDestroy, TemplateRef } from '@angular/core';
import { IToast, ToastType } from '../toast.model';
import { ToastService } from '../toast.service';

@Component({
  selector: 'ngbd-toast-global',
  templateUrl: './toast-global.component.html',
})
export class NgbdToastGlobal implements OnDestroy {

  constructor(private readonly toastService: ToastService) { }

  /**
   * Show default toast (toast type: success) with given message.
   * @param message Text to be used as toast's content.
   * @param delay Delay after which the toast will hide (ms). Default: 5000 (ms).
   * @returns Refernce of the created toast.
   */
  showSuccess(message: string, delay: number = 5000): IToast {
    const toast: IToast = {
      message: message,
      type: ToastType.Success,
      options: {
        classname: 'toast-border toast-sucess toast-full-width',
        delay: delay,
      }
    }
    return this.toastService.show(toast);
  }

  /**
   * Show default toast (toast type: danger) with given message.
   * @param message Text to be used as toast's content.
   * @param delay Delay after which the toast will hide (ms). Default: 5000 (ms).
   * @returns Refernce of the created toast.
   */
  showDanger(message: string, delay: number = 5000): IToast {
    const toast: IToast = {
      message: message,
      type: ToastType.Danger,
      options: {
        classname: 'toast-border toast-danger toast-full-width',
        delay: delay,
      }
    }
    return this.toastService.show(toast);
  }

  /**
   * Show custom toast with given template.
   * @param templateRef Template refernce to be used as toast's conetent.
   * @param toastClassname Style to be used for the custom toast. Default: 'text-light toast-full-width'.
   * @param delay Delay after which the toast will hide (ms). Default: 5000 (ms).
   * @returns Refernce of the created toast.
   */
  showTemplate(templateRef: TemplateRef<any>, toastClassname: string = 'text-light toast-full-width', delay: number = 5000): IToast {
    const toast: IToast = {
      message: templateRef,
      type: ToastType.Custom,
      options: {
        classname: toastClassname,
        delay: delay,
      }
    }
    return this.toastService.show(toast);
  }

  /**
   * Close targeted toast.
   * @param toast Toast reference of the targeted toast.
   */
  closeToast(toast: IToast): void {
    this.toastService.remove(toast);
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
