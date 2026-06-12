import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  @Input() title!: string;
  @Input() description!: string;
  @Input() stats!: string;
  @Input() icon!: string;
  @Input() trendNumber!: string;
  @Input() trendTime!: string;
  @Input() trendIcon!: string;
  @Input() trendTextClass!: string;
  @Input() bgClass?: string;
  @Input() badgeVariant?: string;

  constructor () { }

  ngOnInit(): void {
  }

}
