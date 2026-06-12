import { PricingPlan } from "src/app/shared/widget/pricing-card/pricing-card.model";

const PLANS: PricingPlan[] = [
    {
        id: 1,
        name: 'Standard License',
        icon: 'dripicons-user',
        price: 49,
        duration: 'License',
        features: ['10 GB Storage', '500 GB Bandwidth', 'No Domain', '1 User', 'Email Support', '24x7 Support'],
        recommended: false,
    },
    {
        id: 2,
        name: 'Multiple License',
        icon: 'dripicons-briefcase',
        price: 99,
        duration: 'License',
        features: ['50 GB Storage', '900 GB Bandwidth', '2 Domain', '10 User', 'Email Support', '24x7 Support'],
        recommended: true,
    },
    {
        id: 3,
        name: 'Extended License',
        icon: 'dripicons-store',
        price: 599,
        duration: 'License',
        features: [
            '100 GB Storage',
            'Unlimited Bandwidth',
            '10 Domain',
            'Unlimited Users',
            'Email Support',
            '24x7 Support',
        ],
        recommended: false,
    },
];

export { PLANS };
