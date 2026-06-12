import { Component, OnInit } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  tabs1: number = 1;
  tabs2: number = 2;
  tabs3: string = 'setting3';
  tabs4: string = 'home4';
  tabs5: number = 1;
  tabs6: number = 2;
  tabs7: number = 1;
  tabs8: number = 1;

  dynamicTabs: number[] = [1, 2, 3, 4, 5];
  counter: number = 0;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Tabs', path: '/', active: true }];
    this.counter = this.dynamicTabs.length + 1;
  }

  /**
   * prevents opening of tab
   * @param changeEvent navchange event
   */
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  /**
   * closes tab
   * @param event event
   * @param toRemove remove index
   */
  close(event: MouseEvent, toRemove: number) {
    this.dynamicTabs = this.dynamicTabs.filter((id: number) => id !== toRemove);
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  /**
   * add new tab
   * @param event event
   */
  add(event: MouseEvent) {
    this.dynamicTabs.push(this.counter++);
    event.preventDefault();
  }


}
