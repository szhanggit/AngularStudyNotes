import { Component, OnInit } from '@angular/core';

// type
import { ListTaskItem } from '../shared/tasks.model';

// data
import { otherTasks, todayTasks, upcomingTasks } from '../shared/data';

@Component({
  selector: 'app-task-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  todaysTasks: ListTaskItem[] = [];
  upcomingTasks: ListTaskItem[] = [];
  otherTasks: ListTaskItem[] = [];
  showTodaysTask: boolean = false;
  showUpcomingTask: boolean = false;
  showOtherTask: boolean = false;

  selectedTask!: ListTaskItem;


  constructor () { }

  ngOnInit(): void {
    // get task lists
    this._fetchData();
    // initialize selected task
    this.selectedTask = this.todaysTasks[0];
  }

  /**
   * fetches task data
   */
  _fetchData(): void {
    this.todaysTasks = todayTasks;
    this.upcomingTasks = upcomingTasks;
    this.otherTasks = otherTasks;
  }

}
