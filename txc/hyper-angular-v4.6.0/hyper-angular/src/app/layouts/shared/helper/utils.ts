import { LayoutColor, LayoutConfig, LayoutType, LayoutWidth, SideBarTheme, SideBarWidth } from "../models/layout.model";
import { MenuItem } from "../models/menu.model";

/**
 * finds all parents of selected menuitem
 * @param menuItems list of menus
 * @param menuItem selected menu
 * @returns list of all parent menus of menuitem
 */
const findAllParent = (menuItems: MenuItem[], menuItem: any): any => {
    let parents = [];
    const parent = findMenuItem(menuItems, menuItem['parentKey']);

    if (parent) {
        parents.push(parent['key']);
        if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
    }
    return parents;
};

/**
 * finds menuitem
 * @param menuItems list of menus
 * @param menuItemKey key to be matched
 * @returns menuitem that has menuItemKey
 */
const findMenuItem = (menuItems: MenuItem[], menuItemKey: string): any => {
    if (menuItems && menuItemKey) {
        for (var i = 0; i < menuItems.length; i++) {
            if (menuItems[i].key === menuItemKey) {
                return menuItems[i];
            }
            var found = findMenuItem(menuItems[i].children, menuItemKey);
            if (found) return found;
        }
    }
    return null;
};

/**
 * returns configurations based on layout type
 * @param layoutType layout type
 */
const getLayoutConfig = (layoutType: LayoutType = LayoutType.LAYOUT_VERTICAL): LayoutConfig => {
    let config: LayoutConfig = {
        layoutColor: LayoutColor.LAYOUT_COLOR_LIGHT,
        layoutWidth: LayoutWidth.LAYOUT_WIDTH_FLUID,
        leftbarTheme: SideBarTheme.SIDEBAR_THEME_DARK,
        leftbarWidth: SideBarWidth.SIDEBAR_WIDTH_FIXED
    }

    return config;
}

export { findAllParent, findMenuItem, getLayoutConfig };
