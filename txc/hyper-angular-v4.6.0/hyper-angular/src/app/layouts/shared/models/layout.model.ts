/* Layout types and other constants */
export enum LayoutType {
    LAYOUT_VERTICAL = 'vertical',
    LAYOUT_HORIZONTAL = 'horizontal',
    LAYOUT_DETACHED = 'detached',
    LAYOUT_FULL = 'full'
}

export enum LayoutColor {
    LAYOUT_COLOR_LIGHT = 'light',
    LAYOUT_COLOR_DARK = 'dark',
}

export enum LayoutWidth {
    LAYOUT_WIDTH_FLUID = 'fluid',
    LAYOUT_WIDTH_BOXED = 'boxed',
}


export enum SideBarTheme {
    SIDEBAR_THEME_DEFAULT = 'default',
    SIDEBAR_THEME_LIGHT = 'light',
    SIDEBAR_THEME_DARK = 'dark'
}

export enum SideBarWidth {
    SIDEBAR_WIDTH_FIXED = 'fixed',
    SIDEBAR_WIDTH_CONDENSED = 'condensed',
    SIDEBAR_WIDTH_SCROLLABLE = 'scrollable',
}



export interface LayoutConfig {
    layoutColor: LayoutColor;
    layoutWidth: LayoutWidth;
    leftbarTheme: SideBarTheme;
    leftbarWidth: SideBarWidth;
}

