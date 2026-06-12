import { Component, OnInit } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-accordions',
  templateUrl: './accordions.component.html',
  styleUrls: ['./accordions.component.scss']
})
export class AccordionsComponent implements OnInit {


  pageTitle: BreadcrumbItem[] = [];
  isCollapsed: boolean = true;
  multiCollapsed1: boolean = true;
  multiCollapsed2: boolean = true;
  collapsed4: boolean = true;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Accordions', path: '/', active: true }];
  }

  /**
   *  prevents accordion panel from toggle
   * @param $event panelchange event
   */
  public beforeChange($event: NgbPanelChangeEvent) {

    if ($event.panelId === 'preventchange-2') {
      $event.preventDefault();
    }

    if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
      $event.preventDefault();
    }
  }

}
