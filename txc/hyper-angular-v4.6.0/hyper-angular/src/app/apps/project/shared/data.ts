// type
import { GanttProjectItem, GanttTaskItem, Project } from './projects.model';

const DUMMY_PROJECTS: Project[] = [
    {
        id: 1,
        title: 'Ubold v3.0 - Redesign',
        state: 'Finished',
        shortDesc: 'With supporting text below as a natural lead-in to additional contenposuere erat a ante',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 15800,
        totalTasks: 21,
        totalComments: 741,
        totalMembers: 10,
        progress: 100,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62],
                backgroundColor: 'rgba(10, 207, 151, 0.3)',
                borderColor: '#0acf97',
                tension: 0.4,
                fill: {
                    target: 'origin',
                    above: 'rgba(10, 207, 151, 0.3)',
                },
                pointBackgroundColor: 'transparent',
                pointHoverBackgroundColor: 'transparent',
                pointBorderColor: '#0acf97',
                pointHoverBorderColor: '#0acf97',
                pointBorderWidth: 1.5,
                capBezierPoints: true,
            }, {
                label: 'Plan Tasks',
                data: [42, 58, 66, 93, 82, 105, 92],
                backgroundColor: 'transparent',
                borderColor: '#727cf5',
                borderDash: [5, 5],
                tension: 0.4,
                pointBackgroundColor: 'transparent',
                pointHoverBackgroundColor: 'transparent',
                pointBorderColor: '#727cf5',
                pointHoverBorderColor: '#727cf5',
                pointBorderWidth: 1.5,
                capBezierPoints: true,
            }]
        }
    },
    {
        id: 2,
        title: 'Minton v3.0 - Redesign',
        state: 'Ongoing',
        shortDesc: 'This card has supporting text below as a natural lead-in to additional content is a little bit longer',
        startDate: '17 March 2019',
        startTime: '1:00 PM',
        endDate: '22 December 2019',
        endTime: '1:00 PM',
        totalBudget: 15200,
        totalTasks: 81,
        totalComments: 103,
        totalMembers: 6,
        progress: 21,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62],
                backgroundColor: 'rgba(10, 207, 151, 0.3)',
                borderColor: '#0acf97',
            }, {
                label: 'Plan Tasks',
                data: [42, 58, 66, 93, 82, 105, 92],
                backgroundColor: 'transparent',
                borderColor: '#727cf5',
                borderDash: [5, 5]
            }]
        }
    },
    {
        id: 3,
        title: 'Hyper v2.1 - Angular and Django',
        state: 'Ongoing',
        shortDesc: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 14000,
        totalTasks: 12,
        totalComments: 48,
        totalMembers: 2,
        progress: 66,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62],
                backgroundColor: 'rgba(10, 207, 151, 0.3)',
                borderColor: '#0acf97',
            }, {
                label: 'Plan Tasks',
                data: [42, 58, 66, 93, 82, 105, 92],
                backgroundColor: 'transparent',
                borderColor: '#727cf5',
                borderDash: [5, 5]
            }]
        }
    },
    {
        id: 4,
        title: 'Hyper v2.1 - React, Webpack',
        state: 'Finished',
        shortDesc: 'Some quick example text to build on the card title and make up the bulk of the card\'s content',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 20000,
        totalTasks: 50,
        totalComments: 1024,
        totalMembers: 5,
        progress: 100,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62],
                backgroundColor: 'rgba(10, 207, 151, 0.3)',
                borderColor: '#0acf97',
            }, {
                label: 'Plan Tasks',
                data: [42, 58, 66, 93, 82, 105, 92],
                backgroundColor: 'transparent',
                borderColor: '#727cf5',
                borderDash: [5, 5]
            }]
        }
    },
    {
        id: 5,
        title: 'Hyper 2.2 - Vue.Js and Laravel',
        state: 'Ongoing',
        image: 'assets/images/projects/project-1.jpg',
        shortDesc: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 21000,
        totalTasks: 3,
        totalComments: 104,
        totalMembers: 3,
        progress: 45,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62],
                backgroundColor: 'rgba(10, 207, 151, 0.3)',
                borderColor: '#0acf97',
            }, {
                label: 'Plan Tasks',
                data: [42, 58, 66, 93, 82, 105, 92],
                backgroundColor: 'transparent',
                borderColor: '#727cf5',
                borderDash: [5, 5]
            }]
        }
    },
    {
        id: 6,
        title: 'Hyper 2.3 - Rails, NodeJs, Mean',
        state: 'Finished',
        image: 'assets/images/projects/project-2.jpg',
        shortDesc: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 25000,
        totalTasks: 11,
        totalComments: 201,
        totalMembers: 5,
        progress: 100,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62],
                backgroundColor: 'rgba(10, 207, 151, 0.3)',
                borderColor: '#0acf97',
            }, {
                label: 'Plan Tasks',
                data: [42, 58, 66, 93, 82, 105, 92],
                backgroundColor: 'transparent',
                borderColor: '#727cf5',
                borderDash: [5, 5]
            }]
        }
    },
    {
        id: 7,
        title: 'Hyper - Landing page and UI Kit',
        state: 'Ongoing',
        image: 'assets/images/projects/project-3.jpg',
        shortDesc: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 4000,
        totalTasks: 3,
        totalComments: 104,
        totalMembers: 3,
        progress: 45,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',

                data: [32, 42, 42, 62, 52, 75, 62]
            }, {
                label: 'Plan Tasks',

                data: [42, 58, 66, 93, 82, 105, 92]
            }]
        }
    },
    {
        id: 8,
        title: 'Hyper 3.0 - Scoping',
        state: 'Finished',
        image: 'assets/images/projects/project-4.jpg',
        shortDesc: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.',
        startDate: '17 March 2018',
        startTime: '1:00 PM',
        endDate: '22 December 2018',
        endTime: '1:00 PM',
        totalBudget: 20000,
        totalTasks: 3,
        totalComments: 104,
        totalMembers: 5,
        progress: 45,
        progressData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Completed Tasks',
                data: [32, 42, 42, 62, 52, 75, 62],
                backgroundColor: 'rgba(10, 207, 151, 0.3)',
                borderColor: '#0acf97',
            }, {
                label: 'Plan Tasks',
                data: [42, 58, 66, 93, 82, 105, 92],
                backgroundColor: 'transparent',
                borderColor: '#727cf5',
                borderDash: [5, 5]
            }]
        }
    }];

