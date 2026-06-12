import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// full calendar 
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

//modules
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { CalendarRoutingModule } from './calendar-routing.module';

// components
import { CalendarComponent } from './calendar/calendar.component';
import { EventComponent } from './event/event.component';


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin,
  timeGridPlugin, listPlugin
]);


@NgModule({
  declarations: [
    CalendarComponent,
    EventComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    NgbModalModule,
    PageTitleModule,
    CalendarRoutingModule
  ]
})
export class CalendarModule { }
