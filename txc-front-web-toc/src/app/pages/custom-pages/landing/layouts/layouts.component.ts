import { Component, OnInit } from '@angular/core';

// data
import { Layout, LAYOUTS } from './data';

@Component({
  selector: 'app-landing-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {

  layoutList: Layout[] = [];

  constructor () { }

  ngOnInit(): void {
    this.layoutList = LAYOUTS;
  }

}
