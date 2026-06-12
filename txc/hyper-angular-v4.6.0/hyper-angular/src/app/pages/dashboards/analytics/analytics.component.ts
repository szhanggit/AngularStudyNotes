import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CardDropdownOption } from '../../../shared/widget/card-title/card-title.model';

// type
import { ApexChartOptions } from '../../charts/apex/apex.model';
import { Channel, EngagementItem, SocialMediaItem, ViewsItem } from './analytics.model';

// data
import { CHANNELDATA, ENGAGEMENTDATA, SOCIALMEDIATRAFFIC, VIEWSPERMINUTE } from './data';

@Component({
  selector: 'app-dashboard-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  date!: NgbDateStruct;
  dropdownOptions: CardDropdownOption[] = [{ label: 'Refresh Report' }, { label: 'Export Report' }];
  overviewChart: Partial<ApexChartOptions> = {};
  countryChart: Partial<ApexChartOptions> = {};
  viewsChart: Partial<ApexChartOptions> = {};
  browserChart: Partial<ApexChartOptions> = {};
  osChart: Partial<ApexChartOptions> = {};
  viewsData: ViewsItem[] = [];
  channelData: Channel[] = [];
  socialMediaTrafficData: SocialMediaItem[] = [];
  engagementData: EngagementItem[] = [];
  worldMapConfig: any = {};


  constructor (private calendar: NgbCalendar) {
    //set datepicker value to today
    this.date = this.calendar.getToday();

  }

  ngOnInit(): void {
    //get apex chart data
    this._fetchChartData();

    //get static data
    this._fetchData();

    // initialize map configuration
    this._initMapConfig();
  }


  ngAfterViewInit() {

    // tslint:disable-next-line: no-string-literal
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
    };
  }

  /**
   * fetches chart data
   */
  _fetchChartData(): void {

    this.overviewChart = {
      chart: {
        height: 309,
        type: 'area',
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 4
      },
      series: [{
        name: 'Sessions',
        data: [10, 20, 5, 15, 10, 20, 15, 25, 20, 30, 25, 40, 30, 50, 35]
      }],
      legend: {
        show: false
      },
      colors: ["#0acf97"],
      xaxis: {
        categories: this.getDays(),
        tooltip: {
          enabled: false
        },
        axisBorder: {
          show: false
        },
        labels: {

        }
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return val + "k"
          },
          offsetX: -15
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          type: "vertical",
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [45, 100]
        },
      },
    }

    this.countryChart = {
      chart: {
        height: 320,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      colors: ["#727cf5", "#0acf97", "#fa5c7c", "#ffbc00"],
      dataLabels: {
        enabled: false
      },
      series: [{
        name: 'Sessions',
        data: [90, 75, 60, 50, 45, 36, 28, 20, 15, 12]
      }],
      xaxis: {
        categories: ["India", "China", "United States", "Japan", "France", "Italy", "Netherlands", "United Kingdom", "Canada", "South Korea"],
        axisBorder: {
          show: false,
        },
        labels: {
          formatter: function (val: any) {
            return val + "%";
          }
        }
      },
      grid: {
        strokeDashArray: 5
      }

    }
    const categories: string[] = [];
    for (let i = 10; i >= 1; i--) {
      categories.push(i + ' min ago');
    }
    this.viewsChart = {
      chart: {
        height: 150,
        type: 'bar',
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "22%",
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -24,
        style: {
          fontSize: '12px',
          colors: ["#98a6ad"]
        }
      },
      series: [{
        name: 'Views',
        data: this.getRandomData(10)
      }],
      legend: {
        show: false
      },
      colors: ["#0acf97"],
      xaxis: {
        categories: categories,
        labels: {
          show: false
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          show: false
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          inverseColors: !0,
          shade: "light",
          type: "horizontal",
          shadeIntensity: .25,
          gradientToColors: void 0,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      tooltip: {
        y: {
          formatter: function (val: any) {
            return val;
          }
        },
      },
    }

    this.browserChart = {
      chart: {
        height: 343,
        type: 'radar',
      },
      series: [{
        name: 'Usage',
        data: [80, 50, 30, 40, 60, 20],
      }],
      labels: ['Chrome', 'Firefox', 'Safari', 'Opera', 'Edge', 'Explorer'],
      plotOptions: {
        radar: {
          size: 130,
          polygons: {
            strokeColors: '#e9e9e9',
            fill: {
              colors: ['#f8f8f8', '#fff']
            }
          }
        }
      },
      colors: ["#727cf5", "#0acf97", "#fa5c7c", "#ffbc00"],
      yaxis: {
        labels: {
          formatter: function (val: any) {
            return val + "%";
          }
        },
      },
      dataLabels: {
        enabled: true
      },
      markers: {
        size: 4,
        colors: ['#fff'],
        strokeColors: "#727cf5",
        strokeWidth: 2,
      }
    }

    this.osChart = {
      chart: {
        height: 268,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: 'OS',
              formatter: function (opts: any) {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return '8541'
              }
            }
          }
        }
      },
      colors: ["#727cf5", "#0acf97", "#fa5c7c", "#ffbc00"],
      series: [44, 55, 67, 83],
      labels: ['Windows', 'Macintosh', 'Linux', 'Android']
    }

  }

  /**
   * fetches static data
   */
  _fetchData(): void {
    this.viewsData = VIEWSPERMINUTE;
    this.channelData = CHANNELDATA;
    this.socialMediaTrafficData = SOCIALMEDIATRAFFIC;
    this.engagementData = ENGAGEMENTDATA;
  }

  /**
   *  initialize world map configuration
   */
  _initMapConfig(): void {
    this.worldMapConfig = {
      hoverOpacity: 0.7,
      hoverColor: false,
      regionStyle: {
        initial: {
          fill: 'rgba(93,106,120,0.2)'
        }
      },
      backgroundColor: 'transparent',
      zoomOnScroll: false,
      series: {
        regions: [
          {
            attribute: 'fill',
            scale: {
              ScaleKR: '#e6ebff',
              ScaleCA: '#b3c3ff',
              ScaleGB: '#809bfe',
              ScaleNL: '#4d73fe',
              ScaleIT: '#1b4cfe',
              ScaleFR: '#727cf5',
              ScaleJP: '#e7fef7',
              ScaleUS: '#e7e9fd',
              ScaleCN: '#8890f7',
              ScaleIN: '#727cf5',
            },
            values: {
              KR: 'ScaleKR',
              CA: 'ScaleCA',
              GB: 'ScaleGB',
              NL: 'ScaleNL',
              IT: 'ScaleIT',
              FR: 'ScaleFR',
              JP: 'ScaleJP',
              US: 'ScaleUS',
              CN: 'ScaleCN',
              IN: 'ScaleIN',
            },
          },
        ],
      },
    }

  }

  /**
   * returns array of random data
   * @param length length of array
   */
  getRandomData(length: number): number[] {
    let d: number[] = [];
    for (let idx = 0; idx < length; idx++) {
      d.push(Math.floor(Math.random() * 90) + 10);
    }
    return d;
  }

  /**
   * returns days
   */
  getDays(): string[] {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const date = new Date(year, month, 1);
    const days: string[] = [];
    let idx = 0;
    while (date.getMonth() === month && idx < 15) {
      const d = new Date(date);
      days.push(d.getDate() + ' ' + d.toLocaleString('en-us', { month: 'short' }));
      date.setDate(date.getDate() + 1);
      idx += 1;
    }
    return days;
  }



}
