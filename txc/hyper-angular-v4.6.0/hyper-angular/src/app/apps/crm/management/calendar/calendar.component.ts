import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// types
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';

@Component({
  selector: 'app-management-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  dropdownOptions: CardDropdownOption[] = [];
  model!: NgbDateStruct;

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
