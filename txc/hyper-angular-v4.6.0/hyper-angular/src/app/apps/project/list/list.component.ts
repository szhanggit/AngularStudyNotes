import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Project } from '../shared/projects.model';

// data
import { DUMMY_PROJECTS } from '../shared/data';

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProjectListComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  projectList: Project[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Projects', path: '/' }, { label: 'Projects List', path: '/', active: true }];
    // get project list
    this._fetchData();

  }

  /**
   * fetches project list
   */
  _fetchData(): void {
    this.projectList = DUMMY_PROJECTS;
  }

  /**
   * filter project based on status
   */
  filterProject(state: string): void {
    this.projectList = state === 'All' ? DUMMY_PROJECTS : DUMMY_PROJECTS.filter((project) => project.state === state)
  }



}
