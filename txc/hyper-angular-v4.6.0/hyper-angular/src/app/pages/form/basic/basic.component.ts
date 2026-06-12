import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-forms-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  showPassword: boolean = false;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Forms', path: '/' }, { label: 'Form Elements', path: '/', active: true }];
  }

}
