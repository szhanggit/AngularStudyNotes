import { Component, OnInit } from '@angular/core';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { ApexChartOptions } from 'src/app/pages/charts/apex/apex.model';

@Component({
  selector: 'app-wallet-balance-status',
  templateUrl: './wallet-balance-status.component.html',
  styleUrls: ['./wallet-balance-status.component.scss']
})
export class WalletBalanceStatusComponent implements OnInit {

  active: string = 'day';
  chartOptions: Partial<ApexChartOptions> = {};
  dayBalanceData: ApexAxisChartSeries = [];
  weekBalanceData: ApexAxisChartSeries = [];
  monthBalanceData: ApexAxisChartSeries = [];
  yearBalanceData: ApexAxisChartSeries = [];
  chartData: ApexAxisChartSeries = [];


  constructor () { }

  ngOnInit(): void {
    this.dayBalanceData = this.getDayBalance();
    this.weekBalanceData = this.getWeekBalance();
    this.monthBalanceData = this.getMonthBalance();
    this.yearBalanceData = this.getYearBalance();
    this.initChart();
  }

  /**
   * initialize chart
   */
  initChart(): void {
    this.chartOptions = {
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false
        }
      },
      colors: ['#0acf97'],
      dataLabels: {
        enabled: false
      },
      series: this.dayBalanceData,
      stroke: {
        width: 1,
      },
      markers: {
        size: 0,
        // style: 'hollow',
      },
      xaxis: {
        type: 'datetime',
        // min: new Date('01 Mar 2012').getTime(),
        tickAmount: 6,
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return "$" + value;
          }
        },
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0,
          stops: [0, 100]
        }
      },

    }
  }


  /**
   * return time wise data
   */
  // getData(dayCount: number, data: number[]): [number, number][] {
  //   let balanceData: [number, number][] = [];
  //   for (let i = 0; i < 100; i++) {
  //     let start = new Date();
  //     balanceData.push([start.setDate(start.getDate() + i * dayCount - 100 * dayCount), data[i]]);
  //   }
  //   return balanceData
  // }

  changeChartData(event: NgbNavChangeEvent): void {
    switch (this.active) {
      case 'day':
        this.chartOptions.series = this.dayBalanceData
        break;
      case 'week':
        this.chartOptions.series = this.weekBalanceData
        break;
      case 'month':
        this.chartOptions.series = this.monthBalanceData
        break;
      case 'year':
        this.chartOptions.series = this.yearBalanceData
        break;
      default:
        this.chartOptions.series = this.dayBalanceData
        break;
    }

    console.log(this.chartOptions.series, this.active)
  }


  /**
   * generates random data
   */
  generateData(): number[] {
    var balanceData = [];
    for (var i = 0; i < 100; i++) {
      balanceData.push(5000 + Math.random() * 100000 + 0.8 * i * i * i)
    }
    return balanceData;
  }


  getDayBalance(): ApexAxisChartSeries {
    let dayDummyData = this.generateData();
    let dayBalanceData: [number, number][] = [];

    for (let i = 0; i < 100; i++) {
      let start = new Date();
      dayBalanceData.push([start.setDate(start.getDate() + i - 100), dayDummyData[i]]);
    }
    return [{ data: dayBalanceData }];
  };

  getWeekBalance(): ApexAxisChartSeries {
    let weekDummyData = this.generateData();
    let weekBalanceData: [number, number][] = [];

    for (let i = 0; i < 100; i++) {
      let start = new Date();
      weekBalanceData.push([start.setDate(start.getDate() + i * 7 - 100 * 7), weekDummyData[i]]);
    }
    return [{ data: weekBalanceData }];
  };

  getMonthBalance(): ApexAxisChartSeries {
    let monthDummyData = this.generateData();
    let monthBalanceData: [number, number][] = [];

    for (let i = 0; i < 100; i++) {
      let start = new Date();
      monthBalanceData.push([start.setDate(start.getDate() + i * 30 - 100 * 30), monthDummyData[i]]);
    }
    return [{ data: monthBalanceData }];
  };

  getYearBalance(): ApexAxisChartSeries {
    let yearDummyData = this.generateData();
    let yearBalanceData: [number, number][] = [];

    for (let i = 0; i < 100; i++) {
      let start = new Date();
      yearBalanceData.push([start.setDate(start.getDate() + i * 365 - 100 * 365), yearDummyData[i]]);
    }
    return [{ data: yearBalanceData }];
  };


}
