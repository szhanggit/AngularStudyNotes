import { Component, Input, OnInit } from '@angular/core';
import { Template } from 'src/app/system/models/template-list.model';

@Component({
  selector: 'app-template-list-table',
  templateUrl: './template-list-table.component.html',
  styleUrls: ['./template-list-table.component.scss']
})
export class TemplateListTableComponent implements OnInit {

  @Input() templateList!: Template[] | null;
  constructor() { }

  ngOnInit(): void {
    // sort the template list in alphabetical order 
    if(this.templateList!?.length > 0) 
      this.templateList?.sort((prev, next)=> prev.templateName.localeCompare(next.templateName));
  }

}
