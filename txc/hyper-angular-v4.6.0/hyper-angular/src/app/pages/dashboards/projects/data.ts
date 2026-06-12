import { ActivityItem, EventSchedule, Task } from "./projects.model"

export const taskList: Task[] = [
    {
        id: 1,
        taskName: "Coffee detail page - Main Page",
        dueDays: 3,
        status: "In-progress",
        assignee: "Logan R. Cohn",
        timeSpend: "3h 20min",
    },
    {
        id: 2,
        taskName: "Drinking bottle graphics",
        dueDays: 27,
        status: "Outdated",
        assignee: "Jerry F. Powell",
        timeSpend: "12h 21min",
    },
    {
        id: 3,
        taskName: "App design and development",
        dueDays: 3,
        status: "Completed",
        assignee: "Scot M. Smith",
        timeSpend: "78h 05min",
    },
    {
        id: 4,
        taskName: "Poster illustation design",
        dueDays: 3,
        status: "In-progress",
        assignee: "Logan R. Cohn",
        timeSpend: "26h 58min",
    }
]

export const activityList: ActivityItem[] = [{
    id: 1,
    employeeName: "Soren Drouin",
    employeeProfile: "assets/images/users/avatar-2.jpg",
    description: 'Completed "Design new idea"',
    date: "18 Jan 2019 11:28 pm",
    projectName: "Hyper Mockup",
},
{
    id: 2,
    employeeName: "Anne Simard",
    employeeProfile: "assets/images/users/avatar-6.jpg",
    description: 'Assigned task "Poster illustation design"',
    date: "18 Jan 2019 11:28 pm",
    projectName: "Hyper Mockup",
},
{
    id: 3,
    employeeName: "Nicolas Chartier",
    employeeProfile: "assets/images/users/avatar-2.jpg",
    description: 'Completed "Drinking bottle graphics"',
    date: "18 Jan 2019 11:28 pm",
    projectName: "Web UI Design",
},
{
    id: 4,
    employeeName: "Gano Cloutier",
    employeeProfile: "assets/images/users/avatar-2.jpg",
    description: 'Completed "Design new idea"',
    date: "18 Jan 2019 11:28 pm",
    projectName: "Ubold Admin",
},
{
    id: 5,
    employeeName: "Soren Drouin",
    employeeProfile: "assets/images/users/avatar-2.jpg",
    description: 'Assigned task "Hyper app design"',
    date: "18 Jan 2019 11:28 pm",
    projectName: "Website Mockup",
}];

export const calendarEvents: EventSchedule[] = [
    {
        id: 1,
        title: 'Meeting with BD Team',
        time: '7:30 AM - 10:00 AM'
    },
    {
        id: 2,
        title: 'Design Review - Hyper Admin',
        time: '10:30 AM - 11:45 AM'
    },
    {
        id: 3,
        title: 'Setup Github Repository',
        time: '12:15 PM - 02:00 PM'
    },
    {
        id: 4,
        title: 'Meeting with Design Studio',
        time: '5:30 PM - 06:15 PM'
    }
];
