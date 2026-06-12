import { Component, OnInit } from '@angular/core';

// types
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';
import { ApexChartOptions } from 'src/app/pages/charts/apex/apex.model';


@Component({
  selector: 'app-management-revenue-statistics',
  templateUrl: './revenue-statistics.component.html',
  styleUrls: ['./revenue-statistics.component.scss']
})
export class RevenueStatisticsComponent implements OnInit {

  dropdownOptions: CardDropdownOption[] = [];
  revenueChart: Partial<ApexChartOptions> = {};

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
    this.revenueChart = {
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          opacity: 0.2,
          blur: 7,
          left: -7,
          top: 7
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 4
      },
      series: [{
        name: 'Budget',
        data: [10, 20, 15, 28, 22, 34]
      }, {
        name: 'Revenue',
        data: [2, 26, 10, 38, 30, 48]
      }],
      colors: ["#727cf5", "#0acf97"],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        tooltip: {
          enabled: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val + "k"
          },
          offsetX: -15
        }
      }
    };
  }

}
