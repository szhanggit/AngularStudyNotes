import { Component, OnInit } from '@angular/core';

// types
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { DailyTask, OverviewItem, Project, Statistics, TeamMember } from '../shared/crm.model';

// data
import { DAILY_TASKS, PROJECTLIST, PROJECT_OVERVIEW, PROJECT_STATISTICS, TEAM } from './data';

@Component({
  selector: 'app-crm-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class CRMProjectComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  projects: Project[] = [];
  statistics: Statistics[] = [];
  projectOverview: OverviewItem[] = [];
  dailyTasks: DailyTask[] = [];
  team: TeamMember[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Projects', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches order list
   */
  _fetchData(): void {
    this.projects = PROJECTLIST;
    this.statistics = PROJECT_STATISTICS;
    this.projectOverview = PROJECT_OVERVIEW;
    this.dailyTasks = DAILY_TASKS;
    this.team = TEAM;
  }

}
