import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SortableOptions } from 'sortablejs';

// type
import { KanbanBoardTaskItem } from '../shared/tasks.model';

// data
import { kanbanTasks, allTasks } from '../shared/data';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {

  todoTasks!: KanbanBoardTaskItem[];
  inprogressTasks!: KanbanBoardTaskItem[];
  reviewTasks!: KanbanBoardTaskItem[];
  doneTasks!: KanbanBoardTaskItem[];
  options: SortableOptions = {};

  title: string = '';
  date!: NgbDateStruct;
  priority: string = 'High';
  assignee_avatar: string = 'assets/images/users/avatar-2.jpg';
  assigned_to: string = 'Robert Carlile';
  status: string = 'todo';
  project: string = 'iOS';
  submitted: boolean = false;


  @ViewChild('content', { static: true }) content: any;
  @ViewChild('newTask', { static: true }) newTask!: NgForm;


  constructor (public activeModal: NgbModal) { }

  ngOnInit(): void {
    this.options = {
      group: 'kanban-tasks'
    }
    // get task list
    this._fetchData();
  }

  /**
   * fetches task list
   */
  _fetchData(): void {
    this.todoTasks = kanbanTasks.filter(t => t.status === 'todo');
    this.inprogressTasks = kanbanTasks.filter(t => t.status === 'inprogress');
    this.reviewTasks = kanbanTasks.filter(t => t.status === 'review');
    this.doneTasks = kanbanTasks.filter(t => t.status === 'done');
  }


  openModal(): void {
    this.activeModal.open(this.content);
  }

  /**
   * saves new task
   */
  saveTask() {
    this.submitted = true;
    if (this.title !== '' && this.date !== undefined && this.priority !== '') {
      const updatedTasks = [...this.todoTasks];
      updatedTasks.push({
        id: allTasks.length,
        title: this.title,
        date: this.date.day + "/" + this.date.month + "/" + this.date.year,
        priority: this.priority,
        assignee_avatar: this.assignee_avatar,
        assigned_to: this.assigned_to,
        comments: 0,
        status: 'todo',
        project: this.project,
      });
      this.todoTasks = updatedTasks;
      this.activeModal.dismissAll();
    }
  }



}
