import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss']
})
export class TooltipsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Tooltips', path: '/', active: true }];
  }

}
