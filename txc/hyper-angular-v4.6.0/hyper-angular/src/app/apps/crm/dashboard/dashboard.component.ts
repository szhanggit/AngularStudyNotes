import { Component, OnInit } from '@angular/core';

// type
import { CardDropdownOption } from '../../../shared/widget/card-title/card-title.model';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { ChartStatisticsItem } from '../../../shared/widget/chart-statistics/chart-statistics.model';
import { ToDoItem } from '../../../shared/widget/todo/todo.model';
import { ApexChartOptions } from '../../../pages/charts/apex/apex.model';
import { LeadItem, PerformanceListItem } from '../shared/crm.model';

// data
import { chartStatisticsData, todoItems, recentLeads, topPerformanceData } from './data';

@Component({
  selector: 'app-crm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class CRMDashboardComponent implements OnInit {


  pageTitle: BreadcrumbItem[] = [];
  dropdownOptions: CardDropdownOption[] = [];
  chartStatisticsData: ChartStatisticsItem[] = [];
  topPerdomingData: PerformanceListItem[] = [];
  recentLeadData: LeadItem[] = [];
  toDoItems: ToDoItem[] = [];
  campaignsChart: Partial<ApexChartOptions> = {};
  revenueChart: Partial<ApexChartOptions> = {};

  constructor () {
  }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'CRM ', path: '/' }, { label: 'CRM Dashboard', path: '/', active: true }];
    this.dropdownOptions = [
      { label: 'Today' },
      { label: 'Yesterday' },
      { label: 'Last Week' },
      { label: 'Last Month' }
    ];
    // get static data
    this._fetchData();
    // get chart data
    this._fetchChartData();
  }

  /**
   * fetches data
   */
  _fetchData(): void {
    this.chartStatisticsData = [...chartStatisticsData];
    this.topPerdomingData = [...topPerformanceData];
    this.recentLeadData = [...recentLeads];
    this.toDoItems = [...todoItems];
  }

  /**
   * fetches chart data
   */
  _fetchChartData(): void {

    this.campaignsChart = {
      chart: {
        height: 304,
        type: 'radialBar',
        parentHeightOffset: 0,
        toolbar: {
          show: false,
        },
      },
      grid: {
        padding: {
          left: 0,
          right: 0,
        },
      },
      colors: ['#ffbc00', '#727cf5', '#0acf97'],
      series: [86, 36, 50],
      labels: ['Total Sent', 'Reached', 'Opened'],
      plotOptions: {
        radialBar: {
          track: {
            margin: 8,
          }
        }
      }
    }

    this.revenueChart = {
      chart: {
        height: 334,
        type: 'line',
        parentHeightOffset: 0,
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      series: [{
        name: 'Total Revenue',
        type: 'area',
        data: [44, 55, 31, 47, 31, 43, 26, 41, 31, 47, 33, 43]
      }, {
        name: 'Total Pipeline',
        type: 'line',
        data: [55, 69, 45, 61, 43, 54, 37, 52, 44, 61, 43, 56]
      }],
      fill: {
        type: 'solid',
        opacity: [0.35, 1],
      },
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      markers: {
        size: 0
      },
      colors: ['#0acf97', '#fa5c7c'],
      yaxis: [
        {
          title: {
            text: 'Revenue (USD)',
          },
          min: 0
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: number): string {
            if (typeof val !== "undefined") {
              return val.toFixed(0) + "k";
            }
            return val;

          }
        }
      },
      grid: {
        borderColor: '#f1f3fa',
        padding: {
          bottom: 5,
          left: 15
        }
      },
      legend: {
        fontSize: '14px',
        fontFamily: '14px',
        offsetY: 5,
      },
      responsive: [{
        breakpoint: 600,
        options: {
          yaxis: {
            show: false
          },
          legend: {
            show: false
          }
        }
      }]
    }

  }

}
