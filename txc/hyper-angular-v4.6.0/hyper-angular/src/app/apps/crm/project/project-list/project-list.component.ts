import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// types
import { Select2Data } from 'ng-select2-component';
import { Project } from '../../shared/crm.model';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  @Input() projects: Project[] = [];
  tasks: Select2Data = [];
  projectName: string = "";
  addTask: string = "";
  assignTasks: string[] = [];
  description: string = "";
  submitted: boolean = false;

  constructor (private modalService: NgbModal) { }

  ngOnInit(): void {
    this._fetchData();
  }

  /**
   * opens new project modal
   * @param content modal ref
   */
  open(content: TemplateRef<NgbModal>) {
    this.modalService.open(content)
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.tasks = [
      {
        label: 'UX Designer',
        options: [
          { value: 'AD', label: 'Andrea' },
          { value: 'DL', label: 'Danielle' },
          { value: 'JH', label: 'John' },
        ],
      },
      {
        label: 'Developer',
        options: [
          { value: 'ST', label: 'Steven' },
          { value: 'MC', label: 'Michael' },
        ],
      },
      {
        label: 'UI Designer',
        options: [
          { value: 'SR', label: 'Sharon' },
          { value: 'TM', label: 'Timothy' },
          { value: 'FD', label: 'Frederick' },
          { value: 'HN', label: 'Henry' },
        ],
      },
    ]
  }



}
