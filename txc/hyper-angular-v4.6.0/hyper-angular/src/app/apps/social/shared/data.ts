// type
import { Post, SocialEvent, Topic, Person } from "./social.model";

export const posts: Post[] = [
    {
        id: 1,
        author: {
            id: 1,
            name: 'Jeremy Tomlinson',
            avatar: 'assets/images/users/avatar-3.jpg'
        },
        postedOn: 'about 2 minuts ago',
        scope: 'Public',
        // tslint:disable-next-line: max-line-length
        content: '<div class="font-16 text-center text-dark my-3"><i class="mdi mdi-format-quote-open font-20"></i> Leave one wolf alive and the sheep are never safe. When people ask you what happened here, tell them the North remembers. Tell them winter came for House Frey.</div>',
        totalLikes: '2k',
        totalComments: '200',
        isLiked: true,
        comments: [
            {
                id: 1,
                content: 'This is awesome! Proud of sis :) Waiting for you to come back to winterfall',
                postedOn: '2 mins ago',
                author: {
                    id: 2,
                    name: 'Sansa Stark',
                    avatar: 'assets/images/users/avatar-9.jpg'
                },
                isLiked: true,
                replies: [{
                    id: 3,
                    content: 'I swear! She won\'t be able to reach to winterfall',
                    postedOn: '1 min ago',
                    author: {
                        id: 3,
                        name: 'Cersei Lannister',
                        avatar: 'assets/images/users/avatar-10.jpg'
                    }
                }]
            }
        ]
    },
    {
        id: 2,
        author: {
            id: 4,
            name: 'Jon Snow',
            avatar: 'assets/images/users/avatar-5.jpg'
        },
        postedOn: 'about 20 minuts ago',
        scope: 'Public',
        // tslint:disable-next-line: max-line-length
        content: '<div class="my-3"><p>"Feeling awesome at the wall!"</p><div class="row"><div class="col-sm-8"><img src="assets/images/small/small-4.jpg" alt="post-img" class="rounded mr-1 mb-3 mb-sm-0 img-fluid" /></div><div class="col"><img src="assets/images/small/small-2.jpg" alt="post-img" class="rounded mr-1 img-fluid mb-3" /><img src="assets/images/small/small-3.jpg" alt="post-img" class="rounded mr-1 img-fluid" /></div></div></div>',
        totalLikes: '1.2k',
        totalComments: '148',
        isLiked: false,
        comments: [
            {
                id: 1,
                content: 'This is awesome! Proud of you bro :)',
                postedOn: '2 mins ago',
                author: {
                    id: 2,
                    name: 'Sansa Stark',
                    avatar: 'assets/images/users/avatar-9.jpg'
                },
                isLiked: false,
                replies: []
            }
        ]
    }
];

export const peopleToFollow: Person[] = [
    {
        id: 1,
        name: 'Robb Stark',
        status: 'The first king in the North',
        avatar: 'assets/images/users/avatar-2.jpg'
    },
    {
        id: 2,
        name: 'Sansa Stark',
        status: 'Lady of winterfall',
        avatar: 'assets/images/users/avatar-9.jpg'
    },
    {
        id: 3,
        name: 'Cersei Lannister',
        status: 'Queen of the Seven Kingdoms',
        avatar: 'assets/images/users/avatar-10.jpg'
    },
    {
        id: 4,
        name: 'Daenerys Targaryen',
        status: 'The dragon queen',
        avatar: 'assets/images/users/avatar-7.jpg'
    },
    {
        id: 5,
        name: 'Adhamd Annaway',
        status: 'I am available!',
        avatar: 'assets/images/users/avatar-4.jpg'
    }
];

export const news: Topic[] = [{
    id: 1,
    title: 'Golden Globes',
    description: 'The 27 Best moments from the Golden Globe Awards'
}, {
    id: 2,
    title: 'World Cricket',
    description: 'India has won ICC T20 World Cup Yesterday'
}, {
    id: 3,
    title: 'Antartica',
    description: 'Metling of Totten Glacier could cause high risk to areas near by sea'
}];

export const socialEvents: SocialEvent[] = [{
    id: 1,
    name: '3 events this week',
    icon: 'uil uil-calendar-alt',
},
{
    id: 2,
    name: 'Eva\'s birthday today',
    icon: 'uil uil-calender',
},
{
    id: 3,
    name: 'Jenny\'s wedding tomorrow',
    icon: 'uil uil-bookmark',
}
];