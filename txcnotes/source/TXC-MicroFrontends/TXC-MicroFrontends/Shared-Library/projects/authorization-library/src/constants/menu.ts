import { MenuItem } from '../models/menu.model';

// menu items
export const MENU: MenuItem[] = [
    {
        key: 'move', label: "MOVE", isTitle: true,
    },
    {
        key: "order", label: "Order", link: "/order", icon: "uil-angle-down", parentKey: "move", id: 4, code: "M004", collapsed: true,
        children: [
            {
                key: "order", label: "Order List", link: "/order", parentKey: "order", id: 12, code: "R012",
                hidden: []
            },
            {
                key: "batch-order-list", label: "Batch Order List", link: "/batch-processor/order/batch-order-list", parentKey: "order", id: 12, code: "R012",
                hidden: ['SG', 'TW', 'GL']
            }
        ]
    },
    {
        key: "merchants", label: "Merchant", link: "/merchants", icon: "uil-angle-down", parentKey: "move", id: 2, code: "M002", collapsed: true,
        children: [
            {
                key: "merchants", label: "Merchant List", link: "/merchants", parentKey: "merchant", id: 5, code: "R005",
                hidden: []
            },
        ]
    },
    {
        key: "products", label: "Products", link: "/products", icon: "uil-angle-down", parentKey: "move", id: 3, code: "M003", collapsed: true,
        children: [
            {
                key: "products", label: "Product List", link: "/products", parentKey: "products", id: 6, code: "R006",
                hidden: []
            },
            {
                key: "apply-child-products-quotation", 
                label: "Apply Child Products to Quotation", 
                link: "/products/apply-child-products-quotation", 
                parentKey: "products", 
                id: 6, 
                code: "R006", 
                operationId: 24,
                hidden: []
            },
        ]
    },
    {
        key: "system", label: "System", link: "/system", icon: "uil-angle-down", parentKey: "move", id: 8, code: "M008", collapsed: true,
        children: [
            {
                key: "media-library", label: "Media Library", link: "/system/media-library", parentKey: "system", id: 17, code: "R017",
                hidden: []
            },
            {
                key: "template-list", label: "Template List", link: "/system/template-list", parentKey: "system", id: 18, code: "R018",
                hidden: []
            },
        ]
    },
    {
        key: "clients", label: "Client", link: "/clients", icon: "uil-angle-down", parentKey: "move", id: 5, code: "M005", collapsed: true,
        children: [
            {
                key: "clients", label: "Client List", link: "/clients", parentKey: "client", id: 13, code: "R013"
                
            }
            // ,
            // {
            //     key: "quotation-list", label: "Quotation List", link: "/clients/quotationlist", parentKey: "client", id: 13, code: "R013",
            // },
        ]
    },
    {
        key: 'voucher', label: "Voucher", link: "/voucher", icon: "uil-angle-down", parentKey: "move", id: 6, code: "M006", collapsed: true,
        children: [
            { key: "voucher-list", label: "Voucher List", link: "/voucher/voucher-list", parentKey: "voucher", id: 15, code: "R015"},
            { key: "inventory", label: "Inventory Dashboard", link: "/voucher/inventory/overview", parentKey: "voucher", id: 16, code: "R016", operation: []},
            { key: "inventory-list", label: "Batch Inventory List", link: "/batch-processor/voucher/inventory-list", parentKey: "voucher", id: 16, code: "R016", hidden: []},
            { key: "voucher-operations-list", label: "Batch Voucher Operations", link: "/batch-processor/voucher/voucher-operations-list", parentKey: "voucher", id: 16, code: "R016", hidden: []},
        ]
    },
]