const GanttTasks: GanttTaskItem[] = [{
    id: '1',
    name: 'Draft the new contract document for sales team',
    start: '2019-07-16',
    end: '2019-07-20',
    progress: 55,
    dependencies: ''
},
{
    id: '2',
    name: 'Find out the old contract documents',
    start: '2019-07-19',
    end: '2019-07-21',
    progress: 85,
    dependencies: '1'
},
{
    id: '3',
    name: 'Organize meeting with sales associates to understand need in detail',
    start: '2019-07-21',
    end: '2019-07-22',
    progress: 80,
    dependencies: '2'
},
{
    id: '4',
    name: 'iOS App home page',
    start: '2019-07-15',
    end: '2019-07-17',
    progress: 80,
    dependencies: ''
},
{
    id: '5',
    name: 'Write a release note',
    start: '2019-07-18',
    end: '2019-07-22',
    progress: 65,
    dependencies: '4'
},
{
    id: '6',
    name: 'Setup new sales project',
    start: '2019-07-20',
    end: '2019-07-31',
    progress: 15,
    dependencies: ''
},
{
    id: '7',
    name: 'Invite user to a project',
    start: '2019-07-25',
    end: '2019-07-26',
    progress: 99,
    dependencies: '6'
},
{
    id: '8',
    name: 'Coordinate with business development',
    start: '2019-07-28',
    end: '2019-07-30',
    progress: 35,
    dependencies: '7'
},
{
    id: '9',
    name: 'Kanban board design',
    start: '2019-08-01',
    end: '2019-08-03',
    progress: 25,
    dependencies: '8'
},
{
    id: '10',
    name: 'Enable analytics tracking',
    start: '2019-08-05',
    end: '2019-08-07',
    progress: 60,
    dependencies: '9'
}];

const GanttProjects: GanttProjectItem[] = [
    {
        id: 'proj101',
        name: 'Lunar',
        status: 'On-Track',
        icon: 'uil uil-moonset',
    },
    {
        id: 'proj102',
        name: 'Dark Moon',
        status: 'On-Track',
        icon: 'uil uil-moon-eclipse'
    },
    {
        id: 'proj103',
        name: 'Aurora',
        status: 'Locked',
        icon: 'uil uil-mountains'
    },
    {
        id: 'proj104',
        name: 'Blue Moon',
        status: 'Locked',
        icon: 'uil uil-moon'
    },
    {
        id: 'proj105',
        name: 'Casanova',
        status: 'Delayed',
        icon: 'uil uil-ship'
    },
    {
        id: 'proj106',
        name: 'Darwin',
        status: 'On-Track',
        icon: 'uil uil-subway-alt'
    },
    {
        id: 'proj107',
        name: 'Eagle',
        status: 'Delayed',
        icon: 'uil uil-gold'
    }
];

export { DUMMY_PROJECTS, GanttTasks, GanttProjects };
