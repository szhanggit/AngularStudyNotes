import { MenuItem } from "@txc-angular/authorization-library";
import { TENANT_KEY_LOCAL_STORAGE } from "../constants/tenant";
import { Tenant } from "../models/tenant";

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

const getLocalTenant = (): Tenant => {
    const localTenant = localStorage.getItem(TENANT_KEY_LOCAL_STORAGE);
    if (localTenant) {
        return JSON.parse(localTenant) as Tenant;
    } else {
        return new Tenant;
    }
}

export { findAllParent, findMenuItem, getLocalTenant };
