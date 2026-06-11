import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-error-alt',
  templateUrl: './error-alt.component.html',
  styleUrls: ['./error-alt.component.scss']
})
export class ErrorAltComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Pages', path: '/' }, { label: '404', path: '/', active: true }];
  }

}
