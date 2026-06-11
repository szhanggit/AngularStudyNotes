export interface Button {
    buttonText: string;
    buttonClass: string;
    isDropdown?: boolean;
    buttonAction?: (...args: any[]) => any;
}