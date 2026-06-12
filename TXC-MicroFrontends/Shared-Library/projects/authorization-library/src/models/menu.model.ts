export interface MenuItem {
    id?: number;
    code?: string;
    key?: string;
    label?: string;
    icon?: string;
    link?: string;
    collapsed?: boolean;
    children?: any;
    isTitle?: boolean;
    badge?: any;
    parentKey?: string;
    disabled?: boolean;
}
