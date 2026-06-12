import { Component, Input, OnInit } from '@angular/core';

// types
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';
import { MonthlyProgressItem } from '../../shared/crm.model';

@Component({
  selector: 'app-management-monthly-progress',
  templateUrl: './monthly-progress.component.html',
  styleUrls: ['./monthly-progress.component.scss']
})
export class MonthlyProgressComponent implements OnInit {

  dropdownOptions: CardDropdownOption[] = [];
  @Input() progressData: MonthlyProgressItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.dropdownOptions = [
      { label: 'Today' },
      { label: 'Yesterday' },
      { label: 'Last Week' },
      { label: 'Last Month' }
    ];
  }

}
