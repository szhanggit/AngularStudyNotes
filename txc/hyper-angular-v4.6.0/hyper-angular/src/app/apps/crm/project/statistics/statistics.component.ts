import { Component, Input, OnInit } from '@angular/core';

// types
import { Statistics } from '../../shared/crm.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  @Input() statistics: Statistics[] = [];

  constructor () { }

  ngOnInit(): void {
  }

}
