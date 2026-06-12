import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ChartData, ChartDataset, ChartOptions, ChartType } from 'chart.js';
// import { Label } from 'ng2-charts';

// type
import { CardDropdownOption } from '../../../shared/widget/card-title/card-title.model';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { ActivityItem, EventSchedule, Task } from './projects.model';

// data
import { activityList, calendarEvents, taskList } from './data';


@Component({
  selector: 'app-dashboard-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  model!: NgbDateStruct;
  dropdownOptions: CardDropdownOption[] = [{ label: 'Weekly Report' }, { label: 'Monthly Report' }, { label: 'Action' }, { label: 'Settings' }];

  //doughnut chart
  doughnutChart: ChartData<'doughnut'> = { labels: [], datasets: [] };
  doughnutChartOptions: ChartOptions<'doughnut'> = {};
  //bar chart 
  barChart: { labels: string[]; datasets: ChartDataset[]; } = { labels: [], datasets: [] };
  barChartOptions: ChartOptions = {};
  barChartType: ChartType = 'bar';

  taskList: Task[] = [];
  recentActivities: ActivityItem[] = [];
  events: EventSchedule[] = [];




  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Dashboard', path: '/' }, { label: 'Projects', path: '/', active: true }];

    // get chart data
    this._fetchChartData();
    // get static data
    this._fetchData();
  }



  /**
   *  fetches chart data
   */
  _fetchChartData(): void {

    // dounut chart config
    this.doughnutChart = {
      labels: [
        "Completed",
        "In-progress",
        "Behind"
      ],
      datasets: [
        {
          data: [64, 26, 10],
          backgroundColor: ['#0acf97', '#727cf5', '#fa5c7c'],
          hoverBackgroundColor: ['#0acf97', '#727cf5', '#fa5c7c'],
          borderColor: "transparent",
          hoverBorderColor: 'transparent',
          borderWidth: [3],
        }]
    };
    this.doughnutChartOptions = {
      maintainAspectRatio: false,
      cutout: "80%",
      plugins: {
        legend: {
          display: false
        },
        filler: {
          propagate: false
        }
      },
    };

    // bar chart config
    this.barChart = {
      labels: [
        "Sprint 1",
        "Sprint 2",
        "Sprint 3",
        "Sprint 4",
        "Sprint 5",
        "Sprint 6",
        "Sprint 7",
        "Sprint 8",
        "Sprint 9",
        "Sprint 10",
        "Sprint 11",
        "Sprint 12",
        "Sprint 13",
        "Sprint 14",
        "Sprint 15",
        "Sprint 16",
        "Sprint 17",
        "Sprint 18",
        "Sprint 19",
        "Sprint 20",
        "Sprint 21",
        "Sprint 22",
        "Sprint 23",
        "Sprint 24"
      ],
      datasets: [
        {
          label: "This year",
          backgroundColor: '#727cf5',
          hoverBackgroundColor: '#3953fa',
          borderColor: '#727cf5',
          barPercentage: 0.7,
          categoryPercentage: 0.5,
          // reverse: true,
          borderDash: [5, 5],
          // min: 10,
          // max: 100,
          data: [
            16,
            44,
            32,
            48,
            72,
            60,
            84,
            64,
            78,
            50,
            68,
            34,
            26,
            44,
            32,
            48,
            72,
            60,
            74,
            52,
            62,
            50,
            32,
            22
          ]
        }
      ]
    };
    this.barChartOptions = {
      maintainAspectRatio: false,
      plugins: {
        filler: {
          propagate: false
        },
        legend: {
          display: false
        },
        tooltip: {
          intersect: false
        },
      },
      hover: {
        intersect: true
      },
      scales: {
        x: {
          grid: {
            color: "rgba(0,0,0,0.05)"
          }
        },
        y: {
          ticks: {
            stepSize: 10,
            display: false
          },

          display: true,
          grid: {
            color: "rgba(0,0,0,0)",
          }
        }
      }
    }
  }

  /**
   * fetches static data
   */
  _fetchData(): void {
    this.taskList = [...taskList];
    this.recentActivities = [...activityList];
    this.events = [...calendarEvents];
  }

  /**
   * removes task from tasklist
   * @param task task
   */
  removeTask(task: Task): void {
    const index = this.taskList.indexOf(task);
    if (index > -1) {
      this.taskList.splice(index, 1);
    }
  }



}
