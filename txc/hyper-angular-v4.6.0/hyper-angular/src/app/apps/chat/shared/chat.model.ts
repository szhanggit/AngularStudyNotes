export interface ChatUser {
    id?: number;
    name?: string;
    avatar?: string;
    lastMessage?: string;
    totalUnread?: number;
    lastMessageOn?: string;
    email?: string;
    phone?: string;
    location?: string;
    languages?: string;
    groups?: ChatGroupItem[];
}

export interface ChatGroupItem {
    name: string;
    variant?: string;
}

export interface ChatMessage {
    id: number;
    from: ChatUser;
    to: ChatUser;
    message: {
        type: string;
        value: { text?: string, file?: string, size?: string };
    };
    sendOn?: string;
}
