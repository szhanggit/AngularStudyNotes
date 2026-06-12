import { Component, Input, OnInit } from '@angular/core';

// types
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';
import { ApexChartOptions } from 'src/app/pages/charts/apex/apex.model';
import { OverviewItem } from '../../shared/crm.model';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {

  @Input() projectOverview: OverviewItem[] = [];
  dropdownOptions: CardDropdownOption[] = [];
  overviewChart: Partial<ApexChartOptions> = {};

  constructor () { }

  ngOnInit(): void {
    this.dropdownOptions = [
      { label: 'Today' },
      { label: 'Yesterday' },
      { label: 'Last Week' },
      { label: 'Last Month' }
    ];

    this.initChart();
  }

  /**
   * initialize chart
   */
  initChart(): void {
    this.overviewChart = {
      chart: {
        height: 326,
        type: 'radialBar'
      },
      colors: ["#727cf5", "#ff679b", "#0acf97", "#ffbc00"],
      series: [85, 70, 80, 65],
      labels: this.projectOverview.map((item) => item.title),
      plotOptions: {
        radialBar: {
          track: {
            margin: 5,
          }
        }
      }
    }
  }

}
