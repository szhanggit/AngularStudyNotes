import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-chart-statistics2',
  templateUrl: './chart-statistics2.component.html',
  styleUrls: ['./chart-statistics2.component.scss']
})
export class ChartStatistics2Component implements OnInit {
  @Input() title: string = "";
  @Input() mainNumber: string = "";
  @Input() chartType: string = 'line';
  @Input() data: Array<number> = [];
  @Input() chartColor: string = '#727cf5';
  @Input() lastMonthNumber: string = '';
  @Input() currentMonthNumber: string = '';

  series: any = [{ name: '', data: [] }];
  xaxis: any = {};
  yaxis: any = {};
  chartData: any = {};
  plotOptions: any = {};
  tooltip: any = {};
  stroke = {};
  colors: string[] = [];
  labels: string[] = [];
  grid = {};
  dataLabels = {};

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
        columnWidth: '55%'
      }
    };


    this.labels = [];
    let i = 1;
    for (const d of this.data) {
      this.labels.push(String(i));
      i++;
    }


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

    this.stroke = {
      width: this.chartType === 'bar' ? 3 : 4,
      curve: 'smooth'
    };

    this.colors = [this.chartColor],
      this.grid = {
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      };

    this.dataLabels = {
      enabled: false
    };

    this.chartData = {
      type: this.chartType,
      height: 100,
      sparkline: {
        enabled: true
      },
      markers: {
        size: 0
      }
    };
  }


}
