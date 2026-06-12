import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModalModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Select2Module } from 'ng-select2-component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { PageTitleModule } from 'src/app/shared/page-title/page-title.module';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { CRMClientsComponent } from './clients/clients.component';
import { CrmRoutingModule } from './crm-routing.module';
import { CRMDashboardComponent } from './dashboard/dashboard.component';
import { CRMManagementComponent } from './management/management.component';
import { CRMOrderListComponent } from './order-list/order-list.component';
import { DailyTaskComponent } from './project/daily-task/daily-task.component';
import { MonthlyTargetComponent } from './project/monthly-target/monthly-target.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectOverviewComponent } from './project/project-overview/project-overview.component';
import { ProjectStatisticsComponent } from './project/project-statistics/project-statistics.component';
import { ProjectSummaryComponent } from './project/project-summary/project-summary.component';
import { CRMProjectComponent } from './project/project.component';
import { StatisticsComponent } from './project/statistics/statistics.component';
import { TeamMembersComponent } from './project/team-members/team-members.component';
import { RevenueStatisticsComponent } from './management/revenue-statistics/revenue-statistics.component';
import { ClientWidgetComponent } from './management/client-widget/client-widget.component';
import { MonthlyProgressComponent } from './management/monthly-progress/monthly-progress.component';
import { TaskStatusComponent } from './management/task-status/task-status.component';
import { ProjectWidgetComponent } from './management/project-widget/project-widget.component';
import { CalendarComponent } from './management/calendar/calendar.component';



@NgModule({
  declarations: [
    CRMDashboardComponent,
    CRMOrderListComponent,
    CRMClientsComponent,
    CRMProjectComponent,
    ProjectSummaryComponent,
    MonthlyTargetComponent,
    ProjectStatisticsComponent,
    ProjectListComponent,
    StatisticsComponent,
    ProjectOverviewComponent,
    DailyTaskComponent,
    TeamMembersComponent,
    CRMManagementComponent,
    RevenueStatisticsComponent,
    ClientWidgetComponent,
    MonthlyProgressComponent,
    TaskStatusComponent,
    ProjectWidgetComponent,
    CalendarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SimplebarAngularModule,
    Select2Module,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    NgbAlertModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgApexchartsModule,
    WidgetModule,
    PageTitleModule,
    CrmRoutingModule
  ]
})
export class CrmModule { }
