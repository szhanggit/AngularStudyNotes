import { Component, OnInit } from '@angular/core';

// types
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';

@Component({
  selector: 'app-project-summary',
  templateUrl: './project-summary.component.html',
  styleUrls: ['./project-summary.component.scss']
})
export class ProjectSummaryComponent implements OnInit {

  dropdownOptions: CardDropdownOption[] = [
    { label: 'Refresh Report' },
    { label: 'Export Report' }
  ];

  constructor () { }

  ngOnInit(): void {
  }

}
