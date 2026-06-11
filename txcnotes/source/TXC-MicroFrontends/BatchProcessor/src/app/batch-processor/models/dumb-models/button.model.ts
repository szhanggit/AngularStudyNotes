export interface Button {
    buttonText: string;
    buttonClass?: string;
    buttonAction?: (...args: any[]) => any;
}