import { Component, OnInit } from '@angular/core';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-super-admin-creation',
  templateUrl: './super-admin-creation.component.html',
  styleUrls: ['./super-admin-creation.component.scss']
})
export class SuperAdminCreationComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  title = 'Super Admin Creation';

  constructor() { }

  ngOnInit(): void {
  }

}
