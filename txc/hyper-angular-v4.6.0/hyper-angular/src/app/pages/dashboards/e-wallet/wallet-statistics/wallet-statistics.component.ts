import { Component, Input, OnInit } from '@angular/core';
import { ApexChartOptions } from 'src/app/pages/charts/apex/apex.model';
import { ChartStatisticsItem } from '../e-wallet.model';

@Component({
  selector: 'app-wallet-statistics',
  templateUrl: './wallet-statistics.component.html',
  styleUrls: ['./wallet-statistics.component.scss']
})
export class WalletStatisticsComponent implements OnInit {

  @Input() statisticsItem!: ChartStatisticsItem;
  chartOptions: Partial<ApexChartOptions> = {};

  constructor () { }

  ngOnInit(): void {
    this.initChart();
  }

  /**
   * initialize chart
   */
  initChart(): void {
    this.chartOptions = {
      chart: {
        type: this.statisticsItem.chartType,
        height: 60,
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '60%'
        }
      },
      stroke: {
        width: this.statisticsItem.chartType === 'bar' ? 0 : 2,
        curve: 'smooth'
      },
      colors: ['#727cf5'],
      series: [{
        data: this.statisticsItem.data
      }],
      xaxis: {
        crosshairs: {
          width: 1
        },
      },
      tooltip: {
        fixed: {
          enabled: false
        },
        x: {
          show: false
        },
        y: {
          title: {
            formatter: function (seriesName) {
              return ''
            }
          }
        },
        marker: {
          show: false
        }
      }
    }
  }

}
