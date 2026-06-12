import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/uikit.model';

interface ribbonItem extends Variant {
  direction: string;
}

@Component({
  selector: 'app-ui-ribbons',
  templateUrl: './ribbons.component.html',
  styleUrls: ['./ribbons.component.scss']
})
export class RibbonsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  ribbonVariants: ribbonItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Ribbons', path: '/', active: true }];
    this.ribbonVariants = [
      {
        name: 'Primary',
        color: 'primary',
        direction: 'left'
      },
      {
        name: 'Success',
        color: 'success',
        direction: 'right'
      },
      {
        name: 'Info',
        color: 'info',
        direction: 'right'
      },
      {
        name: 'Warning',
        color: 'warning',
        direction: 'left'
      },
      {
        name: 'Danger',
        color: 'danger',
        direction: 'right'
      },
      {
        name: 'Dark',
        color: 'dark',
        direction: 'right'
      },
      {
        name: 'Secondary',
        color: 'secondary',
        direction: 'left'
      }
    ];
  }

}
