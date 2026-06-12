import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Pages', path: '/' }, { label: 'Timeline', path: '/', active: true }];

  }

}
