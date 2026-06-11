import { TemplateRef } from "@angular/core";

export interface IToast {
    message: string | TemplateRef<any>,
    type: ToastType,
    options?: ToastOption
}

export interface ToastOption {
    classname?: any,
    delay?: any,
}

export enum ToastType {
    Custom = 0,
    Success = 1,
    Danger = 2,
}
