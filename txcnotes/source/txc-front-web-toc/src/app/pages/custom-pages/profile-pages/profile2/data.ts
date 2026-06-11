import { Experience, ProfileProjectItem, TimelinePost } from "./profile2.model";

const EXPERIENCE: Experience[] = [
    {
        id: 1,
        title: "Lead designer / Developer",
        company: "websitename.com ",
        year: "2015 - 18",
        description: "Everyone realizes why a new common language would be desirable: one could refuse to pay expensive translators. To achieve this, it would be necessary to have uniform grammar, pronunciation and more common words.",
    },
    {
        id: 2,
        title: "Senior Graphic Designer",
        company: "Software Inc. ",
        year: "2012 - 15",
        description: "If several languages coalesce, the grammar of the resulting language is more simple and regular than that of the individual languages. The new common language will be more simple and regular than the existing European languages.",
    },
    {
        id: 3,
        title: "Graphic Designer",
        company: "Coderthemes Design LLP",
        year: "2010 - 12",
        description: "The European languages are members of the same family. Their separate existence is a myth. For science music sport etc, Europe uses the same vocabulary. The languages only differ in their grammar their pronunciation."
    }
];


const PROJECTS: ProfileProjectItem[] = [
    {
        id: 1,
        clientName: " Halette Boivin",
        clientAvatar: "assets/images/users/avatar-2.jpg",
        projectName: "App design and development",
        startDate: "01/01/2015",
        dueDate: "10/15/2018",
        status: "Work in Progress",
    },
    {
        id: 2,
        clientName: " Halette Boivin",
        clientAvatar: "assets/images/users/avatar-4.jpg",
        projectName: "App design and development",
        startDate: "01/01/2015",
        dueDate: "10/15/2018",
        status: "Pending",
    },
    {
        id: 3,
        clientName: " Halette Boivin",
        clientAvatar: "assets/images/users/avatar-6.jpg",
        projectName: "App design and development",
        startDate: "01/01/2015",
        dueDate: "10/15/2018",
        status: "Done",
    },
    {
        id: 4,
        clientName: " Halette Boivin",
        clientAvatar: "assets/images/users/avatar-1.jpg",
        projectName: "App design and development",
        startDate: "01/01/2015",
        dueDate: "10/15/2018",
        status: "Work in Progress",
    },
    {
        id: 5,
        clientName: " Halette Boivin",
        clientAvatar: "assets/images/users/avatar-3.jpg",
        projectName: "App design and development",
        startDate: "01/01/2015",
        dueDate: "10/15/2018",
        status: "Coming Soon",
    }
];


const POSTS: TimelinePost[] = [
    {
        id: 1,
        author: {
            id: 4,
            name: 'Jeremy Tomlinson',
            avatar: 'assets/images/users/avatar-3.jpg',
        },
        postedOn: 'about 2 minuts ago',
        content:
            '<p>Story based around the idea of time lapse, animation to post soon!</p><img src="assets/images/small/small-1.jpg" alt="post-img" class="rounded me-1" height="60" /><img src="assets/images/small/small-2.jpg" alt="post-img" class="rounded me-1" height="60" /><img src="assets/images/small/small-3.jpg" alt="post-img" class="rounded me-1" height="60" />',
        isLiked: false,
        totalLikes: '12',
        engagement: true,
    },
    {
        id: 2,
        author: {
            id: 1,
            name: 'Thelma Fridley',
            avatar: 'assets/images/users/avatar-4.jpg',
        },
        postedOn: 'about 1 hour ago',
        content:
            '<div class="font-16 text-center fst-italic text-dark"><i class="mdi mdi-format-quote-open font-20"></i> Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa.</div>',
        totalLikes: '28',
        totalComments: '',
        isLiked: true,
        comments: [
            {
                id: 1,
                content: 'Nice work, makes me think of The Money Pit.',
                postedOn: '3 hours ago',
                author: {
                    id: 2,
                    name: 'Jeremy Tomlinson',
                    avatar: 'assets/images/users/avatar-3.jpg',
                },
                isLiked: true,
                replies: [
                    {
                        id: 3,
                        content:
                            "i'm in the middle of a timelapse animation myself! (Very different though.) Awesome stuff.",
                        postedOn: '5 hours ago',
                        author: {
                            id: 3,
                            name: 'Thelma Fridley',
                            avatar: 'assets/images/users/avatar-4.jpg',
                        },
                    },
                ],
            },
        ],
        engagement: true,
    },
    {
        id: 3,
        author: {
            id: 4,
            name: 'Martin Williamson',
            avatar: 'assets/images/users/avatar-6.jpg',
        },
        postedOn: 'about 20 minuts ago',
        content:
            '<p>The parallax is a little odd but O.o that house build is awesome!!</p>' +
            '<iframe src="https://player.vimeo.com/video/87993762" height="300" class="img-fluid border-0"></iframe>',
        isLiked: false,
        engagement: false,
    },
];
export { EXPERIENCE, PROJECTS, POSTS };