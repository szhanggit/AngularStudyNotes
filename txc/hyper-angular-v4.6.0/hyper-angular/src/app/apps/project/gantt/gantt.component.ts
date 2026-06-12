import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Gantt, { viewMode } from 'frappe-gantt';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { GanttProjectItem, GanttTaskItem } from '../shared/projects.model';

// data
import { GanttProjects, GanttTasks } from '../shared/data';


@Component({
  selector: 'app-project-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  projects: GanttProjectItem[] = [];
  ganttTasks: GanttTaskItem[] = [];
  selectedProject!: GanttProjectItem;
  gantt: any = {};
  view_mode: viewMode = 'Week';

  @ViewChild('gantt') ganttEl!: ElementRef;
  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Projects', path: '/' }, { label: 'Gantt', path: '/', active: true }];

    // get data
    this._fetchData();

    // initialize gantt tasks
    this.initGanttTask();

  }

  /**
   *  fetches task and project data
   */
  _fetchData(): void {
    this.projects = GanttProjects;
    this.ganttTasks = GanttTasks;
    this.selectedProject = this.projects[0];
  }

  /**
   * initializes gantt tasks
   */
  initGanttTask(): void {
    this.gantt = new Gantt("#tasks-gantt", this.ganttTasks, {
      view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
      bar_height: 20,
      padding: 18,
      view_mode: this.view_mode,
      custom_popup_html: function (task: GanttTaskItem) {
        // the task object will contain the updated
        // dates and progress value
        var progressCls = task.progress! >= 60 ? "bg-success" : (task.progress! >= 30 && task.progress! < 60 ? "bg-primary" : "bg-warning");
        return '<div class="popover fade show bs-popover-right gantt-task-details" role="tooltip">' +
          '<div class="arrow"></div><div class="popover-body">' +
          '<h5>' + task.name + '</h5><p class="mb-2">Expected to finish by ' + task.end + '</p>' +
          '<div class="progress mb-2" style="height: 10px;">' +
          '<div class="progress-bar ' + progressCls + '" role="progressbar" style="width:' + task.progress + '%;" aria-valuenow="' + task.progress + '"' +
          ' aria-valuemin="0" aria-valuemax="100">' + task.progress + '%</div>' +
          '</div></div></div>';
      }
    });
  }

  /**
 * Change the mode
 * @param mode mode name
 */
  changeMode(mode: viewMode) {
    if (this.gantt) {
      this.gantt.change_view_mode(mode);
    }
  }

}
