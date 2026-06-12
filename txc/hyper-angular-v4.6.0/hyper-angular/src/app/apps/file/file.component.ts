import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../shared/page-title/page-title.model';
import { QuickAccessItem, RecentFileItem } from './shared/file.model';

// data
import { quickAccess, recentFiles } from './shared/data';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  quickAccessData: QuickAccessItem[] = [];
  recentFiles: RecentFileItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Apps', path: '/' }, { label: 'File Manager', path: '/', active: true }];

    // get static data
    this._fetchData();

  }

  // fetches static data
  _fetchData(): void {
    this.quickAccessData = [...quickAccess];
    this.recentFiles = [...recentFiles];
  }



}
