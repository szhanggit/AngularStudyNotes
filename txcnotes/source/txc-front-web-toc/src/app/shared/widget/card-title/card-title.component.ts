import { Component, Input, OnInit } from '@angular/core';
import { CardDropdownOption } from './card-title.model';

@Component({
  selector: 'app-card-title',
  templateUrl: './card-title.component.html',
  styleUrls: ['./card-title.component.scss']
})
export class CardTitleComponent implements OnInit {

  @Input() cardTitle: string = "";
  @Input() containerClass: string = "";
  @Input() dropdownOptions: CardDropdownOption[] = [];
  @Input() icon?: string = "mdi mdi-dots-vertical";

  constructor () { }

  ngOnInit(): void {
  }
}
