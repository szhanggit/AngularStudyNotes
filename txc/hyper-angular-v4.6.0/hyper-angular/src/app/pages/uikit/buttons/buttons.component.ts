import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/uikit.model';

type BtnGroupCheckbox = {
  left: boolean;
  right: boolean;
  middle: boolean;
}

@Component({
  selector: 'app-ui-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  buttonVariants: Variant[] = [];
  multipleChoice!: BtnGroupCheckbox;
  singleChoice: any = 1;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Buttons', path: '/', active: true }];
    this.buttonVariants = [{
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
    }];


    this.multipleChoice = {
      left: true,
      right: false,
      middle: false
    }
  }

}
