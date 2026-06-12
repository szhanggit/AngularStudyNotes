import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/uikit.model';

type ListGroupItem = {
  icon: string;
  text: string;
}


@Component({
  selector: 'app-ui-listgroups',
  templateUrl: './listgroups.component.html',
  styleUrls: ['./listgroups.component.scss']
})
export class ListgroupsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  listGroupData: ListGroupItem[] = [];
  listItemVariants: Variant[] = [];
  horizontalList: string[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'List Group', path: '/', active: true }];

    this.listGroupData = [
      {
        icon: 'uil-google-drive-alt ',
        text: 'Google Drive'
      },
      {
        icon: 'uil-facebook-messenger',
        text: 'Facebook Messenger'
      },
      {
        icon: 'uil-apple',
        text: 'Apple Technology Company'
      },
      {
        icon: 'uil-intercom',
        text: 'Intercom Support System'
      },
      {
        icon: 'uil-paypal',
        text: 'Paypal Payment Gateway'
      }
    ];

    this.listItemVariants = [{
      name: 'primary',
      color: 'primary',
    },
    {
      name: 'secondary',
      color: 'secondary',
    },
    {
      name: 'success',
      color: 'success',
    },
    {
      name: 'danger',
      color: 'danger',
    },
    {
      name: 'warning',
      color: 'warning',
    },
    {
      name: 'info',
      color: 'info',
    },
    {
      name: 'light',
      color: 'light',
    },
    {
      name: 'dark',
      color: 'dark',
    }];

    this.horizontalList = ["Google", "Whatsapp", "Facebook"];
  }

}
