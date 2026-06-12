import { Component, OnInit } from '@angular/core';

// types
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Client, ManagementProject, MonthlyProgressItem, Task } from '../shared/crm.model';

// data
import { PROGRESS_DATA, TASKS, CLIENTS, PROJECTS } from './data';

@Component({
  selector: 'app-crm-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class CRMManagementComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  clients: Client[] = [];
  progressData: MonthlyProgressItem[] = [];
  tasks: Task[] = [];
  projects: ManagementProject[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM', path: '/' }, { label: 'Management', path: '/', active: true }];
    this._fetchData();
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.progressData = PROGRESS_DATA;
    this.tasks = TASKS;
    this.clients = CLIENTS;
    this.projects = PROJECTS;
  }

}
