import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-icons-unicons',
  templateUrl: './unicons.component.html',
  styleUrls: ['./unicons.component.scss']
})
export class UniconsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];



  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Icons', path: '/' }, { label: 'Unicons', path: '/', active: true }];

  }


}
