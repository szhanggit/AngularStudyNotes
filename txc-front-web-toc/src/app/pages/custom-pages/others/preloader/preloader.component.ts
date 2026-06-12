import { Component, OnInit } from '@angular/core';


// type
import { LeadItem, PerformanceListItem } from 'src/app/apps/crm/shared/crm.model';
import { CardDropdownOption } from 'src/app/shared/widget/card-title/card-title.model';
import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';
import { ChartStatisticsItem } from '../../../../shared/widget/chart-statistics/chart-statistics.model';
import { ToDoItem } from '../../../../shared/widget/todo/todo.model';
import { ApexChartOptions } from '../../../charts/apex/apex.model';

// data
import { chartStatisticsData, recentLeads, topPerformanceData } from 'src/app/apps/crm/dashboard/data';
import { todoItems } from 'src/app/pages/widgets/data';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  loading: boolean = false;
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
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 750);
    this.pageTitle = [{ label: 'Pages', path: '/' }, { label: 'Preloader ', path: '/', active: true }];
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
        height: 321,
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
          formatter: function (val: number, opts?: any): string {
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
