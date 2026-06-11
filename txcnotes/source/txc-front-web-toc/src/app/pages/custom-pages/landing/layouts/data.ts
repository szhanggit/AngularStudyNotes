interface Layout {
    name: string;
    imageUrl: string;
}

const LAYOUTS: Layout[] = [
    {
        name: 'Vertical Layout',
        imageUrl: 'assets/images/layouts/layout-1.png',
    },
    {
        name: 'Horizontal Layout',
        imageUrl: 'assets/images/layouts/layout-2.png',
    },
    {
        name: 'Detached Layout',
        imageUrl: 'assets/images/layouts/layout-3.png',
    },
    {
        name: 'Light Sidenav Layout',
        imageUrl: 'assets/images/layouts/layout-5.png',
    },
    {
        name: 'Boxed Layout',
        imageUrl: 'assets/images/layouts/layout-6.png',
    },
    {
        name: 'Semi Dark Layout',
        imageUrl: 'assets/images/layouts/layout-4.png',
    },
];

export { Layout, LAYOUTS };