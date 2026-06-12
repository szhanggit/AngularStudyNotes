import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/uikit.model';


@Component({
  selector: 'app-ui-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  badgeVariants: Variant[] = [];


  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Badges', path: '/', active: true }]
    this.badgeVariants = [
      {
        name: 'Primary',
        color: 'primary',
      },
      {
        name: 'Secondary',
        color: 'secondary',
      },
      {
        name: 'Success',
        color: 'success',
      },
      {
        name: 'Danger',
        color: 'danger',
      },
      {
        name: 'Warning',
        color: 'warning',
      },
      {
        name: 'Info',
        color: 'info',
      },
      {
        name: 'Light',
        color: 'light',
      },
      {
        name: 'Dark',
        color: 'dark',
      },
    ];
  }

}
