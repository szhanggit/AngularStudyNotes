// type
import { ChatUser } from "./chat.model";

export const USERS: ChatUser[] = [
    {
        id: 1,
        name: 'Brandon Smith',
        avatar: 'assets/images/users/avatar-2.jpg',
        lastMessage: 'How are you today?',
        totalUnread: 3,
        lastMessageOn: '4:30am',
        email: 'support@coderthemes.com',
        phone: '+1 456 9595 9594',
        location: 'California, USA',
        languages: 'English, German, Spanish',
        groups: [{ name: 'Work', variant: 'success' }, { name: 'Favourties', variant: 'primary' }]
    },
    {
        id: 2,
        name: 'Maria C',
        avatar: 'assets/images/users/avatar-10.jpg',
        lastMessage: 'Hey! a reminder for tomorrow\'s meeting?',
        totalUnread: 0,
        lastMessageOn: '5:30am',
        email: 'support@coderthemes.com',
        phone: '+1 456 9595 9594',
        location: 'New York, USA',
        languages: 'English, German, Spanish',
        groups: [{ name: 'Work', variant: 'success' }, { name: 'Friends', variant: 'primary' }]
    },
    {
        id: 3,
        name: 'Dominic A',
        avatar: 'assets/images/users/avatar-8.jpg',
        lastMessage: 'Are we going to have this week\'s planning meeting?',
        totalUnread: 2,
        lastMessageOn: 'Thu',
        email: 'support@coderthemes.com',
        phone: '+1 456 9595 9594',
        location: 'New Jersey, USA',
        languages: 'English, German, Spanish',
        groups: [{ name: 'Work', variant: 'success' }, { name: 'Favourites', variant: 'primary' }]

    },
    {
        id: 4,
        name: 'Ronda D',
        avatar: 'assets/images/users/avatar-9.jpg',
        lastMessage: 'Please check these design assets..',
        totalUnread: 0,
        lastMessageOn: 'Wed',
        email: 'support@coderthemes.com',
        phone: '+1 456 9595 9594',
        location: 'California, USA',
        languages: 'English, German, Spanish',
        groups: [{ name: 'Work', variant: 'success' }, { name: 'Friends', variant: 'primary' }]
    },
    {
        id: 5,
        name: 'Michael H',
        avatar: 'assets/images/users/avatar-3.jpg',
        lastMessage: 'Are you free for 15 mins? I would like to discuss something',
        totalUnread: 6,
        lastMessageOn: 'Tue',
        email: 'support@coderthemes.com',
        phone: '+1 456 9595 9594',
        location: 'New York, USA',
        languages: 'English, German, Spanish',
        groups: [{ name: 'Work', variant: 'success' }, { name: 'Friends', variant: 'primary' }]
    },
    {
        id: 6,
        name: 'Thomas R',
        avatar: 'assets/images/users/avatar-5.jpg',
        lastMessage: 'Let\'s have meeting today between me, you and Tony...',
        totalUnread: 0,
        lastMessageOn: 'Tue',
        email: 'support@coderthemes.com',
        phone: '+1 456 9595 9594',
        location: 'New Jersey, USA',
        languages: 'English, German, Spanish',
        groups: [{ name: 'Work', variant: 'success' }, { name: 'Friends', variant: 'primary' }]
    },
    {
        id: 7,
        name: 'Thomas J',
        avatar: 'assets/images/users/avatar-6.jpg',
        lastMessage: 'Howdy?',
        totalUnread: 0,
        lastMessageOn: 'Tue',
        email: 'support@coderthemes.com',
        phone: '+1 456 9595 9594',
        location: 'New York, USA',
        languages: 'English, German, Spanish',
        groups: [{ name: 'Work', variant: 'success' }, { name: 'Favourites', variant: 'primary' }]
    },
    {
        id: 8,
        name: 'Rikcy J',
        avatar: 'assets/images/users/avatar-1.jpg',
        lastMessage: 'Are you interested in learning?',
        totalUnread: 28,
        lastMessageOn: 'Mon',
        email: 'support@coderthemes.com',
        phone: '+1 456 9595 9594',
        location: 'New Jersey, USA',
        languages: 'English, German, Spanish',
        groups: [{ name: 'Work', variant: 'success' }, { name: 'Friends', variant: 'primary' }]
    }
];