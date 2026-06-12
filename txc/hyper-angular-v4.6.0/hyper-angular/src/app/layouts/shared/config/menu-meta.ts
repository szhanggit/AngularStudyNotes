import { MenuItem } from '../models/menu.model';

// menu items
export const MENU: MenuItem[] = [
    { key: 'navigation', label: 'Navigation', isTitle: true },

    {
        key: 'dashboards', label: 'Dashboards', isTitle: false, icon: 'uil-home-alt', collapsed: true, badge: { variant: 'success', text: '4' },
        children: [
            { key: 'ds-analytics', label: 'Analytics', link: '/dashboard/analytics', parentKey: 'dashboards' },
            { key: 'ds-ecommerce', label: 'Ecommerce', link: '/dashboard/ecommerce', parentKey: 'dashboards' },
            { key: 'ds-project', label: 'Projects', link: '/dashboard/project', parentKey: 'dashboards' },
            { key: 'ds-ewallet', label: 'E-Wallet', link: '/dashboard/e-wallet', parentKey: 'dashboards', badge: { variant: 'danger', text: 'New' }, },
        ]
    },

    { key: 'apps', label: 'Apps', isTitle: true },
    { key: 'apps-calendar', label: 'Calendar', isTitle: false, icon: 'uil-calender', link: '/apps/calendar' },
    { key: 'apps-chat', label: 'Chat', isTitle: false, icon: 'uil-comments-alt', link: '/apps/chat' },
    {
        key: 'apps-crm', label: 'CRM', isTitle: false, icon: 'uil-tachometer-fast', collapsed: true, badge: { variant: 'danger', text: 'New' },
        children: [
            { key: 'crm-dashboard', label: 'Dashboard', link: '/apps/crm/dashboard', parentKey: 'apps-crm' },
            { key: 'crm-projects', label: 'Project', link: '/apps/crm/project', parentKey: 'apps-crm' },
            { key: 'crm-orders-list', label: 'Orders List', link: '/apps/crm/order-list', parentKey: 'apps-crm' },
            { key: 'crm-clients', label: 'Clients', link: '/apps/crm/clients', parentKey: 'apps-crm' },
            { key: 'crm-management', label: 'Management', link: '/apps/crm/management', parentKey: 'apps-crm' },
        ]
    },
    {
        key: 'apps-ecommerce', label: 'Ecommerce', isTitle: false, icon: 'uil-store', collapsed: true,
        children: [
            { key: 'ecommerce-products', label: 'Products', link: '/apps/ecommerce/products', parentKey: 'apps-ecommerce' },
            { key: 'ecommerce-details', label: 'Products Details', link: '/apps/ecommerce/productdetails', parentKey: 'apps-ecommerce' },
            { key: 'ecommerce-orders', label: 'Orders', link: '/apps/ecommerce/orders', parentKey: 'apps-ecommerce' },
            { key: 'ecommerce-order-details', label: 'Order Details', link: '/apps/ecommerce/order-details', parentKey: 'apps-ecommerce' },
            { key: 'ecommerce-customers', label: 'Customers', link: '/apps/ecommerce/customers', parentKey: 'apps-ecommerce' },
            { key: 'ecommerce-shopping-cart', label: 'Shopping Cart', link: '/apps/ecommerce/shopping-cart', parentKey: 'apps-ecommerce' },
            { key: 'ecommerce-checkout', label: 'Checkout', link: '/apps/ecommerce/checkout', parentKey: 'apps-ecommerce' },
            { key: 'ecommerce-sellers', label: 'Sellers', link: '/apps/ecommerce/sellers', parentKey: 'apps-ecommerce' },
        ]
    },
    {
        key: 'apps-email', label: 'Email', isTitle: false, icon: 'uil-envelope', collapsed: true,
        children: [
            { key: 'email-inbox', label: 'Inbox', link: '/apps/email/inbox', parentKey: 'apps-email' },
            { key: 'email-read-email', label: 'Read Email', link: '/apps/email/read', parentKey: 'apps-email' },
        ]
    },
    {
        key: 'apps-projects', label: 'Projects', isTitle: false, icon: 'uil-briefcase', collapsed: true,
        children: [
            { key: 'project-list', label: 'List', link: '/apps/projects/list', parentKey: 'apps-projects' },
            { key: 'project-details', label: 'Details', link: '/apps/projects/details', parentKey: 'apps-projects' },
            { key: 'project-gantt', label: 'Gantt', link: '/apps/projects/gantt', parentKey: 'apps-projects' },
            { key: 'project-create-project', label: 'Create Project', link: '/apps/projects/new', parentKey: 'apps-projects' },
        ]
    },
    { key: 'apps-social', label: 'Social Feed', isTitle: false, icon: 'uil-rss', link: '/apps/social' },
    {
        key: 'apps-tasks', label: 'Tasks', isTitle: false, icon: 'uil-clipboard-alt', collapsed: true,
        children: [
            { key: 'task-list', label: 'List', link: '/apps/tasks/list', parentKey: 'apps-tasks' },
            { key: 'task-details', label: 'Details', link: '/apps/tasks/details', parentKey: 'apps-tasks' },
            { key: 'task-kanban', label: 'Kanban Board', link: '/apps/tasks/kanban', parentKey: 'apps-tasks' },
        ]
    },
    { key: 'apps-file-manager', label: 'File Manager', isTitle: false, icon: 'uil-folder-plus', link: '/apps/file' },

    { key: 'custom', label: 'Custom', isTitle: true },
    {
        key: 'pages', label: 'Pages', isTitle: false, icon: 'uil-copy-alt', collapsed: true,
        children: [
            { key: 'page-profile', label: 'Profile', link: '/pages/profile', parentKey: 'pages' },
            { key: 'page-profile2', label: 'Profile 2', link: '/pages/profile2', parentKey: 'pages' },
            { key: 'page-invoice', label: 'Invoice', link: '/pages/invoice', parentKey: 'pages' },
            { key: 'page-faq', label: 'FAQ', link: '/pages/faq', parentKey: 'pages' },
            { key: 'page-pricing', label: 'Pricing', link: '/pages/pricing', parentKey: 'pages' },
            { key: 'page-error-404', label: 'Error - 404', link: '/error-404', parentKey: 'pages' },
            { key: 'page-error-404-alt', label: 'Error - 404-alt', link: '/pages/error-404-alt', parentKey: 'pages' },
            { key: 'page-error-500', label: 'Error - 500', link: '/error-500', parentKey: 'pages' },
            { key: 'page-starter', label: 'Starter Page', link: '/pages/starter', parentKey: 'pages' },
            { key: 'page-maintenance', label: 'Maintenance', link: '/maintenance', parentKey: 'pages' },
            { key: 'page-preloader', label: 'With Preloader', link: '/pages/preloader', parentKey: 'pages' },
            { key: 'page-timeline', label: 'Timeline', link: '/pages/timeline', parentKey: 'pages' },
        ]
    },
    { key: 'landing', label: 'Landing', isTitle: false, icon: 'uil-globe', link: '/landing' },
    { key: 'components', label: 'Components', isTitle: true },
    {
        key: 'base-ui', label: 'Base UI', isTitle: false, icon: 'uil-box', collapsed: true,
        children: [
            { key: 'base-ui-accordions', label: 'Accordions', link: '/ui/accordions', parentKey: 'base-ui' },
            { key: 'base-ui-alerts', label: 'Alerts', link: '/ui/alerts', parentKey: 'base-ui' },
            { key: 'base-ui-avatars', label: 'Avatars', link: '/ui/avatars', parentKey: 'base-ui' },
            { key: 'base-ui-badges', label: 'Badges', link: '/ui/badges', parentKey: 'base-ui' },
            { key: 'base-ui-breadcrumb', label: 'Breadcrumb', link: '/ui/breadcrumb', parentKey: 'base-ui' },
            { key: 'base-ui-buttons', label: 'Buttons', link: '/ui/buttons', parentKey: 'base-ui' },
            { key: 'base-ui-cards', label: 'Cards', link: '/ui/cards', parentKey: 'base-ui' },
            { key: 'base-ui-carousel', label: 'Carousel', link: '/ui/carousel', parentKey: 'base-ui' },
            { key: 'base-ui-dropdown', label: 'Dropdowns', link: '/ui/dropdowns', parentKey: 'base-ui' },
            { key: 'base-ui-embedvideo', label: 'Embed Video', link: '/ui/embedvideo', parentKey: 'base-ui' },
            { key: 'base-ui-grid', label: 'Grid', link: '/ui/grid', parentKey: 'base-ui' },
            { key: 'base-ui-listgroups', label: 'List Groups', link: '/ui/listgroups', parentKey: 'base-ui' },
            { key: 'base-ui-modals', label: 'Modals', link: '/ui/modals', parentKey: 'base-ui' },
            { key: 'base-ui-notifications', label: 'Notifications', link: '/ui/notifications', parentKey: 'base-ui' },
            { key: 'base-ui-paginations', label: 'Paginations', link: '/ui/paginations', parentKey: 'base-ui' },
            { key: 'base-ui-placeholders', label: 'Placeholders', link: '/ui/placeholders', parentKey: 'base-ui' },
            { key: 'base-ui-popovers', label: 'Popovers', link: '/ui/popovers', parentKey: 'base-ui' },
            { key: 'base-ui-progress', label: 'Progress', link: '/ui/progress', parentKey: 'base-ui' },
            { key: 'base-ui-ribbons', label: 'Ribbons', link: '/ui/ribbons', parentKey: 'base-ui' },
            { key: 'base-ui-spinners', label: 'Spinners', link: '/ui/spinners', parentKey: 'base-ui' },
            { key: 'base-ui-tabs', label: 'Tabs', link: '/ui/tabs', parentKey: 'base-ui' },
            { key: 'base-ui-tooltips', label: 'Tooltips', link: '/ui/tooltips', parentKey: 'base-ui' },
            { key: 'base-ui-typography', label: 'Typography', link: '/ui/typography', parentKey: 'base-ui' },
        ]
    },
    {
        key: 'extended-ui', label: 'Extended UI', isTitle: false, icon: 'uil-package', collapsed: true,
        children: [
            { key: 'extended-ui-dragdrop', label: 'Drag and Drop', link: '/advanced-ui/dragdrop', parentKey: 'extended-ui' },
            { key: 'extended-ui-rangesliders', label: 'Range Sliders', link: '/advanced-ui/rangesliders', parentKey: 'extended-ui' },
            { key: 'extended-ui-ratings', label: 'Ratings', link: '/advanced-ui/ratings', parentKey: 'extended-ui' },
            { key: 'extended-ui-scrollbar', label: 'Scrollbar', link: '/advanced-ui/scrollbar', parentKey: 'extended-ui' }
        ]
    },
    { key: 'widgets', label: 'Widgets', isTitle: false, icon: 'uil-layer-group', link: '/widgets' },
    {
        key: 'icons', label: 'Icons', isTitle: false, icon: 'uil-streering', collapsed: true,
        children: [
            { key: 'icon-dripicons', label: 'Dripicons', link: '/icons/dripicons', parentKey: 'icons' },
            { key: 'icon-mdiicons', label: 'Material Design', link: '/icons/mdi', parentKey: 'icons' },
            { key: 'icon-unicons', label: 'Unicons', link: '/icons/unicons', parentKey: 'icons' },
        ]
    },
    {
        key: 'forms', label: 'Forms', isTitle: false, icon: 'uil-document-layout-center', collapsed: true,
        children: [
            { key: 'form-basic', label: 'Basic Elements', link: '/forms/basic', parentKey: 'forms' },
            { key: 'form-advanced', label: 'Form Advanced', link: 'forms/advanced', parentKey: 'forms' },
            { key: 'form-validation', label: 'Validation', link: '/forms/validation', parentKey: 'forms' },
            { key: 'form-wizard', label: 'Wizard', link: '/forms/wizard', parentKey: 'forms' },
            { key: 'form-upload', label: 'File Upload', link: '/forms/upload', parentKey: 'forms' },
            { key: 'form-editors', label: 'Editors', link: '/forms/editors', parentKey: 'forms' },
        ]
    },
    {
        key: 'charts', label: 'Charts', isTitle: false, icon: 'uil-chart', collapsed: true,
        children: [
            { key: 'chart-apex', label: 'Apex Charts', link: '/charts/apex', parentKey: 'charts' },
            { key: 'chart-chartjs', label: 'Chartjs', link: '/charts/chartjs', parentKey: 'charts' },
        ]
    },
    {
        key: 'tables', label: 'Tables', isTitle: false, icon: 'uil-table', collapsed: true,
        children: [
            { key: 'table-basic', label: 'Basic Tables', link: '/tables/basic', parentKey: 'tables' },
            { key: 'table-advanced', label: 'Advanced Tables', link: '/tables/advanced', parentKey: 'tables' },
        ]
    },
    {
        key: 'maps', label: 'Maps', isTitle: false, icon: 'uil-location-point', collapsed: true,
        children: [
            { key: 'maps-googlemaps', label: 'Google Maps', link: '/maps/googlemaps', parentKey: 'maps' },
            { key: 'maps-vectormaps', label: 'Vector Maps', link: '/maps/vectormaps', parentKey: 'maps' },
        ]
    },
    {
        key: 'multilevel', label: 'Multilevel', isTitle: false, icon: 'uil-folder-plus', collapsed: true,
        children: [
            {
                key: 'level1_1', label: 'Level 1.1', parentKey: 'multilevel', collapsed: true,
                children: [
                    {
                        key: 'level2_1', label: 'Level 2.1', parentKey: 'level1_1', collapsed: true,
                        children: [
                            { key: 'level3_1', label: 'Level 3.1', parentKey: 'level2_1' },
                            { key: 'level3_2', label: 'Level 3.2', parentKey: 'level2_1' }
                        ],
                    },
                    { key: 'level2_2', label: 'Level 2.2', parentKey: 'level1_1' },
                ]
            },
            { key: 'level1_2', label: 'Level 1.2', parentKey: 'multilevel' }
        ]
    }

]