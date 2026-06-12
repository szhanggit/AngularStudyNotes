// type
import { Post } from "src/app/apps/social/shared/social.model";

export interface Experience {
    id?: number;
    title?: string;
    company?: string;
    year?: string;
    description?: string;
}

export interface ProfileProjectItem {
    id?: number;
    clientName?: string;
    clientAvatar?: string;
    projectName?: string;
    startDate?: string;
    dueDate?: string;
    status?: string;
}

export interface TimelinePost extends Post {
    engagement: boolean;
}