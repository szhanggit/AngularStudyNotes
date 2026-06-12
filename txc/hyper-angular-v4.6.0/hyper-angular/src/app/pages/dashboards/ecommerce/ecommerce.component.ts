import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ChartComponent } from 'ng-apexcharts';

// type
import { CardDropdownOption } from '../../../shared/widget/card-title/card-title.model';
import { RecentActivity } from '../../../shared/widget/recent-activity/recent-activity.model';
import { StatisticsItem } from '../../../shared/widget/statistics/statistics.model';
import { markers } from '../../../shared/widget/vectormap/vectormap.model';
import { ApexChartOptions } from '../../charts/apex/apex.model';
import { SellProductItem } from './ecommerce.model';

// data
import { statisticsData1, statisticsData2, sellData, recentActivities } from './data';


@Component({
  selector: 'app-dashboard-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: ['./ecommerce.component.scss']
})
export class EcommerceComponent implements OnInit {

  date!: NgbDateStruct;
  dropdownOptions: CardDropdownOption[] = [{ label: 'Sales Report' }, { label: 'Export Report' }, { label: 'Profit' }, { label: 'Action' }];
  statisticsData1: StatisticsItem[] = [];
  statisticsData2: StatisticsItem[] = [];
  sellData: SellProductItem[] = [];
  activityData: RecentActivity[] = [];
  barChart: Partial<ApexChartOptions> = {};
  lineChart: Partial<ApexChartOptions> = {};
  donutChart: Partial<ApexChartOptions> = {};
  worldMapConfig: any = {};
  mapMarkers: markers[] = [];

  @ViewChild("chart", { static: false }) chart!: ChartComponent;

  constructor (private calendar: NgbCalendar) {
    //set datepicker value to today
    this.date = this.calendar.getToday();
  }

  ngOnInit(): void {
    //get static data
    this._fetchData();

    //get apex chart data
    this._fetchChartData();

    // initialize world map
    this._initMapConfig();
  }

  ngAfterViewInit() {
    (window as any)['Apex'] = {
      chart: {
        parentHeightOffset: 0,
        toolbar: {
          show: false
        }
      },
      grid: {
        padding: {
          left: 0,
          right: 0
        }
      },
      colors: ["#727cf5", "#0acf97", "#fa5c7c", "#ffbc00"],
    }
  }

  /**
   * fetches chart data
   */
  _fetchChartData(): void {
    this.barChart = {
      chart: {
        height: 257,
        type: 'bar',
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '20%'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      series: [{
        name: 'Actual',
        data: [65, 59, 80, 81, 56, 89, 40, 32, 65, 59, 80, 81]
      }, {
        name: 'Projection',
        data: [89, 40, 32, 65, 59, 80, 81, 56, 89, 40, 65, 59]
      }],
      legend: {
        show: false
      },
      colors: ['#727cf5', '#e3eaef'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisBorder: {
          show: false
        },
      },
      yaxis: {
        labels: {
          formatter: (val: any) => {
            return val + 'k';
          },
          offsetX: -15
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: (val: any) => {
            return '$' + val + 'k';
          }
        },
      },
    };

    this.lineChart = {
      chart: {
        height: 377,
        type: 'line',
        dropShadow: {
          enabled: true,
          opacity: 0.2,
          blur: 7,
          left: -7,
          top: 7
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 4
      },
      series: [{
        name: 'Current Week',
        data: [10, 20, 15, 25, 20, 30, 20]
      }, {
        name: 'Previous Week',
        data: [0, 15, 10, 30, 15, 35, 25]
      }],
      colors: ["#727cf5", "#0acf97", "#fa5c7c", "#ffbc00"],
      legend: {
        show: false
      },
      xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        tooltip: {
          enabled: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: function (val: any) {
            return val + "k"
          },
          offsetX: -15
        }
      }
    }

    this.donutChart = {
      chart: {
        height: 210,
        type: 'donut',
      },
      legend: {
        show: false
      },
      stroke: {
        colors: ['transparent']
      },
      series: [44, 55, 41, 17],
      labels: ["Direct", "Affilliate", "Sponsored", "E-mail"],
      colors: ["#727cf5", "#0acf97", "#fa5c7c", "#ffbc00"],
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


  /**
   * fetches static data
   */
  _fetchData(): void {
    this.statisticsData1 = [...statisticsData1];
    this.statisticsData2 = [...statisticsData2];


    this.sellData = [...sellData];

    this.activityData = [...recentActivities];
  }

  /**
   * initialize world map configuration
   */
  _initMapConfig(): void {

    this.mapMarkers = [
      { coords: [31.9474, 35.2272] },
      { coords: [61.524, 105.3188] },
      { coords: [56.1304, -106.3468] },
      { coords: [71.7069, -42.6043] },
    ];

    this.worldMapConfig = {
      zoomOnScroll: false,
      normalizeFunction: 'polynomial',
      hoverOpacity: 0.7,
      hoverColor: false,
      selectedMarkers: [0, 2],
      markersSelectable: true,
      markers: this.mapMarkers,
      labels: {
        markers: {
          render: (marker: markers) => marker.name
        }
      },
      markerStyle: {
        initial: {
          r: 9,
          fill: '#727cf5',
          'fill-opacity': 0.9,
          'stroke': '#fff',
          'stroke-width': 7,
          'stroke-opacity': 0.4,
        },
        hover: {
          fill: '#727cf5',
          'stroke': '#fff',
          'fill-opacity': 1,
          'stroke-width': 1.5,
        },
      },
      regionStyle: {
        initial: {
          fill: '#e3eaef',
        },
      },
    }
  }

}
