import { ChatMessage, ChatUser } from "../shared/chat.model";
import { USERS } from "../shared/data";

//sender
const defaultTo: ChatUser = {
    id: 9,
    name: 'Shreyu N',
    avatar: 'assets/images/users/avatar-7.jpg',
    email: 'support@coderthemes.com',
    phone: '+1 456 9595 9594',
    location: 'California, USA',
    languages: 'English, German, Spanish',
    groups: [{ name: 'Work', variant: 'success' }, { name: 'Favourties', variant: 'primary' }]
};

const messages: ChatMessage[] = [];
for (const user of USERS) {
    messages.push(
        {
            id: 1,
            message: {
                type: 'text',
                value: { text: 'Hello!' }
            },
            to: defaultTo,
            from: user,
            sendOn: '10:00'
        },
        {
            id: 2,
            message: {
                type: 'text',
                value: { text: 'Hi, How are you? What about our next meeting?' }
            },
            to: user,
            from: defaultTo,
            sendOn: '10:01'
        },
        {
            id: 3,
            message: {
                type: 'text',
                value: { text: 'Yeah everything is fine' }
            },
            to: defaultTo,
            from: user,
            sendOn: '10:01'
        },
        {
            id: 4,
            message: {
                type: 'text',
                value: { text: 'Awesome!' }
            },
            to: user,
            from: defaultTo,
            sendOn: '10:02'
        },
        {
            id: 5,
            message: {
                type: 'text',
                value: { text: 'Let\'s have it today if you are free' }
            },
            to: defaultTo,
            from: user,
            sendOn: '10:03'
        },
        {
            id: 6,
            message: {
                type: 'text',
                value: { text: 'Sure thing! let me know if 2pm works for you' }
            },
            to: user,
            from: defaultTo,
            sendOn: '10:03'
        },
        {
            id: 7,
            message: {
                type: 'text',
                value: { text: 'Sorry, I have another meeting scheduled at 2pm. Can we have it at 3pm instead?' }
            },
            to: defaultTo,
            from: user,
            sendOn: '10:04'
        },
        {
            id: 8,
            message: {
                type: 'text',
                value: { text: 'We can also discuss about the presentation talk format if you have some extra mins' }
            },
            to: defaultTo,
            from: user,
            sendOn: '10:04'
        },
        {
            id: 9,
            message: {
                type: 'text',
                value: { text: '3pm it is. Sure, let\'s discuss about presentation format, it would be great to finalize today. I am attaching the last year format and assets here..' }
            },
            to: user,
            from: defaultTo,
            sendOn: '10:05'
        },
        {
            id: 10,
            message: {
                type: 'file',
                value: {
                    file: 'Hyper-admin.zip',
                    size: '2.3MB'
                }
            },
            to: user,
            from: defaultTo,
            sendOn: '10:05'
        },
    );
}


export { messages };