import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { IconItem } from '../shared/icon.model';

// data
import { DRIPICONSLIST } from './data';

@Component({
  selector: 'app-icons-dripicons',
  templateUrl: './dripicons.component.html',
  styleUrls: ['./dripicons.component.scss']
})
export class DripiconsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  dripIconList: IconItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Dripicons', path: '/', active: true }];
    this.dripIconList = DRIPICONSLIST;
  }

}
