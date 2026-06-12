interface Feature {
    id: number;
    title: string;
    description: string;
    image: string;
    features: string[];
}

const FEATURES: Feature[] = [
    {
        id: 1,
        title: 'Inbuilt applications and pages',
        description: 'Hyper comes with a variety of ready-to-use applications and pages that help to speed up the development',
        image: 'assets/images/features-1.svg',
        features: [
            'Projects & Tasks',
            'Ecommerce Application Pages',
            'Profile, pricing, invoice',
            'Login, signup, forget password',
        ],
    },
    {
        id: 2,
        title: 'Simply beautiful design',
        description: 'The simplest and fastest way to build dashboard or admin panel. Hyper is built using the latest tech and tools and provide an easy way to customize anything, including an overall color schemes, layout, etc.',
        image: 'assets/images/features-2.svg',
        features: [
            'Built with latest Bootstrap',
            'Extensive use of SCSS variables',
            ' Well documented and structured code',
            'Detailed Documentation',
        ],
    },
];


export { Feature, FEATURES };
