import { DailyTask, OverviewItem, Project, Statistics, TeamMember } from "../shared/crm.model";

const PROJECTLIST: Project[] = [
    {
        name: 'Project Dashboard',
        task: 'New Task Assign',
        createdOn: '4 Hrs ago',
        teamMembers: ['assets/images/users/avatar-1.jpg', 'assets/images/users/avatar-2.jpg'],
    },
    {
        name: 'Admin Template',
        task: 'New Task Assign',
        createdOn: '7 Hrs ago',
        teamMembers: ['assets/images/users/avatar-3.jpg', 'assets/images/users/avatar-4.jpg'],
    },
    {
        name: 'Client Project',
        task: 'New Task Assign',
        createdOn: '1 Day ago',
        teamMembers: ['assets/images/users/avatar-5.jpg', 'assets/images/users/avatar-6.jpg'],
    },
];

const PROJECT_STATISTICS: Statistics[] = [
    {
        icon: 'mdi mdi-file-document-edit',
        variant: 'primary',
        title: 'Active Project',
        stats: 85,
    },
    {
        icon: 'mdi mdi-account-group',
        variant: 'success',
        title: 'Total Employees',
        stats: 32,
    },
    {
        icon: 'mdi mdi-account-star',
        variant: 'info',
        title: 'Project Review',
        stats: 40,
    },
    {
        icon: 'mdi mdi-folder-plus',
        variant: 'warning',
        title: 'New Project',
        stats: 25,
    },
];

const PROJECT_OVERVIEW: OverviewItem[] = [
    {
        title: 'Product Design',
        totalProjects: 26,
        totalEmployees: 4,
        variant: 'primary'
    },
    {
        title: 'Web Development',
        totalProjects: 30,
        totalEmployees: 5,
        variant: 'danger'
    },
    {
        title: 'Illustration Design',
        totalProjects: 12,
        totalEmployees: 3,
        variant: 'success'
    },
    {
        title: 'UI/UX Design',
        totalProjects: 8,
        totalEmployees: 4,
        variant: 'warning'
    }
];

const DAILY_TASKS: DailyTask[] = [
    {
        title: 'Landing Page Design',
        shortDesc: 'Create a new landing page (Saas Product)',
        time: '2 Hrs ago',
        teamSize: 5,
    },
    {
        title: 'Admin Dashboard',
        shortDesc: 'Create a new Admin dashboard',
        time: '3 Hrs ago',
        teamSize: 2,
    },
    {
        title: 'Client Work',
        shortDesc: 'Create a new Power Project (Sktech design)',
        time: '5 Hrs ago',
        teamSize: 2,
    },
    {
        title: 'UI/UX Design',
        shortDesc: 'Create a new UI Kit in figma',
        time: '6 Hrs ago',
        teamSize: 3,
    },
];

const TEAM: TeamMember[] = [
    {
        avatar: 'assets/images/users/avatar-2.jpg',
        name: 'Risa Pearson',
        designation: 'UI/UX Designer',
        experience: '2.5 Year',
    },
    {
        avatar: 'assets/images/users/avatar-3.jpg',
        name: 'Margaret D. Evans',
        designation: 'PHP Developer',
        experience: '2 Year',
    },
    {
        avatar: 'assets/images/users/avatar-4.jpg',
        name: 'Bryan J. Luellen',
        designation: 'Front end Developer',
        experience: '1 Year',
    },
    {
        avatar: 'assets/images/users/avatar-5.jpg',
        name: 'Kathryn S. Collier',
        designation: 'UI/UX Designer',
        experience: '3 Year',
    },
    {
        avatar: 'assets/images/users/avatar-1.jpg',
        name: 'Timothy Kauper',
        designation: 'Backend Developer',
        experience: '2 Year',
    },
    {
        avatar: 'assets/images/users/avatar-6.jpg',
        name: 'Zara Raws',
        designation: 'Python Developer',
        experience: '1 Year',
    },
];

export { PROJECTLIST, PROJECT_OVERVIEW, PROJECT_STATISTICS, DAILY_TASKS, TEAM };

