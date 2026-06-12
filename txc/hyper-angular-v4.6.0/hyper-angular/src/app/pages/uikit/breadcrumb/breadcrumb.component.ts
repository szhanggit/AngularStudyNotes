import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  breadcrumbData: BreadcrumbItem[][] = [];


  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Breadcrumb', path: '/', active: true }]

    this.breadcrumbData = [
      [
        { label: 'Home', path: '/', active: true }
      ],
      [
        { label: 'Home', path: '/' },
        { label: 'Library', path: '/', active: true }
      ],
      [
        { label: 'Home', path: '/' },
        { label: 'Library', path: '/' },
        { label: 'Data', path: '/', active: true }
      ],
    ]
  }

}
