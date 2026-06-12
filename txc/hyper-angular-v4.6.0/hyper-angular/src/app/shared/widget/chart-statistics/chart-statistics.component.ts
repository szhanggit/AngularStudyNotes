import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-chart-statistics',
  templateUrl: './chart-statistics.component.html',
  styleUrls: ['./chart-statistics.component.scss']
})
export class ChartStatisticsComponent implements OnInit {

  @Input() title: string = "";
  @Input() titleTooltipText: string = "";
  @Input() mainNumber: string | number = "";
  @Input() subNumber: string = "";
  @Input() subTitleClass: string = "";
  @Input() subIconClass: string = "";

  @Input() chartType: string = 'line';
  @Input() data: Array<number> = [];
  @Input() chartColor: string = '#727cf5';

  series: any = [{ name: '', data: [] }];
  xaxis: any = {};
  yaxis: any = {};
  chartData: any = {};
  titleRef: any = {};
  subTitleRef: any = {};
  plotOptions: any = {};
  tooltip: any = {};
  stroke: any = {};
  colors: string[] = []

  constructor () {
  }

  ngOnInit(): void {
    this.series = [{ data: this.data }];
    this.xaxis = {
      crosshairs: {
        width: 1
      }
    };
    this.yaxis = { min: 0 };

    this.plotOptions = {
      bar: {
        columnWidth: '60%'
      }
    };

    this.tooltip = {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: () => {
            return '';
          }
        }
      },
      marker: {
        show: false
      }
    };

    if (this.chartType === 'line') {
      this.stroke = {
        width: 2,
        curve: 'smooth'
      };
    }

    this.colors = [this.chartColor]

    this.chartData = {
      type: this.chartType,
      height: 60,
      sparkline: {
        enabled: true
      },
      markers: {
        size: 0
      }
    };
  }

  //checks whether data is number or string
  isNumber(val: string | number): boolean {
    return typeof val === 'number';
  }

}
