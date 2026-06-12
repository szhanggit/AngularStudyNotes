import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.scss']
})
export class ScrollbarComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Scrollbar', path: '/', active: true }];
  }

}
