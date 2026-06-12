import { ChartData, ChartDataset } from "chart.js";

export interface Project {
    id?: number;
    title?: string;
    state?: string;
    shortDesc?: string;
    totalTasks?: number;
    totalComments?: number;
    totalMembers?: number;
    progress?: number;
    image?: string;
    progressData?: ChartData<'line'>;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    totalBudget?: number;
}

export interface GanttTaskItem {
    id: string;
    name: string;
    start: string;
    end: string;
    progress: number;
    dependencies: string;
}

export interface GanttProjectItem {
    id: string;
    name: string;
    status: string;
    icon: string;
}
