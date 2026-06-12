import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss']
})
export class PlaceholderComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Placeholders', path: '/', active: true }];

  }

}
