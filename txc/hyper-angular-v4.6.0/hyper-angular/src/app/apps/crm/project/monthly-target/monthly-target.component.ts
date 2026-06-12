import { Component, OnInit } from '@angular/core';

// types
import { ApexChartOptions } from 'src/app/pages/charts/apex/apex.model';

@Component({
  selector: 'app-project-monthly-target',
  templateUrl: './monthly-target.component.html',
  styleUrls: ['./monthly-target.component.scss']
})
export class MonthlyTargetComponent implements OnInit {

  monthlyTargetChart: Partial<ApexChartOptions> = {};

  constructor () { }

  ngOnInit(): void {
    this.initChart();
  }

  /**
   * initialize chart
   */
  initChart(): void {
    this.monthlyTargetChart = {
      chart: {
        height: 250,
        type: 'donut',
      },
      legend: {
        show: false
      },
      stroke: {
        colors: ['transparent']
      },
      series: [60, 40],
      labels: ["Pending Projects", "Done Projects"],
      colors: ["#0acf97", "#727cf5"],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  }

}
