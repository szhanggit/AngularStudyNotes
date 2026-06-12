import { Component, Input, OnInit } from '@angular/core';

// types
import { ManagementProject } from '../../shared/crm.model';

@Component({
  selector: 'app-management-project-widget',
  templateUrl: './project-widget.component.html',
  styleUrls: ['./project-widget.component.scss']
})
export class ProjectWidgetComponent implements OnInit {

  @Input() project?: ManagementProject;
  modifiedMembers: string[] = [];
  displayCount: number = 2;

  constructor () { }

  ngOnInit(): void {
    if (this.project) {
      if (this.project.assignTo.length <= this.displayCount || (this.project.assignTo.length - this.displayCount) == 1) {
        this.modifiedMembers = this.project.assignTo;
      }
      else {
        this.modifiedMembers = this.project.assignTo.filter((m: string, index: number) => index < this.displayCount)
      }
    }
  }

}
