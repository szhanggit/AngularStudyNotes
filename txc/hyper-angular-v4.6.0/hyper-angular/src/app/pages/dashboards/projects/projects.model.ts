export interface Task {
    id?: number;
    taskName?: string;
    dueDays?: number;
    status?: string;
    assignee?: string;
    timeSpend?: string;
}

export interface ActivityItem {
    id?: number;
    employeeName?: string;
    employeeProfile?: string;
    description?: string;
    date?: string;
    projectName?: string;
}

export interface EventSchedule {
    id: number;
    title: string;
    time: string;
}
