import { ViewsItem, Channel, EngagementItem, SocialMediaItem } from "./analytics.model";

// views per minute
export const VIEWSPERMINUTE: ViewsItem[] = [
    {
        id: 1,
        page: '/hyper/dashboard-analytics',
        views: 25,
        bounce_rate: 87.5
    },
    {
        id: 2,
        page: '/hyper/dashboard-crm',
        views: 15,
        bounce_rate: 21.48
    },
    {
        id: 3,
        page: '/ubold/dashboard',
        views: 10,
        bounce_rate: 63.59
    },
    {
        id: 4,
        page: '/minton/home',
        views: 7,
        bounce_rate: 56.12
    }
];

// channels
export const CHANNELDATA: Channel[] = [
    { id: 1, channel: 'Direct', visits: 2050, progress: 65 },
    { id: 2, channel: 'Organic Search', visits: 1405, progress: 46 },
    { id: 3, channel: 'Refferal', visits: 750, progress: 31 },
    { id: 4, channel: 'Social', visits: 540, progress: 25 },
];

// traffic
export const SOCIALMEDIATRAFFIC: SocialMediaItem[] = [
    { id: 1, network: 'Facebook', visits: 2050, progress: 65 },
    { id: 2, network: 'Instagram', visits: 1405, progress: 46 },
    { id: 3, network: 'Twitter', visits: 750, progress: 31 },
    { id: 4, network: 'LinkedIn', visits: 540, progress: 25 },
];

// engagment
export const ENGAGEMENTDATA: EngagementItem[] = [
    { id: 1, duration: '0-30', visits: 4250, sessions: 2250 },
    { id: 2, duration: '31-60', visits: 2050, sessions: 1501 },
    { id: 3, duration: '61-120', visits: 1600, sessions: 1600 },
    { id: 4, duration: '121-240', visits: 1040, sessions: 1040 },
];