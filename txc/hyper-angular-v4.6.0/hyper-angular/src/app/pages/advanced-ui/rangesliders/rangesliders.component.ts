import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { SliderItem } from './rangeslider.model';

// data
import { SliderVariants } from './data';

@Component({
  selector: 'app-advaced-ui-rangesliders',
  templateUrl: './rangesliders.component.html',
  styleUrls: ['./rangesliders.component.scss']
})
export class RangeslidersComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  rangeSliders: SliderItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Range Slider', path: '/', active: true }];
    this.rangeSliders = SliderVariants;
  }

}
