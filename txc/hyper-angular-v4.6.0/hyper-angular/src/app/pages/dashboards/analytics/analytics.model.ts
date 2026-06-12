export interface ViewsItem {
    id: number;
    page: string;
    views: number;
    bounce_rate: number;
}

export interface Channel {
    id: number;
    channel: string;
    visits: number;
    progress: number;
}

export interface SocialMediaItem {
    id: number;
    network: string;
    visits: number;
    progress: number;
}

export interface EngagementItem {
    id: number;
    duration: string;
    visits: number;
    sessions: number;
}