export interface NotificationMessage {
    id?: number;
    title?: string;
    icon?: string;
    avatar?: string;
    text?: string;
    variant?: string;
    time?: string;
    isRead?: boolean;
}
export interface NotificationItem {
    day: string,
    messages: NotificationMessage[],
};
