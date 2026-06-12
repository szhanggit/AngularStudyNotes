import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-popovers',
  templateUrl: './popovers.component.html',
  styleUrls: ['./popovers.component.scss']
})
export class PopoversComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  lastShown!: Date;
  lastHidden!: Date;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Popover', path: '/', active: true }];
  }

  /**
   * records last shown time of popover
   */
  recordShown() {
    this.lastShown = new Date();
  }

  /**
   * records hidden time of popover
   */
  recordHidden() {
    this.lastHidden = new Date();
  }

}
