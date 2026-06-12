import { Component, OnInit } from '@angular/core';

// types
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';
import { ApexChartOptions } from 'src/app/pages/charts/apex/apex.model';

@Component({
  selector: 'app-project-statistics',
  templateUrl: './project-statistics.component.html',
  styleUrls: ['./project-statistics.component.scss']
})
export class ProjectStatisticsComponent implements OnInit {

  dropdownOptions: CardDropdownOption[] = [
    { label: 'Refresh Report' },
    { label: 'Export Report' }
  ];

  statisticsChart: Partial<ApexChartOptions> = {};

  constructor () { }

  ngOnInit(): void {
    this.initChart();
  }

  /**
   * initialize chart
   */
  initChart(): void {
    this.statisticsChart = {
      chart: {
        height: 305,
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 3,
        colors: ['transparent']
      },
      colors: ["#ced1ff", "#727cf5"],
      series: [{
        name: 'Previous Week Sale',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
      }, {
        name: 'This Week Sale',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      }],
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      legend: {
        offsetY: 7,
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1

      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.2
        },
        borderColor: '#f1f3fa',
        padding: {
          bottom: 5
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + "K"
          }
        }
      }
    }
  }
}
