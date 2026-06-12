import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-read-mail',
  templateUrl: './read-mail.component.html',
  styleUrls: ['./read-mail.component.scss']
})
export class ReadMailComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Email', path: '/' }, { label: 'Email Read', path: '/', active: true }];
  }

}
