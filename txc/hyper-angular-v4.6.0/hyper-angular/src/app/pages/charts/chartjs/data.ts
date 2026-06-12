import { ChartjsOptions } from "./chartjs.model";

const LINECHART: ChartjsOptions<'line'> =
{
    type: 'line',
    chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
        label: 'Current Week',
        backgroundColor: 'rgba(114, 124, 245, 0.3)',
        borderColor: '#727cf5',
        data: [32, 42, 42, 62, 52, 75, 62],
        tension: 0.4,
        fill: {
            target: 'origin',
            above: 'rgba(114, 124, 245,0.3)',
        },
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: '#727cf5',
        pointHoverBorderColor: '#727cf5',
        pointBorderWidth: 1.5,
        capBezierPoints: true,
    }, {
        label: 'Previous Week',
        fill: true,
        backgroundColor: 'transparent',
        borderColor: '#0acf97',
        borderDash: [5, 5],
        data: [42, 58, 66, 93, 82, 105, 92],
        tension: 0.4,
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: 'transparent',
        pointBorderColor: '#0acf97',
        pointHoverBorderColor: '#0acf97',
        pointBorderWidth: 1.5,
        capBezierPoints: true,
    }],
    chartOptions: {
        maintainAspectRatio: false,
        hover: {
            intersect: true
        },
        plugins: {
            filler: {
                propagate: true,
            },
            legend: {
                display: false,
            },
            tooltip: {
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            },
            y: {
                ticks: {
                    stepSize: 20
                },
                display: true,
                grid: {
                    color: 'rgba(0,0,0,0)',
                }
            }
        }
    },

};

const BARCHART: ChartjsOptions<'bar'> = {
    type: 'bar',
    chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'Sales Analytics',
            data: [65, 59, 80, 81, 56, 89, 40, 32, 65, 59, 80, 81],
            barPercentage: 0.7,
            categoryPercentage: 0.5,
        },
        {
            label: 'Dollar Rate',
            backgroundColor: '#e3eaef',
            borderColor: '#e3eaef',
            hoverBackgroundColor: '#e3eaef',
            hoverBorderColor: '#e3eaef',
            data: [89, 40, 32, 65, 59, 80, 81, 56, 89, 40, 65, 59],
            barPercentage: 0.7,
            categoryPercentage: 0.5,
        }
    ],
    chartOptions: {
        maintainAspectRatio: false,
        plugins: {

            legend: {
                display: false,
            },

        },
        scales: {
            y: {
                grid: {
                    display: false,
                    color: 'rgba(0,0,0,0.05)'
                },
                stacked: false,
                ticks: {
                    stepSize: 20
                }
            },
            x: {

                stacked: false,
                grid: {
                    color: 'rgba(0,0,0,0.01)'
                }
            }
        }
    }
}

const DONUTCHART: ChartjsOptions<'doughnut'> = {
    type: 'doughnut',
    chartLabels: [
        'Direct',
        'Affilliate',
        'Sponsored',
        'E-mail'
    ],
    datasets: [
        {
            data: [300, 135, 48, 154],
            backgroundColor: [
                '#727cf5',
                '#fa5c7c',
                '#0acf97',
                '#ebeff2'
            ],
            hoverBackgroundColor: [
                '#727cf5',
                '#fa5c7c',
                '#0acf97',
                '#ebeff2'
            ],
            hoverBorderColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: [3],
        }],
    chartOptions: {
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
            legend: {
                display: false,
            },
        },
    }

}

const RADARCHART: ChartjsOptions<'radar'> = {
    type: 'radar',
    chartLabels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
    datasets: [
        {
            label: "Desktops",
            backgroundColor: "rgba(57,175,209,0.2)",
            borderColor: "#39afd1",
            pointBackgroundColor: "#39afd1",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#39afd1",
            data: [65, 59, 90, 81, 56, 55, 40]
        },
        {
            label: "Tablets",
            backgroundColor: "rgba(161, 127, 224,0.2)",
            borderColor: "#a17fe0",
            pointBackgroundColor: "#a17fe0",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#a17fe0",
            data: [28, 48, 40, 19, 96, 27, 100]
        }
    ],
    chartOptions: {
        maintainAspectRatio: false
    }
}

export { LINECHART, BARCHART, DONUTCHART, RADARCHART };