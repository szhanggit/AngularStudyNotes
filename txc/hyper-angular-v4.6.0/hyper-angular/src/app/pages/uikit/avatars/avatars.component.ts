import { Component, OnInit } from '@angular/core';
// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-avatars',
  templateUrl: './avatars.component.html',
  styleUrls: ['./avatars.component.scss']
})
export class AvatarsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Avatar', path: '/', active: true }]
  }

}
