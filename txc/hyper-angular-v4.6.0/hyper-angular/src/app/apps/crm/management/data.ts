import { Client, MonthlyProgressItem, Task } from "../shared/crm.model";

const TASKS: Task[] = [
    {
        icon: 'mdi mdi-file-edit',
        variant: 'primary',
        title: 'Running Project',
        totalTask: 160,
        completedTask: 145,
        progressValue: 91,
    },
    {
        icon: 'mdi mdi-account-multiple',
        variant: 'success',
        title: 'Active Clients',
        totalTask: 85,
        completedTask: 40,
        progressValue: 47,
    },
    {
        icon: 'mdi mdi-account-multiple-plus',
        variant: 'danger',
        title: 'New Request',
        progressValue: 68,
    },
    {
        icon: 'mdi mdi-emoticon-happy',
        variant: 'info',
        title: 'Happy Clients',
        totalTask: 50,
        completedTask: 48,
        progressValue: 90,
    },
];

const PROGRESS_DATA: MonthlyProgressItem[] = [
    {
        avatar: 'assets/images/users/avatar-1.jpg',
        name: 'Adam Baldwin',
        emailId: 'AdamNBaldwin@dayrep.com',
        projectName: 'Admin Dashboard',
        status: 'In Progress',
    },
    {
        avatar: 'assets/images/users/avatar-2.jpg',
        name: 'Peter Wallace',
        emailId: 'PeterGWallace@dayrep.com',
        projectName: 'Landing Page',
        status: 'Completed',
    },
    {
        avatar: 'assets/images/users/avatar-3.jpg',
        name: 'Jacob Dunn',
        emailId: 'JacobEDunn@dayrep.com',
        projectName: 'Logo Design',
        status: 'Pending',
    },
    {
        avatar: 'assets/images/users/avatar-4.jpg',
        name: 'Terry Adams',
        emailId: 'TerryCAdams@dayrep.com',
        projectName: 'Client Project',
        status: 'In Progress',
    },
    {
        avatar: 'assets/images/users/avatar-5.jpg',
        name: 'Jason Stovall',
        emailId: 'JasonJStovall@armyspy.com',
        projectName: 'Figma Work',
        status: 'Pending',
    },
];

const CLIENTS: Client[] = [
    {
        avatar: 'assets/images/users/avatar-1.jpg',
        name: 'Kevin Snowden',
        company: 'Simple Solutions LLC',
        date: 'Jan 05 2022',
    },
    {
        avatar: 'assets/images/users/avatar-2.jpg',
        name: 'Steven Embry',
        company: 'Flipside Records LLC',
        date: 'Jan 10 2022',
    },
    {
        avatar: 'assets/images/users/avatar-3.jpg',
        name: 'James McDonald',
        company: 'Vision Clinics LLC',
        date: 'Jan 12 2022',
    },
    {
        avatar: 'assets/images/users/avatar-4.jpg',
        name: 'Ralph Wolford',
        company: 'Merry-Go-Round LLC',
        date: 'Jan 18 2022',
    },
    {
        avatar: 'assets/images/users/avatar-5.jpg',
        name: 'Tomas Cooper',
        company: 'Museum LLC',
        date: 'Feb 02 2022',
    },
];

const PROJECTS = [
    {
        icon: 'mdi mdi-shopping-outline',
        variant: 'primary',
        title: 'Ecommerce App Design',
        subTitle: 'Dashboard, Pages & Auth Pages',
        hours: 145,
        task: 16,
        assignTo: [
            'assets/images/users/avatar-1.jpg',
            'assets/images/users/avatar-2.jpg',
            'assets/images/users/avatar-3.jpg',
        ],
    },
    {
        icon: 'mdi mdi-account-network',
        variant: 'success',
        title: 'Client Power System',
        subTitle: 'Dashboard, Power System Pages',
        hours: 260,
        task: 24,
        assignTo: [
            'assets/images/users/avatar-4.jpg',
            'assets/images/users/avatar-3.jpg',
        ],
    },
    {
        icon: 'mdi mdi-page-layout-header',
        variant: 'info',
        title: 'Landing Pages Design',
        subTitle: 'Business Landing with Auth Pages',
        hours: 48,
        task: 5,
        assignTo: [
            'assets/images/users/avatar-5.jpg',
            'assets/images/users/avatar-6.jpg',
        ],
    },
    {
        icon: 'mdi mdi-monitor-dashboard',
        variant: 'danger',
        title: 'Business Dashboard Design',
        subTitle: 'Dashboard, Components Pages',
        hours: 24,
        task: 8,
        assignTo: [
            'assets/images/users/avatar-5.jpg',
            'assets/images/users/avatar-6.jpg',
            'assets/images/users/avatar-1.jpg',
            'assets/images/users/avatar-2.jpg',
        ],
    },
];


export { TASKS, PROGRESS_DATA, CLIENTS, PROJECTS };
