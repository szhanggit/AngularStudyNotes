import { Component, Input, OnInit } from '@angular/core';

// types
import { DailyTask } from '../../shared/crm.model';

@Component({
  selector: 'app-project-daily-task',
  templateUrl: './daily-task.component.html',
  styleUrls: ['./daily-task.component.scss']
})
export class DailyTaskComponent implements OnInit {

  @Input() dailyTasks: DailyTask[] = [];

  constructor () { }

  ngOnInit(): void {
  }

}
