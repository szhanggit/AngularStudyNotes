import { Component, Input, OnInit } from '@angular/core';

// type
import { RecentFileItem } from '../shared/file.model';

@Component({
  selector: 'app-recent-file',
  templateUrl: './recent-file.component.html',
  styleUrls: ['./recent-file.component.scss']
})
export class RecentFileComponent implements OnInit {

  @Input() recentFiles: RecentFileItem[] = [];

  constructor () { }

  ngOnInit(): void {
  }

}
