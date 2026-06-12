import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-advaced-ui-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  currentRate1: number = 4;
  currentRate2: number = 4;
  selected: number = 0;
  hovered: number = 0;
  readonly: boolean = false;
  decimalRate: number = 2.5;
  ctrl = new FormControl(null, Validators.required);

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Ratings', path: '/', active: true }];
  }

  /**
   * enables/disables rating control
   */
  toggle(): void {
    if (this.ctrl.disabled) {
      this.ctrl.enable();
    } else {
      this.ctrl.disable();
    }
  }

}
