import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  showClosable: boolean = true;
  show = false;
  autohide = true;
  toastPlacement: string = "top-0 start-0";

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Notifications', path: '/', active: true }];

  }

  /**
   * manages re-appear and close state of closable toast
   */
  close(): void {
    this.showClosable = false;
    setTimeout(() => this.showClosable = true, 3000);
  }


}
