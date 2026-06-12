import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions, ChartType } from 'chart.js';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { Project } from '../shared/projects.model';

// data
import { DUMMY_PROJECTS } from '../shared/data';

@Component({
  selector: 'app-project-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  selectedProject!: Project;
  projectChartOptions!: ChartOptions<'line'>;

  constructor (private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.pageTitle = [{ label: 'Projects', path: '/' }, { label: 'Project Details', path: '/', active: true }];

    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        this.selectedProject = DUMMY_PROJECTS.filter(x => String(x.id) === params['id'])[0];
      } else {
        this.selectedProject = DUMMY_PROJECTS[0];
      }
    });
    this.initializeChartConfig();
  }

  /**
   * initialize chart configuration
   */
  initializeChartConfig(): void {

    this.projectChartOptions = {
      maintainAspectRatio: false,
      hover: {
        intersect: true
      },
      plugins: {
        filler: {
          propagate: true
        },
        legend: {
          display: false
        },
        tooltip: {
          intersect: false
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(0,0,0,0.05)"
          }
        },
        y: {
          ticks: {
            stepSize: 20
          },
          display: true,
          grid: {
            color: "rgba(0,0,0,0)",
          }
        }
      }
    };
  }

}
