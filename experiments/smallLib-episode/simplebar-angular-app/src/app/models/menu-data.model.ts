import { MenuItem } from './menu.model';
//note : if the menu is not yet configured in amm, kindly put 0 on id
// menu items
export const MENU: MenuItem[] = [
    { key: 'navigation', label: 'Navigation', isTitle: true, id: 1 },
    {
      key: 'maintenance', label: "Maintenance", isTitle: false, icon: "uil-cog", collapsed: true, id: 1,
      children: [
        { key: "role-management", label: "Role Management", link: "/maintenance/role-management", parentKey: "maintenance", id: 1, parentId: 1 },
        { key: "user-management", label: "User Management", link: "/maintenance/user-management", parentKey: "maintenance", id: 3, parentId: 1 },
        { key: "admin-management", label: "Admin Management", link: "/maintenance/admin-management", parentKey: "maintenance", id: 2, parentId: 1 },
        { key: "tenant-management", label: "Tenant Management", link: "/maintenance/tenant-management", parentKey: "maintenance", id: 4, parentId: 1 }
      ]
    },
    {
      key: 'merchant-sku', label: "Merchant SKU", isTitle: false, icon: "uil-cog", collapsed: true, id: 1,
      children: [
        { key: "create", label: "Create", link: "/merchant-sku", parentKey: "merchant-sku", id: 0, parentId: 0 },
        { key: "detail", label: "Detail", link: "/merchant-sku/detail", parentKey: "merchant-sku", id: 0, parentId: 0 },
      ]
    },
    {
      key: 'inventory', label: "Inventory", isTitle: false, icon: "uil-cog", collapsed: true, id: 1,
      children: [
        { key: "overview", label: "Overview", link: "/inventory/overview", parentKey: "inventory", id: 1, parentId: 0 },
        { key: "approval-list", label: "Approval List", link: "/inventory/approval-list", parentKey: "inventory", id: 1, parentId: 0 },
      ]
    },
    {
      key: 'move', label: "MOVE", isTitle: true, id: 1,
    },  
    {
      key: 'system', label: "System", link: "/system", icon: "uil-cog", parentKey: "move", collapsed: true, id: 1,
      children: [
        {
          key: "vendor-setting", label: "Vendor Setting", link: "/system", parentKey: "system",
          hidden: []
        }
  
      ]
    }
  ]
  
