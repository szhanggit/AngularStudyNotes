import { Component, Input, OnInit } from '@angular/core';
import { QuillModules } from 'ngx-quill';

// type
import { ListTaskItem } from '../../shared/tasks.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  @Input() selectedTask!: ListTaskItem;
  newComment: string = '';
  quillConfig: QuillModules = {};

  constructor () { }

  ngOnInit(): void {
    this.quillConfig = {
      toolbar: [
        ["bold", "italic"],
        ['link'],
        [{ 'header': 1 }, { 'header': 2 }],
        ['blockquote']
      ]
    }
  }

}
