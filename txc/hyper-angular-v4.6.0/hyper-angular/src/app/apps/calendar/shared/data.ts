// type
import { EventInput } from "@fullcalendar/core";
import { ExternalEvent } from "./event.model";

export const calendarEvents: EventInput[] = [{
    id: '1',
    title: 'Meeting with Mr. Shreyu',
    start: new Date().setDate(new Date().getDate() + 1),
    classNames: 'bg-warning',

},
{
    id: '2',
    title: 'Interview - Backend Engineer',
    start: new Date(),
    end: new Date().setDate(new Date().getDate() + 1),
    classNames: 'bg-success',

},
{
    id: '3',
    title: 'Phone Screen - Frontend Engineer',
    start: new Date().setDate(new Date().getDate() + 8),
    classNames: 'bg-info',

},
{
    id: '4',
    title: 'Buy Design Assets',
    start: new Date().setDate(new Date().getDate() + 4),
    classNames: 'bg-primary',

}];


export const externalEvents: ExternalEvent[] = [
    {
        id: 1,
        title: 'New Theme Release',
        type: 'success'
    },
    {
        id: 2,
        title: 'My Event',
        type: 'info'
    },
    {
        id: 3,
        title: 'Meet Manager',
        type: 'warning'
    },
    {
        id: 4,
        title: 'Create New Theme',
        type: 'danger'
    },
];

