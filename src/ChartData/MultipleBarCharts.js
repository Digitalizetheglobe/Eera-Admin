import React from 'react';
import Chart from 'react-apexcharts';

const MultipleBarCharts = () => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    series: [
      {
        name: 'Income',
        data: [23000, 44000, 55000, 57000, 56000, 61000, 58000, 63000, 60000, 66000, 34000, 78000]
      },
      {
        name: 'Outcome',
        data: [17000, 76000, 85000, 101000, 98000, 87000, 105000, 91000, 114000, 94000, 67000, 66000]
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '16px',
        borderRadius: 0
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 8,
      colors: ['transparent']
    },
    xaxis: {
      categories: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        show: false
      },
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '13px',
          fontFamily: 'Inter, ui-sans-serif',
          fontWeight: 400
        },
        offsetX: -2,
        formatter: (title) => title.slice(0, 3)
      }
    },
    yaxis: {
      labels: {
        align: 'left',
        minWidth: 0,
        maxWidth: 140,
        style: {
          colors: '#9ca3af',
          fontSize: '13px',
          fontFamily: 'Inter, ui-sans-serif',
          fontWeight: 400
        },
        formatter: (value) => value >= 1000 ? `${value / 1000}` : value
      }
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.9
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value >= 1000 ? `${value / 1000}` : value}`
      },
      custom: function (props) {
        const { categories } = props.ctx.opts.xaxis;
        const { dataPointIndex } = props;
        const title = categories[dataPointIndex];
        const newTitle = `${title}`;

        return `
          <div class="min-w-28 p-2 bg-white border border-gray-200 rounded-lg shadow-md">
            <div class="flex items-center">
              <div class="text-gray-900">${newTitle}</div>
            </div>
            <div class="flex items-center">
              <div class="text-gray-700">${props.series[props.seriesIndex][props.dataPointIndex]}</div>
            </div>
          </div>
        `;
      }
    },
    responsive: [{
      breakpoint: 568,
      options: {
        chart: {
          height: 300
        },
        plotOptions: {
          bar: {
            columnWidth: '14px'
          }
        },
        stroke: {
          width: 8
        },
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '11px',
            fontFamily: 'Inter, ui-sans-serif',
            fontWeight: 400
          },
          offsetX: -2,
          formatter: (title) => title.slice(0, 3)
        },
        yaxis: {
          labels: {
            align: 'left',
            minWidth: 0,
            maxWidth: 140,
            style: {
              colors: '#9ca3af',
              fontSize: '11px',
              fontFamily: 'Inter, ui-sans-serif',
              fontWeight: 400
            },
            formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
          }
        }
      }
    }],
    colors: ['#2563eb', '#d1d5db'],
    grid: {
      borderColor: '#e5e7eb'
    }
  };

  return (
    <div className="bg-gray-50 p-8 min-h-[300px] flex flex-col items-center justify-center font-sans text-gray-700" style={{paddingBottom:'100px'}}>
      {/* Legend Indicator */}
      <h4 className="text-2xl font-bold mb-4" style={{ fontSize: '30px' }}>Public Notice Analysis Report</h4>
      <div className="flex justify-center sm:justify-end items-center gap-x-4 mb-6 pt-5">
        <div className="inline-flex items-center">
          <span className="w-2.5 h-2.5 inline-block bg-blue-600 rounded-sm mr-2"></span>
          <span className="text-sm text-gray-600 dark:text-neutral-400">Objection Raised</span>
        </div>
        <div className="inline-flex items-center">
          <span className="w-2.5 h-2.5 inline-block bg-gray-300 rounded-sm mr-2 dark:bg-neutral-700"></span>
          <span className="text-sm text-gray-600 dark:text-neutral-400">Daily Notice Upload</span>
        </div>
      </div>
      {/* End Legend Indicator */}
      <Chart options={chartOptions} series={chartOptions.series} type="bar" height={300} width={1000}/>
    </div>
  );
};

export default MultipleBarCharts;
