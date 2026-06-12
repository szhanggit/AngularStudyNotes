import { Component, Input, OnInit } from '@angular/core';

// types
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';
import { Task } from '../../shared/crm.model';

@Component({
  selector: 'app-management-task-status',
  templateUrl: './task-status.component.html',
  styleUrls: ['./task-status.component.scss']
})
export class TaskStatusComponent implements OnInit {

  @Input() tasks: Task[] = [];
  dropdownOptions: CardDropdownOption[] = [];

  constructor () { }

  ngOnInit(): void {
    this.dropdownOptions = [
      { label: 'Today' },
      { label: 'Yesterday' },
      { label: 'Last Week' },
      { label: 'Last Month' }
    ];
  }
}
