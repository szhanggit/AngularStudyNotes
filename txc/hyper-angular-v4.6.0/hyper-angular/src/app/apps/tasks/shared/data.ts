// type
import { KanbanBoardTaskItem, ListTaskItem } from "./tasks.model";

// images
const avatarImg2 = 'assets/images/users/avatar-9.jpg';
const avatarImg3 = 'assets/images/users/avatar-3.jpg';
const avatarImg4 = 'assets/images/users/avatar-4.jpg';
const avatarImg5 = 'assets/images/users/avatar-5.jpg';
const avatarImg6 = 'assets/images/users/avatar-6.jpg';

const todayTasks: ListTaskItem[] = [
    {
        id: 1,
        title: 'Draft the new contract document for sales team',
        assigned_to: 'Arya Stark',
        assignee_avatar: avatarImg2,
        due_date: 'Today 10am',
        completed: false,
        priority: 'High',
        stage: 'Todo',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: true },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
                replies: [{
                    id: 4,
                    author: 'Thelma Fridley',
                    text: 'i\'m in the middle of a timelapse animation myself!(Very different though :)',
                    posted_on: '6:30pm',
                    author_avatar: avatarImg4,
                }]
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 2,
        title: 'iOS App home page',
        assigned_to: 'James B',
        assignee_avatar: avatarImg3,
        due_date: 'Today 4pm',
        completed: false,
        stage: 'In-progress',
        priority: 'High',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 3,
        title: 'Write a release note',
        assigned_to: 'Kevin C',
        assignee_avatar: avatarImg4,
        due_date: 'Today 4pm',
        completed: false,
        stage: 'In-progress',
        priority: 'Medium',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
]

const upcomingTasks: ListTaskItem[] = [
    {
        id: 4,
        title: 'Invite user to a project',
        assigned_to: 'Arya Stark',
        assignee_avatar: avatarImg2,
        due_date: 'Tomorrow 10am',
        stage: 'Todo',
        completed: false,
        priority: 'Low',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 5,
        title: 'Enable analytics tracking',
        assigned_to: 'James B',
        assignee_avatar: avatarImg5,
        due_date: '27 Aug 10am',
        completed: false,
        stage: 'Review',
        priority: 'Low',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 6,
        title: 'Code HTML email template',
        assigned_to: 'Kevin C',
        assignee_avatar: avatarImg6,
        due_date: 'No Due Date',
        completed: false,
        stage: 'Review',
        priority: 'Medium',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
]

const otherTasks: ListTaskItem[] = [
    {
        id: 7,
        title: 'Coordinate with business development',
        assigned_to: 'Arya Stark',
        assignee_avatar: avatarImg2,
        due_date: 'No Due Date',
        stage: 'Todo',
        completed: false,
        priority: 'High',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,

            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 8,
        title: 'Kanban board design',
        assigned_to: 'James B',
        assignee_avatar: avatarImg5,
        stage: 'Review',
        due_date: '30 Aug 10am',
        completed: false,
        priority: 'Low',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 9,
        title: 'Draft the new contract document for sales team',
        assigned_to: 'Kevin C',
        assignee_avatar: avatarImg6,
        due_date: 'No Due Date',
        stage: 'Done',
        completed: false,
        priority: 'Medium',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
    {
        id: 10,
        title: 'Draft the new contract document for vendor Abc',
        assigned_to: 'Kevin C',
        assignee_avatar: avatarImg6,
        due_date: '2 Sep 10am',
        completed: false,
        stage: 'Done',
        priority: 'Medium',
        checklists: [
            { id: 1, title: 'Find out the old contract documents', completed: false },
            {
                id: 2,
                title: 'Organize meeting sales associates to understand need in detail',
                completed: false,
            },
            {
                id: 3,
                title: 'Make sure to cover every small details',
                completed: false,
            },
        ],
        description:
            // tslint:disable-next-line: max-line-length
            '<p><b>This is a task description with markup support</b></p><ul><li>Select a text to reveal the toolbar.</li><li>Edit rich document on-the-fly, so elastic!</li></ul><p>End of air-mode area</p>',
        attachments: [
            { id: 1, filename: 'sales-assets.zip', size: '2.3 MB' },
            { id: 2, filename: 'new-contarcts.docx', size: '1.3 MB' },
        ],
        comments: [
            {
                id: 1,
                author: 'Arya Stark',
                text: 'Should I review the last 3 years legal documents as well?',
                posted_on: '4:30am',
                author_avatar: avatarImg2,
            },
            {
                id: 2,
                author: 'Gary Somya',
                text: '@Arya FYI..I have created some general guidelines last year.',
                posted_on: '3:30am',
                author_avatar: avatarImg3,
            },
        ],
    },
]


const kanbanTasks: KanbanBoardTaskItem[] = [
    {
        id: 1,
        title: 'iOS App home page',
        date: '18 Jul 2019',
        priority: 'High',
        assignee_avatar: 'assets/images/users/avatar-2.jpg',
        assigned_to: 'Robert Clair',
        comments: 7,
        status: 'todo',
        project: 'iOS'
    },
    {
        id: 2,
        title: 'Topnav layout design',
        date: '19 Jul 2019',
        priority: 'Low',
        assigned_to: 'Coderthemes Design',
        assignee_avatar: 'assets/images/users/avatar-7.jpg',
        comments: 11,
        status: 'todo',
        project: 'Hyper'
    },
    {
        id: 3,
        title: 'Invite Greeva to team',
        date: '14 Jul 2019',
        priority: 'Medium',
        assigned_to: 'Lucas Hardy',
        assignee_avatar: 'assets/images/users/avatar-2.jpg',
        comments: 10,
        status: 'todo',
        project: 'CRM'
    },
    {
        id: 4,
        title: 'Write a release note',
        date: '22 Jul 2019',
        priority: 'Low',
        assigned_to: 'Sean Paul',
        assignee_avatar: 'assets/images/users/avatar-7.jpg',
        comments: 11,
        status: 'inprogress',
        project: 'Hyper'
    },
    {
        id: 5,
        title: 'Enable analytics tracking',
        date: '21 Jul 2019',
        priority: 'Normal',
        assigned_to: 'Loius Fillip',
        assignee_avatar: 'assets/images/users/avatar-7.jpg',
        comments: 2,
        status: 'inprogress',
        project: 'Hyper'
    },
    {
        id: 6,
        title: 'Kanban board design',
        date: '22 Jul 2019',
        priority: 'High',
        assigned_to: 'Coderthemes',
        assignee_avatar: 'assets/images/users/avatar-7.jpg',
        comments: 101,
        status: 'review',
        project: 'CRM'
    },
    {
        id: 7,
        title: 'Implement HTML email template',
        date: '19 Jul 2019',
        priority: 'Normal',
        assigned_to: 'Shreyu N',
        assignee_avatar: 'assets/images/users/avatar-7.jpg',
        comments: 14,
        status: 'review',
        project: 'Hyper'
    },
    {
        id: 8,
        title: 'Dashboard design',
        date: '21 Jul 2019',
        priority: 'High',
        assigned_to: 'Shreyu N',
        assignee_avatar: 'assets/images/users/avatar-7.jpg',
        comments: 121,
        status: 'done',
        project: 'CRM'
    },
];

// all tasks
const allTasks = [...todayTasks, ...upcomingTasks, ...otherTasks]


export { allTasks, todayTasks, upcomingTasks, otherTasks, kanbanTasks };